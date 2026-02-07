import { useState } from 'react';
import { Box, Loader2, Maximize2, Minimize2 } from 'lucide-react';

interface MatterportEmbedProps {
  url: string;
  title: string;
}

export function MatterportEmbed({ url, title }: MatterportEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-black'
    : 'relative w-full h-[500px] rounded-2xl overflow-hidden';

  return (
    <div className={containerClass}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
          <p className="text-white/70 text-sm">Loading 3D Tour...</p>
        </div>
      )}

      {/* 3D Tour Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
          <Box size={16} />
          3D Virtual Tour
        </div>
      </div>

      {/* Fullscreen toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 bg-black/40 text-white rounded-lg backdrop-blur-md hover:bg-black/60 transition-colors"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <iframe
        src={url}
        title={`3D Tour - ${title}`}
        className="w-full h-full border-0"
        frameBorder="0"
        allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
