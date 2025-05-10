
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

// Configurações CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  console.log("🔔 Requisição create-payment recebida:", new Date().toISOString());
  console.log("🔔 URL:", req.url);
  console.log("🔔 Método:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("🔔 Requisição OPTIONS recebida - respondendo com CORS headers");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar configurações
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!stripeSecretKey) {
      console.error("❌ STRIPE_SECRET_KEY não configurada");
      throw new Error("STRIPE_SECRET_KEY não configurada");
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Configurações do Supabase incompletas");
      throw new Error("Configurações do Supabase incompletas");
    }
    
    console.log("🔔 Inicializando cliente Stripe");
    // Inicializar Stripe com a chave secreta
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    console.log("🔔 Inicializando cliente Supabase");
    // Inicializar cliente Supabase com a chave de serviço para bypass de RLS
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    // Extrair o token de autenticação do cabeçalho
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("❌ Cabeçalho de autorização não fornecido");
      throw new Error("Cabeçalho de autorização não fornecido");
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("🔔 Token de autenticação extraído");
    
    // Obter o usuário autenticado
    console.log("🔔 Verificando autenticação do usuário");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError) {
      console.error("❌ Erro de autenticação:", userError);
      throw new Error(`Erro de autenticação: ${userError.message}`);
    }
    
    console.log("✅ Usuário autenticado:", userData.user.id);

    // Extrair dados da requisição
    const body = await req.json();
    const { memoryTitle, memoryId } = body;
    
    console.log("🔔 Dados recebidos:", JSON.stringify(body));
    
    if (!memoryId) {
      console.error("❌ ID da memória não fornecido");
      throw new Error("ID da memória é obrigatório");
    }
    
    if (!memoryTitle) {
      console.error("❌ Título da memória não fornecido");
      throw new Error("Título da memória é obrigatório");
    }
    
    // Verificar se a memória existe
    console.log("🔔 Verificando se a memória existe:", memoryId);
    const { data: memoryData, error: memoryError } = await supabaseAdmin
      .from('memories')
      .select('id, title, is_paid')
      .eq('id', memoryId)
      .maybeSingle();
      
    if (memoryError) {
      console.error("❌ Erro ao verificar memória:", memoryError);
      throw new Error(`Erro ao verificar memória: ${memoryError.message}`);
    }
    
    if (!memoryData) {
      console.error("❌ Memória não encontrada:", memoryId);
      throw new Error(`Memória com ID ${memoryId} não encontrada`);
    }
    
    if (memoryData.is_paid) {
      console.log("⚠️ Memória já está marcada como paga:", memoryId);
      // Ainda permitimos o pagamento, mas logamos o aviso
    }
    
    console.log("🔔 Criando sessão de checkout do Stripe");
    // Criar uma sessão de checkout do Stripe
    const origin = req.headers.get("origin") || "https://memoriasafetivas.com";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: memoryTitle || "Memória Afetiva",
              description: "Salvar permanentemente sua memória afetiva",
            },
            unit_amount: 1990, // R$ 19,90 em centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dashboard?success=true&memory_id=${memoryId}`,
      cancel_url: `${origin}/criar-memoria?step=6&canceled=true`,
      metadata: {
        user_id: userData.user.id,
        memory_title: memoryTitle,
        memory_id: memoryId
      }
    });
    
    console.log("✅ Sessão de checkout criada:", session.id);
    console.log("🔔 URL de sucesso:", `${origin}/dashboard?success=true&memory_id=${memoryId}`);
    console.log("🔔 URL de cancelamento:", `${origin}/criar-memoria?step=6&canceled=true`);

    // Verificar se já existe uma compra pendente para esta memória
    console.log("🔔 Verificando compras existentes para a memória:", memoryId);
    const { data: existingPurchase, error: purchaseCheckError } = await supabaseAdmin
      .from("purchases")
      .select("id, status")
      .eq("memory_title", memoryTitle)
      .eq("user_id", userData.user.id)
      .maybeSingle();
      
    if (purchaseCheckError) {
      console.error("❌ Erro ao verificar compras existentes:", purchaseCheckError);
    }
    
    if (existingPurchase) {
      console.log("🔔 Compra existente encontrada:", existingPurchase);
      
      // Atualizar a compra existente com o novo session_id
      console.log("🔔 Atualizando compra existente com novo session_id");
      const { error: updateError } = await supabaseAdmin
        .from("purchases")
        .update({
          stripe_session_id: session.id,
          status: "pendente",
          updated_at: new Date().toISOString()
        })
        .eq("id", existingPurchase.id);
        
      if (updateError) {
        console.error("❌ Erro ao atualizar compra existente:", updateError);
      } else {
        console.log("✅ Compra existente atualizada com sucesso");
      }
    } else {
      // Registrar a compra pendente
      console.log("🔔 Registrando nova compra pendente");
      const { data: newPurchase, error: insertError } = await supabaseAdmin
        .from("purchases")
        .insert({
          user_id: userData.user.id,
          stripe_session_id: session.id,
          memory_title: memoryTitle,
          amount: 1990,
          status: "pendente"
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("❌ Erro ao registrar compra pendente:", insertError);
      } else {
        console.log("✅ Compra pendente registrada com sucesso:", newPurchase.id);
      }
    }

    // Retornar a URL da sessão para redirecionamento
    console.log("✅ Retornando URL da sessão para redirecionamento");
    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
        memoryId: memoryId,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Erro ao criar sessão de pagamento:", error);
    console.error("❌ Stack trace:", error.stack);
    
    // Responder com erro detalhado
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
