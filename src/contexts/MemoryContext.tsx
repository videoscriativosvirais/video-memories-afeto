
import React, { createContext, useState, useContext, ReactNode } from 'react';

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
    
    // Create URL for preview
    const photoUrl = URL.createObjectURL(photo);
    
    setMemory(prev => ({
      ...prev,
      photos: [...prev.photos, photo],
      photoUrls: [...prev.photoUrls, photoUrl]
    }));
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

  // Mock API calls
  const saveMemory = async () => {
    setIsProcessing(true);
    // In a real application, this would be an API call to save the memory
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMemory(prev => ({
      ...prev,
      id: `memory-${Date.now()}`,
      createdAt: new Date(),
      userId: 'user-123', // This would be the actual user ID in a real app
    }));
    setIsProcessing(false);
    return Promise.resolve();
  };

  const generateVideo = async () => {
    setIsProcessing(true);
    // In a real application, this would be an API call to generate the video
    await new Promise(resolve => setTimeout(resolve, 3000));
    setMemory(prev => ({
      ...prev,
      videoUrl: 'https://example.com/fake-video-url',
    }));
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
