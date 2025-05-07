
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-memory-500" />
              <span className="font-serif text-xl font-medium text-memory-600">Memórias Afetivas</span>
            </div>
            <p className="text-gray-600">
              Transforme momentos especiais em memórias afetivas inesquecíveis para compartilhar com quem você ama.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-memory-500 transition-colors">Início</Link></li>
              <li><Link to="/sobre" className="text-gray-600 hover:text-memory-500 transition-colors">Sobre</Link></li>
              <li><Link to="/como-funciona" className="text-gray-600 hover:text-memory-500 transition-colors">Como Funciona</Link></li>
              <li><Link to="/contato" className="text-gray-600 hover:text-memory-500 transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Sua Conta</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-600 hover:text-memory-500 transition-colors">Entrar</Link></li>
              <li><Link to="/cadastro" className="text-gray-600 hover:text-memory-500 transition-colors">Cadastrar</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 hover:text-memory-500 transition-colors">Minhas Memórias</Link></li>
              <li><Link to="/ajuda" className="text-gray-600 hover:text-memory-500 transition-colors">Ajuda</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-memory-500" />
                <span className="text-gray-600">contato@memoriasafetivas.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-memory-500" />
                <span className="text-gray-600">+55 (11) 9999-8888</span>
              </li>
              <li className="flex items-center space-x-4 mt-4">
                <a href="https://instagram.com" className="text-gray-600 hover:text-memory-500">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" className="text-gray-600 hover:text-memory-500">
                  <Facebook className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Memórias Afetivas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
