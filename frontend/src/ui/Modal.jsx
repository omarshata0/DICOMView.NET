import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import PropTypes from "prop-types";
import { useOutsideClick } from "../hooks/useOutsideClick";

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 w-full h-screen bg-black/50 backdrop-blur-sm z-[1000] transition-all duration-500">
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#262a32] rounded-xl shadow-2xl p-10 sm:p-12 max-w-3xl w-full transition-all duration-500"
        ref={ref}
      >
        <button
          onClick={close}
          className="absolute top-3 right-5 bg-transparent border-none p-1 rounded-sm translate-x-2 transition-all duration-200 hover:bg-gray-700 cursor-pointer"
        >
          <HiXMark className="w-6 h-6 text-gray-300" />
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  children: PropTypes.node,
};

Open.propTypes = {
  children: PropTypes.element.isRequired,
  opens: PropTypes.string.isRequired,
};

Window.propTypes = {
  children: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired,
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
