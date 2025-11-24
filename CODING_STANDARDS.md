# Estándares de Código y Guía de Desarrollo - Expirapp

Este documento define las reglas y mejores prácticas para el desarrollo en el proyecto Expirapp. El objetivo es mantener un código limpio, mantenible y escalable, evitando problemas comunes como "spaghetti code", lógica de navegación inconsistente y deuda técnica.

## 1. Arquitectura y Estructura de Archivos

### 1.1. Separación de Responsabilidades (Pattern Container/Presenter)
Para componentes complejos, separamos la lógica de la vista.
*   **Vista (`.tsx`)**: Solo debe contener JSX y lógica de renderizado UI. No debe contener llamadas a APIs ni lógica de negocio compleja.
*   **Lógica (`useHook.ts`)**: Creamos Custom Hooks para manejar estados, efectos (`useEffect`), y funciones manejadoras (`handlers`).
*   **Estilos (`.css`)**: Archivos CSS externos importados en el componente. Evitar estilos en línea (`style={{...}}`) salvo para valores dinámicos muy específicos.

**Ejemplo:**
```
src/components/profile/
├── UserProfile.tsx       # Vista (JSX)
├── useUserProfile.ts     # Lógica (State, Effects, API calls)
└── UserProfile.css       # Estilos
```

### 1.2. Organización por Dominios
Agrupar archivos por funcionalidad o dominio de negocio, no por tipo técnico.
*   `src/components/auth/`: Login, Register, Password Reset.
*   `src/components/store/`: Gestión de tiendas y productos.
*   `src/components/profile/`: Perfiles de usuario y tienda.
*   `src/components/common/`: Componentes reutilizables (Inputs, Botones, Header).

## 2. Navegación y Enrutamiento

### 2.1. React Router DOM Exclusivo
*   **Única Fuente de Verdad**: La navegación debe ser manejada **exclusivamente** por `react-router-dom`.
*   **No Navegación por Estado**: Nunca usar variables de estado (ej. `currentView`) en `App.tsx` para renderizar vistas condicionalmente.
*   **Definición de Rutas**: Todas las rutas deben estar centralizadas en un componente principal de rutas (actualmente `src/components/menu/pages/menu.tsx` o un futuro `AppRoutes.tsx`).

### 2.2. Uso de Hooks de Navegación
*   Usar el hook `useNavigate` dentro de los componentes para redirecciones programáticas.
*   **No pasar callbacks de navegación**: Evitar pasar funciones como `onNavigate` a través de props. Los componentes deben ser autónomos en su capacidad de navegar.

```typescript
// ✅ Correcto
const navigate = useNavigate();
const handleLogin = () => navigate('/profile');

// ❌ Incorrecto
const Login = ({ onNavigate }) => { ... onNavigate('profile') }
```

### 2.3. Enlaces
*   Usar el componente `<Link to="...">` para navegación interna en lugar de etiquetas `<a>` para evitar recargas de página completas (SPA behavior).

## 3. Manejo de Datos y API

### 3.1. Capa de Servicios
*   Toda comunicación con el Backend debe estar encapsulada en `src/services/`.
*   Los componentes **no** deben hacer `fetch` directamente. Deben llamar a métodos del servicio (ej. `authService.login()`).

### 3.2. Configuración de Entorno
*   **No Hardcodear URLs**: Las URLs base de la API (ej. `http://localhost:8081/api/v1`) deben venir de variables de entorno (`import.meta.env.VITE_API_URL`) o constantes centralizadas.
*   Asegurar consistencia en los puertos (evitar mezclar 8080 y 8081).

## 4. TypeScript y Tipado

### 4.1. Interfaces Explícitas
*   Definir interfaces para Props, Estados y respuestas de API.
*   Evitar el uso de `any`. Si el tipo es desconocido, usar `unknown` y validar, o definir un tipo parcial.

### 4.2. Props de Componentes
*   Usar `React.FC<Props>` para componentes funcionales.
*   Definir claramente qué props son opcionales (`?`).

## 5. Estilos y UI

### 5.1. CSS
*   Usar clases CSS descriptivas (BEM o similar es recomendado).
*   Evitar selectores globales que puedan causar conflictos.
*   Si se usa Tailwind (presente en algunas partes), mantener consistencia y no mezclar arbitrariamente con CSS puro sin razón.

## 6. Flujo de Trabajo Recomendado para Nuevas Features

1.  **Definir la Ruta**: Agregar la nueva ruta en el archivo de rutas principal.
2.  **Crear el Hook**: Implementar la lógica de negocio y estado en `useFeatureName.ts`.
3.  **Crear la Vista**: Maquetar el componente en `FeatureName.tsx` usando el hook.
4.  **Estilar**: Crear `FeatureName.css`.
5.  **Integrar Servicio**: Si requiere backend, agregar métodos a `services/`.

---
*Este documento debe ser revisado y actualizado conforme el equipo y el proyecto evolucionen.*
