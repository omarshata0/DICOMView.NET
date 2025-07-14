import React from "react";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";

function Logo() {
  const src = "/logo.png";
  const navigate = useNavigate();

  return (
    <div
      className="text-center flex items-center justify-center cursor-pointer"
      onClick={() => navigate("/workList")}
    >
      <img src={src} alt="Logo" className="h-24 w-auto" />
    </div>
  );
}

export default Logo;
