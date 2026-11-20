import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@tatsuyamiura2667/akane-lib/style.css'
import './styles.css'
import App from './App'

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-reveal')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
