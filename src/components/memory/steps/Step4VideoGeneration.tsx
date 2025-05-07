
import React, { useEffect, useState, useRef } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Button } from '@/components/ui/button';
import { Video, Check, Loader2, Music } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Step4VideoGeneration: React.FC = () => {
  const { memory, generateVideo, nextStep, prevStep, isProcessing } = useMemory();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isProcessing && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.floor(Math.random() * 10) + 1;
          const newProgress = Math.min(prev + increment, 100);
          return newProgress;
        });
      }, 500);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isProcessing, progress]);

  useEffect(() => {
    if (progress === 100 && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [progress, isComplete]);

  // Para simular a troca de fotos no slideshow estilo stories
  useEffect(() => {
    let slideTimer: NodeJS.Timeout;
    
    if (memory.videoUrl === 'generated' && memory.photoUrls.length > 0 && !isPaused) {
      slideTimer = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => 
          prevIndex === memory.photoUrls.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Troca a foto a cada 5 segundos
    }
    
    return () => {
      clearInterval(slideTimer);
    };
  }, [memory.videoUrl, memory.photoUrls.length, isPaused]);

  const handleGenerateVideo = async () => {
    setProgress(0);
    setIsComplete(false);
    await generateVideo();
    setProgress(100);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === memory.photoUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? memory.photoUrls.length - 1 : prevIndex - 1
    );
  };

  // Função para extrair o ID da música do Spotify para incorporação
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

  const spotifyTrackId = getSpotifyEmbedId(memory.spotifyLink);

  return (
    <div className="memory-step">
      <h2 className="text-2xl font-serif font-medium mb-6 text-memory-600">Criação do Slideshow</h2>
      <p className="text-gray-600 mb-6">
        Vamos criar um slideshow especial com suas fotos, texto e música. Este processo pode levar alguns momentos.
      </p>
      
      <div className="bg-memory-50 rounded-lg p-6 border border-memory-200 text-center mb-8">
        <div className="w-20 h-20 mx-auto bg-memory-100 rounded-full flex items-center justify-center mb-4">
          {memory.videoUrl ? (
            <Check className="h-8 w-8 text-green-500" />
          ) : (
            <Video className="h-8 w-8 text-memory-500" />
          )}
        </div>
        
        <h3 className="text-lg font-medium text-memory-700 mb-2">
          {memory.videoUrl 
            ? "Slideshow gerado com sucesso!" 
            : isProcessing 
              ? "Criando seu slideshow de memória..." 
              : "Pronto para criar seu slideshow"}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          {memory.videoUrl 
            ? "Seu slideshow está pronto para ser compartilhado." 
            : isProcessing 
              ? "Estamos combinando suas fotos, texto e música. Por favor, aguarde..." 
              : "Clique no botão abaixo para começar a geração do slideshow da sua memória."}
        </p>
        
        {isProcessing && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Processando...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {memory.videoUrl === 'generated' ? (
          <div className="mb-6 space-y-4">
            {/* Container do slideshow estilo Stories */}
            <div className="aspect-video rounded-lg overflow-hidden bg-black mb-2 relative max-w-2xl mx-auto">
              {memory.photoUrls.length > 0 ? (
                <div className="relative w-full h-full">
                  <img 
                    src={memory.photoUrls[currentPhotoIndex]} 
                    alt={`Foto da memória ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Barras de progresso no topo estilo Instagram Stories */}
                  <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
                    {memory.photoUrls.map((_, index) => (
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
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{memory.emoji}</span>
                      <h3 className="text-xl font-medium">{memory.title}</h3>
                    </div>
                    <p className="text-sm mb-2 italic">"{memory.text.substring(0, 100)}{memory.text.length > 100 ? '...' : ''}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {memory.date?.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Controles de navegação */}
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4">
                    <button
                      onClick={prevPhoto}
                      className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-back"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" x2="5" y1="19" y2="5"></line></svg>
                    </button>
                    <button
                      onClick={togglePause}
                      className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                    >
                      {isPaused ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                      )}
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-forward"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line></svg>
                    </button>
                  </div>
                  
                  {/* Indicador de posição */}
                  <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-md text-xs text-white">
                    {currentPhotoIndex + 1}/{memory.photoUrls.length}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Nenhuma foto foi adicionada para gerar o slideshow</p>
                </div>
              )}
            </div>
            
            {/* Player do Spotify */}
            {spotifyTrackId && (
              <div className="max-w-md mx-auto rounded-lg overflow-hidden">
                <div className="bg-memory-100 p-2 flex items-center gap-2 rounded-t-lg">
                  <Music className="h-5 w-5 text-memory-700" />
                  <span className="text-sm font-medium">Música selecionada:</span>
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
        ) : (
          !isProcessing && (
            <Button
              onClick={handleGenerateVideo}
              className="memory-button-primary mt-4"
              disabled={isProcessing || memory.photos.length === 0}
            >
              {memory.photos.length === 0 ? 'Adicione fotos para continuar' : 'Gerar Slideshow da Memória'}
            </Button>
          )
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          onClick={prevStep} 
          className="memory-button-outline"
          disabled={isProcessing}
        >
          Voltar
        </Button>
        <Button 
          type="button" 
          onClick={nextStep} 
          className="memory-button-primary"
          disabled={!memory.videoUrl || isProcessing}
        >
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};

export default Step4VideoGeneration;
