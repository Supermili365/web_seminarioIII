import React, { useState } from 'react';
import { CheckCircle, MapPin, Store, Phone, Mail, Lock, CreditCard } from 'lucide-react';
import { Input } from '../common/Input';

interface RegisterProps {
  onNavigate: (view: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [role, setRole] = useState<'comprador' | 'vendedor'>('comprador');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Formulario para compradores
  const [buyerData, setBuyerData] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
  });

  // Formulario para vendedores (tiendas)
  const [storeData, setStoreData] = useState({
    nombreUsuario: '',      // Nombre del responsable/dueño
    areaResponsable: '',    // Nombre del negocio
    direccion: '',
    telefono: '',
    correo: '',
    contrasena: '',
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (role === 'comprador') {
        // COMPRADOR: Registro simple
        const payload = { 
          nombre: buyerData.fullName,
          correo: buyerData.email,
          contrasena: buyerData.password,
          direccion: buyerData.address,
          rol: 'comprador'
        };

        console.log('📤 Registrando comprador:', payload);

        const response = await fetch('http://localhost:8080/api/v1/users/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        console.log('📥 Response:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
        }

        if (!response.ok) {
          throw new Error(data.message || 'Error al crear la cuenta');
        }

        setSuccessMessage('¡Usuario creado con éxito! Redirigiendo al inicio de sesión...');
        
      } else {
        // VENDEDOR: Registro de tienda con usuario en una sola petición
        const payload = {
          area_responsable: storeData.areaResponsable,
          direccion: storeData.direccion,
          telefono: storeData.telefono,
          usuario: {
            nombre: storeData.nombreUsuario, // Nombre del dueño/responsable
            correo: storeData.correo,
            contrasena: storeData.contrasena,
            rol: 'tienda'
          }
        };

        console.log('📤 Registrando tienda con usuario:', payload);

        const response = await fetch('http://localhost:8080/api/v1/stores/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        console.log('📥 Response:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
        }

        if (!response.ok) {
          throw new Error(data.message || 'Error al crear la tienda');
        }

        console.log('✅ Tienda y usuario creados exitosamente:', data);
        setSuccessMessage('¡Tienda registrada con éxito! Redirigiendo al inicio de sesión...');
      }

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        onNavigate('login');
      }, 2000);

    } catch (error) {
      console.error('Error en registro:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al crear la cuenta. Intenta nuevamente.');
    } finally {
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    marginBottom: '24px',
    fontSize: '14px',
  };

  const roleContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    justifyContent: 'center',
  };

  const roleButtonStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 24px',
    border: isActive ? '2px solid #10B981' : '2px solid #E5E7EB',
    backgroundColor: isActive ? '#D1FAE5' : 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500',
    fontSize: '14px',
    color: isActive ? '#065F46' : '#6B7280',
  });

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

  const buttonPrimaryStyle: React.CSSProperties = {
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

  const buttonSecondaryStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#10B981',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const alertSuccessStyle: React.CSSProperties = {
    backgroundColor: '#D1FAE5',
    border: '1px solid #10B981',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    color: '#065F46',
    fontSize: '14px',
    textAlign: 'center',
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

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '24px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>
            <CheckCircle style={{ color: '#10B981' }} size={24} />
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Expirapp</span>
          </div>
          <button
            onClick={() => onNavigate('login')}
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
          >
            Iniciar sesión
          </button>
        </div>

        <h1 style={titleStyle}>Crea tu cuenta en Expirapp</h1>
        <p style={subtitleStyle}>
          {role === 'comprador' 
            ? 'Únete a nuestra comunidad y empieza a disfrutar de productos de calidad a precios increíbles.'
            : 'Únete a Expirapp y empieza a vender productos próximos a vencer.'}
        </p>

        {/* Mensajes de éxito o error */}
        {successMessage && (
          <div style={alertSuccessStyle}>
            ✓ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div style={alertErrorStyle}>
            ✕ {errorMessage}
          </div>
        )}

        {/* Selector de Rol */}
        <div style={roleContainerStyle}>
          <button
            onClick={() => setRole('comprador')}
            style={roleButtonStyle(role === 'comprador')}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (role !== 'comprador' && !isLoading) {
                e.currentTarget.style.borderColor = '#10B981';
                e.currentTarget.style.backgroundColor = '#F0FDF4';
              }
            }}
            onMouseLeave={(e) => {
              if (role !== 'comprador') {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            👤 Soy Comprador
          </button>
          <button
            onClick={() => setRole('vendedor')}
            style={roleButtonStyle(role === 'vendedor')}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (role !== 'vendedor' && !isLoading) {
                e.currentTarget.style.borderColor = '#10B981';
                e.currentTarget.style.backgroundColor = '#F0FDF4';
              }
            }}
            onMouseLeave={(e) => {
              if (role !== 'vendedor') {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            🏪 Soy Vendedor (Tengo una Tienda)
          </button>
        </div>

        {/* Formulario para Compradores */}
        {role === 'comprador' && (
          <div>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Nombre completo</label>
              <Input
                type="text"
                placeholder="Introduce tu nombre y apellidos"
                value={buyerData.fullName}
                onChange={(e) => setBuyerData({ ...buyerData, fullName: e.target.value })}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Correo electrónico</label>
              <Input
                type="email"
                placeholder="tu.correo@ejemplo.com"
                value={buyerData.email}
                onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Contraseña</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Crea una contraseña segura"
                value={buyerData.password}
                onChange={(e) => setBuyerData({ ...buyerData, password: e.target.value })}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Dirección principal</label>
              <Input
                type="text"
                placeholder="Ej: Calle Falsa 123, Springfield"
                value={buyerData.address}
                icon={<MapPin size={18} />}
                onChange={(e) => setBuyerData({ ...buyerData, address: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Formulario para Vendedores (Tiendas) */}
        {role === 'vendedor' && (
          <div>
            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Nombre del responsable</label>
              <Input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={storeData.nombreUsuario}
                onChange={(e) => setStoreData({ ...storeData, nombreUsuario: e.target.value })}
                icon={<Store size={18} />}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Área responsable / Nombre del negocio</label>
              <Input
                type="text"
                placeholder="Ej: Super Ahorro"
                value={storeData.areaResponsable}
                onChange={(e) => setStoreData({ ...storeData, areaResponsable: e.target.value })}
                icon={<Store size={18} />}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Dirección</label>
              <Input
                type="text"
                placeholder="Ej: Av. Siempre Viva 742"
                value={storeData.direccion}
                onChange={(e) => setStoreData({ ...storeData, direccion: e.target.value })}
                icon={<MapPin size={18} />}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Número de contacto</label>
              <Input
                type="tel"
                placeholder="Ej: 3012345678"
                value={storeData.telefono}
                onChange={(e) => setStoreData({ ...storeData, telefono: e.target.value })}
                icon={<Phone size={18} />}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Correo electrónico</label>
              <Input
                type="email"
                placeholder="tu.tienda@correo.com"
                value={storeData.correo}
                onChange={(e) => setStoreData({ ...storeData, correo: e.target.value })}
                icon={<Mail size={18} />}
              />
            </div>

            <div style={fieldContainerStyle}>
              <label style={labelStyle}>Contraseña</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={storeData.contrasena}
                onChange={(e) => setStoreData({ ...storeData, contrasena: e.target.value })}
                icon={<Lock size={18} />}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={buttonPrimaryStyle}
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
          {isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
        </button>

        <p style={footerStyle}>
          © 2024 Expirapp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};