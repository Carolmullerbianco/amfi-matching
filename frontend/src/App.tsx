import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Auth pages
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';

// Protected pages
import { Dashboard } from '@/pages/Dashboard';
import { Originadores } from '@/pages/Originadores';
import { Investidores } from '@/pages/Investidores';
import { Matches } from '@/pages/Matches';
import { Historico } from '@/pages/Historico';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="originadores" element={<Originadores />} />
        <Route path="investidores" element={<Investidores />} />
        <Route path="matches" element={<Matches />} />
        <Route path="historico" element={<Historico />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;