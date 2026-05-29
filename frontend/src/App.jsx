import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components & Layouts
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberDashboard from './pages/MemberDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Guard for Protected Routes by Role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>Verifying access authorization credentials...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not allowed, redirect to correct landing for their role
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'trainer') return <Navigate to="/trainer-dashboard" replace />;
    return <Navigate to="/member-dashboard" replace />;
  }

  return children;
};

// Dashboard Layout wrapper to include the contextual sidebar next to dashboard screens
const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {children}
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Views */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Member Guarded Views */}
        <Route
          path="/member-dashboard"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <DashboardLayout>
                <MemberDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Trainer Guarded Views */}
        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <DashboardLayout>
                <TrainerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Guarded Views */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
