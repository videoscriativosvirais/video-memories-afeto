
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

  // Log para depuração
  useEffect(() => {
    console.log("MemorySlideshow recebeu:", {
      title: memory.title,
      emoji: memory.emoji,
      photosLength: memory.photos?.length || 0,
      spotifyLink: memory.spotify_link
    });

    if (memory.photos) {
      console.log("Primeiras 3 fotos:", memory.photos.slice(0, 3));
    }
  }, [memory]);

  // Inicializa o estado de carregamento das imagens
  useEffect(() => {
    if (memory.photos && memory.photos.length > 0) {
      setImagesLoaded(Array(memory.photos.length).fill(false));
      // Pré-carrega as imagens para melhorar a experiência
      memory.photos.forEach((url, index) => {
        console.log(`Tentando carregar imagem ${index}:`, url);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          console.log(`Imagem ${index} carregada com sucesso`);
          handleImageLoad(index);
        };
        img.onerror = (error) => {
          console.error(`Erro ao carregar imagem ${index}:`, error);
          handleImageError(index);
        };
      });
    }
  }, [memory.photos]);

  // Para extrair o ID da música do Spotify para incorporação
  const getSpotifyEmbedId = (spotifyLink: string) => {
    if (!spotifyLink) return null;

    try {
      console.log("Tentando extrair ID do Spotify de:", spotifyLink);

      // Padrões para links do Spotify
      // 1. https://open.spotify.com/track/ID?si=parameters
      // 2. https://open.spotify.com/track/ID
      // 3. spotify:track:ID

      // Tenta extrair de URL completa primeiro
      let trackMatch = spotifyLink.match(/track\/([a-zA-Z0-9]+)/);
      if (trackMatch && trackMatch[1]) {
        console.log("ID do Spotify extraído (formato URL):", trackMatch[1]);
        return trackMatch[1];
      }

      // Tenta extrair do formato URI
      trackMatch = spotifyLink.match(/track:([a-zA-Z0-9]+)/);
      if (trackMatch && trackMatch[1]) {
        console.log("ID do Spotify extraído (formato URI):", trackMatch[1]);
        return trackMatch[1];
      }

      console.log("Não foi possível extrair ID do Spotify");
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

  // Verificar se temos dados válidos para exibir
  const hasValidPhotos = memory.photos && Array.isArray(memory.photos) && memory.photos.length > 0;
  const spotifyTrackId = memory.spotify_link ? getSpotifyEmbedId(memory.spotify_link) : null;

  console.log("Estado atual do slideshow:", {
    hasValidPhotos,
    currentPhotoIndex,
    isPaused,
    isAnyImageLoaded,
    spotifyTrackId
  });

  return (
    <div className="space-y-4">
      {/* Container do slideshow com proporção 4:5 (1080x1350) */}
      <div className="slideshow-container mb-2 w-full">
        <AspectRatio ratio={4/5} className="bg-black">
          {hasValidPhotos ? (
            <div className="relative w-full h-full">
              {/* Renderiza todas as imagens, mas apenas a atual é visível */}
              {memory.photos.map((photo, index) => (
                <img
                  key={`photo-${index}`}
                  src={photo}
                  alt={`Foto da memória ${index + 1}`}
                  className={`slideshow-image ${
                    index === currentPhotoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              ))}

              {/* Mensagem quando não há imagens carregadas */}
              {(!isAnyImageLoaded && hasValidPhotos) && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white z-20 bg-black">
                  <p className="text-center">Carregando imagens...</p>
                </div>
              )}

              {/* Barras de progresso no topo estilo Instagram Stories */}
              <div className="slideshow-progress">
                {memory.photos.map((_, index) => (
                  <div
                    key={index}
                    className="slideshow-progress-bar"
                  >
                    <div
                      className={`slideshow-progress-indicator ${index === currentPhotoIndex
                        ? "bg-white animate-pulse"
                        : index < currentPhotoIndex
                          ? "bg-white"
                          : "bg-white/40"}`}
                    />
                  </div>
                ))}
              </div>

              {/* Conteúdo com emoji e texto */}
              <div className="slideshow-text-overlay">
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
              <div className="slideshow-controls">
                <button
                  onClick={prevPhoto}
                  className="slideshow-control-button"
                  aria-label="Foto anterior"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                <button
                  onClick={togglePause}
                  className="slideshow-control-button"
                  aria-label={isPaused ? "Reproduzir" : "Pausar"}
                >
                  {isPaused ? (
                    <Play className="h-6 w-6" />
                  ) : (
                    <Pause className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={nextPhoto}
                  className="slideshow-control-button"
                  aria-label="Próxima foto"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>

              {/* Indicador de posição */}
              {hasValidPhotos && (
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
        <div className="slideshow-spotify-player">
          <div className="bg-memory-100 p-2 flex items-center gap-2 rounded-t-lg">
            <Music className="h-5 w-5 text-memory-700" />
            <span className="text-sm font-medium">Música da memória:</span>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyTrackId}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media; autoplay"
            className="border-0 rounded-b-lg"
            title="Spotify Music Player"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MemorySlideshow;
