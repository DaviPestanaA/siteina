# TODO - Ina Agency Dashboard

## Autenticação e Configuração Inicial
- [x] Configurar autenticação com login fixo (agencia ina / 12davi34)
- [x] Aplicar tema preto e branco em todo o site
- [x] Configurar layout de dashboard com navegação lateral

## CRM Semanal
- [x] Criar estrutura de semanas no CRM
- [x] Implementar visualização de semanas (lista/cards)
- [x] Adicionar campo de script por semana
- [x] Criar estrutura de 7 dias por semana
- [x] Implementar kanban diário (5 abordagens por dia)
- [x] Adicionar funcionalidade de criar lead
- [x] Adicionar funcionalidade de editar lead
- [x] Adicionar funcionalidade de excluir lead permanentemente
- [ ] Implementar drag and drop no kanban
- [x] Adicionar status/colunas no kanban (ex: Novo, Em Contato, Negociação, Fechado, Perdido)

## Gestão de Clientes - Tráfego Pago
- [x] Criar lista de clientes
- [x] Implementar sistema de "gavetas" por cliente
- [x] Adicionar seção de KPIs atuais
- [x] Adicionar seção de KPIs passados (histórico)
- [x] Adicionar seção de acompanhamento semanal
- [x] Adicionar campo para criativos usados
- [x] Adicionar campo para análise de performance (o que funciona/não funciona)
- [x] Adicionar seção de acessos do cliente

## Gestão de Clientes - Social Media
- [x] Criar lista de clientes de Social Media
- [x] Implementar sistema de "gavetas" por cliente
- [x] Adicionar seção de referências
- [x] Adicionar seção de copys
- [x] Adicionar seção de informações do cliente

## Melhorias de UX
- [x] Implementar navegação intuitiva entre módulos
- [x] Adicionar feedback visual para ações (toast notifications)
- [x] Implementar loading states
- [x] Adicionar confirmação antes de excluir dados
- [x] Otimizar responsividade mobile

## Reestruturação do CRM - Estágios
- [x] Mudar estrutura de kanban para estágios: C1, C2, C3, C4, C5, Demonstrou Interesse, Não Tem Interesse
- [x] Implementar scripts diários divididos por C1/C2/C3/C4/C5 (5 mensagens por dia)
- [x] Criar aba "Futuros Clientes"
- [x] Criar aba "Reuniões Agendadas"
- [x] Atualizar schema do banco para suportar novos estágios
- [x] Atualizar interface do kanban para exibir leads nos estágios corretos

## Sistema de Páginas Editáveis (Estilo Notion)
- [x] Criar tabela de páginas/documentos no banco de dados
- [x] Implementar editor de texto rico para páginas
- [x] Adicionar páginas editáveis em KPIs
- [x] Adicionar páginas editáveis em Relatórios Semanais
- [x] Adicionar páginas editáveis em Acessos
- [x] Adicionar páginas editáveis em Referências (Social Media)
- [x] Adicionar páginas editáveis em Copys (Social Media)
- [x] Adicionar sistema de upload de documentos

## Divisão Semanal para Clientes
- [x] Implementar divisão semanal para Tráfego Pago
- [x] Implementar divisão semanal para Social Media
- [x] Permitir navegação entre semanas diferentes
- [x] Criar histórico de semanas anteriores

## Melhorias de Navegação e Funcionalidade
- [x] Adicionar botões de exclusão em KPIs (atuais e passados)
- [x] Adicionar botões de exclusão em Relatórios Semanais
- [x] Adicionar botões de exclusão em Acessos
- [x] Implementar drag and drop no kanban do CRM (arrastar leads entre estágios)
- [x] Melhorar navegação geral (adicionar breadcrumbs ou botões voltar)
- [x] Reorganizar layout de Tráfego Pago para facilitar edição
- [x] Reorganizar layout de Social Media para facilitar edição
- [x] Adicionar funcionalidade de edição inline onde possível

