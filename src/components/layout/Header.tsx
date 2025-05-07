
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-memory-500" />
          <span className="font-serif text-2xl font-semibold text-memory-600">Memórias Afetivas</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-memory-500 transition-colors">
            Início
          </Link>
          <Link to="/sobre" className="text-gray-600 hover:text-memory-500 transition-colors">
            Sobre
          </Link>
          <Link to="/como-funciona" className="text-gray-600 hover:text-memory-500 transition-colors">
            Como Funciona
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-memory-500 transition-colors">
            Minhas Memórias
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/criar-memoria">
            <Button className="bg-memory-500 hover:bg-memory-600">
              Criar Memória
            </Button>
          </Link>
          <Link to="/login" className="text-gray-600 hover:text-memory-500 transition-colors">
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
