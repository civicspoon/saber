import { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-600 text-white rounded-lg p-4 w-full max-w-md">
        <div className="flex justify-end">
          <button className="absolute  bg-red-600 text-gray-200 hover:text-gray-900" onClick={onClose}>
            &times;
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
