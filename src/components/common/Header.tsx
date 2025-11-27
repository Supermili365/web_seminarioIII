import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, User, Store } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import './Header.css';

interface HeaderProps {
  variant?: 'default' | 'simple' | string;
  user?: { name: string; photo?: string; role?: string } | null;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onNavigate?: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ variant = 'default', user, onLogout, onProfileClick, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [localUser, setLocalUser] = useState<{ name: string; photo?: string; role?: string } | null>(() => {
    // Inicialización síncrona para evitar parpadeos y asegurar que el rol esté disponible inmediatamente
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      try {
        const u = JSON.parse(usuarioString);
        let role = u.rol || u.role;

        if (!role) {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const decoded: any = jwtDecode(token);
              role = decoded.role;
            } catch (e) {
              console.error("Error decoding token during init", e);
            }
          }
        }

        if (role && typeof role === 'string') {
          role = role.toLowerCase().trim();
        }

        return { name: u.nombre, photo: u.foto, role };
      } catch (e) {
        console.error("Error parsing user from localStorage during init", e);
        return null;
      }
    }
    return null;
  });

  // Efecto para sincronizar si cambia el prop user (aunque la inicialización ya cubrió el caso base)
  useEffect(() => {
    if (!user && !localUser) {
      // Re-intentar leer si por alguna razón no se leyó al inicio y no hay user prop
      const usuarioString = localStorage.getItem('usuario');
      if (usuarioString) {
        // Lógica similar a la inicialización, útil si el localStorage cambia externamente (poco probable en este flujo)
        // Por simplicidad, confiamos en la inicialización, pero mantenemos esto para actualizaciones posteriores si fuera necesario
      }
    }
  }, [user]);

  const activeUser = React.useMemo(() => {
    if (user) {
      // Si se pasa un usuario pero sin rol (ej. desde Profile), intentamos usar el rol detectado localmente
      if (!user.role && localUser?.role) {
        return { ...user, role: localUser.role };
      }
      return user;
    }
    return localUser;
  }, [user, localUser]);

  const isSeller = activeUser?.role === 'vendedor';
  const isBuyer = activeUser?.role === 'comprador';

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
      if (view === 'profile') navigate(isSeller ? '/store-profile' : '/profile');
      if (view === 'orders') navigate('/orders');
      if (view === 'inventory') navigate('/inventory');
      if (view === 'create-product') navigate('/create-product');
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
              {/* Inicio - Común para todos */}
              <button
                onClick={() => navigate('/')}
                className={`header-nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Inicio
              </button>

              {/* Enlaces para Comprador */}
              {isBuyer && (
                <>
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
                </>
              )}

              {/* Enlaces para Vendedor */}
              {isSeller && (
                <button
                  onClick={() => handleNavigation('inventory')}
                  className={`header-nav-link ${isActive('/inventory') ? 'active' : ''}`}
                >
                  Inventario
                </button>
              )}

              {/* Perfil - Común pero con destino diferente */}
              <button
                onClick={() => handleNavigation('profile')}
                className={`header-nav-link ${isActive(isSeller ? '/store-profile' : '/profile') ? 'active' : ''}`}
              >
                Perfil
              </button>
            </>
          )}
        </nav>
      )}

      {/* Actions Section */}
      <div className="header-actions">
        {activeUser ? (
          <>
            {isBuyer && (
              <Link to="/cart" className="mr-4">
                <button className="btn-icon">
                  <ShoppingCart size={20} />
                </button>
              </Link>
            )}
                        {isSeller && (
              <button
                onClick={() => handleNavigation('create-product')}
                className="btn-logout"
              >
                Publicar producto
              </button>
            )}
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