## Correções e Novas Funcionalidades
- [x] Corrigir bug do drag and drop (leads sumindo ao arrastar)
- [x] Adicionar estágio "Sem Contato" como estágio inicial
- [x] Implementar sistema de progressão diária de leads (avançam para próximo dia voltando a "Sem Contato")
- [x] Manter leads em "Demonstrou Interesse" e "Não Tem Interesse" em todos os dias
- [x] Implementar sistema de semanas para Tráfego Pago
- [x] Implementar sistema de semanas para Social Media
- [x] Separar Tráfego Pago e Social Media em abas diferentes na página Clientes
- [x] Melhorar navegação para voltar facilmente à página inicial

## Correções de Performance e Funcionalidade
- [x] Otimizar performance do CRM (reduzir travamentos)
- [x] Corrigir sistema de "Demonstrou Interesse" e "Não Tem Interesse" (manter em todos os dias)
- [x] Garantir que novos leads sejam criados em "Sem Contato"
- [x] Melhorar layout de Tráfego Pago (mais funcional e rápido)
- [x] Melhorar layout de Social Media (mais funcional e rápido)
- [x] Otimizar carregamento de dados
- [x] Simplificar interface para facilitar uso

## Melhorias de Layout e Design
- [x] Mudar nome do site para "Agência INA"
- [x] Remover mensagem "Bem-vindo, Davi Pestana!"
- [x] Separar Tráfego Pago e Social Media em cards individuais
- [x] Reorganizar layout da página inicial de forma mais profissional
- [x] Melhorar espaçamento e hierarquia visual
- [x] Deixar layout mais compacto e organizado

## Correções de Lógica de Leads
- [x] Novos leads devem ser criados em "Sem Contato"
- [x] Leads em "Sem Contato" devem aparecer em TODOS os 7 dias
- [x] Leads em "Demonstrou Interesse" devem aparecer em TODOS os 7 dias
- [x] Leads em "Não Tem Interesse" devem aparecer em TODOS os 7 dias
- [x] Leads em C1, C2, C3, C4, C5 aparecem apenas no dia específico (dayOfWeek)

## Funcionalidade de Avanço em Massa
- [x] Criar mutation no backend para avançar múltiplos leads de uma vez
- [x] Adicionar botão "Avançar Todos" para C1→C2
- [x] Adicionar botão "Avançar Todos" para C2→C3
- [x] Adicionar botão "Avançar Todos" para C3→C4
- [x] Adicionar botão "Avançar Todos" para C4→C5
- [x] Adicionar confirmação antes de executar ação em massa
- [x] Manter opção de movimentação manual individual

## Melhorias Adicionais
- [x] Adicionar campos de data de início e término no relatório semanal de Tráfego Pago
- [x] Adicionar campos de data de início e término no relatório semanal de Social Media
- [x] Adicionar botão "Avançar Todos" para estágio "Sem Contato" → C1

## Separação de Social Media e Tráfego Pago
- [x] Adicionar campo "tipo" (traffic/social) na tabela de clientes
- [ ] Filtrar clientes por tipo nas páginas de Tráfego Pago e Social Media
- [ ] Garantir que cada área mostre apenas seus próprios clientes

## Sistema de KPIs Flexível
- [ ] Criar modelo padrão de KPIs
- [ ] Permitir adicionar KPIs personalizados por cliente
- [ ] Permitir remover KPIs que não fazem sentido para o cliente
- [ ] Permitir editar nome e descrição dos KPIs

## Fotos dos Clientes
- [ ] Adicionar campo de foto/logo na tabela de clientes
- [ ] Implementar upload de imagem para clientes
- [ ] Exibir foto do cliente nos cards e páginas de detalhes

## Sistema de Tasks Diárias
- [x] Criar tabela de tasks no banco de dados
- [x] Implementar rotas tRPC para tasks
- [x] Criar página de Tasks Diárias
- [x] Implementar visualização diária por membro (Davi, Bia, Lucas)
- [x] Implementar visualização semanal
- [x] Adicionar funcionalidade de criar/editar/excluir tasks
- [x] Adicionar marcação de tasks como concluídas
## Separação Completa de Tráfego Pago e Social Media
- [x] Remover página "Gestão de Clientes" unificada
- [x] Criar página separada "/traffic" apenas para clientes de Tráfego Pago
- [x] Criar página separada "/social-media" apenas para clientes de Social Media
- [x] Atualizar Home com 2 cards separados (Tráfego Pago e Social Media)
- [x] Atualizar rotas no App.tsx
- [x] Garantir que cada página mostre apenas seus clientes específicos
