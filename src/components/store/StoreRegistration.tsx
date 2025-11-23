import React, { useState } from 'react';
import { Clock, Store, MapPin, Phone, Mail, Lock, CreditCard } from 'lucide-react';
import { Input } from '../common/Input';
import { StoreFormData } from '../../types/auth.types';

interface StoreRegistrationProps {
  onNavigate: (view: string) => void;
}

export const StoreRegistration: React.FC<StoreRegistrationProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<StoreFormData>({
    businessName: '',
    taxId: '',
    physicalAddress: '',
    phone: '',
    email: '',
    password: '',
    role: 'vendedor', // Agregado el campo role
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://api.expirapp.com/stores/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Tienda registrada:', data);
    } catch (error) {
      console.error('Error en registro de tienda:', error);
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
    maxWidth: '672px',
    boxSizing: 'border-box',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
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

  const gridTwoColsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
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

  const linkStyle: React.CSSProperties = {
    color: '#10B981',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '24px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>
          <Clock style={{ color: '#10B981' }} size={24} />
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Expirapp</span>
        </div>

        <h1 style={titleStyle}>Registra tu tienda</h1>
        <p style={subtitleStyle}>
          Únete a Expirapp y empieza a vender productos próximos a vencer.
        </p>

        <div>
          <div style={gridTwoColsStyle}>
            <div style={{ width: '100%' }}>
              <label style={labelStyle}>
                Nombre del negocio
              </label>
              <Input
                type="text"
                placeholder="Ej: Super Ahorro"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                icon={<Store size={18} />}
              />
            </div>

            <div style={{ width: '100%' }}>
              <label style={labelStyle}>
                NIT o identificación
              </label>
              <Input
                type="text"
                placeholder="Tu número de identificación"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                icon={<CreditCard size={18} />}
              />
            </div>
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Dirección física del local
            </label>
            <Input
              type="text"
              placeholder="Ej: Av. Siempre Viva 742"
              value={formData.physicalAddress}
              onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
              icon={<MapPin size={18} />}
            />
          </div>

          <div style={gridTwoColsStyle}>
            <div style={{ width: '100%' }}>
              <label style={labelStyle}>
                Número de contacto
              </label>
              <Input
                type="tel"
                placeholder="Ej: 3012345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon={<Phone size={18} />}
              />
            </div>

            <div style={{ width: '100%' }}>
              <label style={labelStyle}>
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="tu.tienda@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<Mail size={18} />}
              />
            </div>
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Contraseña
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={<Lock size={18} />}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
          >
            Crear cuenta
          </button>
        </div>

        <p style={footerStyle}>
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => onNavigate('login')}
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#059669')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#10B981')}
          >
            Inicia sesión
          </button>
        </p>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#6B7280', marginTop: '32px' }}>
          © 2024 Expirapp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};