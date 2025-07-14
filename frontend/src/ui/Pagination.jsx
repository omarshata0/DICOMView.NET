import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { PAGE_SIZE } from "../utils/constants";

function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }

  function prevPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  if (pageCount <= 1) return null;

  return (
    <div className="w-full flex items-center justify-between">
      <p className="text-sm ml-2">
        Showing{" "}
        <span className="font-semibold">
          {(currentPage - 1) * PAGE_SIZE + 1}
        </span>{" "}
        to{" "}
        <span className="font-semibold">
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span className="font-semibold">{count}</span> results
      </p>

      <div className="flex gap-1.5">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-all duration-300 ${
            currentPage === 1
              ? "bg-gray-50 text-gray-700"
              : "bg-gray-50 hover:bg-blue-600 hover:text-blue-50"
          }`}
        >
          <HiChevronLeft className="w-4.5 h-4.5" />
          <span>Previous</span>
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === pageCount}
          className={`flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-all duration-300 ${
            currentPage === pageCount
              ? "bg-gray-50 text-gray-700"
              : "bg-gray-50 hover:bg-blue-600 hover:text-blue-50"
          }`}
        >
          <span>Next</span>
          <HiChevronRight className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
};

export default Pagination;
