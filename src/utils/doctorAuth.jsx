const DOCTORS_STORAGE_KEY = 'doctors';

// Get all doctors from localStorage
export function getDoctors() {
  return JSON.parse(localStorage.getItem(DOCTORS_STORAGE_KEY) || '[]');
}

// Save doctors to localStorage
export function saveDoctors(doctors) {
  localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(doctors));
}

// Add a new doctor
export function addDoctor(newDoctor) {
  const doctors = getDoctors();
  
  // Check if doctor with this email already exists
  const existingDoctor = doctors.find(doctor => 
    doctor.email.toLowerCase() === newDoctor.email.toLowerCase()
  );
  
  if (existingDoctor) {
    throw new Error('Doctor with this email already exists');
  }
  
  // Add new doctor with unique ID
  newDoctor.id = `d${Date.now()}`;
  newDoctor.role = 'Admin';
  newDoctor.createdAt = new Date().toISOString();
  
  doctors.push(newDoctor);
  saveDoctors(doctors);
  
  return newDoctor;
}

// Authenticate doctor by email and password
export function authenticateDoctor(email, password) {
  const doctors = getDoctors();
  return doctors.find(doctor => 
    doctor.email.toLowerCase() === email.toLowerCase() && 
    doctor.password === password
  );
}

// Get doctor by ID
export function getDoctorById(doctorId) {
  const doctors = getDoctors();
  return doctors.find(doctor => doctor.id === doctorId);
}

// Get doctor by email
export function getDoctorByEmail(email) {
  const doctors = getDoctors();
  return doctors.find(doctor => doctor.email.toLowerCase() === email.toLowerCase());
}

// Update doctor password
export function updateDoctorPassword(email, newPassword) {
  const doctors = getDoctors();
  const doctorIndex = doctors.findIndex(doctor => doctor.email.toLowerCase() === email.toLowerCase());
  
  if (doctorIndex === -1) {
    return false;
  }
  
  doctors[doctorIndex].password = newPassword;
  saveDoctors(doctors);
  return true;
}

// Generate reset token (simulated for demo)
export function generateResetToken(email) {
  return `reset_${Date.now()}_${email.replace(/[^a-zA-Z0-9]/g, '')}`;
}

// Simulate sending reset email (in real app, this would call an email API)
export function sendResetEmail(email, resetToken) {
  // In a real application, this would send an actual email
  // For demo purposes, we'll store the reset token in localStorage
  // and show it in the console for testing
  
  const resetData = {
    email: email,
    token: resetToken,
    timestamp: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  // Store reset data
  const existingResets = JSON.parse(localStorage.getItem('password_resets') || '[]');
  existingResets.push(resetData);
  localStorage.setItem('password_resets', JSON.stringify(existingResets));
  
  // Log for demo purposes (in real app, this would be an actual email)
  console.log(`Password reset email sent to: ${email}`);
  console.log(`Reset token: ${resetToken}`);
  console.log(`Reset link would be: http://localhost:3002/reset-password?token=${resetToken}`);
  
  return true;
}