namespace backend.Models
{
    public class Patient
    {
        public int PatientId { get; set; }

        public string PatientName { get; set; }

        public DateTime Birthdate { get; set; }

        public string Gender { get; set; }

        public string Email { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}