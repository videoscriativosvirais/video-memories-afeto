
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar Stripe com a chave secreta
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Inicializar cliente Supabase com a chave de serviço para bypass de RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Extrair o token de autenticação do cabeçalho
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Cabeçalho de autorização não fornecido");
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Obter o usuário autenticado
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError) {
      throw new Error(`Erro de autenticação: ${userError.message}`);
    }

    const { memoryTitle, memoryId } = await req.json();
    
    // Criar uma sessão de checkout do Stripe
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
      success_url: `${req.headers.get("origin")}/dashboard?success=true&memory_id=${memoryId || ""}`,
      cancel_url: `${req.headers.get("origin")}/criar-memoria?step=6&canceled=true`,
      metadata: {
        user_id: userData.user.id,
        memory_title: memoryTitle,
        memory_id: memoryId || ""
      }
    });

    // Registrar a compra pendente
    await supabaseAdmin.from("purchases").insert({
      user_id: userData.user.id,
      stripe_session_id: session.id,
      memory_title: memoryTitle,
      amount: 1990,
      status: "pendente"
    });

    // Retornar a URL da sessão para redirecionamento
    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao criar sessão de pagamento:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
