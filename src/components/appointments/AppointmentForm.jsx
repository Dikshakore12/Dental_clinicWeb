import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiPhone, FiMail, FiCalendar, FiClock, FiFileText, FiPlus, FiTrash2 } from 'react-icons/fi';

const AppointmentForm = ({ appointment, patients, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    patientId: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    treatment: '',
    description: '',
    status: 'pending',
    sendWhatsApp: false,
    files: []
  });

  const [fileInputs, setFileInputs] = useState([{ id: Date.now(), file: null }]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        ...appointment,
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString().split('T')[0] : '',
        appointmentTime: appointment.appointmentDate ? new Date(appointment.appointmentDate).toTimeString().slice(0, 5) : ''
      });
      if (appointment.files && appointment.files.length > 0) {
        setFileInputs(appointment.files.map((file, index) => ({ id: Date.now() + index, file })));
      }
    }
  }, [appointment]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePatientSelect = (e) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientId,
        patientName: patient.name,
        patientPhone: patient.contact || '',
        patientEmail: patient.email || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        patientId: '',
        patientName: '',
        patientPhone: '',
        patientEmail: ''
      }));
    }
  };

  const handleFileChange = (id, file) => {
    setFileInputs(prev => prev.map(input => 
      input.id === id ? { ...input, file } : input
    ));
  };

  const addFileInput = () => {
    setFileInputs(prev => [...prev, { id: Date.now(), file: null }]);
  };

  const removeFileInput = (id) => {
    setFileInputs(prev => prev.filter(input => input.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const files = fileInputs.filter(input => input.file).map(input => input.file);
    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    
    const submissionData = {
      ...formData,
      appointmentDate: appointmentDateTime.toISOString(),
      files
    };
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiUser className="inline w-4 h-4 mr-1" />
            Patient
          </label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handlePatientSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiCalendar className="inline w-4 h-4 mr-1" />
            Appointment Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Root Canal Treatment"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiCalendar className="inline w-4 h-4 mr-1" />
            Date
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiClock className="inline w-4 h-4 mr-1" />
            Time
          </label>
          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiPhone className="inline w-4 h-4 mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            name="patientPhone"
            value={formData.patientPhone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMail className="inline w-4 h-4 mr-1" />
            Email
          </label>
          <input
            type="email"
            name="patientEmail"
            value={formData.patientEmail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="patient@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Treatment Type
        </label>
        <input
          type="text"
          name="treatment"
          value={formData.treatment}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Cleaning, Filling, Extraction"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiFileText className="inline w-4 h-4 mr-1" />
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes about the appointment..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attach Files
        </label>
        {fileInputs.map((input, index) => (
          <div key={input.id} className="flex items-center gap-2 mb-2">
            <input
              type="file"
              onChange={(e) => handleFileChange(input.id, e.target.files[0])}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*,.pdf,.doc,.docx"
            />
            {index === fileInputs.length - 1 ? (
              <button
                type="button"
                onClick={addFileInput}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeFileInput(input.id)}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="sendWhatsApp"
          checked={formData.sendWhatsApp}
          onChange={handleInputChange}
          className="mr-2"
        />
        <label className="text-sm text-gray-700">
          Send WhatsApp notification to patient
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {appointment ? 'Update Appointment' : 'Create Appointment'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;