
import React, { useRef } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Button } from '@/components/ui/button';
import { Image, Plus, X } from 'lucide-react';

const Step2Photos: React.FC = () => {
  const { memory, addPhoto, removePhoto, nextStep, prevStep } = useMemory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Limit to remaining slots (max 10 photos total)
    const remainingSlots = 10 - memory.photos.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    
    filesToAdd.forEach(file => {
      addPhoto(file);
    });
    
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="memory-step">
      <h2 className="text-2xl font-serif font-medium mb-6 text-memory-600">Adicione fotos</h2>
      <p className="text-gray-600 mb-6">
        Adicione até 10 fotos que representam essa memória especial. Estas imagens serão usadas para criar o vídeo da sua memória.
      </p>
      
      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {memory.photoUrls.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
              <img 
                src={url} 
                alt={`Foto ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button 
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover foto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {memory.photos.length < 10 && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-memory-400 hover:bg-memory-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Adicionar</span>
            </button>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-2">
          {memory.photos.length} de 10 fotos adicionadas
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-memory-500 h-2.5 rounded-full" 
            style={{ width: `${(memory.photos.length / 10) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between pt-8">
        <Button 
          type="button" 
          onClick={prevStep} 
          className="memory-button-outline"
        >
          Voltar
        </Button>
        <Button 
          type="button" 
          onClick={nextStep} 
          className="memory-button-primary"
          disabled={memory.photos.length === 0}
        >
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};

export default Step2Photos;
