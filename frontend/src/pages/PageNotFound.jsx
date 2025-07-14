import React from "react";
import { useMoveBack } from "../hooks/useMoveBack";
import Heading from "../ui/Heading";

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <main className="min-h-screen bg-[#30353f] flex items-center justify-center p-12">
      <div className="bg-[#262a32] border border-[#30353f] rounded-lg p-30 flex-1 max-w-6xl text-center text-white">
        <Heading as="h1" className="mb-8 text-3xl font-medium">
          The page you are looking for could not be found!
        </Heading>
        <button
          onClick={moveBack}
          className="text-lg text-[#1a73e8] hover:text-[#1557b0] cursor-pointer transition-colors duration-200"
        >
          ← Go back
        </button>
      </div>
    </main>
  );
}

export default PageNotFound;
