import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createExam as createExamApi } from "../../services/apiExams";

export function useCreateExam() {
  const queryClient = useQueryClient();

  const { isLoading: isCreating, mutate: createExam } = useMutation({
    mutationFn: (examData) => createExamApi(examData),
    onSuccess: () => {
      toast.success("Exam successfully created!");
      queryClient.invalidateQueries({
        queryKey: ["exams"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["patients"],
        exact: false,
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createExam };
}
