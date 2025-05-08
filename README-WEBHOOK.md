# Correção do Webhook do Stripe

Este documento contém instruções para corrigir o problema com os webhooks do Stripe que não estão sendo processados corretamente.

## Problema

Os pagamentos do Stripe não estavam sendo retornados ao sistema após a conclusão bem-sucedida. Isso ocorria porque:

1. O webhook não estava processando corretamente os eventos do Stripe
2. Faltavam logs detalhados para identificar problemas
3. Não havia tratamento adequado para diferentes formatos de evento

## Solução

Foram implementadas as seguintes melhorias:

1. **Logs Detalhados**: Adicionados logs em todas as etapas do processamento do webhook
2. **Melhor Tratamento de Erros**: Implementado tratamento de erros mais robusto
3. **Verificação de Dados**: Adicionadas verificações para garantir que os dados necessários existam
4. **Compatibilidade com Diferentes Formatos**: A função agora pode lidar com diferentes formatos de evento

## Arquivos Atualizados

- `webhook-stripe/index.ts`: Função Edge que processa os webhooks do Stripe
- `create-payment/index.ts`: Função Edge que cria sessões de checkout do Stripe

## Configuração no Supabase

Para configurar as funções Edge no Supabase, siga estas etapas:

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

### 2. Implantar as Funções

1. Para a função "webhook-stripe":
   - Selecione a função "webhook-stripe" na lista
   - Clique em "Edit Code" ou similar
   - Substitua todo o código pelo conteúdo do arquivo `webhook-stripe/index.ts`
   - Clique em "Save" ou "Deploy"

2. Para a função "create-payment":
   - Selecione a função "create-payment" na lista
   - Clique em "Edit Code" ou similar
   - Substitua todo o código pelo conteúdo do arquivo `create-payment/index.ts`
   - Clique em "Save" ou "Deploy"

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
