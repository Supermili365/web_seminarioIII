import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../common/Header';
import { useUserProfile } from './useUserProfile';
import './UserProfile.css';

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const {
    userData,
    isLoading,
    error,
    isEditingInfo,
    setIsEditingInfo,
    isEditingAddress,
    setIsEditingAddress,
    tempData,
    setTempData,
    handleSaveInfo,
    handleSaveAddress,
    handleLogout
  } = useUserProfile();

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-full">
      {/* Header Centralizado - Siempre visible */}
      <Header />

      <div className="user-profile-container">
        {isLoading ? (
          <div className="loading-container">
            <div style={{ marginBottom: '16px' }}>⏳</div>
            Cargando perfil...
          </div>
        ) : !userData ? (
          <div className="error-container">
            ❌ No se pudieron cargar los datos del perfil
          </div>
        ) : (
          /* Content */
          <div className="profile-content">
            <h1 className="profile-title">Mi Perfil</h1>

            {error && (
              <div className="error-container">
                ⚠️ {error}
              </div>
            )}

            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-avatar">
                {userData.foto ? (
                  <img src={userData.foto} alt="Profile" />
                ) : (
                  '👤'
                )}
              </div>
              <h2 className="profile-name">{userData.nombre}</h2>
              <p className="profile-email">{userData.correo}</p>
              <button className="btn-change-photo">Cambiar Foto</button>
            </div>

            {/* Personal Information */}
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">Información Personal</h3>
                {!isEditingInfo && (
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setTempData({ ...userData });
                      setIsEditingInfo(true);
                    }}
                  >
                    Editar
                  </button>
                )}
              </div>

              <div className="field-group">
                <div className="field-item">
                  <label className="field-label">Nombre Completo</label>
                  <input
                    className="form-input"
                    type="text"
                    value={isEditingInfo ? (tempData?.nombre || '') : userData.nombre}
                    onChange={(e) => tempData && setTempData({ ...tempData, nombre: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="field-item">
                  <label className="field-label">Correo Electrónico</label>
                  <input
                    className="form-input"
                    type="email"
                    value={isEditingInfo ? (tempData?.correo || '') : userData.correo}
                    onChange={(e) => tempData && setTempData({ ...tempData, correo: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </div>
              </div>

              {isEditingInfo && (
                <div className="button-group">
                  <button className="btn-cancel" onClick={() => {
                    setIsEditingInfo(false);
                    setTempData({ ...userData });
                  }}>
                    Cancelar
                  </button>
                  <button className="btn-save" onClick={handleSaveInfo}>
                    Guardar
                  </button>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">Dirección de Entrega/Recogida</h3>
                {!isEditingAddress && (
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setTempData({ ...userData });
                      setIsEditingAddress(true);
                    }}
                  >
                    Editar
                  </button>
                )}
              </div>

              <div className="field-item">
                <label className="field-label">Tu Dirección Principal</label>
                <input
                  className="form-input"
                  type="text"
                  value={isEditingAddress ? (tempData?.direccion || '') : (userData.direccion || 'No especificada')}
                  onChange={(e) => tempData && setTempData({ ...tempData, direccion: e.target.value })}
                  disabled={!isEditingAddress}
                />
              </div>

              {isEditingAddress && (
                <div className="button-group">
                  <button className="btn-cancel" onClick={() => {
                    setIsEditingAddress(false);
                    setTempData({ ...userData });
                  }}>
                    Cancelar
                  </button>
                  <button className="btn-save" onClick={handleSaveAddress}>
                    Guardar
                  </button>
                </div>
              )}
            </div>

            {/* Security */}
            <div className="section-card">
              <h3 className="section-title">Seguridad de la Cuenta</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                ¿Deseas actualizar tu contraseña?
              </p>
              <button
                className="btn-change-password"
                onClick={() => navigate('/change-password')}
              >
                Cambiar Contraseña
              </button>
            </div>

            {/* Footer */}
            <div className="profile-footer">
              <span>© 2024 Expirapp. Todos los derechos reservados.</span>
              <a className="footer-link">Términos de Servicio</a>
              <a className="footer-link">Política de Privacidad</a>
              <a className="footer-link">Ayuda</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};