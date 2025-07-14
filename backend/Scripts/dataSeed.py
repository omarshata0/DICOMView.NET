import os
import pyodbc
from pathlib import Path
import struct  # Add this import

def generate_and_apply_dicom_blob(folder_path: str) -> None:
    if not folder_path or not os.path.isdir(folder_path):
        raise ValueError("Invalid or non-existent folder path.")

    blob_data = bytearray()

    dicom_files = [f for f in Path(folder_path).glob("*.dcm")]

    for file_path in dicom_files:
        with open(file_path, "rb") as f:
            file_bytes = f.read()
        
        # Prefix with 4-byte big-endian length
        length = len(file_bytes)
        blob_data.extend(struct.pack('>I', length))  # '>I' for big-endian unsigned int
        blob_data.extend(file_bytes)
    
    # No trailing anything needed

    # Database connection and insertion (unchanged)
    conn_str = (
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=localhost;"
        "DATABASE=WorkListTask;"
        "UID=sa;"
        "PWD=OmarAtef3;"
    )

    try:
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT ExamId FROM Exams")
            exam_ids = [row[0] for row in cursor.fetchall()]
            insert_sql = "INSERT INTO ExamBlob (ExamId, DicomStudyBlob) VALUES (?, ?)"
            for exam_id in exam_ids:
                cursor.execute(insert_sql, (exam_id, blob_data))
            conn.commit()
            print(f"Successfully inserted {len(exam_ids)} rows into ExamBlob with the DICOM blob.")
    except pyodbc.Error as e:
        raise Exception(f"Database error: {e}")

# Example usage (unchanged)
if __name__ == "__main__":
    try:
        folder_path = "/home/omar-shata/Omar/HealthTOM/WorkList_Task/DICOMView.NET/CT_Data"
        generate_and_apply_dicom_blob(folder_path)
    except Exception as e:
        print(f"Error: {e}")