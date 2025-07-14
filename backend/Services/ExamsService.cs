using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using backend.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text;


namespace backend.Services
{
    public class ExamsService : IExamsService
    {
        private readonly string _connectionString;

        public ExamsService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration), "Connection string 'DefaultConnection' not found.");
        }

        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);
        public async Task<ExamWithPatientDto> CreateExamAsync(ExamWithPatientDto exam)
        {
            if (exam == null) throw new ArgumentException("Exam data is required.");
            if (string.IsNullOrEmpty(exam.ExamType)) throw new ArgumentException("ExamType is required.");
            if (string.IsNullOrEmpty(exam.Status)) throw new ArgumentException("Status is required.");
            if (exam.ExamDate == default || exam.ExamDate == DateTime.MinValue)
                throw new ArgumentException("A valid ExamDate is required.");
            var validStatuses = new[] { "Scheduled", "Arrived", "Cancelled", "Completed" };
            if (!validStatuses.Contains(exam.Status))
                throw new ArgumentException($"Status must be one of: {string.Join(", ", validStatuses)}");

            if (!exam.IsNewPatient && exam.PatientId <= 0)
                throw new ArgumentException("Valid PatientId is required for existing patients.");

            // If IsNewPatient is true -> validate patient fields
            if (exam.IsNewPatient)
            {
                if (string.IsNullOrEmpty(exam.PatientName))
                    throw new ArgumentException("PatientName is required for new patients.");
                if (!exam.Birthdate.HasValue || exam.Birthdate == DateTime.MinValue)
                    throw new ArgumentException("A valid Birthdate is required for new patients.");
                if (string.IsNullOrEmpty(exam.Gender))
                    throw new ArgumentException("Gender is required for new patients.");
                if (string.IsNullOrEmpty(exam.Email))
                    throw new ArgumentException("Email is required for new patients.");
            }

            Console.WriteLine($"Creating exam with Status={exam.Status}, PatientId={exam.PatientId}");

            using var connection = (SqlConnection)CreateConnection();
            await connection.OpenAsync();
            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                // If IsNewPatient is true -> create a new patient record
                int patientId = exam.PatientId;
                if (exam.IsNewPatient)
                {
                    patientId = await connection.ExecuteScalarAsync<int>(
                        @"INSERT INTO Patients (PatientName, Birthdate, Gender, Email)
                  VALUES (@PatientName, @Birthdate, @Gender, @Email);
                  SELECT SCOPE_IDENTITY();",
                        new
                        {
                            exam.PatientName,
                            exam.Birthdate,
                            exam.Gender,
                            exam.Email
                        },
                        transaction);

                    if (patientId <= 0)
                        throw new Exception("Failed to create new patient.");
                }
                else
                {
                    // Verify that the PatientId exists
                    var patientExists = await connection.ExecuteScalarAsync<int>(
                        @"SELECT COUNT(*) FROM Patients WHERE PatientId = @PatientId",
                        new { PatientId = exam.PatientId },
                        transaction);

                    if (patientExists == 0)
                        throw new ArgumentException($"Patient with ID {exam.PatientId} does not exist.");
                }

                // Insert the exam record
                var examId = await connection.ExecuteScalarAsync<int>(
                    @"INSERT INTO Exams (PatientId, ExamType, ExamDate, Status, Comments)
              VALUES (@PatientId, @ExamType, @ExamDate, @Status, @Comments);
              SELECT SCOPE_IDENTITY();",
                    new
                    {
                        PatientId = patientId,
                        exam.ExamType,
                        ExamDate = exam.ExamDate,
                        exam.Status,
                        exam.Comments,
                    },
                    transaction);

                if (examId <= 0)
                    throw new Exception("Failed to create new exam.");

                // Retrieve patient details to populate the DTO
                var patient = await connection.QueryFirstOrDefaultAsync(
                    @"SELECT PatientName, Birthdate, Gender, Email
              FROM Patients WHERE PatientId = @PatientId",
                    new { PatientId = patientId },
                    transaction);

                await transaction.CommitAsync();

                // Return the created exam with patient details
                return new ExamWithPatientDto
                {
                    ExamId = examId,
                    PatientId = patientId,
                    ExamType = exam.ExamType,
                    ExamDate = exam.ExamDate,
                    Status = exam.Status,
                    Comments = exam.Comments,
                    IsNewPatient = exam.IsNewPatient,
                    PatientName = patient?.PatientName,
                    Birthdate = patient?.Birthdate,
                    Gender = patient?.Gender,
                    Email = patient?.Email
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in CreateExamAsync: {ex.Message}");
                throw;
            }
        }
        public async Task<ExamWithPatientDto> GetExamAsync(int examId)
        {
            if (examId <= 0) throw new ArgumentException("Valid ExamId is required.");

            using var connection = CreateConnection();
            var exam = await connection.QuerySingleOrDefaultAsync<ExamWithPatientDto>(
                @"SELECT e.ExamId, e.PatientId, e.ExamType, e.ExamDate, e.Status, e.Comments,
                         p.PatientName, p.Birthdate, p.Gender, p.Email
                  FROM Exams e
                  INNER JOIN Patients p ON e.PatientId = p.PatientId
                  WHERE e.ExamId = @ExamId",
                new { ExamId = examId });

            if (exam == null)
            {
                throw new KeyNotFoundException($"Exam with ID {examId} not found.");
            }

            return exam;
        }

        public async Task<List<ExamWithPatientDto>> GetAllExamsAsync(
            string? patientId = null,
            string? patientName = null,
            string? modality = null,
            string? status = null,
            string? gender = null,
            string? dateOption = null,
            DateTime? fromDate = null,
            DateTime? toDate = null)
        {
            // Date FIlters
            DateTime today = DateTime.Today;
            if (!string.IsNullOrEmpty(dateOption) && dateOption != "custom")
            {
                switch (dateOption)
                {
                    case "today":
                        fromDate = today;
                        toDate = today.AddDays(1);
                        break;
                    case "yesterday":
                        fromDate = today.AddDays(-1);
                        toDate = today;
                        break;
                    case "last_week":
                        fromDate = today.AddDays(-7);
                        toDate = today.AddDays(1);
                        break;
                    case "last_month":
                        fromDate = today.AddDays(-30);
                        toDate = today.AddDays(1);
                        break;
                    case "last_three_months":
                        fromDate = today.AddDays(-90);
                        toDate = today.AddDays(1);
                        break;
                    case "last_six_months":
                        fromDate = today.AddDays(-180);
                        toDate = today.AddDays(1);
                        break;
                    default:
                        fromDate = null;
                        toDate = null;
                        break;
                }
            }
            else if (dateOption == "custom")
            {

                if (fromDate > toDate)
                {
                    throw new ArgumentException("fromDate cannot be after toDate for custom range.");
                }
            }

            using var connection = CreateConnection();
            var sqlBuilder = new StringBuilder(
                @"SELECT e.ExamId, e.PatientId, e.ExamType, e.ExamDate, e.Status, e.Comments,
                 p.PatientName, p.Birthdate, p.Gender, p.Email
          FROM Exams e
          INNER JOIN Patients p ON e.PatientId = p.PatientId
          WHERE 1=1");

            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(patientId))
            {
                sqlBuilder.Append(" AND CAST(p.PatientId AS VARCHAR(20)) LIKE @PatientId");
                parameters.Add("@PatientId", "%" + patientId + "%");
            }

            if (!string.IsNullOrWhiteSpace(patientName))
            {
                sqlBuilder.Append(" AND p.PatientName LIKE @PatientName");
                parameters.Add("@PatientName", "%" + patientName + "%");
            }

            if (!string.IsNullOrWhiteSpace(modality))
            {
                sqlBuilder.Append(" AND e.ExamType = @Modality");
                parameters.Add("@Modality", modality);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                sqlBuilder.Append(" AND e.Status = @Status");
                parameters.Add("@Status", status);
            }

            if (!string.IsNullOrWhiteSpace(gender))
            {
                sqlBuilder.Append(" AND p.Gender = @Gender");
                parameters.Add("@Gender", gender);
            }

            if (fromDate.HasValue)
            {
                sqlBuilder.Append(" AND e.ExamDate >= @FromDate");
                parameters.Add("@FromDate", fromDate.Value);
            }

            if (toDate.HasValue)
            {
                sqlBuilder.Append(" AND e.ExamDate < @ToDate");
                parameters.Add("@ToDate", toDate.Value);
            }

            sqlBuilder.Append(" ORDER BY e.ExamDate DESC");

            var exams = await connection.QueryAsync<ExamWithPatientDto>(sqlBuilder.ToString(), parameters);
            return exams.ToList();
        }

        public async Task UpdateExamAsync(ExamWithPatientDto exam)
        {
            if (exam == null) throw new ArgumentException("Valid ExamId is required.");
            if (string.IsNullOrEmpty(exam.ExamType)) throw new ArgumentException("ExamType is required.");
            if (exam.PatientId <= 0) throw new ArgumentException("Valid PatientId is required.");
            if (string.IsNullOrEmpty(exam.PatientName)) throw new ArgumentException("PatientName is required.");
            if (string.IsNullOrEmpty(exam.Gender)) throw new ArgumentException("Gender is required.");
            if (string.IsNullOrEmpty(exam.Email)) throw new ArgumentException("Email is required.");

            // Validate Status
            var validStatuses = new[] { "Scheduled", "Arrived", "Cancelled", "Completed" };
            if (string.IsNullOrEmpty(exam.Status) || !validStatuses.Contains(exam.Status))
            {
                throw new ArgumentException($"Status must be one of: {string.Join(", ", validStatuses)}");
            }

            Console.WriteLine($"Updating exam with ExamId={exam.ExamId}, Status={exam.Status}");

            using var connection = (SqlConnection)CreateConnection();
            await connection.OpenAsync();
            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                // Update Exams table
                var examRowsAffected = await connection.ExecuteAsync(
                    @"UPDATE Exams
              SET PatientId = @PatientId, ExamType = @ExamType, ExamDate = @ExamDate,
                  Status = @Status, Comments = @Comments
              WHERE ExamId = @ExamId",
                    exam,
                    transaction);

                if (examRowsAffected == 0)
                {
                    throw new KeyNotFoundException($"Exam with ID {exam.ExamId} not found.");
                }

                // Update Patients table
                var patientRowsAffected = await connection.ExecuteAsync(
                    @"UPDATE Patients
              SET PatientName = @PatientName, Birthdate = @Birthdate, Gender = @Gender, Email = @Email
              WHERE PatientId = @PatientId",
                    new { exam.PatientId, exam.PatientName, exam.Birthdate, exam.Gender, exam.Email },
                    transaction);

                if (patientRowsAffected == 0)
                {
                    throw new KeyNotFoundException($"Patient with ID {exam.PatientId} not found.");
                }

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task DeleteExamAsync(int examId)
        {
            if (examId <= 0) throw new ArgumentException("Valid ExamId is required.");

            using var connection = (SqlConnection)CreateConnection();
            await connection.OpenAsync();
            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                // Delete from ExamBlob first 
                await connection.ExecuteAsync(
                    "DELETE FROM ExamBlob WHERE ExamId = @ExamId",
                    new { ExamId = examId },
                    transaction);

                // Delete from Exams
                var rowsAffected = await connection.ExecuteAsync(
                    "DELETE FROM Exams WHERE ExamId = @ExamId",
                    new { ExamId = examId },
                    transaction);

                if (rowsAffected == 0)
                {
                    throw new KeyNotFoundException($"Exam with ID {examId} not found.");
                }

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // public async Task UploadDicomStudyAsync(int examId, Stream dicomStream)
        // {
        //     if (examId <= 0) throw new ArgumentException("Valid ExamId is required.");
        //     if (dicomStream == null || !dicomStream.CanRead) throw new ArgumentException("DICOM stream is required and must be readable.");

        //     // Verify exam exists
        //     await GetExamAsync(examId); // Throws if not found

        //     using var memoryStream = new MemoryStream();
        //     await dicomStream.CopyToAsync(memoryStream);
        //     var blobData = memoryStream.ToArray();

        //     if (blobData.Length == 0)
        //     {
        //         throw new InvalidOperationException("DICOM stream is empty.");
        //     }

        //     using var connection = CreateConnection();
        //     // Delete any existing blob for this ExamId to avoid duplicates
        //     await connection.ExecuteAsync(
        //         "DELETE FROM ExamBlob WHERE ExamId = @ExamId",
        //         new { ExamId = examId });

        //     // Insert new blob
        //     var rowsAffected = await connection.ExecuteAsync(
        //         "INSERT INTO ExamBlob (DicomStudyBlob, ExamId) VALUES (@DicomStudyBlob, @ExamId)",
        //         new { DicomStudyBlob = blobData, ExamId = examId });

        //     if (rowsAffected == 0)
        //     {
        //         throw new InvalidOperationException($"Failed to upload DICOM study for Exam ID {examId}.");
        //     }
        // }

        public async Task<byte[]?> GetDicomBlobAsync(int examId)
        {
            if (examId <= 0) throw new ArgumentException("Valid ExamId is required.");

            // Verify exam exists
            await GetExamAsync(examId); // Throws if not found

            using var connection = CreateConnection();
            var blob = await connection.QuerySingleOrDefaultAsync<byte[]>(
                "SELECT DicomStudyBlob FROM ExamBlob WHERE ExamId = @ExamId",
                new { ExamId = examId });

            return blob;
        }

        public async Task<List<Patient>> GetAllPatientsAsync()
        {
            using var connection = CreateConnection();
            var patients = await connection.QueryAsync<Patient>(
                "SELECT PatientId, PatientName, Birthdate, Gender, Email FROM Patients");
            return patients.ToList();
        }
    }
}