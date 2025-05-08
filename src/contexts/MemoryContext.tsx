
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of a memory
export interface Memory {
  id?: string;
  title: string;
  text: string;
  date: Date | null;
  photos: File[];
  photoUrls: string[];
  spotifyLink: string;
  emoji: string;
  videoUrl?: string;
  qrCodeUrl?: string;
  createdAt?: Date;
  userId?: string;
  isPaid: boolean;
}

// Context interface
interface MemoryContextType {
  memory: Memory;
  currentStep: number;
  setTitle: (title: string) => void;
  setText: (text: string) => void;
  setDate: (date: Date | null) => void;
  addPhoto: (photo: File) => void;
  removePhoto: (index: number) => void;
  setSpotifyLink: (link: string) => void;
  setEmoji: (emoji: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetMemory: () => void;
  saveMemory: () => Promise<void>;
  generateVideo: () => Promise<void>;
  generateQRCode: () => Promise<void>;
  isProcessing: boolean;
}

// Default empty memory
const defaultMemory: Memory = {
  title: '',
  text: '',
  date: null,
  photos: [],
  photoUrls: [],
  spotifyLink: '',
  emoji: '',
  isPaid: false
};

// Create the context
const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

// Provider component
export const MemoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memory, setMemory] = useState<Memory>(defaultMemory);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Memory update handlers
  const setTitle = (title: string) => setMemory(prev => ({ ...prev, title }));
  const setText = (text: string) => setMemory(prev => ({ ...prev, text }));
  const setDate = (date: Date | null) => setMemory(prev => ({ ...prev, date }));
  const setSpotifyLink = (spotifyLink: string) => setMemory(prev => ({ ...prev, spotifyLink }));
  const setEmoji = (emoji: string) => setMemory(prev => ({ ...prev, emoji }));

  // Photo handlers
  const addPhoto = (photo: File) => {
    if (memory.photos.length >= 10) {
      console.log('Maximum of 10 photos reached');
      return;
    }

    try {
      console.log(`Adicionando foto: ${photo.name}, tamanho: ${photo.size} bytes, tipo: ${photo.type}`);

      // Create URL for preview
      const photoUrl = URL.createObjectURL(photo);
      console.log(`URL criada para a foto: ${photoUrl}`);

      setMemory(prev => ({
        ...prev,
        photos: [...prev.photos, photo],
        photoUrls: [...prev.photoUrls, photoUrl]
      }));
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...memory.photos];
    const newPhotoUrls = [...memory.photoUrls];

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newPhotoUrls[index]);

    newPhotos.splice(index, 1);
    newPhotoUrls.splice(index, 1);

    setMemory(prev => ({
      ...prev,
      photos: newPhotos,
      photoUrls: newPhotoUrls
    }));
  };

  // Navigation handlers
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  // Reset memory
  const resetMemory = () => {
    // Revoke all object URLs to avoid memory leaks
    memory.photoUrls.forEach(url => URL.revokeObjectURL(url));
    setMemory(defaultMemory);
    setCurrentStep(1);
  };

  // Save memory to Supabase
  const saveMemory = async () => {
    setIsProcessing(true);

    try {
      // Check if user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error('Usuário não autenticado');
      }

      // Format memory data for database
      const memoryData = {
        title: memory.title,
        text: memory.text,
        date: memory.date ? memory.date.toISOString().split('T')[0] : null,
        emoji: memory.emoji,
        spotify_link: memory.spotifyLink,
        user_id: sessionData.session.user.id,
        is_paid: false
      };

      // Save or update memory
      let result;
      if (memory.id) {
        // Update existing memory
        result = await supabase
          .from('memories')
          .update(memoryData)
          .eq('id', memory.id)
          .select('id')
          .single();
      } else {
        // Create new memory
        result = await supabase
          .from('memories')
          .insert(memoryData)
          .select('id')
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Update memory state with ID
      setMemory(prev => ({
        ...prev,
        id: result.data.id,
        userId: sessionData.session?.user.id
      }));

      // Upload photos
      // Note: In a real app, you would upload photos to Supabase storage
      // and save references in the database
    } catch (error) {
      console.error('Erro ao salvar memória:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVideo = async () => {
    setIsProcessing(true);
    console.log("Iniciando geração de vídeo com:", {
      title: memory.title,
      photosCount: memory.photos.length,
      photoUrlsCount: memory.photoUrls.length,
      spotifyLink: memory.spotifyLink,
      emoji: memory.emoji
    });

    // Verificar se temos URLs de fotos válidas
    if (memory.photoUrls.length === 0) {
      console.error("Não há URLs de fotos para gerar o vídeo");
      setIsProcessing(false);
      return Promise.reject(new Error("Não há fotos para gerar o vídeo"));
    }

    // Em uma aplicação real, isto seria uma chamada para uma API gerar o vídeo
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Em vez de usar uma URL fixa de vídeo, vamos usar um marcador para indicar
    // que o "vídeo" foi gerado e deve exibir nossas fotos em sequência
    setMemory(prev => ({
      ...prev,
      videoUrl: 'generated', // Usamos este marcador para indicar que devemos mostrar a apresentação de slides
    }));

    console.log("Vídeo gerado com sucesso");
    setIsProcessing(false);
    return Promise.resolve();
  };

  const generateQRCode = async () => {
    setIsProcessing(true);
    // In a real application, this would be an API call to generate the QR code
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMemory(prev => ({
      ...prev,
      qrCodeUrl: 'https://example.com/fake-qr-code',
    }));
    setIsProcessing(false);
    return Promise.resolve();
  };

  // Provider value
  const value: MemoryContextType = {
    memory,
    currentStep,
    setTitle,
    setText,
    setDate,
    addPhoto,
    removePhoto,
    setSpotifyLink,
    setEmoji,
    nextStep,
    prevStep,
    goToStep,
    resetMemory,
    saveMemory,
    generateVideo,
    generateQRCode,
    isProcessing
  };

  return (
    <MemoryContext.Provider value={value}>
      {children}
    </MemoryContext.Provider>
  );
};

// Custom hook to use the memory context
export const useMemory = (): MemoryContextType => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};
