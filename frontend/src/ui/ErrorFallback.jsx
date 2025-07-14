import React from "react";
import PropTypes from "prop-types";
import Heading from "./Heading";
import Button from "./Button";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="bg-white border border-gray-200 rounded-lg p-12 flex-1 max-w-6xl text-center">
        <Heading as="h1" className="mb-4">
          Something went wrong
        </Heading>
        <p className="font-mono mb-8 text-gray-500">{error.message}</p>
        <Button size="large" onClick={resetErrorBoundary}>
          Try again
        </Button>
      </div>
    </main>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorFallback;
