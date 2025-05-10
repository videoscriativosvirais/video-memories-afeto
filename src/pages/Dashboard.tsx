
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import MemorySlideshow from '@/components/memory/MemorySlideshow';

interface Memory {
  id: string;
  title?: string;
  date?: string;
  description?: string;
  emoji?: string;
  photoUrls?: string[];
  is_paid: boolean;
}

const Dashboard: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const success = searchParams.get('success');
  const memoryId = searchParams.get('memory_id');

  useEffect(() => {
    // Check if success query parameter is present
    if (success && memoryId) {
      toast({
        title: "Pagamento bem-sucedido!",
        description: "Sua memória foi salva permanentemente.",
        variant: "default",
      });

      // Reset URL to remove query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [success, memoryId, toast]);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        fetchMemories(data.session.user.id);
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const fetchMemories = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include photoUrls
      const memoriesWithPhotos = await Promise.all(
        (data || []).map(async (memory) => {
          // Fetch photos for this memory
          const { data: photosData, error: photosError } = await supabase
            .from('memory_photos')
            .select('photo_url')
            .eq('memory_id', memory.id);

          if (photosError) {
            console.error('Error fetching photos:', photosError);
            return {
              ...memory,
              photoUrls: []
            };
          }

          return {
            ...memory,
            photoUrls: photosData.map(p => p.photo_url)
          };
        })
      );

      setMemories(memoriesWithPhotos);
    } catch (error) {
      console.error('Error fetching memories:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas memórias.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMemory = () => {
    navigate('/criar-memoria');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-memory-700">Suas Memórias</h1>
          <Button 
            onClick={handleCreateMemory}
            className="memory-button-primary"
          >
            Criar nova memória
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Carregando...
              </span>
            </div>
            <p className="mt-4 text-gray-600">Carregando suas memórias...</p>
          </div>
        ) : memories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <div 
                key={memory.id} 
                className={`rounded-lg shadow-md overflow-hidden bg-white cursor-pointer transition-transform hover:scale-105 border-2 ${memory.is_paid ? 'border-green-500' : 'border-yellow-300'}`}
                onClick={() => navigate(`/memoria/${memory.id}`)}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <MemorySlideshow 
                    photos={memory.photoUrls || []} 
                    autoplay={false} 
                    showArrows={true}
                  />
                  {!memory.is_paid && (
                    <div className="absolute top-0 right-0 bg-yellow-300 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded m-2">
                      Não salva
                    </div>
                  )}
                  {memory.is_paid && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded m-2">
                      Salva
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-1">{memory.title || "Memória sem título"}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {memory.date ? new Date(memory.date).toLocaleDateString('pt-BR') : "Data não definida"}
                  </p>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{memory.emoji || "❤️"}</span>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {memory.description || "Sem descrição"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Sem memórias ainda</h2>
              <p className="text-gray-600 mb-6">Você ainda não criou nenhuma memória. Que tal começar agora?</p>
              <Button 
                onClick={handleCreateMemory}
                className="memory-button-primary"
              >
                Criar minha primeira memória
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
