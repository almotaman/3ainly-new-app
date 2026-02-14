import { useEffect, useRef, useState, useCallback } from 'react';
import { Maximize2, Minimize2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface PanoramaViewerProps {
  panoramas: { url: string; label: string }[];
}

// Real equirectangular 360° panorama images
const REAL_360_PANORAMAS = [
  {
    url: 'https://pannellum.org/images/alma.jpg',
    label: 'Living Room'
  },
  {
    url: 'https://pannellum.org/images/bma-1.jpg', 
    label: 'Kitchen'
  },
  {
    url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    label: 'Outdoor View'
  }
];

export function PanoramaViewer({ panoramas }: PanoramaViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Use real 360 panoramas for demo (falling back to sample panos if none provided)
  const activePanoramas = panoramas.length > 0 ? panoramas : REAL_360_PANORAMAS;

  const initViewer = useCallback((index: number) => {
    if (!viewerContainerRef.current) return;
    
    // Clean up existing viewer
    if (viewerRef.current) {
      try {
        viewerRef.current.destroy();
      } catch (e) {
        // Viewer might already be destroyed
      }
      viewerRef.current = null;
    }

    // Clear the container
    viewerContainerRef.current.innerHTML = '';
    setIsLoading(true);

    // Create a new div for the viewer
    const viewerDiv = document.createElement('div');
    viewerDiv.style.width = '100%';
    viewerDiv.style.height = '100%';
    viewerContainerRef.current.appendChild(viewerDiv);

    // Dynamically load Pannellum
    const loadPannellum = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if already loaded
        if ((window as any).pannellum) {
          resolve();
          return;
        }

        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pannellum'));
        document.head.appendChild(script);
      });
    };

    loadPannellum().then(() => {
      const pannellum = (window as any).pannellum;
      
      viewerRef.current = pannellum.viewer(viewerDiv, {
        type: 'equirectangular',
        panorama: activePanoramas[index].url,
        autoLoad: true,
        autoRotate: autoRotate ? -2 : 0,
        autoRotateInactivityDelay: 1000,
        compass: false,
        showZoomCtrl: true,
        showFullscreenCtrl: false,
        mouseZoom: true,
        keyboardZoom: true,
        draggable: true,
        friction: 0.15,
        yaw: 0,
        pitch: 0,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        strings: {
          loadingLabel: 'Loading 360° View...'
        }
      });

      viewerRef.current.on('load', () => {
        setIsLoading(false);
      });

      viewerRef.current.on('error', (err: any) => {
        console.error('Pannellum error:', err);
        setIsLoading(false);
      });
    }).catch(err => {
      console.error('Failed to load Pannellum:', err);
      setIsLoading(false);
    });
  }, [autoRotate]);

  useEffect(() => {
    initViewer(activeIndex);

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [activeIndex, initViewer]);

  // Update auto-rotate when toggled
  useEffect(() => {
    if (viewerRef.current) {
      try {
        if (autoRotate) {
          viewerRef.current.startAutoRotate(-2);
        } else {
          viewerRef.current.stopAutoRotate();
        }
      } catch (e) {
        // Viewer might not be ready
      }
    }
  }, [autoRotate]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const nextPanorama = () => {
    setActiveIndex(prev => (prev + 1) % activePanoramas.length);
  };

  const prevPanorama = () => {
    setActiveIndex(prev => (prev - 1 + activePanoramas.length) % activePanoramas.length);
  };

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-black'
    : 'relative w-full h-[500px] rounded-2xl overflow-hidden';

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={`${containerClass} select-none group bg-gray-900`}
      >
        {/* Pannellum Viewer Container */}
        <div
          ref={viewerContainerRef}
          className="w-full h-full"
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-cyan-400/30 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>
              <p className="text-white font-medium">Loading 360° Panorama...</p>
              <p className="text-gray-400 text-sm mt-1">Preparing immersive view</p>
            </div>
          </div>
        )}

        {/* 360° Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-3 text-sm font-medium shadow-lg">
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                <path d="M2 12h20"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <span>360° Live View</span>
          </div>
        </div>

        {/* Room label */}
        <div className="absolute bottom-24 left-4 z-20">
          <div className="bg-white/95 backdrop-blur-md text-gray-900 px-4 py-2 rounded-xl font-semibold shadow-lg border border-gray-100">
            📍 {activePanoramas[activeIndex].label}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-200 ${
              autoRotate 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            title={autoRotate ? 'Stop auto-rotate' : 'Start auto-rotate'}
          >
            <RotateCcw size={18} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-black/50 text-white rounded-xl backdrop-blur-md hover:bg-black/70 transition-all duration-200"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        {/* Nav arrows */}
        {activePanoramas.length > 1 && (
          <>
            <button
              onClick={prevPanorama}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextPanorama}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 hover:scale-110 transition-all duration-200 shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/60 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="text-lg">🖱️</span> Drag to look around
            </span>
            <span className="w-px h-4 bg-white/30"></span>
            <span className="flex items-center gap-1">
              <span className="text-lg">🔍</span> Scroll to zoom
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activePanoramas.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-8 h-2 bg-blue-500 rounded-full'
                  : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 px-1">
        {activePanoramas.map((pano, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
              index === activeIndex
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-lg'
                : 'opacity-60 hover:opacity-100 hover:scale-102'
            }`}
          >
            <div className="relative w-28 h-20">
              <img 
                src={pano.url} 
                alt={pano.label} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                <span className="text-[11px] text-white font-medium truncate">{pano.label}</span>
                <span className="text-[10px] bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-white">360°</span>
              </div>
              {index === activeIndex && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
