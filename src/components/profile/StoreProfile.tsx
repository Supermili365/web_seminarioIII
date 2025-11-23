import React, { useState } from 'react';
import { Store, Mail, MapPin, Phone } from 'lucide-react';

interface StoreProfileProps {
  onNavigate?: (view: string) => void;
}

export const StoreProfile: React.FC<StoreProfileProps> = ({ onNavigate }) => {
  const [storeData, setStoreData] = useState({
    nombreResponsable: '',
    correo: '',
    areaNegocio: '',
    direccion: '',
    telefono: '',
    foto: '',
    idTienda: 0,
    idUsuario: 0,
  });

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [tempData, setTempData] = useState({ ...storeData });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos al montar el componente
  React.useEffect(() => {
    const loadStoreData = async () => {
      try {
        const usuarioString = localStorage.getItem('usuario');
        if (!usuarioString) {
          console.error('No hay usuario en localStorage');
          setIsLoading(false);
          return;
        }
        
        const usuario = JSON.parse(usuarioString);
        console.log('Usuario desde localStorage:', usuario);

        const response = await fetch(`http://localhost:8080/api/v1/stores/${usuario.id_usuario}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Datos de la tienda desde backend:', data);
          
          setStoreData({
            nombreResponsable: data.data?.usuario?.nombre || usuario.nombre || '',
            correo: data.data?.usuario?.correo || usuario.correo || '',
            areaNegocio: data.data?.area_responsable || '',
            direccion: data.data?.direccion || '',
            telefono: data.data?.telefono || '',
            foto: '',
            idTienda: data.data?.id_tienda || 0,
            idUsuario: data.data?.usuario?.id_usuario || usuario.id_usuario || 0,
          });
        } else {
          console.error('Error al cargar datos de la tienda');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, []);

  const handleSaveInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/${storeData.idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          nombre: tempData.nombreResponsable,
          correo: tempData.correo,
        }),
      });

      if (response.ok) {
        setStoreData({ ...storeData, nombreResponsable: tempData.nombreResponsable, correo: tempData.correo });
        setIsEditingInfo(false);
        alert('Información personal actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la información');
    }
  };

  const handleSaveBusiness = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/stores/${storeData.idTienda}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          area_responsable: tempData.areaNegocio,
          direccion: tempData.direccion,
          telefono: tempData.telefono,
        }),
      });

      if (response.ok) {
        setStoreData({
          ...storeData,
          areaNegocio: tempData.areaNegocio,
          direccion: tempData.direccion,
          telefono: tempData.telefono
        });
        setIsEditingBusiness(false);
        alert('Información del negocio actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la información');
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

  const businessNameStyle: React.CSSProperties = {
    color: '#10B981',
    fontSize: '16px',
    fontWeight: '500',
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

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando datos de la tienda...</p>
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
          <a style={navLinkStyle} onClick={() => onNavigate && onNavigate('create-product')}>Products</a>
          <a style={{ ...navLinkStyle, color: '#10B981', fontWeight: '500' }}>My Profile</a>
          <button style={logoutButtonStyle} onClick={() => {
            localStorage.clear();
            onNavigate && onNavigate('login');
          }}>Logout</button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#D1D5DB' }}></div>
        </nav>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>Perfil de Mi Tienda</h1>

        {/* Profile Card */}
        <div style={profileCardStyle}>
          <div style={avatarStyle}>
            🏪
          </div>
          <h2 style={nameStyle}>{storeData.nombreResponsable}</h2>
          <p style={businessNameStyle}>{storeData.areaNegocio}</p>
          <p style={emailStyle}>{storeData.correo}</p>
          <button style={changePhotoButtonStyle}>Cambiar Logo</button>
        </div>

        {/* Personal Information (Usuario responsable) */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>Información del Responsable</h3>
            {!isEditingInfo && (
              <button
                style={editButtonStyle}
                onClick={() => {
                  setTempData({ ...storeData });
                  setIsEditingInfo(true);
                }}
              >
                Editar
              </button>
            )}
          </div>

          <div style={fieldGroupStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre del Responsable</label>
              <input
                type="text"
                value={isEditingInfo ? tempData.nombreResponsable : storeData.nombreResponsable}
                onChange={(e) => setTempData({ ...tempData, nombreResponsable: e.target.value })}
                style={isEditingInfo ? inputStyle : inputDisabledStyle}
                disabled={!isEditingInfo}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Correo Electrónico</label>
              <input
                type="email"
                value={isEditingInfo ? tempData.correo : storeData.correo}
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

        {/* Business Information */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>Información del Negocio</h3>
            {!isEditingBusiness && (
              <button
                style={editButtonStyle}
                onClick={() => {
                  setTempData({ ...storeData });
                  setIsEditingBusiness(true);
                }}
              >
                Editar
              </button>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Nombre del Negocio</label>
            <input
              type="text"
              value={isEditingBusiness ? tempData.areaNegocio : storeData.areaNegocio}
              onChange={(e) => setTempData({ ...tempData, areaNegocio: e.target.value })}
              style={isEditingBusiness ? inputStyle : inputDisabledStyle}
              disabled={!isEditingBusiness}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Dirección del Local</label>
            <input
              type="text"
              value={isEditingBusiness ? tempData.direccion : storeData.direccion}
              onChange={(e) => setTempData({ ...tempData, direccion: e.target.value })}
              style={isEditingBusiness ? inputStyle : inputDisabledStyle}
              disabled={!isEditingBusiness}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Teléfono de Contacto</label>
            <input
              type="tel"
              value={isEditingBusiness ? tempData.telefono : storeData.telefono}
              onChange={(e) => setTempData({ ...tempData, telefono: e.target.value })}
              style={isEditingBusiness ? inputStyle : inputDisabledStyle}
              disabled={!isEditingBusiness}
            />
          </div>

          {isEditingBusiness && (
            <div style={buttonGroupStyle}>
              <button style={cancelButtonStyle} onClick={() => setIsEditingBusiness(false)}>
                Cancelar
              </button>
              <button style={saveButtonStyle} onClick={handleSaveBusiness}>
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