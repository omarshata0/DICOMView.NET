import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineUsers,
} from "react-icons/hi2";
import { useFilters } from "../contexts/FiltersContext";
import { useExams } from "../features/workList/useExams";
import Heading from "../ui/Heading";

function SearchSideBar() {
  const { exams } = useExams();
  const {
    setPatientIdFilter,
    setPatientNameFilter,
    setExamModalityFilter,
    setExamStatusFilter,
    setGenderFilter,
    setDateOption,
    setFromDate,
    setToDate,
  } = useFilters();

  // Temporary state for filter inputs
  const [tempPatientId, setTempPatientId] = useState("");
  const [tempPatientName, setTempPatientName] = useState("");
  const [tempExamModality, setTempExamModality] = useState("");
  const [tempExamStatus, setTempExamStatus] = useState("");
  const [tempGender, setTempGender] = useState("");
  const [tempDateOption, setTempDateOption] = useState("");
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate, setTempToDate] = useState("");

  const modalities = [
    "Chest X-ray",
    "Abdominal Ultrasound",
    "Brain MRI",
    "Head CT",
    "Spine MRI",
    "Pelvic Ultrasound",
    "Knee X-ray",
    "Mammogram",
    "Shoulder X-ray",
    "Chest CT",
    "Bone DEXA Scan",
    "Whole Body PET-CT",
    "Neck Ultrasound",
    "Abdomen/Pelvis CT",
  ];

  const dateOptions = [
    { value: "", label: "All" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last_week", label: "Last Week" },
    { value: "last_month", label: "Last Month" },
    { value: "last_three_months", label: "Last Three Months" },
    { value: "last_six_months", label: "Last Six Months" },
    { value: "custom", label: "Custom Date" },
  ];

  const statusOptions = [
    { value: "", label: "All" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "Arrived", label: "Arrived" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Completed", label: "Completed" },
  ];

  // Function to apply filters when Search button is clicked
  const handleSearch = () => {
    setPatientIdFilter(tempPatientId);
    setPatientNameFilter(tempPatientName);
    setExamModalityFilter(tempExamModality);
    setExamStatusFilter(tempExamStatus);
    setGenderFilter(tempGender);
    setDateOption(tempDateOption);
    // Format dates as YYYY-MM-DD for API
    setFromDate(
      tempFromDate ? new Date(tempFromDate).toISOString().split("T")[0] : ""
    );
    setToDate(
      tempToDate ? new Date(tempToDate).toISOString().split("T")[0] : ""
    );
  };

  // Function to reset all filter fields
  const handleReset = () => {
    setTempPatientId("");
    setTempPatientName("");
    setTempExamModality("");
    setTempExamStatus("");
    setTempGender("");
    setTempDateOption("");
    setTempFromDate("");
    setTempToDate("");
    // Also reset the applied filters
    setPatientIdFilter("");
    setPatientNameFilter("");
    setExamModalityFilter("");
    setExamStatusFilter("");
    setGenderFilter("");
    setDateOption("");
    setFromDate("");
    setToDate("");
  };

  return (
    <nav className="flex flex-col p-4 bg-[#30353f] rounded h-full text-white">
      <Heading as="h2">Search</Heading>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Patient ID
        </label>
        <input
          type="text"
          className="w-full focus:outline-none border border-[#30353f] bg-[#262a32] rounded p-2 text-white placeholder:text-gray-400"
          value={tempPatientId}
          onChange={(e) => setTempPatientId(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Patient Name
        </label>
        <input
          type="text"
          className="w-full focus:outline-none border border-[#30353f] bg-[#262a32] rounded p-2 text-white placeholder:text-gray-400"
          value={tempPatientName}
          onChange={(e) => setTempPatientName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Exam Modality
        </label>
        <select
          className="w-full focus:outline-none border border-[#30353f] bg-[#262a32] rounded p-2 text-white"
          value={tempExamModality}
          onChange={(e) => setTempExamModality(e.target.value)}
        >
          <option value="">All</option>
          {modalities.map((modality) => (
            <option key={modality} value={modality}>
              {modality}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Exam Status
        </label>
        <select
          className="w-full focus:outline-none border border-[#30353f] bg-[#262a32] rounded p-2 text-white"
          value={tempExamStatus}
          onChange={(e) => setTempExamStatus(e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Gender
        </label>
        <select
          className="w-full focus:outline-none border border-[#30353f] bg-[#262a32] rounded p-2 text-white"
          value={tempGender}
          onChange={(e) => setTempGender(e.target.value)}
        >
          <option value="">All</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Exam Date
        </label>
        <select
          className="w-full focus:outline-none border border-[#30353f] bg-[#262a32] rounded p-2 text-white"
          value={tempDateOption}
          onChange={(e) => setTempDateOption(e.target.value)}
        >
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {tempDateOption === "custom" && (
          <div className="flex flex-col gap-2 mt-2">
            <span>From</span>
            <input
              type="date"
              className="flex-1 border border-[#30353f] bg-[#262a32] rounded p-2 text-white"
              value={tempFromDate}
              onChange={(e) => setTempFromDate(e.target.value)}
            />
            <span>To</span>
            <input
              type="date"
              className="flex-1 border border-[#30353f] bg-[#262a32] rounded p-2 text-white"
              value={tempToDate}
              onChange={(e) => setTempToDate(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSearch}
          className="flex-1 bg-[#1a73e8] cursor-pointer hover:bg-[#1557b0] text-white font-medium py-2 px-4 rounded transition-colors duration-200"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="flex-1 bg-[#6b7280] cursor-pointer hover:bg-[#4b5563] text-white font-medium py-2 px-4 rounded transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </nav>
  );
}

export default SearchSideBar;
