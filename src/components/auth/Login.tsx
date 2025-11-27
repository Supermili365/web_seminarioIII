import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { Input } from '../common/Input';
import { LoginFormData } from '../../types/auth.types';
import { authService } from '../../services/authService';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { role } = await authService.login(data);
      
      // Simular un pequeño delay para mejor UX
      setTimeout(() => {
        setIsLoading(false);
        // Todos los usuarios van al home después de iniciar sesión
        navigate('/');
      }, 1000);

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="icon-container">
            <div className="icon-bg">
              <Clock style={{ color: '#10B981' }} size={32} />
            </div>
          </div>
          
          <h1 className="login-title">Bienvenido a Expirapp</h1>
          <p className="login-subtitle">
            Inicia sesión para encontrar grandes ofertas en productos cercanos a su fecha de vencimiento
          </p>

          {errorMessage && (
            <div className="alert-error">
              ✕ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field-container">
              <label className="input-label">
                Correo electrónico
              </label>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                }}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.email && (
                <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>
              )}
            </div>

            <div className="field-container">
              <label className="input-label">
                Contraseña
              </label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'La contraseña es obligatoria' }}
                render={({ field }) => (
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Introduce tu contraseña"
                    value={field.value}
                    onChange={field.onChange}
                    showPasswordToggle={true}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}
              />
              {errors.password && (
                <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>
              )}
            </div>

            <div className="checkbox-container">
              <label className="checkbox-label">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <input
                      {...field}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="checkbox-input"
                    />
                  )}
                />
                <span>Recordarme</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="link-button"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="login-footer">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="link-button"
              style={{ fontWeight: '500' }}
            >
              Crear una cuenta nueva
            </button>
          </p>
        </div>
      </div>

      {/* Círculo de carga superpuesto */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </>
  );
};