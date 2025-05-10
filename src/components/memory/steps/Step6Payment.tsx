
import React, { useState } from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Button } from '@/components/ui/button';
import { CreditCard, Check, ArrowRight, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const Step6Payment: React.FC = () => {
  const { memory, prevStep, saveMemory } = useMemory();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Check for canceled payment from URL
  const canceled = searchParams.get('canceled');
  
  React.useEffect(() => {
    if (canceled) {
      toast({
        title: "Pagamento cancelado",
        description: "O processo de pagamento foi cancelado. Você pode tentar novamente quando estiver pronto.",
        variant: "destructive"
      });
    }
  }, [canceled, toast]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Primeiro, salvar a memória no Supabase para obter um ID
      if (!memory.id) {
        await saveMemory();
      }
      
      // Buscar a memória salva para ter certeza de que temos seu ID
      const { data: memoryData } = await supabase
        .from('memories')
        .select('id')
        .eq('title', memory.title)
        .maybeSingle();
      
      const memoryId = memoryData?.id || memory.id;
      
      if (!memoryId) {
        throw new Error('Não foi possível salvar a memória');
      }
      
      // Chamar a função de borda para criar uma sessão de checkout do Stripe
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          memoryTitle: memory.title,
          memoryId: memoryId 
        }
      });

      if (error) {
        console.error('Erro ao processar pagamento:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      console.log("Resposta da função create-payment:", data);

      // Redirecionar para a página de checkout do Stripe
      if (data?.url) {
        console.log("Redirecionando para:", data.url);
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="memory-step">
      <h2 className="text-2xl font-serif font-medium mb-6 text-memory-600">
        Salvar sua memória
      </h2>
      <p className="text-gray-600 mb-8">
        Para salvar permanentemente sua memória afetiva e poder acessá-la a qualquer momento, complete o pagamento abaixo.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Memory Summary */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium border-b pb-4 mb-4">Resumo da memória</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-memory-100 rounded-full p-2 mr-3">
                <Heart className="h-5 w-5 text-memory-500" />
              </div>
              <div>
                <p className="font-medium">{memory.title}</p>
                <p className="text-gray-600 text-sm">
                  {memory.date ? new Date(memory.date).toLocaleDateString('pt-BR') : 'Data não definida'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Emoji escolhido:</span>
              <span className="text-2xl ml-2">{memory.emoji}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {memory.photoUrls.slice(0, 4).map((url, index) => (
                <div key={index} className="w-16 h-16 rounded-md overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {memory.photoUrls.length > 4 && (
                <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                  +{memory.photoUrls.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Payment Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium border-b pb-4 mb-4">Pagamento</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Criação de memória</span>
              <span>R$ 19,90</span>
            </div>
            
            <div className="pt-4 border-t border-gray-100 font-medium flex justify-between">
              <span>Total</span>
              <span>R$ 19,90</span>
            </div>
          </div>
          
          <Button 
            className="w-full memory-button-primary mt-6"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <React.Fragment>
                Processando...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </React.Fragment>
            ) : (
              <React.Fragment>
                Pagar e salvar memória
                <CreditCard className="ml-2 h-4 w-4" />
              </React.Fragment>
            )}
          </Button>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            Pagamento seguro <span className="mx-1">•</span> Processado por Stripe
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default Step6Payment;
