import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllPatients } from "../../services/apiExams";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function usePatients() {
  // const queryClient = useQueryClient();

  // QUERY
  const {
    isLoading,
    data: data,
    error,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getAllPatients(),
  });

  return { isLoading, error, patients: data };
}
