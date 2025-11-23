import React, { useState } from 'react';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { InventoryManagement } from './components/dashboard/InventoryManagement';
import { OrderHistory } from './components/dashboard/OrderHistory';
 codex/analyze-this-project-d947pk
import { NavigateHandler, View } from './types/navigation.types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');

  const handleNavigate: NavigateHandler = (view) => setCurrentView(view);


type View = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'inventory' | 'orders';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
 master

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} />;
      case 'reset-password':
 codex/analyze-this-project-d947pk
        return <ResetPassword onNavigate={handleNavigate} />;
      case 'inventory':
        return <InventoryManagement onNavigate={handleNavigate} />;
      case 'orders':
        return <OrderHistory onNavigate={handleNavigate} />;

        return <ResetPassword onNavigate={setCurrentView} />;
      case 'inventory':
        return <InventoryManagement onNavigate={setCurrentView} />;
      case 'orders':
        return <OrderHistory onNavigate={setCurrentView} />;
master
      default:
        return <Login onNavigate={handleNavigate} />;
    }
  };

  return <div>{renderView()}</div>;
}