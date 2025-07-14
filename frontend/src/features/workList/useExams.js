import { useQuery } from "@tanstack/react-query";
import { getAllExams } from "../../services/apiExams";
import { useFilters } from "../../contexts/FiltersContext";

export function useExams() {
  const {
    patientIdFilter,
    patientNameFilter,
    examModalityFilter,
    examStatusFilter,
    genderFilter,
    dateOption,
    fromDate,
    toDate,
  } = useFilters();

  const {
    isLoading,
    data: exams,
    error,
  } = useQuery({
    queryKey: [
      "exams",
      patientIdFilter,
      patientNameFilter,
      examModalityFilter,
      examStatusFilter,
      genderFilter,
      dateOption,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      getAllExams({
        patientId: patientIdFilter,
        patientName: patientNameFilter,
        modality: examModalityFilter,
        status: examStatusFilter,
        gender: genderFilter,
        dateOption,
        fromDate,
        toDate,
      }),
  });

  return { isLoading, error, exams: exams || [] };
}
