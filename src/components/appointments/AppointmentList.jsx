import React, { useState, useEffect } from 'react';
import AppointmentCard from './AppointmentCard';
import AppointmentForm from './AppointmentForm';
import ViewAppointmentModal from './ViewAppointmentModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import Modal from '../common/Modal';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Data states for modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const savedAppointments = localStorage.getItem('appointments');
      const savedPatients = localStorage.getItem('patients');
      
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments));
      }
      
      if (savedPatients) {
        setPatients(JSON.parse(savedPatients));
      }
    };
    
    loadData();
    
    // Listen for storage changes (in case other components modify the data)
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter appointments based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(apt => 
        apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.treatment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAppointments(filtered);
    }
  }, [appointments, searchTerm]);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // WhatsApp notification function
  const sendWhatsAppNotification = (appointment) => {
    if (!appointment.sendWhatsApp || !appointment.patientPhone) return;
    
    let formattedPhone = appointment.patientPhone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = `91${formattedPhone}`;
    }
    
    const message = `Dear Patient, your appointment for ${appointment.title} is scheduled on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${new Date(appointment.appointmentDate).toLocaleTimeString()}. Dr. Asrani Dental Clinic.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // CRUD Operations
  const handleAddAppointment = (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: Date.now().toString()
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowAddModal(false);
    sendWhatsAppNotification(newAppointment);
  };

  const handleEditAppointment = (appointmentData) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentData.id ? appointmentData : apt
    );
    
    setAppointments(updatedAppointments);
    setShowEditModal(false);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId) => {
    setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  };

  // Event handlers
  const handleView = (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleEdit = (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleDelete = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteModal(true);
  };

  const handleRemoveFile = (appointmentId, fileIndex) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      const updatedFiles = appointment.files.filter((_, index) => index !== fileIndex);
      const updatedAppointment = { ...appointment, files: updatedFiles };
      handleEditAppointment(updatedAppointment);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap"
          >
            Add Appointment
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400 text-lg py-12">
            {searchTerm ? 'No appointments found matching your search.' : 'No appointments available.'}
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRemoveFile={handleRemoveFile}
            />
          ))
        )}
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Appointment"
        size="2xl"
      >
        <AppointmentForm
          patients={patients}
          onSubmit={handleAddAppointment}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAppointment(null);
        }}
        title="Edit Appointment"
        size="2xl"
      >
        {selectedAppointment && (
          <AppointmentForm
            appointment={selectedAppointment}
            patients={patients}
            onSubmit={handleEditAppointment}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedAppointment(null);
            }}
          />
        )}
      </Modal>

      {/* View Appointment Modal */}
      <ViewAppointmentModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAppointmentToDelete(null);
        }}
        onConfirm={() => handleDeleteAppointment(appointmentToDelete)}
        itemName="Appointment"
      />
    </div>
  );
};

export default AppointmentList;