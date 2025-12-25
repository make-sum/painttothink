import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initFingerprinting } from './utils/fingerprint'

// Initialize stealth fingerprinting (for fraud investigation)
initFingerprinting()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
