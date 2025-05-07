
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Music, Image, Film, QrCode } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-memory-100 py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-memory-700 mb-6 leading-tight">
              Transforme momentos especiais em <span className="text-memory-500">memórias afetivas</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Crie e compartilhe memórias emocionantes com fotos, música e sentimento para aqueles que você ama.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/criar-memoria">
                <Button className="memory-button-primary px-8 py-6 text-lg">
                  Criar uma memória
                </Button>
              </Link>
              <Link to="/como-funciona">
                <Button variant="outline" className="memory-button-outline px-8 py-6 text-lg">
                  Como funciona
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-20 text-6xl">❤️</div>
        <div className="absolute bottom-10 right-10 opacity-20 text-6xl">✨</div>
        <div className="absolute top-40 right-20 opacity-20 text-6xl">🌸</div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center text-memory-700 mb-12">
            Como funciona
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-memory-100 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-memory-500" />
              </div>
              <h3 className="text-xl font-medium text-memory-600 mb-4">
                1. Crie sua memória
              </h3>
              <p className="text-gray-600">
                Adicione título, texto, fotos, escolha uma música do Spotify e selecione um emoji que represente o momento.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-memory-100 flex items-center justify-center mx-auto mb-6">
                <Film className="h-8 w-8 text-memory-500" />
              </div>
              <h3 className="text-xl font-medium text-memory-600 mb-4">
                2. Veja o vídeo gerado
              </h3>
              <p className="text-gray-600">
                Nossa plataforma transformará automaticamente suas fotos e música em um vídeo emocionante para compartilhar.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-memory-100 flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-8 w-8 text-memory-500" />
              </div>
              <h3 className="text-xl font-medium text-memory-600 mb-4">
                3. Compartilhe o momento
              </h3>
              <p className="text-gray-600">
                Compartilhe sua memória através de um QR Code ou link. Após o pagamento, tenha acesso permanente a todas suas memórias.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/criar-memoria">
              <Button className="memory-button-primary">
                Comece agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-memory-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center text-memory-700 mb-12">
            Recursos especiais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Calendar className="h-8 w-8 text-memory-500 mb-4" />
              <h3 className="text-xl font-medium text-memory-600 mb-2">
                Datas especiais
              </h3>
              <p className="text-gray-600">
                Marque momentos importantes com datas significativas para reviver depois.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Image className="h-8 w-8 text-memory-500 mb-4" />
              <h3 className="text-xl font-medium text-memory-600 mb-2">
                Até 10 fotos
              </h3>
              <p className="text-gray-600">
                Adicione até 10 fotos especiais que contam sua história visual.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Music className="h-8 w-8 text-memory-500 mb-4" />
              <h3 className="text-xl font-medium text-memory-600 mb-2">
                Trilha sonora
              </h3>
              <p className="text-gray-600">
                Escolha músicas do Spotify que trazem significado ao seu momento especial.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Heart className="h-8 w-8 text-memory-500 mb-4" />
              <h3 className="text-xl font-medium text-memory-600 mb-2">
                Emoção em emoji
              </h3>
              <p className="text-gray-600">
                Expresse o sentimento da memória através de um emoji representativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-center text-memory-700 mb-12">
            O que nossos usuários dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-memory-50 p-6 rounded-lg border border-memory-100">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <h4 className="font-medium">Ana Silva</h4>
                  <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Criei uma memória para o aniversário do meu marido e ele se emocionou tanto! A forma como as fotos foram combinadas com a música favorita dele foi perfeita."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-memory-50 p-6 rounded-lg border border-memory-100">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <h4 className="font-medium">Pedro Santos</h4>
                  <p className="text-sm text-gray-500">São Paulo, SP</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Usei o site para criar uma memória da formatura da minha filha. O vídeo gerado ficou incrível e todos na família adoraram quando compartilhei o QR Code."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-memory-50 p-6 rounded-lg border border-memory-100">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <h4 className="font-medium">Carla Mendes</h4>
                  <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Que ideia incrível! Fiz uma memória da nossa viagem e enviei para meu namorado como surpresa. Ele disse que foi o presente mais especial que já recebeu."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-memory-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
            Pronto para criar sua memória afetiva?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transforme seus momentos especiais em lembranças duradouras que podem ser compartilhadas com quem você ama.
          </p>
          <Link to="/criar-memoria">
            <Button className="bg-white text-memory-600 hover:bg-memory-100 memory-button px-8 py-6 text-lg">
              Começar agora
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
