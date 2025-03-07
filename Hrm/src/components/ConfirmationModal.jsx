import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, action }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Confirm {action}</h3>
        <p className="text-sm text-center mb-6">Are you sure you want to {action === 'delete' ? 'delete' : 'perform this action'}?</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
