import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [autoReminders, setAutoReminders] = useState(true);

  useEffect(() => {
    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    // Load patients from localStorage
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
  }, []);
  
  // Check for due payments daily and send automatic reminders
  useEffect(() => {
    if (!autoReminders) return;
    
    const checkDuePayments = () => {
      const today = new Date().toISOString().split('T')[0];
      const dueTransactions = transactions.filter(t => 
        t.status !== 'completed' && 
        t.dueDate && 
        t.dueDate <= today && 
        t.patientPhone
      );
      
      // Send reminders for due transactions
      dueTransactions.forEach(transaction => {
        // Check if we already sent a reminder today (stored in localStorage)
        const reminderKey = `reminder_${transaction.id}_${today}`;
        const alreadySent = localStorage.getItem(reminderKey);
        
        if (!alreadySent) {
          sendPaymentReminder(transaction, true);
          // Mark as sent for today
          localStorage.setItem(reminderKey, 'sent');
        }
      });
    };
    
    // Check immediately and then daily
    checkDuePayments();
    const intervalId = setInterval(checkDuePayments, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [transactions, autoReminders]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    
    const newTransaction = {
      patientId: form.patientId.value,
      patientName: form.patientName.value,
      patientPhone: form.patientPhone.value,
      date: form.date.value,
      amount: form.amount.value,
      paymentType: form.paymentType.value,
      description: form.description.value,
      status: form.status.value,
      dueDate: form.dueDate.value || null,
    };

    let updatedTransactions;
    
    if (editTransaction) {
      // Update existing transaction
      updatedTransactions = transactions.map(t => 
        t.id === editTransaction.id ? { ...newTransaction, id: t.id } : t
      );
    } else {
      // Add new transaction
      updatedTransactions = [...transactions, { ...newTransaction, id: uuidv4() }];
    }
    
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Reset form
    setShowForm(false);
    setEditTransaction(null);
  };

  // Function to send payment reminder via WhatsApp
  const sendPaymentReminder = (transaction, isAutomatic = false) => {
    // Format phone number - ensure it has proper format for WhatsApp
    let formattedPhone = transaction.patientPhone || '';
    
    // Remove all non-digit characters
    const digits = formattedPhone.replace(/\D/g, '');
    
    // Format for WhatsApp - no plus sign, just digits
    let whatsappPhone = '';
    
    // Add country code for Indian numbers if missing
    if (digits) {
      // If it's a 10-digit number (Indian format without country code)
      if (digits.length === 10) {
        whatsappPhone = `91${digits}`;
      } else {
        // For any other case, just use the digits
        whatsappPhone = digits;
      }
    } else {
      // Fallback to clinic number if patient number is missing
      whatsappPhone = "919767368738";
    }
    
    // Create a more detailed message with due date if available
    const dueDate = transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : 'as soon as possible';
    const message = `Dear ${transaction.patientName}, this is a reminder that your payment of ₹${transaction.amount} for dental treatment at Dr. Asrani Dental Clinic is ${transaction.status === 'partial' ? 'partially paid and balance is' : 'pending'}. Payment was due on ${dueDate}. Please make the payment at your earliest convenience. For any queries, contact us at +919767368738.`;
    const encodedMessage = encodeURIComponent(message);
    
    if (!isAutomatic) {
      // Manual reminder - use direct WhatsApp protocol
      window.location.href = `whatsapp://send?phone=${whatsappPhone}&text=${encodedMessage}`;
    } else {
      // Automatic reminder - use notification API if available
      if ('Notification' in window && Notification.permission === 'granted') {
        // Show notification to staff that reminder was sent
        new Notification('Payment Reminder Sent', {
          body: `Automatic reminder sent to ${transaction.patientName} for ₹${transaction.amount}`,
          icon: '/logo192.png'
        });
        
        // Still open WhatsApp but in background
        window.location.href = `whatsapp://send?phone=${whatsappPhone}&text=${encodedMessage}`;
        // Focus back to the main window
        window.focus();
      } else {
        // Just open WhatsApp
        window.location.href = `whatsapp://send?phone=${whatsappPhone}&text=${encodedMessage}`;
      }
    }
  };
  
  // Function to send transaction details directly via WhatsApp
  const sendTransactionDetails = (transaction) => {
    // Format phone number for WhatsApp
    let whatsappPhone = transaction.patientPhone || '';
    
    // Remove all non-digit characters
    const digits = whatsappPhone.replace(/\D/g, '');
    
    // Format for WhatsApp - no plus sign, just digits
    if (digits) {
      // If it's a 10-digit number (Indian format without country code)
      if (digits.length === 10) {
        whatsappPhone = `91${digits}`;
      } else {
        // For any other case, just use the digits
        whatsappPhone = digits;
      }
    } else {
      // Fallback to clinic number if patient number is missing
      whatsappPhone = "919767368738";
    }
    
    const formattedDate = new Date(transaction.date).toLocaleDateString();
    const message = `
Dear ${transaction.patientName},

Here are your transaction details from Dr. Asrani Dental Clinic:

Transaction Date: ${formattedDate}
Amount: ₹${transaction.amount}
Payment Type: ${transaction.paymentType}
Status: ${transaction.status === 'completed' ? 'Paid' : transaction.status === 'partial' ? 'Partially Paid' : 'Pending'}
${transaction.description ? `Description: ${transaction.description}` : ''}

Thank you for choosing Dr. Asrani Dental Clinic.
For any queries, please contact us at +919767368738.
`;

    // Try a combination approach that works better across different devices
    try {
      // First try the direct intent approach for mobile apps
      const encodedMessage = encodeURIComponent(message);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.setAttribute('href', `whatsapp://send?phone=${whatsappPhone}&text=${encodedMessage}`);
      link.setAttribute('data-action', 'share/whatsapp/share');
      
      // Simulate a click on the hidden link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Fallback to web version if the app doesn't open within 1 second
      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedMessage}`, '_blank');
      }, 1000);
    } catch (error) {
      // If direct approach fails, use web version as fallback
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedMessage}`, '_blank');
    }
  };

  const deleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.patientPhone.includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && transaction.status === filterStatus;
  });

  const totalPending = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Patient Transactions</h2>
        <button 
          onClick={() => { setShowForm(true); setEditTransaction(null); }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Add New Transaction
        </button>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-yellow-700">
            <span className="font-bold">Total Pending Amount:</span> ₹{totalPending.toFixed(2)}
          </p>
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer mr-4">
              <input 
                type="checkbox" 
                checked={autoReminders} 
                onChange={() => setAutoReminders(!autoReminders)}
                className="sr-only peer" 
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">Auto WhatsApp Reminders</span>
            </label>
            <button 
              onClick={() => {
                if (Notification.permission !== 'granted') {
                  Notification.requestPermission();
                }
              }}
              className="text-blue-500 hover:text-blue-700 text-sm"
              title="Enable notifications for automatic reminders"
            >
              <i className="fas fa-bell mr-1"></i> Enable Notifications
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, ID or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Transactions</option>
            <option value="completed">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partially Paid</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.patientName}</div>
                    <div className="text-sm text-gray-500">ID: {transaction.patientId}</div>
                    <div className="text-sm text-gray-500">{transaction.patientPhone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(transaction.date).toLocaleDateString()}</div>
                    {transaction.dueDate && (
                      <div className="text-sm text-red-500">
                        Due: {new Date(transaction.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{parseFloat(transaction.amount).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{transaction.paymentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {transaction.status === 'completed' ? 'Paid' : 
                       transaction.status === 'partial' ? 'Partially Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => { setEditTransaction(transaction); setShowForm(true); }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    {transaction.status !== 'completed' && (
                      <button 
                        onClick={() => sendPaymentReminder(transaction)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                      >
                        Send Reminder
                      </button>
                    )}
                    <button 
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Delete
                    </button>
                    {transaction.patientPhone && (
                       <>
                         <button
                           onClick={() => sendPaymentReminder(transaction)}
                           className="text-green-600 hover:text-green-800 mr-3"
                           title="Send payment reminder via WhatsApp"
                         >
                           <i className="fab fa-whatsapp"></i> Remind
                         </button>
                         <button
                           onClick={() => sendTransactionDetails(transaction)}
                           className="text-blue-600 hover:text-blue-800"
                           title="Send transaction details via WhatsApp"
                         >
                           <i className="fab fa-whatsapp"></i> Details
                         </button>
                       </>
                     )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search patient by name or ID" 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
                      onChange={(e) => {
                        // Show dropdown when typing
                        const dropdown = document.getElementById('patientDropdown');
                        dropdown.style.display = e.target.value ? 'block' : 'none';
                        
                        // Filter patients based on search
                        const searchTerm = e.target.value.toLowerCase();
                        const filteredPatients = patients.filter(patient => 
                          patient.name?.toLowerCase().includes(searchTerm) || 
                          patient.patientId?.toLowerCase().includes(searchTerm) ||
                          patient.id?.toLowerCase().includes(searchTerm)
                        );
                        
                        // Update dropdown options
                        const dropdown_content = document.getElementById('patientDropdownContent');
                        dropdown_content.innerHTML = '';
                        
                        filteredPatients.forEach(patient => {
                          const option = document.createElement('div');
                          option.className = 'px-3 py-2 hover:bg-blue-100 cursor-pointer';
                          option.textContent = `${patient.name} (${patient.patientId || patient.id})`;
                          option.onclick = () => {
                            const selectElement = document.getElementsByName('patientId')[0];
                            selectElement.value = patient.patientId || patient.id;
                            
                            // Trigger the onChange event of the select element
                            const event = new Event('change', { bubbles: true });
                            selectElement.dispatchEvent(event);
                            
                            document.getElementById('patientSearchInput').value = `${patient.name} (${patient.patientId || patient.id})`;
                            dropdown.style.display = 'none';
                          };
                          dropdown_content.appendChild(option);
                        });
                      }}
                      id="patientSearchInput"
                    />
                    <select 
                      name="patientId" 
                      defaultValue={editTransaction?.patientId || ''} 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        // Find the selected patient
                        const selectedPatient = patients.find(p => p.patientId === e.target.value || p.id === e.target.value);
                        if (selectedPatient) {
                          // Auto-fill patient name and phone
                          document.getElementsByName('patientName')[0].value = selectedPatient.name || '';
                          document.getElementsByName('patientPhone')[0].value = selectedPatient.phone || selectedPatient.contact || '';
                          document.getElementById('patientSearchInput').value = `${selectedPatient.name} (${selectedPatient.patientId || selectedPatient.id})`;
                        }
                      }}
                      required 
                    >
                      <option value="">Select a patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.patientId || patient.id}>
                          {patient.name} ({patient.patientId || patient.id})
                        </option>
                      ))}
                    </select>
                    <div 
                      id="patientDropdown" 
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                      style={{display: 'none'}}
                    >
                      <div id="patientDropdownContent"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input 
                    type="text" 
                    name="patientName" 
                    defaultValue={editTransaction?.patientName || ''} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    name="patientPhone" 
                    defaultValue={editTransaction?.patientPhone || ''} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    defaultValue={editTransaction?.date || new Date().toISOString().split('T')[0]} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    name="amount" 
                    defaultValue={editTransaction?.amount || ''} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                  <select 
                    name="paymentType" 
                    defaultValue={editTransaction?.paymentType || 'cash'} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    name="status" 
                    defaultValue={editTransaction?.status || 'pending'} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="completed">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partially Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    defaultValue={editTransaction?.dueDate || ''} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    defaultValue={editTransaction?.description || ''} 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 border-t flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => { setShowForm(false); setEditTransaction(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium"
                >
                  {editTransaction ? 'Update Transaction' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;