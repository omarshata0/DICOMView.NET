import React from "react";
import PropTypes from "prop-types";

function FormRow({ label, error, children }) {
  return (
    <div
      className={`
        grid items-center grid-cols-[24rem_1fr_1.2fr] gap-6 py-3
        first:pt-0 last:pb-0 not-last:border-b border-gray-200
        has-[button]:flex has-[button]:justify-end has-[button]:gap-3
      `}
    >
      {label && (
        <label htmlFor={children.props.id} className="font-medium">
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-sm text-red-700">{error}</span>}
    </div>
  );
}

FormRow.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default FormRow;
