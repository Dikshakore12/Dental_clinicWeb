import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import PList from '../components/patients/PatientList';
import AList from '../components/appointments/AppointmentList';
import Cal from '../components/calendar/CalendarView';
import Khatabook from './Khatabook';
import { FiGrid, FiUsers, FiCalendar, FiClipboard, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';

// Get doctor info from localStorage
const getDoc = () => {
  return JSON.parse(localStorage.getItem('doctor')) || {
    name: 'Dr. Asrani',
    email: 'yashbjp888@gmail.com',
    role: 'Dentist',
    profilePic: 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=400'
  };
};

// Greeting function
const greet = (h, n) => {
  const f = n.split(' ')[0];
  if (h >= 5 && h < 12) return `Good Morning, Dr. ${f}`;
  if (h >= 12 && h < 16) return `Good Afternoon, Dr. ${f}`;
  if (h >= 16 && h < 20) return `Good Evening, Dr. ${f}`;
  return `Good Night, Dr. ${f}`;
};

// Get today's appointments
const getToday = () => {
  const apps = JSON.parse(localStorage.getItem('appointments') || '[]');
  const t = new Date();
  return apps.filter(e => {
    if (!e.appointmentDate) return false;
    const d = new Date(e.appointmentDate);
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  });
};

// Sidebar button component
const SidebarBtn = ({ icon, text, act, click }) => {
  const cMap = { Dashboard: 'text-gray-900', Patients: 'text-blue-900', Appointments: 'text-purple-900', Calendar: 'text-green-900', Khatabook: 'text-yellow-900' };
  const hMap = { Dashboard: 'hover:bg-yellow-200', Patients: 'hover:bg-yellow-200', Appointments: 'hover:bg-yellow-200', Calendar: 'hover:bg-yellow-200', Khatabook: 'hover:bg-yellow-200' };
  const cCls = cMap[text] || 'text-gray-900';
  const hCls = hMap[text] || 'hover:bg-gray-200';

  return (
    <button
      onClick={click}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105 ${
        act ? 'bg-white/30 shadow-inner backdrop-blur' : hCls
      }`}
    >
      <span className={`text-xl ${cCls}`}>{icon}</span>
      <span className={`text-lg ${cCls}`}>{text}</span>
    </button>
  );
};

const AdminDash = () => {
  const { setUser } = useContext(UserContext);
  const nav = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [now, setNow] = useState(new Date());
  const doc = getDoc();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Use greet and today variables
  const greeting = greet(now.getHours(), doc.name);
  const today = getToday();

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (tab === 'dashboard') getToday();
  }, [tab]);

  const logout = () => {
    localStorage.removeItem('sessionUser');
    setUser(null);
    nav('/');
  };

  const dStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const isDay = h >= 6 && h < 18;

  // Clock angles for potential analog clock display
  const sAng = s * 6;
  const mAng = m * 6 + s * 0.1;
  const hAng = ((h % 12) + m / 60) * 30;

  return (
    <div className="min-h-screen relative font-['Poppins'] dental-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-dental-primary via-dental-secondary to-dental-dark opacity-10 z-0"></div>
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white shadow-xl flex flex-col p-6 space-y-4 dental-nav">
          <div className="flex flex-col items-center mb-8 dental-slide-up">
            <div className="relative">
              <img src={doc.profilePic} alt="Doc" className="w-20 h-20 rounded-full shadow-dental-lg mb-2 object-cover ring-4 ring-dental-light" />
              <div className="absolute bottom-2 right-0 w-4 h-4 bg-dental-success rounded-full border-2 border-white"></div>
            </div>
            <div className="text-xl font-bold text-dental-dark">{doc.name}</div>
            <div className="text-sm font-medium text-dental-secondary">{doc.role}</div>
            <div className="text-xs text-dental-text">{doc.email}</div>
          </div>

          <div className="space-y-1">
            <SidebarBtn icon={<FiGrid />} text="Dashboard" act={tab === 'dashboard'} click={() => setTab('dashboard')} />
            <SidebarBtn icon={<FiUsers />} text="Patients" act={tab === 'patients'} click={() => setTab('patients')} />
            <SidebarBtn icon={<FiClipboard />} text="Appointments" act={tab === 'appointments'} click={() => setTab('appointments')} />
            <SidebarBtn icon={<FiCalendar />} text="Calendar" act={tab === 'calendar'} click={() => setTab('calendar')} />
            <SidebarBtn icon={<FiDollarSign />} text="Khatabook" act={tab === 'khatabook'} click={() => setTab('khatabook')} />
          </div>

          <button
            onClick={logout}
            className="dental-btn flex items-center justify-center gap-3 mt-auto p-3 rounded-dental bg-dental-danger hover:bg-red-600 text-white font-semibold transition transform hover:scale-105 shadow-dental"
          >
            <FiLogOut className="text-xl" /> Logout
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 md:p-12 relative overflow-y-auto text-dental-text bg-dental-gray">
          <div className="relative z-10 max-w-7xl mx-auto">
            {tab === 'dashboard' && (
              <div className="space-y-8 dental-slide-up">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dental-dark">{greeting}</h1>
                    <p className="text-dental-secondary mt-1">{dStr}</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-white p-2 rounded-dental shadow-dental">
                    {isDay ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-dental-primary" />}
                    <span className="font-medium">{now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    <button
                      onClick={toggleTheme}
                      className="ml-2 p-1 rounded-full bg-dental-light hover:bg-dental-secondary text-dental-dark hover:text-white transition-colors"
                      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                      {theme === 'light' ? <FaMoon size={14} /> : <FaSun size={14} />}
                    </button>
                  </div>
                </div>

                {/* Dashboard cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="dental-dashboard-card p-6">
                    <p>Total Patients: {JSON.parse(localStorage.getItem('patients') || '[]').length}</p>
                  </div>
                  <div className="dental-dashboard-card p-6">
                    <p>Today's Appointments: {today.length}</p>
                  </div>
                  <div className="dental-dashboard-card p-6">
                    <p>Completed Appointments: {JSON.parse(localStorage.getItem('appointments') || '[]').filter(a => a.status === 'Completed').length}</p>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="mt-8 dental-card p-6">
                  <h2 className="dental-dashboard-title mb-4">Today's Appointments</h2>
                  <div className="space-y-4">
                    {today.length > 0 ? today.map((appt, i) => {
                      const patient = JSON.parse(localStorage.getItem('patients') || '[]').find(p => p.id === appt.patientId);
                      return (
                        <div key={i} className="dental-appointment flex items-start p-3 rounded-dental hover:bg-dental-light">
                          <div className="bg-dental-light text-dental-primary p-2 rounded-full mr-3"></div>
                          <div>
                            <p>{patient?.name || 'Unknown Patient'}</p>
                            <p>{appt.title} - {new Date(appt.appointmentDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <span className={`ml-auto px-2 py-1 text-xs rounded-full ${appt.status === 'Completed' ? 'dental-status-success' : 'dental-status-warning'}`}>
                            {appt.status}
                          </span>
                        </div>
                      );
                    }) : <p className="text-center py-4">No appointments today</p>}
                  </div>
                </div>
              </div>
            )}
            {tab === 'patients' && <PList />}
            {tab === 'appointments' && <AList />}
            {tab === 'calendar' && <Cal />}
            {tab === 'khatabook' && <Khatabook />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDash;
