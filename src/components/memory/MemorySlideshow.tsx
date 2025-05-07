
import React, { useState, useEffect } from 'react';
import { Music, SkipBack, SkipForward, Pause, Play } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MemorySlideshowProps {
  memory: {
    id: string;
    title: string;
    date: string | null;
    emoji: string | null;
    text: string | null;
    photos: string[] | null;
    spotify_link: string | null;
  };
}

const MemorySlideshow: React.FC<MemorySlideshowProps> = ({ memory }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [isAnyImageLoaded, setIsAnyImageLoaded] = useState(false);
  
  // Inicializa o estado de carregamento das imagens
  useEffect(() => {
    if (memory.photos && memory.photos.length > 0) {
      setImagesLoaded(Array(memory.photos.length).fill(false));
      // Pré-carrega as imagens para melhorar a experiência
      memory.photos.forEach((url, index) => {
        const img = new Image();
        img.src = url;
        img.onload = () => handleImageLoad(index);
        img.onerror = () => handleImageError(index);
      });
    }
  }, [memory.photos]);

  // Para extrair o ID da música do Spotify para incorporação
  const getSpotifyEmbedId = (spotifyLink: string) => {
    if (!spotifyLink) return null;
    
    try {
      // Padrão para links de faixa: https://open.spotify.com/track/ID ou spotify:track:ID
      const trackMatch = spotifyLink.match(/track\/([a-zA-Z0-9]+)|track:([a-zA-Z0-9]+)/);
      if (trackMatch) {
        return trackMatch[1] || trackMatch[2];
      }
      return null;
    } catch (error) {
      console.error("Erro ao extrair ID do Spotify:", error);
      return null;
    }
  };

  // Para trocar as fotos automaticamente
  useEffect(() => {
    let slideTimer: NodeJS.Timeout;
    
    if (memory.photos?.length && memory.photos.length > 0 && !isPaused) {
      slideTimer = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => 
          prevIndex === (memory.photos?.length || 1) - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Troca a foto a cada 5 segundos
    }
    
    return () => {
      clearInterval(slideTimer);
    };
  }, [memory.photos?.length, isPaused]);

  // Verificar se pelo menos uma imagem foi carregada
  useEffect(() => {
    if (imagesLoaded.some(loaded => loaded)) {
      setIsAnyImageLoaded(true);
    }
  }, [imagesLoaded]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const nextPhoto = () => {
    if (!memory.photos?.length) return;
    
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === memory.photos!.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    if (!memory.photos?.length) return;
    
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? memory.photos!.length - 1 : prevIndex - 1
    );
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleImageError = (index: number) => {
    console.error(`Erro ao carregar a imagem ${index}`);
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  const spotifyTrackId = memory.spotify_link ? getSpotifyEmbedId(memory.spotify_link) : null;

  return (
    <div className="space-y-4">
      {/* Container do slideshow com proporção 4:5 (1080x1350) */}
      <div className="rounded-lg overflow-hidden bg-black mb-2 relative w-full">
        <AspectRatio ratio={4/5} className="bg-black">
          {memory.photos && memory.photos.length > 0 ? (
            <div className="relative w-full h-full">
              {memory.photos.map((photo, index) => (
                <img 
                  key={`photo-${index}`}
                  src={photo} 
                  alt={`Foto da memória ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-300 ${
                    index === currentPhotoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              ))}
              
              {/* Mensagem quando não há imagens carregadas */}
              {(!isAnyImageLoaded && memory.photos.length > 0) && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white z-20 bg-black">
                  <p className="text-center">Carregando imagens...</p>
                </div>
              )}
              
              {memory.photos.length === 0 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white z-20 bg-black">
                  <p className="text-center">Nenhuma foto disponível para este slideshow</p>
                </div>
              )}
              
              {/* Barras de progresso no topo estilo Instagram Stories */}
              <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-30">
                {memory.photos.map((_, index) => (
                  <div 
                    key={index} 
                    className="h-1 flex-1 rounded-full overflow-hidden"
                  >
                    <div 
                      className={`h-full ${index === currentPhotoIndex 
                        ? "bg-white animate-pulse" 
                        : index < currentPhotoIndex 
                          ? "bg-white" 
                          : "bg-white/40"}`} 
                    />
                  </div>
                ))}
              </div>
              
              {/* Conteúdo com emoji e texto */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 z-30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{memory.emoji || '❤️'}</span>
                  <h3 className="text-xl font-medium">{memory.title}</h3>
                </div>
                {memory.text && (
                  <p className="text-sm mb-2 italic">"{memory.text.substring(0, 100)}{memory.text.length > 100 ? '...' : ''}"</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {memory.date ? new Date(memory.date).toLocaleDateString('pt-BR') : 'Sem data'}
                  </span>
                </div>
              </div>
              
              {/* Controles de navegação */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 z-30">
                <button
                  onClick={prevPhoto}
                  className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                <button
                  onClick={togglePause}
                  className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                >
                  {isPaused ? (
                    <Play className="h-6 w-6" />
                  ) : (
                    <Pause className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={nextPhoto}
                  className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>
              
              {/* Indicador de posição */}
              {memory.photos.length > 0 && (
                <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-md text-xs text-white z-30">
                  {currentPhotoIndex + 1}/{memory.photos.length}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Nenhuma foto disponível para este slideshow</p>
            </div>
          )}
        </AspectRatio>
      </div>
      
      {/* Player do Spotify */}
      {spotifyTrackId && (
        <div className="rounded-lg overflow-hidden">
          <div className="bg-memory-100 p-2 flex items-center gap-2 rounded-t-lg">
            <Music className="h-5 w-5 text-memory-700" />
            <span className="text-sm font-medium">Música da memória:</span>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyTrackId}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            className="border-0 rounded-b-lg"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MemorySlideshow;
