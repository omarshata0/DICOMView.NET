import React from "react";
import PropTypes from "prop-types";

const Row = ({ type, children, ...props }) => {
  const baseClasses = "flex";

  const typeClasses = {
    horizontal: "justify-between items-center px-2",
    vertical: "flex-col",
  };

  const classes = `${baseClasses} ${typeClasses[type] || typeClasses.vertical}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Row.propTypes = {
  type: PropTypes.oneOf(["horizontal", "vertical"]),
  children: PropTypes.node,
};

Row.defaultProps = {
  type: "vertical",
};

export default Row;
