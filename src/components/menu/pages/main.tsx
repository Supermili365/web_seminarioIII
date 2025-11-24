import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './menu' 
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById('root') as HTMLElement;

// 2. Usamos createRoot
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      {/* App es ahora el componente tipado de TypeScript */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
