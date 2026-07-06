import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useGameStore } from './engine/store'
import { audio } from './engine/audio/AudioEngine'
import { playerPos } from './engine/scene3d/playerRef'

if (import.meta.env.DEV) {
  Object.assign(window, { __game: useGameStore, __audio: audio, __player: playerPos })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
