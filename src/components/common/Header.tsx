import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, User, Store } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  variant?: 'default' | 'simple' | string;
  user?: { name: string; photo?: string } | null;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNavigate?: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ variant = 'default', user, onLogout, onProfileClick, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [localUser, setLocalUser] = useState<{ name: string; photo?: string } | null>(null);

  useEffect(() => {
    if (!user) {
      const usuarioString = localStorage.getItem('usuario');
      if (usuarioString) {
        try {
          const u = JSON.parse(usuarioString);
          setLocalUser({ name: u.nombre, photo: u.foto });
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      } else {
        setLocalUser(null);
      }
    }
  }, [user]);

  const activeUser = user || localUser;

  const handleLogoutInternal = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setLocalUser(null);
      navigate('/login');
    }
  };

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      if (view === 'home') navigate('/');
      if (view === 'products') navigate('/');
      if (view === 'profile') navigate('/profile');
      if (view === 'orders') navigate('/orders');
      if (view === 'inventory') navigate('/inventory');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header-container">
      {/* Logo Section */}
      <div className="header-logo-section">
        <Link to="/" className="header-logo">
          <Store className="header-logo-icon" size={24} />
          Expirapp
        </Link>
      </div>

      {/* Navigation Section */}
      {variant !== 'simple' && (
        <nav className="header-nav lg:flex hidden">
          {activeUser && (
            <>
              <button
                onClick={() => navigate('/')}
                className={`header-nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Inicio
              </button>
              <button
                onClick={() => navigate('/orders')}
                className={`header-nav-link ${isActive('/orders') ? 'active' : ''}`}
              >
                Pedidos
              </button>
              <button
                onClick={() => navigate('/cart')}
                className={`header-nav-link ${isActive('/cart') ? 'active' : ''}`}
              >
                Carrito
              </button>
              <button
                onClick={() => navigate('/profile')}
                className={`header-nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                Perfil
              </button>
              <button onClick={() => handleNavigation('orders')} className="header-nav-link">
                Pedidos
              </button>
              <button onClick={() => handleNavigation('inventory')} className="header-nav-link">
                Inventario
              </button>
            </>
          )}
        </nav>
      )}

      {/* Actions Section */}
      <div className="header-actions">
        {activeUser ? (
          <>
            <button onClick={handleLogoutInternal} className="btn-logout">
              Cerrar Sesión
            </button>
            <div className="avatar-container">
              {activeUser.photo ? (
                <img src={activeUser.photo} alt={activeUser.name} className="avatar-image" />
              ) : (
                <User size={16} />
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className="btn-login sm:inline-flex hidden"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
            <button className="btn-icon">
              <Heart size={20} />
            </button>
            <Link to="/cart">
              <button className="btn-icon">
                <ShoppingCart size={20} />
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
