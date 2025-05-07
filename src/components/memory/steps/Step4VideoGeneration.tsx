
import React, { useEffect, useState } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Button } from '@/components/ui/button';
import { Video, Check, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Step4VideoGeneration: React.FC = () => {
  const { memory, generateVideo, nextStep, prevStep, isProcessing } = useMemory();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

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

  const handleGenerateVideo = async () => {
    setProgress(0);
    setIsComplete(false);
    await generateVideo();
    setProgress(100);
  };

  return (
    <div className="memory-step">
      <h2 className="text-2xl font-serif font-medium mb-6 text-memory-600">Geração de vídeo</h2>
      <p className="text-gray-600 mb-6">
        Agora vamos criar um vídeo especial com suas fotos, texto e música. Este processo pode levar alguns momentos.
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
            ? "Vídeo gerado com sucesso!" 
            : isProcessing 
              ? "Criando sua memória em vídeo..." 
              : "Pronto para criar seu vídeo"}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          {memory.videoUrl 
            ? "Seu vídeo está pronto para ser compartilhado." 
            : isProcessing 
              ? "Estamos combinando suas fotos, texto e música. Por favor, aguarde..." 
              : "Clique no botão abaixo para começar a geração do vídeo da sua memória."}
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
        
        {memory.videoUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-black mb-6">
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Simulação de vídeo gerado</p>
            </div>
          </div>
        ) : (
          !isProcessing && (
            <Button
              onClick={handleGenerateVideo}
              className="memory-button-primary mt-4"
              disabled={isProcessing}
            >
              Gerar Vídeo da Memória
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
