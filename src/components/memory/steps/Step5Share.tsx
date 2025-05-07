
import React, { useEffect, useState } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, Share2, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

const Step5Share: React.FC = () => {
  const { memory, generateQRCode, nextStep, prevStep, isProcessing } = useMemory();
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    if (!memory.qrCodeUrl) {
      generateQRCode();
    }
  }, [memory.qrCodeUrl, generateQRCode]);

  const handleCopyLink = () => {
    // In a real app, this would be the actual URL to the memory view page
    const shareLink = `https://memoriasafetivas.com/visualizar/${memory.id}`;
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setIsCopied(true);
        toast.success("Link copiado com sucesso!");
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error("Erro ao copiar o link. Por favor, tente novamente.");
      });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Memória: ${memory.title}`,
        text: 'Confira essa memória especial que eu criei!',
        url: `https://memoriasafetivas.com/visualizar/${memory.id}`
      })
      .then(() => toast.success("Compartilhado com sucesso!"))
      .catch(() => toast.error("Erro ao compartilhar."));
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="memory-step">
      <h2 className="text-2xl font-serif font-medium mb-6 text-memory-600">Compartilhar sua memória</h2>
      <p className="text-gray-600 mb-6">
        Sua memória está pronta para ser compartilhada! Use o QR Code ou o link para enviar para seus amigos e familiares.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Section */}
        <div className="bg-memory-50 rounded-lg p-6 border border-memory-200 flex flex-col items-center">
          <div className="w-full aspect-square max-w-[240px] bg-white rounded-lg flex items-center justify-center mb-4 p-4">
            {isProcessing ? (
              <Loader2 className="h-12 w-12 text-memory-400 animate-spin" />
            ) : memory.qrCodeUrl ? (
              <div className="flex flex-col items-center">
                <QrCode className="h-32 w-32 text-memory-600" />
                <p className="text-xs text-gray-500 mt-2">Simulação de QR Code</p>
              </div>
            ) : (
              <QrCode className="h-12 w-12 text-gray-300" />
            )}
          </div>
          
          <h3 className="text-lg font-medium text-memory-700 mb-2">QR Code da Memória</h3>
          <p className="text-gray-600 text-sm mb-4 text-center">
            Escaneie o QR Code para visualizar e compartilhar esta memória.
          </p>
          
          <Button 
            className="w-full memory-button-outline"
            onClick={() => {
              toast.success("QR Code baixado com sucesso!");
            }}
            disabled={isProcessing || !memory.qrCodeUrl}
          >
            Baixar QR Code
          </Button>
        </div>
        
        {/* Share Options */}
        <div className="bg-memory-50 rounded-lg p-6 border border-memory-200">
          <h3 className="text-lg font-medium text-memory-700 mb-4">Opções de compartilhamento</h3>
          
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-6"
              onClick={handleCopyLink}
            >
              {isCopied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              <span>{isCopied ? 'Link copiado!' : 'Copiar link da memória'}</span>
            </Button>
            
            <Button
              className="w-full bg-memory-500 hover:bg-memory-600 text-white flex items-center justify-center gap-2 py-6"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              <span>Compartilhar memória</span>
            </Button>
            
            <div className="mt-6 pt-4 border-t border-memory-200">
              <p className="text-sm text-gray-600 mb-2">
                Compartilhe diretamente:
              </p>
              <div className="flex justify-center gap-4">
                {/* Social sharing buttons would go here */}
                <button
                  className="p-2 rounded-full bg-[#4267B2] text-white hover:opacity-90"
                  onClick={() => toast.success("Compartilhado no Facebook!")}
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-full bg-[#25D366] text-white hover:opacity-90"
                  onClick={() => toast.success("Compartilhado no WhatsApp!")}
                >
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-full bg-[#1DA1F2] text-white hover:opacity-90"
                  onClick={() => toast.success("Compartilhado no Twitter!")}
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-full bg-[#E60023] text-white hover:opacity-90"
                  onClick={() => toast.success("Compartilhado no Pinterest!")}
                >
                  <span className="sr-only">Pinterest</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
          disabled={isProcessing || !memory.qrCodeUrl}
        >
          Próximo Passo: Pagamento
        </Button>
      </div>
    </div>
  );
};

export default Step5Share;
