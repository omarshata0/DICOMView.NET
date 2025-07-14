import React from "react";
import PropTypes from "prop-types";

const Button = ({ size, variation, children, ...props }) => {
  const sizeClasses = {
    small: "text-xs px-2 py-1 uppercase font-semibold text-center",
    medium: "text-sm px-4 py-2 font-medium",
    large: "text-base px-6 py-3 font-medium",
  };

  const variationClasses = {
    primary: "text-white bg-[#31479d] hover:brightness-90",
    secondary:
      "text-white bg-[#377fc8] border border-gray-200 hover:brightness-90",
    danger: "text-white bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      className={`border-none rounded-sm shadow-sm transition-all duration-200 cursor-pointer ${sizeClasses[size]} ${variationClasses[variation]}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variation: PropTypes.oneOf(["primary", "secondary", "danger"]),
  children: PropTypes.node,
};

Button.defaultProps = {
  variation: "primary",
  size: "medium",
};

export default Button;
