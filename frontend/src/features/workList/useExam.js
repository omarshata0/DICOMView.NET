import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getExam } from "../../services/apiExams";

export function useExam() {
  const { examId } = useParams();

  const {
    isLoading,
    data: exam,
    error,
  } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => getExam(examId),
    retry: false,
  });

  return { isLoading, error, exam };
}
