import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Complaints from './pages/Complaints';
import Residents from './pages/Residents';
import Finances from './pages/Finances';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function MainContent() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected Resident Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['resident', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute allowedRoles={['resident', 'admin']}>
              <Complaints />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/residents"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Residents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finances"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Finances />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <MainContent />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;