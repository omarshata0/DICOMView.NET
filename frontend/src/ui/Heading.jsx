import React from "react";
import PropTypes from "prop-types";

const Heading = ({ as, children, ...props }) => {
  const headingStyles = {
    h1: "text-3xl font-semibold",
    h2: "text-2xl font-semibold",
    h3: "text-2xl font-medium",
    h4: "text-3xl font-semibold text-center",
  };

  const Component = as || "h1";
  const classes = `leading-snug p-2 ${headingStyles[as] || headingStyles.h1}`;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

Heading.propTypes = {
  as: PropTypes.oneOf(["h1", "h2", "h3", "h4"]),
  children: PropTypes.node,
};

export default Heading;
