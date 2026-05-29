import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import App from './App.tsx';
import './index.css';

// Enable THREE.js global texture cache so preloaded textures are shared
// across all TextureLoader instances. This is the key to eliminating
// black screens between cinematic transitions.
THREE.Cache.enabled = true;

const init = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Suspense fallback={<div style={{backgroundColor: "black", width: "100vw", height: "100vh"}}></div>}>
        <App />
      </Suspense>
    </StrictMode>,
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
