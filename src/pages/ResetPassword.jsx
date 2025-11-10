import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { updateDoctorPassword } from '../utils/doctorAuth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    // Check if token exists and is valid
    const resetData = JSON.parse(localStorage.getItem('password_resets') || '[]');
    const tokenData = resetData.find(data => data.token === token);
    
    if (!tokenData) {
      setError('Invalid reset token');
      return;
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      setError('Reset token has expired. Please request a new reset link.');
      return;
    }

    setTokenValid(true);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const token = searchParams.get('token');
    const resetData = JSON.parse(localStorage.getItem('password_resets') || '[]');
    const tokenData = resetData.find(data => data.token === token);

    if (!tokenData) {
      setError('Invalid reset token');
      return;
    }

    try {
      setLoading(true);
      
      // Update the doctor's password
      const updated = updateDoctorPassword(tokenData.email, password);
      
      if (updated) {
        // Remove used token
        const updatedResetData = resetData.filter(data => data.token !== token);
        localStorage.setItem('password_resets', JSON.stringify(updatedResetData));
        
        setMessage('Password successfully reset! Redirecting to login page...');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while resetting your password.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid && !error) {
    return (
      <div className="flex min-h-screen font-['Poppins'] bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-md mx-auto flex flex-col justify-center p-8">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-['Poppins'] bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center p-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 mt-2">Enter your new password</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              {error}
              <div className="mt-3">
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                  Request a new reset link
                </Link>
              </div>
            </div>
          )}
          
          {message && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              {message}
            </div>
          )}
          
          {tokenValid && !message && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              
              <div className="text-center mt-6">
                <Link to="/" className="text-sm text-blue-600 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;