import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDoctorByEmail, generateResetToken, sendResetEmail } from '../utils/doctorAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if doctor exists with this email
    const doctor = getDoctorByEmail(email);
    
    if (doctor) {
      // Generate reset token
      const resetToken = generateResetToken(email);
      
      // Send reset email (simulated)
      const emailSent = sendResetEmail(email, resetToken);
      
      if (emailSent) {
        setMessage(`Password reset link has been sent to ${email}. Check your email and follow the instructions. The reset link will expire in 24 hours.`);
      } else {
        setMessage('Failed to send reset email. Please try again later.');
      }
    } else {
      // For security, show the same message whether email exists or not
      setMessage(`If an account with the email ${email} exists, a password reset link has been sent.`);
    }
    
    setEmail('');
  };

  return (
    <div className="flex min-h-screen font-['Poppins'] bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center p-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
            <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
          </div>
          {message && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              Send Reset Link
            </button>
            <div className="text-center mt-6">
              <Link to="/login" className="text-sm text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;