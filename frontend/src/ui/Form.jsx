import React from "react";
import PropTypes from "prop-types";

const Form = ({ type, children, ...props }) => {
  const baseClasses = "overflow-hidden text-sm";

  const typeClasses = {
    regular: "p-6 sm:p-10 border-1 border-[#30353f] rounded-lg w-",
    modal: "w-[50rem]",
  };

  const classes = `${baseClasses} ${typeClasses[type] || typeClasses.regular}`;

  return (
    <form className={`w-lg  ${classes}`} {...props}>
      {children}
    </form>
  );
};

Form.propTypes = {
  type: PropTypes.oneOf(["regular", "modal"]),
  children: PropTypes.node,
};

Form.defaultProps = {
  type: "regular",
};

export default Form;
