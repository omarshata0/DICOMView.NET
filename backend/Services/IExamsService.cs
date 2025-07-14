using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Services
{
    public interface IExamsService
    {
        Task<ExamWithPatientDto> CreateExamAsync(ExamWithPatientDto exam);
        Task<ExamWithPatientDto> GetExamAsync(int examId);
        Task<List<ExamWithPatientDto>> GetAllExamsAsync(
            string? patientId = null,
            string? patientName = null,
            string? modality = null,
            string? status = null,
            string? gender = null,
            string? dateOption = null,
            DateTime? fromDate = null,
            DateTime? toDate = null);
        Task UpdateExamAsync(ExamWithPatientDto exam);
        Task DeleteExamAsync(int examId);
        // Task UploadDicomStudyAsync(int examId, Stream dicomStream);
        Task<byte[]?> GetDicomBlobAsync(int examId);
        Task<List<Patient>> GetAllPatientsAsync();
    }
}