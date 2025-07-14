import React from "react";
import { useForm } from "react-hook-form";
import { useEditExam } from "../features/workList/useEditExam";
import Form from "./Form";
import FormRowVertical from "./FormRowVertical";
import Input from "./Input";
import Button from "./Button";

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

function EditExamForm({ exam, onCloseModal }) {
  const { editExam, isEditing } = useEditExam();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      examId: exam.examId,
      patientId: exam.patientId,
      status: exam.status,
      comments: exam.comments || "",
      examType: exam.examType,
      examDate: new Date(exam.examDate).toISOString().slice(0, 16),
      patientName: exam.patientName,
      birthdate: new Date(exam.birthdate).toISOString().slice(0, 10),
      gender: exam.gender,
      email: exam.email,
    },
  });

  const onSubmit = (data) => {
    const examData = {
      examId: data.examId,
      patientId: data.patientId,
      status: data.status,
      comments: data.comments || "",
      examType: data.examType,
      examDate: data.examDate ? new Date(data.examDate).toISOString() : null,
      patientName: data.patientName,
      birthdate: data.birthdate ? new Date(data.birthdate).toISOString() : null,
      gender: data.gender,
      email: data.email,
    };

    editExam(
      { examId: data.examId, examData },
      {
        onSuccess: () => {
          onCloseModal?.();
        },
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Exam Details Column */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white">Exam Details</h3>
          <FormRowVertical label="Exam ID" error={errors?.examId?.message}>
            <Input
              type="text"
              id="examId"
              {...register("examId")}
              disabled
              className="bg-[#30353f]/30 cursor-not-allowed"
            />
          </FormRowVertical>
          <FormRowVertical label="Exam Type" error={errors?.examType?.message}>
            <select
              id="examType"
              {...register("examType", {
                required: "This field is required",
              })}
              className="w-full focus:outline-none border border-[#30353f] bg-[#262a32] rounded p-2 text-white"
            >
              <option value="">Select Exam Type</option>
              {modalities.map((modality) => (
                <option key={modality} value={modality}>
                  {modality}
                </option>
              ))}
            </select>
          </FormRowVertical>
          <FormRowVertical label="Exam Date" error={errors?.examDate?.message}>
            <Input
              type="datetime-local"
              id="examDate"
              {...register("examDate", {
                required: "This field is required",
              })}
            />
          </FormRowVertical>
          <FormRowVertical label="Status" error={errors?.status?.message}>
            <select
              id="status"
              {...register("status", {
                required: "This field is required",
                validate: (value) =>
                  ["Scheduled", "Arrived", "Cancelled", "Completed"].includes(
                    value
                  ) || "Please select a valid status",
              })}
              className="w-full border border-[#30353f] bg-[#30353f] rounded p-2 text-white"
            >
              <option value="">Select Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Arrived">Arrived</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </FormRowVertical>
          <FormRowVertical label="Comments" error={errors?.comments?.message}>
            <textarea
              id="comments"
              {...register("comments")}
              className="w-full border border-[#30353f] bg-[#30353f] rounded p-2 text-white placeholder:text-gray-400"
              rows="3"
            />
          </FormRowVertical>
        </div>

        {/* Patient Details Column */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white">Patient Details</h3>
          <FormRowVertical
            label="Patient ID"
            error={errors?.patientId?.message}
          >
            <Input
              type="text"
              id="patientId"
              {...register("patientId")}
              disabled
              className="bg-[#30353f]/30 cursor-not-allowed"
            />
          </FormRowVertical>
          <FormRowVertical
            label="Patient Name"
            error={errors?.patientName?.message}
          >
            <Input
              type="text"
              id="patientName"
              {...register("patientName")}
              disabled
              className="bg-[#30353f]/30 cursor-not-allowed"
            />
          </FormRowVertical>
          <FormRowVertical label="Birthdate" error={errors?.birthdate?.message}>
            <Input
              type="date"
              id="birthdate"
              {...register("birthdate")}
              disabled
              className="bg-[#30353f]/30 cursor-not-allowed"
            />
          </FormRowVertical>
          <FormRowVertical label="Gender" error={errors?.gender?.message}>
            <select
              id="gender"
              {...register("gender")}
              disabled
              className="w-full border border-[#30353f] bg-[#30353f]/30 cursor-not-allowed rounded p-2 text-white"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </FormRowVertical>
          <FormRowVertical label="Email" error={errors?.email?.message}>
            <Input
              type="email"
              id="email"
              {...register("email")}
              disabled
              className="bg-[#30353f]/30 cursor-not-allowed"
            />
          </FormRowVertical>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variation="secondary"
          size="medium"
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variation="primary"
          size="medium"
          disabled={isEditing}
        >
          {isEditing ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Form>
  );
}

export default EditExamForm;
