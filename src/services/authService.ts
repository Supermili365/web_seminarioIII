import { jwtDecode } from 'jwt-decode';
import { LoginFormData, BuyerRegisterData, StoreRegisterData } from '../types/auth.types';

const API_URL = 'http://localhost:8081/api/v1';

interface LoginResponse {
  status: string;
  data: {
    token: string;
    usuario: any;
  };
}

interface DecodedToken {
  role: string;
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

export const authService = {
  async login(credentials: LoginFormData): Promise<{ token: string; user: any; role: string }> {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: credentials.email,
          contrasena: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      const data: LoginResponse = await response.json();
      
      if (!data.data || !data.data.token) {
        throw new Error('Respuesta del servidor inválida');
      }

      const { token, usuario } = data.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      // Decodificar token para obtener el rol
      const decoded = jwtDecode<DecodedToken>(token);
      const role = decoded.role?.toLowerCase().trim() || '';

      return { token, user: usuario, role };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async registerBuyer(data: BuyerRegisterData) {
    const payload = {
      nombre: data.fullName,
      correo: data.email,
      contrasena: data.password,
      direccion: data.address,
      role: 'comprador'
    };

    const response = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(responseData.message || 'Error al crear la cuenta');
    }

    return responseData;
  },

  async registerStore(data: StoreRegisterData) {
    const payload = {
      nombre: data.nombreUsuario,
      correo: data.correo,
      contrasena: data.contrasena,
      area_responsable: data.areaResponsable,
      direccion: data.direccion,
      telefono: data.telefono,
      role: 'vendedor'
    };

    const response = await fetch(`${API_URL}/stores/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(responseData.message || 'Error al crear la tienda');
    }

    return responseData;
  },

  // -------------------------------------------------------------------
  // 🔥 MÉTODO NUEVO: getMe()
  // Llama al backend para obtener los datos del usuario según el token.
  // -------------------------------------------------------------------
  async getMe(token: string) {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener la información del usuario autenticado');
    }

    return response.json();
  },

  // -------------------------------------------------------------------
  // 🔥 MÉTODO NUEVO (Opcional): obtener rol desde JWT sin login
  // -------------------------------------------------------------------
  getRoleFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role?.toLowerCase().trim() || '';
    } catch {
      return '';
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  }
};
