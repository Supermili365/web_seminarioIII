import React, { useState } from 'react';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { InventoryManagement } from './components/dashboard/InventoryManagement';
import { OrderHistory } from './components/dashboard/OrderHistory';
import { NavigateHandler, View } from './types/navigation.types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');

  const handleNavigate: NavigateHandler = (view) => setCurrentView(view);

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} />;
      case 'reset-password':
        return <ResetPassword onNavigate={handleNavigate} />;
      case 'inventory':
        return <InventoryManagement onNavigate={handleNavigate} />;
      case 'orders':
        return <OrderHistory onNavigate={handleNavigate} />;
      default:
        return <Login onNavigate={handleNavigate} />;
    }
  };

  return <div>{renderView()}</div>;
}