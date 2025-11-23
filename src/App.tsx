import React, { useState } from 'react';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { UserProfile } from './components/profile/UserProfile';
import { StoreProfile } from './components/profile/StoreProfile';
import { CreateProduct } from './components/store/CreateProduct';

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
      case 'user-profile':
        return <UserProfile onNavigate={setCurrentView} />;
      case 'store-profile':
        return <StoreProfile onNavigate={setCurrentView} />;
      case 'create-product':
        return <CreateProduct onNavigate={setCurrentView} />;
      default:
        return <Login onNavigate={setCurrentView} />;
    }
  };

  return <div>{renderView()}</div>;
}