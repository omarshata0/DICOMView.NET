import os
import pyodbc
from pathlib import Path

def generate_and_apply_dicom_blob(folder_path: str) -> None:
    # Validate folder path
    if not folder_path or not os.path.isdir(folder_path):
        raise ValueError("Invalid or non-existent folder path.")

    # Initialize a bytearray to store the combined blob
    blob_data = bytearray()

    # Get all .dcm files from the folder
    dicom_files = [f for f in Path(folder_path).glob("*.dcm")]

    for file_path in dicom_files:
        # Read the file's bytes
        with open(file_path, "rb") as f:
            file_bytes = f.read()
        # Append file bytes to the blob
        blob_data.extend(file_bytes)
        # Add a 4-byte delimiter (0x00 0x00 0x00 0x00)
        blob_data.extend(b"\x00\x00\x00\x00")

    # Connect to SQL Server with SQL authentication
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
            
            # Get all ExamIds from Exams table
            cursor.execute("SELECT ExamId FROM Exams")
            exam_ids = [row[0] for row in cursor.fetchall()]
            
            # Insert blob data for each ExamId into ExamBlob table
            insert_sql = "INSERT INTO ExamBlob (ExamId, DicomStudyBlob) VALUES (?, ?)"
            for exam_id in exam_ids:
                cursor.execute(insert_sql, (exam_id, blob_data))
            
            conn.commit()
            print(f"Successfully inserted {len(exam_ids)} rows into ExamBlob with the DICOM blob.")
            
    except pyodbc.Error as e:
        raise Exception(f"Database error: {e}")

# Example usage
if __name__ == "__main__":
    try:
        folder_path = "/home/omar-shata/Omar/HealthTOM/WorkList_Task/DICOMView.NET/CT_Data"
        generate_and_apply_dicom_blob(folder_path)
    except Exception as e:
        print(f"Error: {e}")