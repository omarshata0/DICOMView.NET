import { format, isToday } from "date-fns";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import Tag from "../../ui/Table";
import Table from "../../ui/Table";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteExam } from "./useDeleteExam";
import EditExamForm from "../../ui/EditExamForm";

function ExamRow({ exam }) {
  const {
    patientId,
    examId,
    status,
    comments,
    examType,
    examDate,
    patientName,
    birthdate,
    gender,
    email,
  } = exam;

  const navigate = useNavigate();
  const { deleteExam, isDeleting } = useDeleteExam();

  const formattedExamDate = format(new Date(examDate), "MMM dd yyyy");
  const formattedExamTime = format(new Date(examDate), "HH:mm:ss");
  const formattedBirthdate = format(new Date(birthdate), "MMM dd yyyy");
  const modality = examType.split(" ")[0];

  // Function to determine text color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      case "in progress":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  // Handle double-click to open viewer page in a new tab
  const handleDoubleClick = () => {
    window.open(`/viewer/${examId}`, "_blank");
  };

  return (
    <Table.Row
      className="hover:bg-[#2d3748] transition-colors duration-200 cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`overflow-hidden text-ellipsis whitespace-nowrap ${getStatusColor(
          status
        )}`}
      >
        {status}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {formattedExamDate}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {formattedExamTime}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {patientId}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {examId}
      </div>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {patientName}
      </span>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {formattedBirthdate}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {gender}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {modality}
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {comments}
      </div>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={examId} />
            <Menus.List id={examId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit Exam</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete Exam</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <EditExamForm exam={exam} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="Exam"
                disabled={isDeleting}
                onConfirm={() => {
                  deleteExam(examId);
                }}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default ExamRow;
