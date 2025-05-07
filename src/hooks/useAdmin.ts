
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      
      try {
        // Verificar se o usuário está autenticado
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          // Não está autenticado, redirecione para o login
          toast.error('Você precisa estar logado para acessar esta página');
          navigate('/login');
          return;
        }

        const userId = sessionData.session.user.id;
        
        // Verificar se o usuário tem a função de admin
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (error) {
          console.error('Erro ao verificar status de admin:', error);
          toast.error('Erro ao verificar permissões');
          setIsAdmin(false);
        } else {
          // Se encontrou um registro, o usuário é admin
          setIsAdmin(!!roleData);
          
          if (!roleData) {
            toast.error('Você não tem permissão para acessar esta página');
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const addAdmin = async (email: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error('Você precisa estar logado para adicionar administradores');
        return false;
      }

      const response = await supabase.functions.invoke('add-admin', {
        body: { email },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (response.error) {
        toast.error(`Erro: ${response.error.message || 'Falha ao adicionar administrador'}`);
        return false;
      }

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Administrador adicionado com sucesso');
        return true;
      } else {
        toast.error(response.data?.error || 'Falha ao adicionar administrador');
        return false;
      }
    } catch (error) {
      console.error('Erro ao adicionar administrador:', error);
      toast.error('Erro ao adicionar administrador');
      return false;
    }
  };

  return { isAdmin, isLoading, addAdmin };
};
