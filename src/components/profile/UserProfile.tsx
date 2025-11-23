import React, { useState } from 'react';
import { User, Mail, MapPin, Lock } from 'lucide-react';

interface UserProfileProps {
  onNavigate?: (view: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const [userData, setUserData] = useState({
    nombre: 'Juan Pérez',
    correo: 'juan.perez@email.com',
    direccion: 'Av. Siempre Viva 742, Springfield',
    foto: '', // URL de la foto de perfil
  });

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempData, setTempData] = useState({ ...userData });

  const handleSaveInfo = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/users/:id', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          nombre: tempData.nombre,
          correo: tempData.correo,
        }),
      });

      if (response.ok) {
        setUserData({ ...userData, nombre: tempData.nombre, correo: tempData.correo });
        setIsEditingInfo(false);
        alert('Información actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la información');
    }
  };

  const handleSaveAddress = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/users/:id', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          direccion: tempData.direccion,
        }),
      });

      if (response.ok) {
        setUserData({ ...userData, direccion: tempData.direccion });
        setIsEditingAddress(false);
        alert('Dirección actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la dirección');
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
    padding: '24px',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '16px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  };

  const navLinkStyle: React.CSSProperties = {
    color: '#6B7280',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const logoutButtonStyle: React.CSSProperties = {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '32px',
  };

  const profileCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
    textAlign: 'center',
  };

  const avatarStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#D1FAE5',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: '#10B981',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '4px',
  };

  const emailStyle: React.CSSProperties = {
    color: '#6B7280',
    fontSize: '14px',
    marginBottom: '16px',
  };

  const changePhotoButtonStyle: React.CSSProperties = {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const sectionCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const inputDisabledStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  };

  const editButtonStyle: React.CSSProperties = {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    float: 'right',
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '16px',
  };

  const saveButtonStyle: React.CSSProperties = {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const cancelButtonStyle: React.CSSProperties = {
    backgroundColor: '#E5E7EB',
    color: '#374151',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const changePasswordButtonStyle: React.CSSProperties = {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: '12px',
    marginTop: '48px',
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
  };

  const footerLinkStyle: React.CSSProperties = {
    color: '#6B7280',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={logoStyle}>
          <span style={{ color: '#10B981' }}>■</span>
          <span>Expirapp</span>
        </div>
        <nav style={navStyle}>
          <a style={navLinkStyle}>Home</a>
          <a style={navLinkStyle}>Products</a>
          <a style={{ ...navLinkStyle, color: '#10B981', fontWeight: '500' }}>My Profile</a>
          <button style={logoutButtonStyle}>Logout</button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#D1D5DB' }}></div>
        </nav>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>Mi Perfil</h1>

        {/* Profile Card */}
        <div style={profileCardStyle}>
          <div style={avatarStyle}>
            👤
          </div>
          <h2 style={nameStyle}>{userData.nombre}</h2>
          <p style={emailStyle}>{userData.correo}</p>
          <button style={changePhotoButtonStyle}>Cambiar Foto</button>
        </div>

        {/* Personal Information */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>Información Personal</h3>
            {!isEditingInfo && (
              <button
                style={editButtonStyle}
                onClick={() => {
                  setTempData({ ...userData });
                  setIsEditingInfo(true);
                }}
              >
                Editar
              </button>
            )}
          </div>

          <div style={fieldGroupStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre Completo</label>
              <input
                type="text"
                value={isEditingInfo ? tempData.nombre : userData.nombre}
                onChange={(e) => setTempData({ ...tempData, nombre: e.target.value })}
                style={isEditingInfo ? inputStyle : inputDisabledStyle}
                disabled={!isEditingInfo}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Correo Electrónico</label>
              <input
                type="email"
                value={isEditingInfo ? tempData.correo : userData.correo}
                onChange={(e) => setTempData({ ...tempData, correo: e.target.value })}
                style={isEditingInfo ? inputStyle : inputDisabledStyle}
                disabled={!isEditingInfo}
              />
            </div>
          </div>

          {isEditingInfo && (
            <div style={buttonGroupStyle}>
              <button style={cancelButtonStyle} onClick={() => setIsEditingInfo(false)}>
                Cancelar
              </button>
              <button style={saveButtonStyle} onClick={handleSaveInfo}>
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* Delivery Address */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>Dirección de Entrega/Recogida</h3>
            {!isEditingAddress && (
              <button
                style={editButtonStyle}
                onClick={() => {
                  setTempData({ ...userData });
                  setIsEditingAddress(true);
                }}
              >
                Editar
              </button>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Tu Dirección Principal</label>
            <input
              type="text"
              value={isEditingAddress ? tempData.direccion : userData.direccion}
              onChange={(e) => setTempData({ ...tempData, direccion: e.target.value })}
              style={isEditingAddress ? inputStyle : inputDisabledStyle}
              disabled={!isEditingAddress}
            />
          </div>

          {isEditingAddress && (
            <div style={buttonGroupStyle}>
              <button style={cancelButtonStyle} onClick={() => setIsEditingAddress(false)}>
                Cancelar
              </button>
              <button style={saveButtonStyle} onClick={handleSaveAddress}>
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* Security */}
        <div style={sectionCardStyle}>
          <h3 style={sectionTitleStyle}>Seguridad de la Cuenta</h3>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
            ¿Deseas actualizar tu contraseña?
          </p>
          <button style={changePasswordButtonStyle}>Cambiar Contraseña</button>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <span>© 2024 Expirapp. Todos los derechos reservados.</span>
          <a style={footerLinkStyle}>Términos de Servicio</a>
          <a style={footerLinkStyle}>Política de Privacidad</a>
          <a style={footerLinkStyle}>Ayuda</a>
        </div>
      </div>
    </div>
  );
};