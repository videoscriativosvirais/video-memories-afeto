
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Calendar, Music, Video } from 'lucide-react';

// Mock memories data
const mockMemories = [
  {
    id: 'mem-1',
    title: 'Nosso primeiro encontro',
    date: new Date('2023-02-14'),
    emoji: '❤️',
    thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    spotifyLink: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
  },
  {
    id: 'mem-2',
    title: 'Aniversário de 5 anos',
    date: new Date('2022-10-22'),
    emoji: '🎂',
    thumbnail: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    spotifyLink: 'https://open.spotify.com/track/7iL6o9tox1zgHpKUfh9vuC',
  },
  {
    id: 'mem-3',
    title: 'Viagem para a praia',
    date: new Date('2022-07-08'),
    emoji: '🌴',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    spotifyLink: 'https://open.spotify.com/track/6fWoFduMpBym4QcCY5c9xx',
  },
];

const Dashboard: React.FC = () => {
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
          {mockMemories.map((memory) => (
            <div key={memory.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={memory.thumbnail} 
                  alt={memory.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full py-1 px-3 text-lg">
                  {memory.emoji}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-serif font-medium text-memory-700 mb-2">
                  {memory.title}
                </h3>
                
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{memory.date.toLocaleDateString('pt-BR')}</span>
                  <Music className="h-4 w-4 ml-3 mr-1" />
                  <span>Spotify</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-memory-600 border-memory-200"
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
                      alert(`Compartilhando memória: ${memory.title}`);
                    }}
                  >
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
