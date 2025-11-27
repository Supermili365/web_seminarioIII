import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UserData {
  id_usuario: number;
  nombre: string;
  correo: string;
  direccion: string;
  telefono?: string;
  fecha_registro?: string;
  foto?: string;
}

export const useUserProfile = () => {
  const navigate = useNavigate();
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

      // ---------------------------------------------------------
      // NUEVO: DETECCIÓN AUTOMÁTICA (TIENDA O USUARIO)
      // ---------------------------------------------------------

      // 1. Intentar como tienda
      let endpoint = `http://localhost:8081/api/v1/stores/${userId}`;
      let response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      // 2. Si la tienda NO existe → es comprador
      if (response.status === 404) {
        console.log("🔄 No es tienda. Intentando como usuario...");

        endpoint = `http://localhost:8081/api/v1/users/${userId}`;
        response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      }

      if (!response.ok) {
        throw new Error('Error al cargar los datos del usuario');
      }

      console.log("🔎 Endpoint final usado:", endpoint);

      const data = await response.json();
      console.log('✅ Datos del usuario cargados:', data);

      // Construir objeto UserData
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

      // Guardar la versión más nueva del usuario
      localStorage.setItem('usuario', JSON.stringify(userInfo));

    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
      setError('Error al cargar los datos del perfil');

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

      const response = await fetch(`http://localhost:8081/api/v1/users/${userData.id_usuario}`, {
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

      setUserData({ ...userData, nombre: tempData.nombre, correo: tempData.correo });

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

      const response = await fetch(`http://localhost:8081/api/v1/users/${userData.id_usuario}`, {
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

      setUserData({ ...userData, direccion: tempData.direccion });

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

    navigate('/login');
  };

  return {
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
  };
};
