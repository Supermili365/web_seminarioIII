import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface CreateProductProps {
  onNavigate: (view: string) => void;
}

export const CreateProduct: React.FC<CreateProductProps> = ({ onNavigate }) => {
  const [productData, setProductData] = useState({
    nombre: '',
    descripcion: '',
    // Eliminado: categoria
    fechaVencimiento: '',
    stock: '', // Cambiado de 'cantidad' a 'stock'
    // Eliminado: precioOriginal
    precio: '', // Nuevo campo que unifica 'precioOriginal' y 'precioDescuento'
    estado: 'En preparación', // Nuevo campo con valor por defecto
    // Eliminado: marcarDonacion
  });
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages([...images, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Obtener el usuario de localStorage
      const usuarioString = localStorage.getItem('usuario');
      if (!usuarioString) {
        alert('No hay sesión activa');
        setIsLoading(false);
        return;
      }
      const usuario = JSON.parse(usuarioString);

      // Validación básica de campos requeridos (nombre, precio, fechaVencimiento)
      if (!productData.nombre || !productData.precio || !productData.fechaVencimiento) {
        alert('Por favor, completa los campos Nombre del Producto, Precio y Fecha de Vencimiento.');
        setIsLoading(false);
        return;
      }
      
      const payload = {
        nombre: productData.nombre,
        descripcion: productData.descripcion || undefined, // opcional
        precio: parseFloat(productData.precio), // requerido
        fecha_vencimiento: productData.fechaVencimiento, // requerido
        stock: productData.stock ? parseInt(productData.stock) : undefined, // opcional
        estado: productData.estado, // opcional, con default en backend
        id_tienda: usuario.id_tienda, // requerido
      };

      const response = await fetch('http://localhost:8080/api/v1/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('¡Producto publicado exitosamente!');
        // Limpiar formulario
        setProductData({
          nombre: '',
          descripcion: '',
          fechaVencimiento: '',
          stock: '',
          precio: '',
          estado: 'En preparación',
        });
        setImages([]);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'No se pudo publicar el producto'}`);
      }
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Error al publicar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Estilos de la interfaz (se mantienen iguales) ---
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '16px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  const userMenuStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  };

  const iconButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#6B7280',
  };

  const avatarStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#FED7AA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '32px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '16px',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
  };

const uploadAreaStyle: React.CSSProperties = {
    border: '2px dashed #D1D5DB',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#F9FAFB',
    marginBottom: '16px',
    display: 'flex', // Agregado
    flexDirection: 'column', // Agregado
    alignItems: 'center', // Agregado
    justifyContent: 'center', // Agregado
    minHeight: '180px', // Opcional: Asegura una altura mínima para la caja
  };

  const imagePreviewContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginTop: '16px',
  };

  const imagePreviewStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #E5E7EB',
  };

  const removeImageButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: '10px 24px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const submitButtonStyle: React.CSSProperties = {
    padding: '10px 24px',
    backgroundColor: isLoading ? '#9CA3AF' : '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  // --- JSX de la interfaz (modificado para reflejar los campos del JSON) ---

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={logoStyle}>
          <span style={{ color: '#10B981' }}>■</span>
          <span>Expirapp</span>
        </div>
        <div style={userMenuStyle}>
          <button style={iconButtonStyle}>🔔</button>
          <button style={iconButtonStyle}>⚙️</button>
          <div style={avatarStyle} onClick={() => onNavigate('store-profile')}>
            👤
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>Crear Nueva Publicación</h1>

        <div style={gridStyle}>
          {/* Left Column */}
          <div>
            <div style={cardStyle}>
              {/* Nombre del Producto (nombre) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Nombre del Producto (*)</label>
                <input
                  type="text"
                  placeholder="Ej: Leche Deslactosada"
                  value={productData.nombre}
                  onChange={(e) => setProductData({ ...productData, nombre: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Descripción (descripcion) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Descripción</label>
                <textarea
                  placeholder="Breve descripción del producto"
                  value={productData.descripcion}
                  onChange={(e) => setProductData({ ...productData, descripcion: e.target.value })}
                  style={textareaStyle}
                />
              </div>

              {/* Fecha de Vencimiento (fecha_vencimiento) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Fecha de Vencimiento (*)</label>
                <input
                  type="date"
                  value={productData.fechaVencimiento}
                  onChange={(e) => setProductData({ ...productData, fechaVencimiento: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Campos divididos: Stock y Precio */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                {/* Stock (stock) */}
                <div>
                  <label style={labelStyle}>Stock</label>
                  <input
                    type="number"
                    placeholder="Unidades disponibles"
                    value={productData.stock}
                    onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                
                {/* Precio (precio) - Unificado */}
                <div>
                  <label style={labelStyle}>Precio de Venta (*)</label>
                  <input
                    type="number"
                    placeholder="$0.00"
                    value={productData.precio}
                    onChange={(e) => setProductData({ ...productData, precio: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Estado (estado) - Nuevo campo con lista desplegable */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Estado de Publicación</label>
                <select
                  value={productData.estado}
                  onChange={(e) => setProductData({ ...productData, estado: e.target.value })}
                  style={selectStyle}
                >
                  <option value="En preparación">En preparación</option>
                  <option value="Listo para recoger">Listo para recoger</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </div>

              {/* Eliminado: checkbox 'Marcar como Donación' */}
              
            </div>
          </div>

          {/* Right Column - Images */}
          <div>
            <div style={cardStyle}>
              <label style={labelStyle}>Subir Fotografías</label>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                Arrastra y suelta o haz clic para seleccionar las imágenes del producto
              </p>

              <label style={uploadAreaStyle}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Upload size={48} style={{ color: '#10B981', margin: '0 auto 16px' }} />
                <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
                  Seleccionar Archivos
                </p>
              </label>

              {images.length > 0 && (
                <div style={imagePreviewContainerStyle}>
                  {images.map((image, index) => (
                    <div key={index} style={imagePreviewStyle}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        style={removeImageButtonStyle}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={buttonGroupStyle}>
          <button
            style={cancelButtonStyle}
            onClick={() => onNavigate('store-profile')}
          >
            Cancelar
          </button>
          <button
            style={submitButtonStyle}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
};