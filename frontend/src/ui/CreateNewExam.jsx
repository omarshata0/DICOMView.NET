import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { usePatients } from "../features/workList/usePatients";
import { useForm } from "react-hook-form";
import Form from "./Form";
import FormRowVertical from "./FormRowVertical";
import Input from "./Input";
import Button from "./Button";
import { useCreateExam } from "../features/workList/useCreateExam";
import { toast } from "react-hot-toast";

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

function CreateNewExam() {
  const { patients, isLoading } = usePatients();
  const { createExam, isCreating } = useCreateExam();

  return (
    <Modal>
      <Modal.Open opens="create-exam">
        <Button variation="primary" size="medium">
          Create New Exam
        </Button>
      </Modal.Open>
      <Modal.Window name="create-exam">
        <CreateExamForm
          patients={patients}
          isCreating={isCreating}
          createExam={createExam}
        />
      </Modal.Window>
    </Modal>
  );
}

function CreateExamForm({ patients, isCreating, createExam, onCloseModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      patientId: "",
      examType: "",
      examDate: "",
      status: "",
      comments: "",
      patientName: "",
      birthdate: "",
      gender: "",
      email: "",
      isNewPatient: false,
    },
  });

  const watchedIsNewPatient = watch("isNewPatient");
  const watchedPatientId = watch("patientId");

  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (!watchedIsNewPatient && watchedPatientId) {
      const patient = patients?.find((p) => p.patientId === watchedPatientId);
      if (patient) {
        setSelectedPatient(patient);
        setValue("patientName", patient.patientName || "");
        setValue("birthdate", patient.birthdate?.split("T")[0] || "");
        setValue("gender", patient.gender || "");
        setValue("email", patient.email || "");
      }
    } else {
      setSelectedPatient(null);
      if (watchedIsNewPatient) {
        setValue("patientName", "");
        setValue("birthdate", "");
        setValue("gender", "");
        setValue("email", "");
        setValue("patientId", "");
      }
    }
  }, [watchedIsNewPatient, watchedPatientId, patients, setValue]);

  const onSubmit = (data) => {
    const examData = {
      examType: data.examType,
      examDate: data.examDate ? new Date(data.examDate).toISOString() : null,
      status: data.status,
      comments: data.comments || "",
      isNewPatient: data.isNewPatient,
    };

    if (data.isNewPatient) {
      examData.patientId = 0; // -> ID handled by Backend
      examData.patientName = data.patientName;
      examData.birthdate = data.birthdate
        ? new Date(data.birthdate).toISOString()
        : null;
      examData.gender = data.gender;
      examData.email = data.email;
    } else {
      examData.patientId = parseInt(data.patientId, 10);
      examData.patientName = selectedPatient?.patientName || null;
      examData.birthdate = selectedPatient?.birthdate || null;
      examData.gender = selectedPatient?.gender || null;
      examData.email = selectedPatient?.email || null;
    }

    // console.log("Submitting examData:", JSON.stringify(examData, null, 2));

    createExam(examData, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Exam Details Column */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white">Exam Details</h3>
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
          <div className="mb-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                {...register("isNewPatient")}
                className="h-4 w-4 text-[#1a73e8] rounded cursor-pointer"
              />
              New Patient
            </label>
          </div>
          {!watchedIsNewPatient ? (
            <>
              <FormRowVertical
                label="Select Patient"
                error={errors?.patientId?.message}
              >
                <select
                  id="patientId"
                  {...register("patientId", {
                    required: "Please select a patient",
                  })}
                  className="w-full border border-[#30353f] bg-[#30353f] rounded p-2 text-white"
                >
                  <option value="">Select a patient</option>
                  {patients?.map((patient) => (
                    <option key={patient.patientId} value={patient.patientId}>
                      {patient.patientName} (ID: {patient.patientId})
                    </option>
                  ))}
                </select>
              </FormRowVertical>
              {selectedPatient && (
                <div className="mt-3 p-3 bg-[#2a2f3a] rounded border border-[#30353f]">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Patient Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white ml-2">
                        {selectedPatient.patientName || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Gender:</span>
                      <span className="text-white ml-2">
                        {selectedPatient.gender || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Birthdate:</span>
                      <span className="text-white ml-2">
                        {selectedPatient.birthdate
                          ? selectedPatient.birthdate.split("T")[0]
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white ml-2">
                        {selectedPatient.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <FormRowVertical
                label="Patient Name"
                error={errors?.patientName?.message}
              >
                <Input
                  type="text"
                  id="patientName"
                  {...register("patientName", {
                    required: "Patient name is required",
                  })}
                />
              </FormRowVertical>
              <FormRowVertical
                label="Birthdate"
                error={errors?.birthdate?.message}
              >
                <Input
                  type="date"
                  id="birthdate"
                  {...register("birthdate", {
                    required: "Birthdate is required",
                  })}
                />
              </FormRowVertical>
              <FormRowVertical label="Gender" error={errors?.gender?.message}>
                <select
                  id="gender"
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                  className="w-full border border-[#30353f] bg-[#30353f] rounded p-2 text-white"
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please provide a valid email address",
                    },
                  })}
                />
              </FormRowVertical>
            </>
          )}
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
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Exam"}
        </Button>
      </div>
    </Form>
  );
}

export default CreateNewExam;
