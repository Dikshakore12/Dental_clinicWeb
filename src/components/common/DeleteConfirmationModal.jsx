import React from 'react';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName = "item", 
  itemType = "item",
  message = null 
}) => {
  if (!isOpen) return null;

  const defaultMessage = `Are you sure you want to delete this ${itemType}? This action cannot be undone.`;
  const displayMessage = message || defaultMessage;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete {itemName}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {displayMessage}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;