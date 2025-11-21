import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SoraHome } from './components/SoraHome';
import { SoraForm } from './components/SoraForm';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AuthLayout } from './components/auth/AuthLayout';
import { StudyProvider } from './contexts/StudyContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminPanel } from './components/admin/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <StudyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/admin" element={
              <AuthLayout>
                <AdminPanel />
              </AuthLayout>
            } />
            <Route path="/" element={
              <AuthLayout>
                <SoraHome />
              </AuthLayout>
            } />
            <Route path="/evaluation/new" element={
              <AuthLayout>
                <SoraForm />
              </AuthLayout>
            } />
            <Route path="/evaluation/:id" element={
              <AuthLayout>
                <SoraForm />
              </AuthLayout>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StudyProvider>
    </AuthProvider>
  );
}

export default App;
