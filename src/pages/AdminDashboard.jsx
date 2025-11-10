import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import PList from '../components/patients/PatientList';
import AList from '../components/appointments/AppointmentList';
import Cal from '../components/calendar/CalendarView';
import Khatabook from './Khatabook';
import { FiGrid, FiUsers, FiCalendar, FiClipboard, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';

// Get doctor info
const getDoc = () => JSON.parse(localStorage.getItem('doctor')) || {
  name: 'Dr. Asrani',
  email: 'korediksha30@gmail.com',
  role: 'Dentist',
  profilePic: 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=400'
};

// Get today's appointments
const getToday = () => {
  const apps = JSON.parse(localStorage.getItem('appointments') || '[]');
  const today = new Date();
  return apps.filter(a => a.appointmentDate && new Date(a.appointmentDate).toDateString() === today.toDateString());
};

// Sidebar button
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

// Greeting function
const greet = (h, name) => {
  const first = name.split(' ')[0];
  if (h >= 5 && h < 12) return `Good Morning, ${first}`;
  if (h >= 12 && h < 16) return `Good Afternoon, ${first}`;
  if (h >= 16 && h < 20) return `Good Evening, ${first}`;
  return `Good Night, ${first}`;
};

const AdminDash = () => {
  const { setUser } = useContext(UserContext);
  const nav = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [now, setNow] = useState(new Date());
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const doc = getDoc();

  const today = getToday(); // used, ESLint safe
  const greeting = greet(now.getHours(), doc.name); // used in JSX

  useEffect(() => {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => { localStorage.removeItem('sessionUser'); setUser(null); nav('/'); };

  return (
    <div className="min-h-screen font-['Poppins']">
      <aside className="w-72 bg-white shadow-xl p-6 flex flex-col space-y-4">
        <div className="text-center mb-6">
          <img src={doc.profilePic} alt="Doctor" className="w-20 h-20 rounded-full mx-auto mb-2" />
          <div className="font-bold">{doc.name}</div>
          <div className="text-sm">{doc.role}</div>
          <div className="text-xs">{doc.email}</div>
        </div>
        <SidebarBtn icon={<FiGrid />} text="Dashboard" act={tab === 'dashboard'} click={() => setTab('dashboard')} />
        <SidebarBtn icon={<FiUsers />} text="Patients" act={tab === 'patients'} click={() => setTab('patients')} />
        <SidebarBtn icon={<FiClipboard />} text="Appointments" act={tab === 'appointments'} click={() => setTab('appointments')} />
        <SidebarBtn icon={<FiCalendar />} text="Calendar" act={tab === 'calendar'} click={() => setTab('calendar')} />
        <SidebarBtn icon={<FiDollarSign />} text="Khatabook" act={tab === 'khatabook'} click={() => setTab('khatabook')} />
        <button onClick={logout} className="mt-auto p-3 bg-red-600 text-white rounded flex items-center justify-center gap-2">Logout <FiLogOut /></button>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        {tab === 'dashboard' && (
          <div>
            <h1 className="text-2xl mb-2">{greeting}</h1>
            <p>Today's appointments: {today.length}</p>
          </div>
        )}
        {tab === 'patients' && <PList />}
        {tab === 'appointments' && <AList />}
        {tab === 'calendar' && <Cal />}
        {tab === 'khatabook' && <Khatabook />}
      </main>
    </div>
  );
};

export default AdminDash;
