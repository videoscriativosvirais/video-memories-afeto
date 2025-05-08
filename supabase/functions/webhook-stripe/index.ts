
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
  console.log("🔔 Webhook Stripe recebido:", new Date().toISOString());
  console.log("🔔 URL:", req.url);
  console.log("🔔 Método:", req.method);

  // Log all headers for debugging
  console.log("🔔 Headers:", JSON.stringify(Object.fromEntries([...req.headers.entries()])));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("🔔 Requisição OPTIONS recebida - respondendo com CORS headers");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Stripe keys are configured
    if (!stripeSecretKey) {
      console.error("❌ STRIPE_SECRET_KEY não configurada");
    }

    if (!endpointSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET não configurada");
    }

    console.log("🔔 Inicializando cliente Stripe");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Inicializar cliente Supabase com a chave de serviço para bypass de RLS
    console.log("🔔 Inicializando cliente Supabase");
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ Assinatura Stripe não encontrada");
      return new Response(JSON.stringify({ error: "Assinatura Stripe não fornecida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Obter o corpo da requisição como texto
    const body = await req.text();
    let event;

    try {
      console.log("🔔 Verificando assinatura do evento Stripe");
      // Verificar a assinatura do evento usando o webhook secret
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
        console.log("✅ Assinatura do evento verificada com sucesso");
      } else {
        // Se não tiver endpointSecret, apenas parse o JSON
        event = JSON.parse(body);
        console.error("⚠️ Webhook não verificado (endpointSecret não configurado)");
      }
    } catch (err) {
      console.error(`❌ Erro na verificação do webhook: ${err.message}`);
      console.error("❌ Detalhes do erro:", err);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log(`🔔 Evento recebido: ${event.type}`);
    console.log(`🔔 Dados do evento:`, JSON.stringify(event, null, 2));

    // Tratar eventos específicos
    if (event.type === 'checkout.session.completed') {
      console.log("✅ Evento de checkout.session.completed recebido");
      const session = event.data.object;

      // Extrair dados da sessão
      const { metadata } = session;
      const userId = metadata?.user_id;
      const memoryId = metadata?.memory_id;
      const sessionId = session.id;

      console.log(`🔔 Metadados da sessão:`, JSON.stringify(metadata));
      console.log(`🔔 ID da sessão: ${sessionId}`);

      if (userId && memoryId) {
        console.log(`🔔 Atualizando status de pagamento para memória ${memoryId} do usuário ${userId}`);

        try {
          // Verificar se a memória existe
          const { data: memoryData, error: memoryCheckError } = await supabaseAdmin
            .from('memories')
            .select('id, is_paid')
            .eq('id', memoryId)
            .eq('user_id', userId)
            .maybeSingle();

          if (memoryCheckError) {
            console.error('❌ Erro ao verificar memória:', memoryCheckError);
          } else if (!memoryData) {
            console.error(`❌ Memória ${memoryId} não encontrada para o usuário ${userId}`);
          } else {
            console.log(`🔔 Memória encontrada:`, JSON.stringify(memoryData));

            if (memoryData.is_paid) {
              console.log(`⚠️ Memória ${memoryId} já está marcada como paga`);
            } else {
              // Atualizar a memória para is_paid = true
              const { error: memoryError } = await supabaseAdmin
                .from('memories')
                .update({ is_paid: true })
                .eq('id', memoryId)
                .eq('user_id', userId);

              if (memoryError) {
                console.error('❌ Erro ao atualizar status da memória:', memoryError);
              } else {
                console.log(`✅ Status da memória ${memoryId} atualizado com sucesso para is_paid=true`);
              }
            }
          }

          // Verificar se a compra existe
          const { data: purchaseData, error: purchaseCheckError } = await supabaseAdmin
            .from('purchases')
            .select('id, status')
            .eq('stripe_session_id', sessionId)
            .maybeSingle();

          if (purchaseCheckError) {
            console.error('❌ Erro ao verificar compra:', purchaseCheckError);
          } else if (!purchaseData) {
            console.error(`❌ Compra com session_id ${sessionId} não encontrada`);

            // Tentar criar a compra se não existir
            const { error: createPurchaseError } = await supabaseAdmin
              .from('purchases')
              .insert({
                user_id: userId,
                stripe_session_id: sessionId,
                memory_title: "Memória recuperada via webhook",
                amount: 1990,
                status: 'pago'
              });

            if (createPurchaseError) {
              console.error('❌ Erro ao criar compra:', createPurchaseError);
            } else {
              console.log(`✅ Compra criada com sucesso para session_id ${sessionId}`);
            }
          } else {
            console.log(`🔔 Compra encontrada:`, JSON.stringify(purchaseData));

            if (purchaseData.status === 'pago') {
              console.log(`⚠️ Compra ${purchaseData.id} já está marcada como paga`);
            } else {
              // Atualizar o status da compra para 'pago'
              const { error: purchaseError } = await supabaseAdmin
                .from('purchases')
                .update({ status: 'pago' })
                .eq('stripe_session_id', sessionId);

              if (purchaseError) {
                console.error('❌ Erro ao atualizar status da compra:', purchaseError);
              } else {
                console.log(`✅ Status da compra atualizado com sucesso para status=pago`);
              }
            }
          }
        } catch (error) {
          console.error('❌ Erro ao processar atualização de pagamento:', error);
        }
      } else {
        console.error("❌ Metadados incompletos no evento:", metadata);
        console.error("❌ userId ou memoryId não encontrados nos metadados");
      }
    } else {
      console.log(`⚠️ Evento ${event.type} não processado (apenas checkout.session.completed é tratado)`);
    }

    // Responder com sucesso
    console.log("✅ Processamento do webhook concluído com sucesso");
    return new Response(JSON.stringify({
      received: true,
      timestamp: new Date().toISOString(),
      event_type: event.type
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    console.error("❌ Stack trace:", error.stack);

    // Responder com erro
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString(),
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
