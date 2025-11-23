import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'; // Import tailwindcss

export default defineConfig(({ mode }) => {
  // Load env vars so we can use VITE_API_BASE_URL or BACKEND_URL in the proxy
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE_URL || env.BACKEND_URL || 'http://localhost:8080';

  return {
    plugins: [
      react(),
      tailwindcss(), // Add tailwindcss to your plugins
    ],
    server: {
      proxy: {
        // Proxy any request starting with /api to the backend
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
          // keep path as-is; backend should accept /api/v1/...
        }
      }
    }
  }
});

