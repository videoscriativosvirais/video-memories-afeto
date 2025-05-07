
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Verifique a autorização
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email não fornecido' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verificar se o usuário atual já é um administrador (exceto para o primeiro admin)
    const { data: isExistingAdmin } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('role', 'admin');

    if (isExistingAdmin && isExistingAdmin.length > 0) {
      // Se já existem administradores, verifique se o usuário atual é um administrador
      const { data: currentUserIsAdmin } = await supabaseClient
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!currentUserIsAdmin) {
        return new Response(JSON.stringify({ error: 'Apenas administradores podem adicionar novos administradores' }), { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Buscar o usuário pelo email
    const { data: foundUser, error: userError } = await supabaseClient.auth.admin.getUserByEmail(email);

    if (userError || !foundUser) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verificar se o usuário já é um administrador
    const { data: existingRole } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', foundUser.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (existingRole) {
      return new Response(JSON.stringify({ message: 'Usuário já é administrador' }), { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Adicionar o usuário como administrador
    const { error: insertError } = await supabaseClient
      .from('user_roles')
      .insert([{ user_id: foundUser.id, role: 'admin' }]);

    if (insertError) {
      console.error('Erro ao adicionar administrador:', insertError);
      return new Response(JSON.stringify({ error: 'Erro ao adicionar administrador' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Usuário adicionado como administrador' }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro no servidor:', error);
    return new Response(JSON.stringify({ error: 'Erro no servidor' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
