import { useEffect } from "react";

const IMAGE_ASSETS = [
  // Fallback statici per i 360° (usati se la VideoTexture non è disponibile)
  "./assets/textures/BatCaverna360_ArmeriaArea.jpg",
  "./assets/textures/BatCaverna360_BatComputerArea.jpg",
  "./assets/textures/BatCaverna360_BatMobileArea.jpg",
];

const VIDEO_ASSETS = [
  // Video 360° animati (render BatCaverna — tutti e tre gli ambienti)
  "./assets/textures/BatCaverna360_ArmeriaArea.mp4",
  "./assets/textures/BatCaverna360_BatComputerArea.mp4",
  "./assets/textures/BatCaverna360_BatMobileArea.mp4",
  // Video di passaggio tra zone
  "./assets/videos/BatCaverna_PassaggioBatComputerAArmeria.mp4",
  "./assets/videos/BatCaverna_PassaggioArmeriaABatMobile.mp4",
];

export default function AssetPreloader() {
  useEffect(() => {
    // Preload Images
    IMAGE_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Preload Videos with graceful degradation for file://
    if (window.location.protocol !== 'file:') {
      VIDEO_ASSETS.forEach((src) => {
        try {
          const req = new XMLHttpRequest();
          req.open("GET", src, true);
          req.responseType = "blob";
          req.onerror = () => { console.warn(`Preload failed for ${src}`); };
          req.send();
        } catch (e) {
          // Ignore errors
        }
      });
    }
  }, []);

  return null;
}
