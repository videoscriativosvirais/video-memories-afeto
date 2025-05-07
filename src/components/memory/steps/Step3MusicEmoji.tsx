
import React, { useState } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, Music } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Common emojis for memory/emotional contexts
const commonEmojis = [
  '❤️', '😊', '🥰', '😍', '🎉', '✨', '🌟', '🎂', 
  '🎁', '🎈', '💫', '💕', '💞', '💓', '💖', '💝',
  '🌈', '🌸', '🌺', '🌷', '🏆', '🥇', '💯', '🙏',
  '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👪', '👨‍👩‍👦', '👫', '👭', '👬', '🧸'
];

const Step3MusicEmoji: React.FC = () => {
  const { memory, setSpotifyLink, setEmoji, nextStep, prevStep } = useMemory();
  const [linkError, setLinkError] = useState<string | null>(null);

  const handleEmojiSelect = (emoji: string) => {
    setEmoji(emoji);
  };

  const validateSpotifyLink = (link: string) => {
    if (!link) {
      setLinkError(null);
      setSpotifyLink('');
      return;
    }
    
    // Basic validation for Spotify link format
    const isSpotifyLink = link.includes('spotify.com') || link.includes('open.spotify');
    
    if (isSpotifyLink) {
      setLinkError(null);
      setSpotifyLink(link);
    } else {
      setLinkError('Por favor, insira um link válido do Spotify.');
    }
  };

  return (
    <div className="memory-step">
      <h2 className="text-2xl font-serif font-medium mb-6 text-memory-600">Música e emoji</h2>
      <p className="text-gray-600 mb-6">
        Adicione uma música do Spotify que represente essa memória e escolha um emoji que expresse o sentimento dessa lembrança.
      </p>
      
      <div className="space-y-8">
        {/* Spotify Link Section */}
        <div className="space-y-3">
          <label htmlFor="spotifyLink" className="block text-sm font-medium text-gray-700">
            Link da música no Spotify
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Music className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="spotifyLink"
              type="text"
              value={memory.spotifyLink}
              onChange={(e) => validateSpotifyLink(e.target.value)}
              className="memory-input pl-10"
              placeholder="https://open.spotify.com/track/..."
            />
          </div>
          
          {linkError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{linkError}</AlertDescription>
            </Alert>
          )}
          
          <p className="text-sm text-gray-500">
            Vá até o Spotify, encontre a música desejada, clique nos três pontos e selecione "Compartilhar &gt; Copiar link".
          </p>
        </div>
        
        {/* Emoji Selection Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Escolha um emoji que represente essa memória
          </label>
          
          <div className="emoji-picker">
            {commonEmojis.map((emoji) => (
              <div
                key={emoji}
                className={`emoji-item ${emoji === memory.emoji ? 'selected' : ''}`}
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </div>
            ))}
          </div>
          
          {memory.emoji && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-700 mb-2">Emoji selecionado:</p>
              <div className="text-5xl">{memory.emoji}</div>
            </div>
          )}
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
          disabled={!memory.emoji || !!linkError}
        >
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};

export default Step3MusicEmoji;
