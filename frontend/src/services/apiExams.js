import { authenticatedFetch } from "../utils/apiUtils";

export async function createExam(examData) {
  const url = `${import.meta.env.VITE_API_URL}/api/exams/create`;
  const response = await authenticatedFetch(url, {
    method: "POST",
    body: JSON.stringify(examData),
  });
  return response.json();
}

export async function getExam(examId) {
  const url = `${import.meta.env.VITE_API_URL}/api/exams/${examId}`;
  const response = await authenticatedFetch(url);
  return response.json();
}

export async function updateExam(examId, examData) {
  const url = `${import.meta.env.VITE_API_URL}/api/exams/${examId}`;
  const response = await authenticatedFetch(url, {
    method: "PUT",
    body: JSON.stringify(examData),
  });
  return { success: true };
}

export async function deleteExam(examId) {
  const url = `${import.meta.env.VITE_API_URL}/api/exams/${examId}`;
  const response = await authenticatedFetch(url, {
    method: "DELETE",
  });
  return { success: true };
}

export async function getAllExams({
  patientId,
  patientName,
  modality,
  status,
  gender,
  dateOption,
  fromDate,
  toDate,
} = {}) {
  const queryParams = new URLSearchParams();
  if (patientId) queryParams.append("patientId", patientId);
  if (patientName) queryParams.append("patientName", patientName);
  if (modality) queryParams.append("modality", modality);
  if (status) queryParams.append("status", status);
  if (gender) queryParams.append("gender", gender);
  if (dateOption) queryParams.append("dateOption", dateOption);
  if (fromDate) queryParams.append("fromDate", fromDate);
  if (toDate) queryParams.append("toDate", toDate);

  const url = `${
    import.meta.env.VITE_API_URL
  }/api/exams?${queryParams.toString()}`;
  console.log("Fetching exams with URL:", url);

  const response = await authenticatedFetch(url);
  return response.json();
}

export async function getAllPatients() {
  const url = `${import.meta.env.VITE_API_URL}/api/patients`;
  const response = await authenticatedFetch(url);
  return response.json();
}

export async function uploadDicomStudy(examId, dicomFile) {
  if (!dicomFile) {
    throw new Error("DICOM file is required");
  }

  const formData = new FormData();
  formData.append("dicomFile", dicomFile);

  const url = `${import.meta.env.VITE_API_URL}/api/exams/${examId}/dicom`;
  const response = await authenticatedFetch(url, {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export async function getDicomBlob(examId) {
  const url = `${import.meta.env.VITE_API_URL}/api/exams/${examId}/dicom`;
  const response = await authenticatedFetch(url);
  return response.blob();
}
