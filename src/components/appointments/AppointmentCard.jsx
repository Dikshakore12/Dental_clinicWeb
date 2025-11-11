import React from 'react';
import { FiEye, FiEdit2, FiTrash2, FiPaperclip, FiClock, FiUser, FiPhone } from 'react-icons/fi';

const AppointmentCard = ({ appointment, onView, onEdit, onDelete, onRemoveFile }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {appointment.title || 'Appointment'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <FiUser className="w-4 h-4" />
            <span>{appointment.patientName || 'Patient Name'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiPhone className="w-4 h-4" />
            <span>{appointment.patientPhone || 'Phone Number'}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status || 'Pending'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FiClock className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{formatDate(appointment.appointmentDate)}</p>
            <p className="text-xs text-gray-600">{formatTime(appointment.appointmentDate)}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Treatment</p>
          <p className="text-xs text-gray-600">{appointment.treatment || 'Not specified'}</p>
        </div>
      </div>

      {appointment.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-2">{appointment.description}</p>
        </div>
      )}

      {appointment.files && appointment.files.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FiPaperclip className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Attachments</span>
          </div>
          <div className="space-y-1">
            {appointment.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                <span className="text-xs text-gray-700 truncate">{file.name}</span>
                <button
                  onClick={() => onRemoveFile(appointment.id, index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onView(appointment.id)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
        >
          <FiEye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={() => onEdit(appointment.id)}
          className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm"
        >
          <FiEdit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(appointment.id)}
          className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
        >
          <FiTrash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;