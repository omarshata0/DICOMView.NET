import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import ExamRow from "../features/workList/ExamRow";

const TableContext = createContext();

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div
        role="table"
        className="border border-[#30353f] text-sm bg-[#262a32] overflow-hidden"
      >
        {children}
      </div>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <header
      role="row"
      className={`grid gap-x-6 items-center px-6 bg-[#30353f] tracking-wide font-semibold text-white`}
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </header>
  );
}

function Row({ children, className, onDoubleClick }) {
  const { columns } = useContext(TableContext);
  return (
    <div
      role="row"
      className={`grid gap-x-6 items-center py-3 px-6 ${className}`}
      style={{ gridTemplateColumns: columns }}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
}

function Body({ data, render }) {
  if (!data.length)
    return (
      <p className="text-base font-medium text-center my-6">
        No data to show at the moment
      </p>
    );

  return (
    <section className="my-1 ">
      {data.map((exam) => {
        return <ExamRow key={exam.examId} exam={exam} />;
      })}
    </section>
  );
}

function Footer({ children }) {
  return (
    <footer className="bg-gray-50 flex justify-center py-3 has-[*]:block hidden">
      {children}
    </footer>
  );
}

Table.propTypes = {
  columns: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Header.propTypes = {
  children: PropTypes.node,
};

Row.propTypes = {
  children: PropTypes.node,
};

Body.propTypes = {
  data: PropTypes.array.isRequired,
  render: PropTypes.func.isRequired,
};

Footer.propTypes = {
  children: PropTypes.node,
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
