import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Modal content */}
      <div className="bg-secondary-dark rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Modal header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-white text-2xl font-bold">&times;</button>
        </div>
        {/* Modal body */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;