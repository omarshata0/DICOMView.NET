using System;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class ExamWithPatientDto
    {
        // Exam properties
        [JsonPropertyName("examId")]
        public int? ExamId { get; set; }

        [JsonPropertyName("patientId")]
        public int PatientId { get; set; }

        [JsonPropertyName("examType")]
        public string ExamType { get; set; } = string.Empty;

        [JsonPropertyName("examDate")]
        public DateTime ExamDate { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("comments")]
        public string Comments { get; set; } = string.Empty;

        // Patient properties
        [JsonPropertyName("isNewPatient")]
        public bool IsNewPatient { get; set; }

        [JsonPropertyName("patientName")]
        public string? PatientName { get; set; }

        [JsonPropertyName("birthdate")]
        public DateTime? Birthdate { get; set; }

        [JsonPropertyName("gender")]
        public string? Gender { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }
    }
}