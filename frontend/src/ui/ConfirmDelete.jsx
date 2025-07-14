import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import Heading from "./Heading";

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <div className="w-[40rem] flex flex-col gap-3">
      <Heading as="h3">Delete {resourceName}</Heading>
      <p className="text-gray-500 mb-3">
        Are you sure you want to delete this {resourceName} permanently?
        <br></br> This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        {/* <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button> */}
        <Button
          variation="danger"
          size="medium"
          disabled={disabled}
          onClick={() => {
            onConfirm();
            onCloseModal();
          }}
        >
          Confirm Delete
        </Button>
      </div>
    </div>
  );
}

ConfirmDelete.propTypes = {
  resourceName: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  onCloseModal: PropTypes.func,
};

ConfirmDelete.defaultProps = {
  disabled: false,
};

export default ConfirmDelete;
