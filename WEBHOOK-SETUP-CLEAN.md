# Correção do Webhook do Stripe

Este documento contém instruções para corrigir o problema com os webhooks do Stripe que não estão sendo processados corretamente.

## Arquivos Incluídos

- `webhook-stripe-clean.ts`: Versão atualizada da função webhook-stripe
- `create-payment-clean.ts`: Versão atualizada da função create-payment

## Configuração Manual no Painel do Supabase

Para configurar manualmente as funções Edge no painel do Supabase, siga estas etapas:

### 1. Configurar Variáveis de Ambiente

1. Acesse o painel do Supabase: https://app.supabase.com/project/bsribrdwyvrhzagoqxvr
2. Vá para "Edge Functions" no menu lateral
3. Selecione a função "webhook-stripe"
4. Clique na aba "Settings" ou "Configuration"
5. Configure as seguintes variáveis de ambiente:
   - `STRIPE_SECRET_KEY`: [Sua chave secreta do Stripe]
   - `STRIPE_WEBHOOK_SECRET`: [Seu segredo do webhook do Stripe]
   - `SUPABASE_URL`: https://bsribrdwyvrhzagoqxvr.supabase.co
   - `SUPABASE_SERVICE_ROLE_KEY`: [Sua chave de serviço do Supabase]

6. Repita o mesmo processo para a função "create-payment"

### 2. Atualizar o Código das Funções

1. Para a função "webhook-stripe":
   - Selecione a função "webhook-stripe" na lista
   - Clique em "Edit Code" ou similar
   - Substitua todo o código pelo conteúdo do arquivo `webhook-stripe-clean.ts`
   - Clique em "Save" ou "Deploy"

2. Para a função "create-payment":
   - Selecione a função "create-payment" na lista
   - Clique em "Edit Code" ou similar
   - Substitua todo o código pelo conteúdo do arquivo `create-payment-clean.ts`
   - Clique em "Save" ou "Deploy"

### 3. Verificar a Configuração do Webhook no Stripe

1. Acesse o painel do Stripe: https://dashboard.stripe.com/
2. Vá para "Developers" > "Webhooks"
3. Verifique se o webhook está configurado para o endpoint correto:
   - `https://bsribrdwyvrhzagoqxvr.supabase.co/functions/v1/webhook-stripe`
4. Verifique se o webhook está configurado para receber o evento `checkout.session.completed`
5. Anote o "Signing Secret" (será necessário para a variável `STRIPE_WEBHOOK_SECRET`)

## Testando o Webhook

Após configurar as funções, você pode testar o webhook enviando um evento de teste:

1. Crie um arquivo HTML com um formulário para enviar um evento de teste
2. Configure a URL do webhook para `https://bsribrdwyvrhzagoqxvr.supabase.co/functions/v1/webhook-stripe`
3. Envie um evento de teste com o formato correto
4. Verifique a resposta e os logs da função no painel do Supabase

## Verificando os Logs

Para verificar se o webhook está funcionando corretamente:

1. Acesse o painel do Supabase
2. Vá para "Edge Functions" > "webhook-stripe" > "Logs"
3. Procure por logs recentes que mostram o processamento de eventos

## Solução de Problemas

Se o webhook ainda não estiver funcionando corretamente:

1. Verifique se todas as variáveis de ambiente estão configuradas corretamente
2. Verifique se o segredo do webhook no Stripe corresponde ao configurado no Supabase
3. Verifique se o webhook está configurado para receber o evento `checkout.session.completed`
4. Verifique os logs da função para identificar possíveis erros
