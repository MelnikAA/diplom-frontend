import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './modules/landing';
import { LoginPage } from './modules/auth';
import { UserDashboard } from './modules/user';
import { HistoryPage } from './modules/history';
import { AdminDashboard } from './modules/admin';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
