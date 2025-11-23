import React, { useState } from 'react';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';

export default function App() {
  const [currentView, setCurrentView] = useState('login');

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onNavigate={setCurrentView} />;
      case 'register':
        return <Register onNavigate={setCurrentView} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={setCurrentView} />;
      case 'reset-password':
        return <ResetPassword onNavigate={setCurrentView} />;
      default:
        return <Login onNavigate={setCurrentView} />;
    }
  };

  return <div>{renderView()}</div>;
}