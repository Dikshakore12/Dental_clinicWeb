import React from 'react';
import { FiX, FiUser, FiPhone, FiMail, FiCalendar, FiClock, FiFileText, FiFile } from 'react-icons/fi';

const ViewAppointmentModal = ({ appointment, onClose }) => {
  if (!appointment) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FiUser className="w-4 h-4 mr-2" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900 font-medium">{appointment.patientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{appointment.patientPhone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{appointment.patientEmail || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FiCalendar className="w-4 h-4 mr-2" />
                Appointment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Title</label>
                  <p className="text-gray-900 font-medium">{appointment.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Treatment Type</label>
                  <p className="text-gray-900">{appointment.treatment || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Date</label>
                  <p className="text-gray-900">{formatDate(appointment.appointmentDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Time</label>
                  <p className="text-gray-900">{formatTime(appointment.appointmentDate)}</p>
                </div>
              </div>
            </div>

            {appointment.description && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FiFileText className="w-4 h-4 mr-2" />
                  Description
                </h3>
                <p className="text-gray-900 whitespace-pre-wrap">{appointment.description}</p>
              </div>
            )}

            {appointment.files && appointment.files.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FiFile className="w-4 h-4 mr-2" />
                  Attachments ({appointment.files.length})
                </h3>
                <div className="space-y-2">
                  {appointment.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-sm text-gray-900 truncate flex-1 mr-2">
                        {file.name || `Attachment ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (file.url) {
                            window.open(file.url, '_blank');
                          }
                        }}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appointment.createdAt && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
                <div className="text-sm text-gray-600">
                  <p>Created: {formatDate(appointment.createdAt)} at {formatTime(appointment.createdAt)}</p>
                  {appointment.updatedAt && appointment.updatedAt !== appointment.createdAt && (
                    <p>Last Updated: {formatDate(appointment.updatedAt)} at {formatTime(appointment.updatedAt)}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointmentModal;