import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [patientIdFilter, setPatientIdFilter] = useState("");
  const [patientNameFilter, setPatientNameFilter] = useState("");
  const [examModalityFilter, setExamModalityFilter] = useState("");
  const [examStatusFilter, setExamStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [dateOption, setDateOption] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const value = {
    patientIdFilter,
    setPatientIdFilter,
    patientNameFilter,
    setPatientNameFilter,
    examModalityFilter,
    setExamModalityFilter,
    examStatusFilter,
    setExamStatusFilter,
    genderFilter,
    setGenderFilter,
    dateOption,
    setDateOption,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
