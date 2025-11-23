import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Input } from '../common/Input';
import { ResetPasswordFormData } from '../../types/auth.types';

interface ResetPasswordProps {
  onNavigate: (view: string) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await fetch('https://api.expirapp.com/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: formData.newPassword }),
      });
      const data = await response.json();
      console.log('Contraseña actualizada:', data);
      setPasswordUpdated(true);
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
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

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#6B7280',
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

  const requirementsBoxStyle: React.CSSProperties = {
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  };

  const requirementItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '4px',
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

  const successContainerStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  const iconSuccessStyle: React.CSSProperties = {
    backgroundColor: '#D1FAE5',
    padding: '16px',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const successTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const successTextStyle: React.CSSProperties = {
    color: '#6B7280',
    marginBottom: '24px',
  };

  const linkStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <span style={{ color: '#10B981', fontWeight: 'bold' }}>Expirapp</span>
        </div>

        <h1 style={titleStyle}>Restablece tu Contraseña</h1>
        <p style={subtitleStyle}>
          Crea una nueva contraseña segura para tu cuenta
        </p>

        {!passwordUpdated ? (
          <div>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Nueva Contraseña
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Introduce tu nueva contraseña"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>
                Confirmar Contraseña
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirma tu nueva contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div style={requirementsBoxStyle}>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                <strong>Debe incluir:</strong>
              </p>
              <div style={requirementItemStyle}>
                <span style={{ color: '#10B981' }}>✓</span> Mínimo 8 caracteres
              </div>
              <div style={requirementItemStyle}>
                <span style={{ color: '#10B981' }}>✓</span> Al menos una mayúscula
              </div>
              <div style={requirementItemStyle}>
                <span style={{ color: '#10B981' }}>✓</span> Al menos un número
              </div>
              <div style={requirementItemStyle}>
                <span style={{ color: '#10B981' }}>✓</span> Al menos un símbolo
              </div>
            </div>

            <button
              onClick={handleSubmit}
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
            >
              Guardar Contraseña
            </button>
          </div>
        ) : (
          <div style={successContainerStyle}>
            <div style={iconSuccessStyle}>
              <CheckCircle style={{ color: '#10B981' }} size={32} />
            </div>
            <h2 style={successTitleStyle}>¡Contraseña actualizada!</h2>
            <p style={successTextStyle}>
              Tu contraseña ha sido cambiada con éxito. Ya puedes iniciar sesión.
            </p>
            <button
              onClick={() => onNavigate('login')}
              style={buttonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => onNavigate('login')}
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
          >
            ¿Necesitas ayuda? Contacta soporte
          </button>
        </div>
      </div>
    </div>
  );
};