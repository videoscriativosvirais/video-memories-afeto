
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Settings, LogOut, Package } from 'lucide-react';
import { formatDateWithTime } from '@/lib/date-utils';

interface UserProfile {
  email: string;
  id: string;
  created_at: string;
}

interface Purchase {
  id: string;
  memory_title: string;
  amount: number;
  created_at: string;
  status: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);

      try {
        // Verificar se o usuário está autenticado
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          navigate('/login');
          return;
        }

        // Obter dados do perfil
        const { data: userData } = await supabase.auth.getUser();

        if (userData.user) {
          setProfile({
            email: userData.user.email || '',
            id: userData.user.id,
            created_at: new Date(userData.user.created_at).toLocaleDateString('pt-BR')
          });

          // Buscar compras do usuário do Supabase
          const { data: purchasesData, error: purchasesError } = await supabase
            .from('purchases')
            .select('*')
            .order('created_at', { ascending: false });

          if (purchasesError) {
            console.error('Erro ao buscar compras:', purchasesError);
            toast.error('Erro ao carregar histórico de compras');
          } else if (purchasesData) {
            setPurchases(purchasesData as Purchase[]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Saiu com sucesso');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
      toast.error('Erro ao sair da conta');
    }
  };

  const formatPurchaseDate = (dateString: string) => {
    return formatDateWithTime(dateString);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'pago':
      case 'concluído': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'bg-yellow-100 text-yellow-700';
      case 'pago':
      case 'concluído': return 'bg-green-100 text-green-700';
      case 'cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-container flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-memory-700 mb-8">
          Meu Perfil
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informações do Usuário */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-memory-500" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ID do Usuário</p>
                  <p className="text-xs text-gray-600 truncate">{profile?.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Conta criada em</p>
                  <p>{profile?.created_at}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => navigate('/dashboard')}
                >
                  <Settings className="h-4 w-4" />
                  Minhas Memórias
                </Button>
                <Button
                  variant="destructive"
                  className="w-full flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Histórico de Compras */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-memory-500" />
                  Histórico de Compras
                </CardTitle>
                <CardDescription>
                  Suas memórias adquiridas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">
                    Você ainda não fez nenhuma compra.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="border rounded-lg p-4 hover:border-memory-300 transition-colors"
                      >
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium text-memory-700">
                            {purchase.memory_title}
                          </h3>
                          <span className={`text-sm px-2 py-1 rounded ${getStatusClass(purchase.status)}`}>
                            {formatStatus(purchase.status)}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-memory-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatPurchaseDate(purchase.created_at)}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-memory-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Valor: R$ {(purchase.amount / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
