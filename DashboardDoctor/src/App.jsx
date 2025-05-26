import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import AppointmentsList from './components/appointments/AppointmentsList';
import MessagesList from './components/messages/MessagesList';
import PatientsList from './components/patients/PatientsList';
import PatientDetail from './components/patients/PatientDetail';
import TriageList from './components/triage/TriageList';
import MedicalRecordsList from './components/records/MedicalRecordsList';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/messages" element={<MessagesList />} />
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/triage" element={<TriageList />} />
          <Route path="/records" element={<MedicalRecordsList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;