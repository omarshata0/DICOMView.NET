import React from "react";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`border border-[#30353f] bg-[#30353f] rounded-sm px-3 py-2 shadow-sm active:border-[#30353f] focus:outline-none ${className}`}
      {...props}
      ref={ref}
    />
  );
});

export default Input;
