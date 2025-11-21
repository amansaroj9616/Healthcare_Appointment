import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import DoctorPanel from './pages/DoctorPanel';
import Teleconsult from './pages/Teleconsult';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
        <Route path="/book/:doctorId" element={<BookAppointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor-panel" element={<DoctorPanel />} />
        <Route path="/teleconsult/:appointmentId" element={<Teleconsult />} />
      </Routes>
    </Layout>
  );
}

export default App;

