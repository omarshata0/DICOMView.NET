using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/exams")]
    [ApiController]
    public class ExamsController : ControllerBase
    {
        private readonly IExamsService _examsService;

        public ExamsController(IExamsService examsService)
        {
            _examsService = examsService ?? throw new ArgumentNullException(nameof(examsService));
            Console.WriteLine("ExamsController initialized.");
        }


        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateExam([FromBody] ExamWithPatientDto exam)
        {
            Console.WriteLine($"CreateExam called with Exam: {JsonSerializer.Serialize(exam, new JsonSerializerOptions { WriteIndented = true })}");
            if (exam == null)
            {
                Console.WriteLine("Invalid request: Exam is null.");
                return BadRequest("Exam cannot be null.");
            }
            if (string.IsNullOrEmpty(exam.ExamType))
            {
                Console.WriteLine("Invalid request: ExamType is required.");
                return BadRequest("ExamType is required.");
            }
            // Validate Status
            var validStatuses = new[] { "Scheduled", "Arrived", "Cancelled", "Completed" };
            if (string.IsNullOrEmpty(exam.Status) || !validStatuses.Contains(exam.Status))
            {
                Console.WriteLine($"Invalid request: Status is invalid. Provided={exam.Status}, Allowed={string.Join(", ", validStatuses)}");
                return BadRequest($"Status must be one of: {string.Join(", ", validStatuses)}");
            }
            if (exam.IsNewPatient)
            {
                if (string.IsNullOrEmpty(exam.PatientName))
                {
                    Console.WriteLine("Invalid request: PatientName is required for new patients.");
                    return BadRequest("PatientName is required for new patients.");
                }
                if (string.IsNullOrEmpty(exam.Gender))
                {
                    Console.WriteLine("Invalid request: Gender is required for new patients.");
                    return BadRequest("Gender is required for new patients.");
                }
                if (string.IsNullOrEmpty(exam.Email))
                {
                    Console.WriteLine("Invalid request: Email is required for new patients.");
                    return BadRequest("Email is required for new patients.");
                }
                if (!exam.Birthdate.HasValue)
                {
                    Console.WriteLine("Invalid request: Birthdate is required for new patients.");
                    return BadRequest("Birthdate is required for new patients.");
                }
                if (exam.PatientId != 0)
                {
                    Console.WriteLine("Invalid request: PatientId must be 0 for new patients.");
                    return BadRequest("PatientId must be 0 for new patients.");
                }
            }
            else
            {
                if (exam.PatientId <= 0)
                {
                    Console.WriteLine("Invalid request: Valid PatientId is required for existing patients.");
                    return BadRequest("Valid PatientId is required for existing patients.");
                }
            }

            try
            {
                var createdExam = await _examsService.CreateExamAsync(exam);
                Console.WriteLine($"Exam created successfully: ExamId={createdExam.ExamId}");
                return CreatedAtAction(nameof(GetExam), new { examId = createdExam.ExamId }, createdExam);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"ArgumentException in CreateExam: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"KeyNotFoundException in CreateExam: {ex.Message}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in CreateExam: {ex}");
                return StatusCode(500, "An unexpected error occurred while creating the exam.");
            }
        }

        [Authorize]
        [HttpGet("{examId}")]
        public async Task<IActionResult> GetExam(int examId)
        {
            Console.WriteLine($"GetExam called with ExamId={examId}");
            if (examId <= 0)
            {
                Console.WriteLine("Invalid request: ExamId must be positive.");
                return BadRequest("ExamId must be a positive integer.");
            }

            try
            {
                var exam = await _examsService.GetExamAsync(examId);
                Console.WriteLine($"Exam retrieved successfully: ExamId={examId}");
                return Ok(exam);
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"KeyNotFoundException in GetExam: {ex.Message}");
                return NotFound($"Exam with ID {examId} not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in GetExam: {ex}");
                return StatusCode(500, "An unexpected error occurred while retrieving the exam.");
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllExams(
            [FromQuery] string? patientId = null,
            [FromQuery] string? patientName = null,
            [FromQuery] string? modality = null,
            [FromQuery] string? status = null,
            [FromQuery] string? gender = null,
            [FromQuery] string? dateOption = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            Console.WriteLine($"GetAllExams called with filters: patientId={patientId}, patientName={patientName}, modality={modality}, status={status}, gender={gender}, dateOption={dateOption}, fromDate={fromDate}, toDate={toDate}");
            try
            {
                var exams = await _examsService.GetAllExamsAsync(patientId, patientName, modality, status, gender, dateOption, fromDate, toDate);
                Console.WriteLine($"Retrieved {exams?.Count ?? 0} exams.");
                return Ok(exams);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in GetAllExams: {ex}");
                return StatusCode(500, "An unexpected error occurred while retrieving exams.");
            }
        }

        [Authorize]
        [HttpPut("{examId}")]
        public async Task<IActionResult> UpdateExam(int examId, [FromBody] ExamWithPatientDto exam)
        {
            Console.WriteLine($"UpdateExam called with ExamId={examId}, Exam: {exam?.ToString() ?? "null"}");
            if (exam == null)
            {
                Console.WriteLine("Invalid request: Exam is null.");
                return BadRequest("Exam cannot be null.");
            }
            if (string.IsNullOrEmpty(exam.PatientName))
            {
                Console.WriteLine("Invalid request: PatientName is required.");
                return BadRequest("PatientName is required.");
            }
            if (string.IsNullOrEmpty(exam.Gender))
            {
                Console.WriteLine("Invalid request: Gender is required.");
                return BadRequest("Gender is required.");
            }
            if (string.IsNullOrEmpty(exam.Email))
            {
                Console.WriteLine("Invalid request: Email is required.");
                return BadRequest("Email is required.");
            }

            try
            {
                await _examsService.UpdateExamAsync(exam);
                Console.WriteLine($"Exam updated successfully: ExamId={examId}");
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"KeyNotFoundException in UpdateExam: {ex.Message}");
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"ArgumentException in UpdateExam: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in UpdateExam: {ex}");
                return StatusCode(500, "An unexpected error occurred while updating the exam.");
            }
        }

        [Authorize]
        [HttpDelete("{examId}")]
        public async Task<IActionResult> DeleteExam(int examId)
        {
            Console.WriteLine($"DeleteExam called with ExamId={examId}");
            if (examId <= 0)
            {
                Console.WriteLine("Invalid request: ExamId must be positive.");
                return BadRequest("ExamId must be a positive integer.");
            }

            try
            {
                await _examsService.DeleteExamAsync(examId);
                Console.WriteLine($"Exam deleted successfully: ExamId={examId}");
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"KeyNotFoundException in DeleteExam: {ex.Message}");
                return NotFound($"Exam with ID {examId} not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in DeleteExam: {ex}");
                return StatusCode(500, "An unexpected error occurred while deleting the exam.");
            }
        }

        [Authorize]
        [HttpPost("{examId}/dicom")]
        public async Task<IActionResult> UploadDicomStudy(int examId, IFormFile dicomFile)
        {
            Console.WriteLine($"UploadDicomStudy called with ExamId={examId}, FileName={dicomFile?.FileName ?? "null"}");
            if (examId <= 0)
            {
                Console.WriteLine("Invalid request: ExamId must be positive.");
                return BadRequest("ExamId must be a positive integer.");
            }
            if (dicomFile == null || dicomFile.Length == 0)
            {
                Console.WriteLine("Invalid request: DICOM file is null or empty.");
                return BadRequest("DICOM file is required and cannot be empty.");
            }

            try
            {
                using var stream = dicomFile.OpenReadStream();
                await _examsService.UploadDicomStudyAsync(examId, stream);
                Console.WriteLine($"DICOM study uploaded successfully for ExamId={examId}");
                return Ok("DICOM study uploaded successfully.");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"InvalidOperationException in UploadDicomStudy: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"KeyNotFoundException in UploadDicomStudy: {ex.Message}");
                return NotFound($"Exam with ID {examId} not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in UploadDicomStudy: {ex}");
                return StatusCode(500, "An unexpected error occurred while uploading the DICOM study.");
            }
        }

        [Authorize]
        [HttpGet("{examId}/dicom")]
        public async Task<IActionResult> GetDicomBlob(int examId)
        {
            Console.WriteLine($"GetDicomBlob called with ExamId={examId}");
            if (examId <= 0)
            {
                Console.WriteLine("Invalid request: ExamId must be positive.");
                return BadRequest("ExamId must be a positive integer.");
            }

            try
            {
                var blob = await _examsService.GetDicomBlobAsync(examId);
                if (blob == null)
                {
                    Console.WriteLine($"DICOM study not found for ExamId={examId}");
                    return NotFound("DICOM study not found for this exam.");
                }

                Console.WriteLine($"DICOM study retrieved successfully for ExamId={examId}");
                return File(blob, "application/octet-stream", $"exam_{examId}_dicom.bin");
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"KeyNotFoundException in GetDicomBlob: {ex.Message}");
                return NotFound($"Exam with ID {examId} not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error in GetDicomBlob: {ex}");
                return StatusCode(500, "An unexpected error occurred while retrieving the DICOM study.");
            }
        }
    }
}