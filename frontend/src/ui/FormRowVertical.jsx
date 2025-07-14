import React from "react";
import PropTypes from "prop-types";

function FormRowVertical({ label, error, children }) {
  return (
    <div className="flex flex-col gap-2 py-2">
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

FormRowVertical.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default FormRowVertical;
