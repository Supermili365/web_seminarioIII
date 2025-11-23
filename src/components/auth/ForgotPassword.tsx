import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Input } from '../common/Input';

interface ForgotPasswordProps {
  onNavigate: (view: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://api.expirapp.com/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log('Email enviado:', data);
      setEmailSent(true);
    } catch (error) {
      console.error('Error al enviar email:', error);
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
    marginBottom: '24px',
    width: '100%',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#10B981',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const alertStyle: React.CSSProperties = {
    backgroundColor: '#D1FAE5',
    border: '1px solid #A7F3D0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  };

  const alertTextStyle: React.CSSProperties = {
    color: '#065F46',
    fontSize: '14px',
  };

  const linkStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconContainerStyle}>
          <div style={iconBgStyle}>
            <Clock style={{ color: '#10B981' }} size={32} />
          </div>
        </div>

        <h1 style={titleStyle}>Recupera tu acceso a Expirapp</h1>
        <p style={subtitleStyle}>
          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {!emailSent ? (
          <div>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
            >
              Enviar enlace
            </button>
          </div>
        ) : (
          <div style={alertStyle}>
            <p style={alertTextStyle}>
              <strong>¡Listo!</strong> Si tienes una cuenta con nosotros, hemos enviado un enlace de recuperación a tu correo.
              Revisa tu bandeja de entrada.
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => onNavigate('login')}
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};