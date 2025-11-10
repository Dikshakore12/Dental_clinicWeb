import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import PList from '../components/patients/PatientList';
import AList from '../components/appointments/AppointmentList';
import Cal from '../components/calendar/CalendarView';
import Khatabook from './Khatabook';
import { FiGrid, FiUsers, FiCalendar, FiClipboard, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';

// Doctor info
const getDoc = () => JSON.parse(localStorage.getItem('doctor')) || {
  name: 'Dr. Asrani',
  email: 'yashbjp888@gmail.com',
  role: 'Dentist',
  profilePic: 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=400'
};

// Today's appointments
const getToday = () => {
  const apps = JSON.parse(localStorage.getItem('appointments') || '[]');
  const t = new Date();
  return apps.filter(e => e.appointmentDate && new Date(e.appointmentDate).toDateString() === t.toDateString());
};

// Sidebar button
const SidebarBtn = ({ icon, text, act, click }) => {
  return (
    <button onClick={click} className={`flex items-center gap-4 px-4 py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105 ${act ? 'bg-white/30 shadow-inner backdrop-blur' : 'hover:bg-gray-200'}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-lg">{text}</span>
    </button>
  );
};

const AdminDash = () => {
  const { setUser } = useContext(UserContext);
  const nav = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [now, setNow] = useState(new Date());
  const [today, setToday] = useState(getToday());
  const doc = getDoc();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Clock
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // Update today's appointments when tab changes
  useEffect(() => { if (tab === 'dashboard') setToday(getToday()); }, [tab]);

  const logout = () => { localStorage.removeItem('sessionUser'); setUser(null); nav('/'); };

  // Greeting
  const h = now.getHours();
  const gr = h >= 5 && h < 12 ? `Good Morning, ${doc.name}` :
             h >= 12 && h < 16 ? `Good Afternoon, ${doc.name}` :
             h >= 16 && h < 20 ? `Good Evening, ${doc.name}` :
             `Good Night, ${doc.name}`;

  return (
    <div className="min-h-screen relative font-['Poppins'] dental-fade-in">
      <aside className="w-full md:w-72 bg-white shadow-xl flex flex-col p-6 space-y-4">
        <div className="flex flex-col items-center mb-8">
          <img src={doc.profilePic} alt="Doc" className="w-20 h-20 rounded-full mb-2" />
          <div className="text-xl font-bold">{doc.name}</div>
          <div className="text-sm">{doc.role}</div>
          <div className="text-xs">{doc.email}</div>
        </div>
        <SidebarBtn icon={<FiGrid />} text="Dashboard" act={tab === 'dashboard'} click={() => setTab('dashboard')} />
        <SidebarBtn icon={<FiUsers />} text="Patients" act={tab === 'patients'} click={() => setTab('patients')} />
        <SidebarBtn icon={<FiClipboard />} text="Appointments" act={tab === 'appointments'} click={() => setTab('appointments')} />
        <SidebarBtn icon={<FiCalendar />} text="Calendar" act={tab === 'calendar'} click={() => setTab('calendar')} />
        <SidebarBtn icon={<FiDollarSign />} text="Khatabook" act={tab === 'khatabook'} click={() => setTab('khatabook')} />
        <button onClick={logout} className="mt-auto bg-red-600 text-white p-3 rounded-lg flex items-center gap-2"><FiLogOut /> Logout</button>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        {tab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold">{gr}</h1>
            <p>{today.length} appointments today</p>
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
