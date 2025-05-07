
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-memory-500" />
              <span className="ml-2 text-xl font-serif font-medium text-memory-700">Memórias</span>
            </Link>
          </div>
          
          {/* Menu para desktop */}
          <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link 
              to="/" 
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/' 
                  ? 'border-memory-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Início
            </Link>
            
            {isLoggedIn && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/dashboard' 
                      ? 'border-memory-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Minhas Memórias
                </Link>
                <Link 
                  to="/criar-memoria" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/criar-memoria' 
                      ? 'border-memory-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Criar Memória
                </Link>
                <Link 
                  to="/profile" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/profile' 
                      ? 'border-memory-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Meu Perfil
                </Link>
              </>
            )}
          </nav>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <Button 
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => navigate('/profile')}
              >
                <User className="h-5 w-5" />
                <span>Perfil</span>
              </Button>
            ) : (
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-5 w-5" />
                <span>Entrar</span>
              </Button>
            )}
          </div>
          
          {/* Botão do menu mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={closeMenu}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/' 
                  ? 'border-memory-500 text-memory-700 bg-memory-50' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              Início
            </Link>
            
            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === '/dashboard' 
                      ? 'border-memory-500 text-memory-700 bg-memory-50' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  Minhas Memórias
                </Link>
                <Link
                  to="/criar-memoria"
                  onClick={closeMenu}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === '/criar-memoria' 
                      ? 'border-memory-500 text-memory-700 bg-memory-50' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  Criar Memória
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === '/profile' 
                      ? 'border-memory-500 text-memory-700 bg-memory-50' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  Meu Perfil
                </Link>
              </>
            )}
            
            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
