
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Inicializar cliente Supabase com a chave de serviço para bypass de RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      console.error("Assinatura Stripe não encontrada");
      return new Response(JSON.stringify({ error: "Assinatura Stripe não fornecida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Obter o corpo da requisição como texto
    const body = await req.text();
    let event;

    try {
      // Verificar a assinatura do evento usando o webhook secret
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      } else {
        // Se não tiver endpointSecret, apenas parse o JSON
        event = JSON.parse(body);
        console.log("Aviso: Webhook não verificado (endpointSecret não configurado)");
      }
    } catch (err) {
      console.error(`Webhook error: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log(`Evento recebido: ${event.type}`);

    // Tratar eventos específicos
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extrair dados da sessão
      const { metadata } = session;
      const userId = metadata?.user_id;
      const memoryId = metadata?.memory_id;
      
      if (userId && memoryId) {
        console.log(`Atualizando status de pagamento para memória ${memoryId} do usuário ${userId}`);
        
        // Atualizar a memória para is_paid = true
        const { error: memoryError } = await supabaseAdmin
          .from('memories')
          .update({ is_paid: true })
          .eq('id', memoryId)
          .eq('user_id', userId);
          
        if (memoryError) {
          console.error('Erro ao atualizar status da memória:', memoryError);
        }
        
        // Atualizar o status da compra para 'pago'
        const { error: purchaseError } = await supabaseAdmin
          .from('purchases')
          .update({ status: 'pago' })
          .eq('stripe_session_id', session.id);
          
        if (purchaseError) {
          console.error('Erro ao atualizar status da compra:', purchaseError);
        }
      } else {
        console.log("Metadados incompletos no evento:", metadata);
      }
    }
    
    // Responder com sucesso
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
