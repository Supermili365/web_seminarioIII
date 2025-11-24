import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'; 

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE_URL || env.BACKEND_URL || 'http://localhost:8080';

  return {
    plugins: [
      react(),
      tailwindcss(), 
    ],
    server: {
      proxy: {
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
});

