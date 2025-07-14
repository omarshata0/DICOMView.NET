namespace backend.Models
{
    public class Exam
    {
        public int ExamId { get; set; }
        public int PatientId { get; set; }
        public string ExamType { get; set; } = string.Empty;
        public DateTime ExamDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Comments { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
    }
}