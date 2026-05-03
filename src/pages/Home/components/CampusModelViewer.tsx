import { useState, useRef, useEffect } from 'react';

export default function CampusModelViewer() {
  const [status, setStatus] = useState<string>('Loading NIET 3D Campus…');
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically load the model-viewer script from Google's CDN to avoid Vite bundling issues
    if (!document.querySelector('script[src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }

    const viewer = viewerRef.current;
    if (viewer) {
      const handleLoad = () => {
        console.log('Model loaded successfully');
        setStatus('');
      };
      const handleError = (e: any) => {
        console.error('Model failed to load:', e);
        setStatus('Model failed to load. Check console.');
      };

      viewer.addEventListener('load', handleLoad);
      viewer.addEventListener('error', handleError);

      return () => {
        viewer.removeEventListener('load', handleLoad);
        viewer.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <div className="w-full relative flex flex-col items-center justify-center p-4">
      {status && (
        <div className="absolute top-10 z-10 bg-white/80 px-4 py-2 rounded-full font-bold text-gray-700 shadow-md backdrop-blur-sm">
          {status}
        </div>
      )}
      <div className="w-full rounded-[32px] overflow-hidden flex items-center justify-center relative">
        {/* @ts-ignore - model-viewer is a web component */}
        <model-viewer
          ref={viewerRef}
          src="/models/niet-campus.glb"
          alt="NIET 3D Campus Model"
          camera-controls
          auto-rotate
          reveal="auto"
          loading="eager"
          shadow-intensity="1"
          exposure="1.2"
          environment-image="neutral"
          camera-orbit="45deg 55deg 25%"
          field-of-view="25deg"
          min-field-of-view="10deg"
          max-field-of-view="auto"
          interpolation-decay="200"
          bounds="tight"
          style={{
            width: "100%",
            height: "750px",
            background: "transparent",
            borderRadius: "32px",
            display: "block"
          }}
          className="transition-all duration-300"
        >
        {/* @ts-ignore */}
        </model-viewer>
      </div>
    </div>
  );
}
