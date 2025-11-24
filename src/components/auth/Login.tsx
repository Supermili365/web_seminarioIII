import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Input } from '../common/Input';
import { LoginFormData } from '../../types/auth.types';

interface LoginProps {
  onNavigate: (view: string) => void;
}

// Función para decodificar el JWT manualmente (sin dependencias)
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Error al decodificar JWT:', error);
    return null;
  }
};

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8081/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: formData.email,
          contrasena: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      const data = await response.json();
      console.log('📦 RESPUESTA COMPLETA DEL LOGIN:', JSON.stringify(data, null, 2));
      
      // Guardar el token en localStorage
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
        
        console.log('💾 Token guardado:', data.data.token);
        console.log('👤 Usuario guardado:', JSON.stringify(data.data.usuario, null, 2));

        // SOLUCIÓN: Decodificar el JWT para obtener el rol
        const decodedToken = decodeJWT(data.data.token);
        console.log('🔓 Token decodificado:', decodedToken);

        // Simular un pequeño delay para mostrar el círculo de carga
        setTimeout(() => {
          let rolUsuario = '';

          // Intentar obtener el rol del token decodificado
          if (decodedToken && decodedToken.role) {
            rolUsuario = decodedToken.role;
            console.log('✅ Rol extraído del token:', rolUsuario);
          } else {
            console.log('⚠️ No se pudo extraer el rol del token');
          }

          // Normalizar el rol a minúsculas para comparación
          const rolNormalizado = rolUsuario.toLowerCase().trim();
          console.log('🔍 Rol normalizado:', rolNormalizado);

          // Redirección basada en el rol
          if (rolNormalizado === 'tienda' || rolNormalizado === 'vendedor') {
            console.log('✅ USUARIO ES VENDEDOR/TIENDA');
            console.log('🚀 Redirigiendo a: create-product');
            onNavigate('create-product');
          } else if (rolNormalizado === 'comprador' || rolNormalizado === 'cliente') {
            console.log('✅ USUARIO ES COMPRADOR');
            console.log('🚀 Redirigiendo a: user-profile');
            onNavigate('user-profile');
          } else {
            console.log('⚠️ ROL NO RECONOCIDO:', rolNormalizado);
            console.log('🚀 Redirigiendo por defecto a: user-profile');
            onNavigate('user-profile');
          }
        }, 1500);
      }

    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al iniciar sesión. Verifica tus credenciales.');
      setIsLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    boxSizing: 'border-box',
    position: 'relative',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    width: '100%',
    maxWidth: '448px',
    boxSizing: 'border-box',
  };

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  };

  const iconBgStyle: React.CSSProperties = {
    backgroundColor: '#D1FAE5',
    padding: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '30px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: '32px',
    fontSize: '14px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  };

  const fieldContainerStyle: React.CSSProperties = {
    marginBottom: '16px',
    width: '100%',
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '8px',
  };

  const checkboxLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#6B7280',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: isLoading ? '#9CA3AF' : '#10B981',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
  };

  const linkStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#10B981',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '24px',
  };

  const alertErrorStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    color: '#991B1B',
    fontSize: '14px',
    textAlign: 'center',
  };

  // Overlay del círculo de carga
  const loadingOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  const spinnerStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={iconContainerStyle}>
            <div style={iconBgStyle}>
              <Clock style={{ color: '#10B981' }} size={32} />
            </div>
          </div>
          
          <h1 style={titleStyle}>Bienvenido a Expirapp</h1>
          <p style={subtitleStyle}>
            Inicia sesión para encontrar grandes ofertas en productos cercanos a su fecha de vencimiento
          </p>

          {errorMessage && (
            <div style={alertErrorStyle}>
              ✕ {errorMessage}
            </div>
          )}

          <div>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Contraseña
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Introduce tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <div style={checkboxContainerStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  style={{ marginRight: '8px' }}
                />
                <span>Recordarme</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#059669')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#10B981')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              style={buttonStyle}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#10B981';
                }
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>

          <p style={footerStyle}>
            ¿No tienes una cuenta?{' '}
            <button
              onClick={() => onNavigate('register')}
              style={{ ...linkStyle, fontWeight: '500' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#10B981')}
            >
              Crear una cuenta nueva
            </button>
          </p>
        </div>
      </div>

      {/* Círculo de carga superpuesto */}
      {isLoading && (
        <div style={loadingOverlayStyle}>
          <div style={spinnerStyle}></div>
        </div>
      )}
    </>
  );
};