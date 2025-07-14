import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDicomBlob } from "../../services/apiExams";

export function useDicomData({ examId }) {
  const {
    isLoading,
    data: dicomBlob,
    error,
  } = useQuery({
    queryKey: ["dicomBlob", examId],
    queryFn: () => getDicomBlob(examId),
    retry: false,
  });

  return { isLoading, error, dicomBlob };
}
