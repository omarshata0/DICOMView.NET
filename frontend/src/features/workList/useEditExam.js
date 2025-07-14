import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateExam as editExamApi } from "../../services/apiExams";

export function useEditExam() {
  const queryClient = useQueryClient();

  const { isLoading: isEditing, mutate: editExam } = useMutation({
    mutationFn: ({ examId, examData }) => editExamApi(examId, examData),
    onSuccess: () => {
      toast.success("Exam successfully updated");

      queryClient.invalidateQueries({
        queryKey: ["exams"],
        exact: false,
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editExam };
}
