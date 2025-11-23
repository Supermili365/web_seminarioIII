import React, { useState } from 'react';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { InventoryManagement } from './components/dashboard/InventoryManagement';
import { OrderHistory } from './components/dashboard/OrderHistory';

type View = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'inventory' | 'orders';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');

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
      case 'inventory':
        return <InventoryManagement onNavigate={setCurrentView} />;
      case 'orders':
        return <OrderHistory onNavigate={setCurrentView} />;
      default:
        return <Login onNavigate={setCurrentView} />;
    }
  };

  return <div>{renderView()}</div>;
}