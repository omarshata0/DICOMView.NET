import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ExamRow from "./ExamRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useExams } from "./useExams";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function ExamsTable() {
  const { exams, isLoading } = useExams();
  const [searchParams] = useSearchParams();
  const initialColumnWidths = [
    120, // Status
    100, // Date
    100, // Time
    80, // Patient ID
    100, // Study ID 
    200, // Name
    120, // Birth Date
    80, // Gender
    80, // Modality
    150, // Description 
    100, // Dropdown icon
  ];
  const [columnWidths, setColumnWidths] = useState(initialColumnWidths);
  const [activeResizeColumn, setActiveResizeColumn] = useState(null);
  const resizeRef = useRef({
    isResizing: false,
    columnIndex: -1,
    startX: 0,
    startWidth: 0,
  });
  const containerRef = useRef(null);

  // Early returns after all hooks
  if (isLoading) return <Spinner />;
  if (!Array.isArray(exams) || !exams.length)
    return <Empty resourceName="Exams" />;

  const headerTitles = [
    "Status",
    "Date",
    "Time",
    "Patient ID",
    "Study ID",
    "Name",
    "Birth Date",
    "Gender",
    "Modality",
    "Description",
    "",
  ];

  const gridTemplateColumns = columnWidths.map((w) => `${w}px`).join(" ");

  const handleMouseDown = (e, index) => {
    resizeRef.current = {
      isResizing: true,
      columnIndex: index,
      startX: e.clientX,
      startWidth: columnWidths[index],
    };
    setActiveResizeColumn(index);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!resizeRef.current.isResizing) return;
    const index = resizeRef.current.columnIndex;
    const delta = e.clientX - resizeRef.current.startX;
    let newWidth = resizeRef.current.startWidth + delta;
    const minWidth = initialColumnWidths[index] - 50;
    const maxWidth = initialColumnWidths[index] + 50;

    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

    const newWidths = [...columnWidths];
    newWidths[index] = newWidth;
    setColumnWidths(newWidths);
  };

  const handleMouseUp = () => {
    resizeRef.current.isResizing = false;
    setActiveResizeColumn(null);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));
  const pageSize = 10;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  const paginatedExams = exams.slice(from, to);

  return (
    <Menus>
      <div ref={containerRef} className="overflow-x-auto w-full">
        <Table columns={gridTemplateColumns}>
          <Table.Header>
            {headerTitles.map((title, index) => (
              <div
                key={title || `column-${index}`}
                className="relative overflow-hidden text-ellipsis py-5 whitespace-nowrap px-2"
              >
                {title}
                <div
                  className={`absolute right-0 top-0 w-[5px] h-full mx-2 cursor-col-resize`}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                />
              </div>
            ))}
          </Table.Header>

          <Table.Body
            data={paginatedExams}
            render={(exam) => <ExamRow key={exam.examId} exam={exam} />}
          />
          {/* 
          <Table.Footer>
            <Pagination count={exams.length} />
          </Table.Footer> */}
        </Table>
      </div>
    </Menus>
  );
}

export default ExamsTable;
