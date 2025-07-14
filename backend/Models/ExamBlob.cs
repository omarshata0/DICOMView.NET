using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ExamBlob
    {
        public int BlobId { get; set; }
        public byte[] DicomStudyBlob { get; set; }
        public int ExamId { get; set; }
    }
}

