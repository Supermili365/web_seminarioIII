import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Lock } from 'lucide-react';

interface UserProfileProps {
  onNavigate?: (view: string) => void;
}

interface UserData {
  id_usuario: number;
  nombre: string;
  correo: string;
  direccion: string;
  telefono?: string;
  fecha_registro?: string;
  foto?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempData, setTempData] = useState<UserData | null>(null);
  const [error, setError] = useState('');

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Obtener el usuario almacenado en localStorage
      const usuarioString = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');

      if (!usuarioString || !token) {
        setError('No hay sesión activa');
        setIsLoading(false);
        return;
      }

      const usuarioLocal = JSON.parse(usuarioString);
      const userId = usuarioLocal.id_usuario;

      console.log('🔍 Cargando datos del usuario ID:', userId);

      // Hacer petición al backend para obtener los datos actualizados
      const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del usuario');
      }

      const data = await response.json();
      console.log('✅ Datos del usuario cargados:', data);

      // Actualizar el estado con los datos recibidos
      const userInfo: UserData = {
        id_usuario: data.data?.id_usuario || usuarioLocal.id_usuario,
        nombre: data.data?.nombre || usuarioLocal.nombre || '',
        correo: data.data?.correo || usuarioLocal.correo || '',
        direccion: data.data?.direccion || '',
        telefono: data.data?.telefono || '',
        fecha_registro: data.data?.fecha_registro || usuarioLocal.fecha_registro,
        foto: data.data?.foto || '',
      };

      setUserData(userInfo);
      setTempData(userInfo);
      
      // Actualizar localStorage con los datos más recientes
      localStorage.setItem('usuario', JSON.stringify(userInfo));

    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
      setError('Error al cargar los datos del perfil');
      
      // Intentar usar los datos del localStorage como respaldo
      const usuarioString = localStorage.getItem('usuario');
      if (usuarioString) {
        const usuarioLocal = JSON.parse(usuarioString);
        setUserData(usuarioLocal);
        setTempData(usuarioLocal);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!tempData || !userData) return;

    try {
      const token = localStorage.getItem('token');
      
      console.log('💾 Actualizando información personal...');
      
      const response = await fetch(`http://localhost:8080/api/v1/users/${userData.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: tempData.nombre,
          correo: tempData.correo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar');
      }

      const data = await response.json();
      console.log('✅ Información actualizada:', data);

      // Actualizar el estado local
      setUserData({ ...userData, nombre: tempData.nombre, correo: tempData.correo });
      
      // Actualizar localStorage
      localStorage.setItem('usuario', JSON.stringify({ 
        ...userData, 
        nombre: tempData.nombre, 
        correo: tempData.correo 
      }));
      
      setIsEditingInfo(false);
      alert('✅ Información actualizada exitosamente');
      
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      alert('❌ Error al actualizar la información');
    }
  };

  const handleSaveAddress = async () => {
    if (!tempData || !userData) return;

    try {
      const token = localStorage.getItem('token');
      
      console.log('💾 Actualizando dirección...');
      
      const response = await fetch(`http://localhost:8080/api/v1/users/${userData.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          direccion: tempData.direccion,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar');
      }

      const data = await response.json();
      console.log('✅ Dirección actualizada:', data);

      // Actualizar el estado local
      setUserData({ ...userData, direccion: tempData.direccion });
      
      // Actualizar localStorage
      localStorage.setItem('usuario', JSON.stringify({ 
        ...userData, 
        direccion: tempData.direccion 
      }));
      
      setIsEditingAddress(false);
      alert('✅ Dirección actualizada exitosamente');
      
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      alert('❌ Error al actualizar la dirección');
    }
  };

  const handleLogout = () => {
    console.log('👋 Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    if (onNavigate) {
      onNavigate('login');
    }
  };

  // Estilos
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

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '48px',
    fontSize: '18px',
    color: '#6B7280',
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    color: '#991B1B',
    textAlign: 'center',
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={{ marginBottom: '16px' }}>⏳</div>
          Cargando perfil...
        </div>
      </div>
    );
  }

  // Mostrar error si no hay datos
  if (!userData) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          ❌ No se pudieron cargar los datos del perfil
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={logoStyle}>
          <span style={{ color: '#10B981' }}>■</span>
          <span>Expirapp</span>
        </div>
        <nav style={navStyle}>
          <a style={navLinkStyle} onClick={() => onNavigate && onNavigate('home')}>Home</a>
          <a style={navLinkStyle} onClick={() => onNavigate && onNavigate('products')}>Products</a>
          <a style={{ ...navLinkStyle, color: '#10B981', fontWeight: '500' }}>My Profile</a>
          <button style={logoutButtonStyle} onClick={handleLogout}>Logout</button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#D1D5DB' }}></div>
        </nav>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>Mi Perfil</h1>

        {error && (
          <div style={errorStyle}>
            ⚠️ {error}
          </div>
        )}

        {/* Profile Card */}
        <div style={profileCardStyle}>
          <div style={avatarStyle}>
            {userData.foto ? (
              <img src={userData.foto} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              '👤'
            )}
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
                value={isEditingInfo ? (tempData?.nombre || '') : userData.nombre}
                onChange={(e) => tempData && setTempData({ ...tempData, nombre: e.target.value })}
                style={isEditingInfo ? inputStyle : inputDisabledStyle}
                disabled={!isEditingInfo}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Correo Electrónico</label>
              <input
                type="email"
                value={isEditingInfo ? (tempData?.correo || '') : userData.correo}
                onChange={(e) => tempData && setTempData({ ...tempData, correo: e.target.value })}
                style={isEditingInfo ? inputStyle : inputDisabledStyle}
                disabled={!isEditingInfo}
              />
            </div>
          </div>

          {isEditingInfo && (
            <div style={buttonGroupStyle}>
              <button style={cancelButtonStyle} onClick={() => {
                setIsEditingInfo(false);
                setTempData({ ...userData });
              }}>
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
              value={isEditingAddress ? (tempData?.direccion || '') : (userData.direccion || 'No especificada')}
              onChange={(e) => tempData && setTempData({ ...tempData, direccion: e.target.value })}
              style={isEditingAddress ? inputStyle : inputDisabledStyle}
              disabled={!isEditingAddress}
            />
          </div>

          {isEditingAddress && (
            <div style={buttonGroupStyle}>
              <button style={cancelButtonStyle} onClick={() => {
                setIsEditingAddress(false);
                setTempData({ ...userData });
              }}>
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
          <button 
            style={changePasswordButtonStyle}
            onClick={() => onNavigate && onNavigate('change-password')}
          >
            Cambiar Contraseña
          </button>
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