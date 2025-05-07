
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Calendar, Music, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MemorySlideshow from '@/components/memory/MemorySlideshow';

interface Memory {
  id: string;
  title: string;
  date: string | null;
  emoji: string | null;
  thumbnail: string | null;
  spotify_link: string | null;
  text: string | null;
  photos: string[] | null;
}

const Dashboard: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMemoryId, setOpenMemoryId] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login');
        return;
      }

      loadMemories();
    };

    checkAuth();
    
    // Verificar se o usuário acabou de concluir uma compra
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('success') === 'true') {
      toast.success('Memória salva com sucesso!');
      // Verificar se há um memoryId para atualizar o status de pagamento
      const memoryId = searchParams.get('memory_id');
      if (memoryId && memoryId !== "new") {
        updateMemoryPaymentStatus(memoryId);
      }
    }
  }, [navigate, location]);

  // Função para atualizar o status de pagamento da memória
  const updateMemoryPaymentStatus = async (memoryId: string) => {
    try {
      const { error } = await supabase
        .from('memories')
        .update({ is_paid: true })
        .eq('id', memoryId);

      if (error) {
        console.error('Erro ao atualizar status de pagamento:', error);
      }
    } catch (error) {
      console.error('Erro ao atualizar status de pagamento:', error);
    }
  };

  const loadMemories = async () => {
    setLoading(true);
    
    try {
      // Buscar memórias do usuário no Supabase
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar memórias:', error);
        toast.error('Erro ao carregar suas memórias');
        setLoading(false);
        return;
      }
      
      if (data && data.length > 0) {
        // Transformar os dados do banco para o formato Memory
        const formattedData: Memory[] = data.map(item => ({
          id: item.id,
          title: item.title,
          date: item.date,
          emoji: item.emoji,
          thumbnail: item.thumbnail,
          spotify_link: item.spotify_link,
          text: item.text,
          photos: null // Inicialmente não temos as fotos carregadas
        }));
        setMemories(formattedData);
      } else {
        setMemories([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar memórias:', error);
      toast.error('Erro ao carregar suas memórias');
      setLoading(false);
    }
  };
  
  const handleViewVideo = async (memoryId: string) => {
    // Encontrar a memória selecionada
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;
    
    setSelectedMemory(memory);
    
    try {
      // Buscar as fotos da memória se ainda não tiverem sido carregadas
      if (!memory.photos || memory.photos.length === 0) {
        const { data: photosData, error: photosError } = await supabase
          .from('memory_photos')
          .select('photo_url, order')
          .eq('memory_id', memoryId)
          .order('order', { ascending: true });
          
        if (photosError) {
          console.error('Erro ao buscar fotos da memória:', photosError);
          return;
        }
        
        if (photosData && photosData.length > 0) {
          const photos = photosData.map(item => item.photo_url);
          // Atualizar a memória com as fotos
          memory.photos = photos;
          // Atualizar no estado local
          setMemories(prevMemories => 
            prevMemories.map(m => m.id === memoryId ? {...m, photos} : m)
          );
          setSelectedMemory({...memory, photos});
        }
      }
      
      // Abrir o modal
      setOpenMemoryId(memoryId);
    } catch (error) {
      console.error('Erro ao processar visualização do vídeo:', error);
      toast.error('Erro ao carregar o slideshow');
    }
  };

  const closeDialog = () => {
    setOpenMemoryId(null);
    setSelectedMemory(null);
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-memory-700">
              Minhas Memórias
            </h1>
            <p className="text-gray-600">
              Suas memórias afetivas salvas e compartilhadas
            </p>
          </div>
          
          <Link to="/criar-memoria">
            <Button className="memory-button-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nova Memória
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-memory-500 animate-spin mb-4" />
            <p className="text-gray-600">Carregando suas memórias...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Memory Card */}
            <Link to="/criar-memoria" className="group">
              <div className="h-full border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-white hover:border-memory-400 hover:bg-memory-50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-memory-100 flex items-center justify-center mb-4 group-hover:bg-memory-200 transition-colors">
                  <Plus className="h-8 w-8 text-memory-500" />
                </div>
                <h3 className="text-xl font-medium text-memory-600 mb-2">Criar nova memória</h3>
                <p className="text-center text-gray-600">
                  Adicione um novo momento especial à sua coleção de memórias afetivas
                </p>
              </div>
            </Link>
            
            {/* Memory Cards */}
            {memories.map((memory) => (
              <div key={memory.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={memory.thumbnail || 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'} 
                    alt={memory.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full py-1 px-3 text-lg">
                    {memory.emoji || '❤️'}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-serif font-medium text-memory-700 mb-2">
                    {memory.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{memory.date ? new Date(memory.date).toLocaleDateString('pt-BR') : 'Sem data'}</span>
                    {memory.spotify_link && (
                      <>
                        <Music className="h-4 w-4 ml-3 mr-1" />
                        <span>Spotify</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-memory-600 border-memory-200"
                      onClick={() => handleViewVideo(memory.id)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Ver vídeo
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500"
                      onClick={(e) => {
                        e.preventDefault();
                        // Share functionality would go here
                        toast.info(`Compartilhando memória: ${memory.title}`);
                      }}
                    >
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && memories.length === 0 && (
          <div className="bg-memory-50 rounded-lg border border-memory-100 p-8 text-center">
            <Heart className="h-12 w-12 text-memory-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-memory-700 mb-2">Você ainda não tem memórias</h2>
            <p className="text-gray-600 mb-6">
              Crie sua primeira memória afetiva para eternizar seus momentos especiais.
            </p>
            <Link to="/criar-memoria">
              <Button className="memory-button-primary">
                <Plus className="h-5 w-5 mr-2" />
                Criar minha primeira memória
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Dialog para exibir o slideshow/vídeo da memória */}
      <Dialog open={openMemoryId !== null} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-memory-700">
              {selectedMemory?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedMemory && (
            <MemorySlideshow 
              memory={selectedMemory} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
