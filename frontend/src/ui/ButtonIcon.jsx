import React from "react";
import PropTypes from "prop-types";

const ButtonIcon = ({ children, ...props }) => {
  return (
    <button
      className="bg-transparent border-none p-1.5 rounded hover:bg-[#30353f] transition-all duration-200 cursor-pointer"
      {...props}
    >
      {React.cloneElement(children, {
        className: "w-5 h-5 text-blue-600",
      })}
    </button>
  );
};

ButtonIcon.propTypes = {
  children: PropTypes.element,
};

export default ButtonIcon;
