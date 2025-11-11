# Agência INA - Dashboard de Gestão

Dashboard completo para gestão de agência com CRM semanal, gestão de clientes de Tráfego Pago e Social Media, e sistema de tasks diárias para equipe.

## 🚀 Funcionalidades

### CRM Semanal
- Organização por semanas com kanban diário
- 7 dias com estágios: Sem Contato, C1, C2, C3, C4, C5, Demonstrou Interesse, Não Tem Interesse
- Scripts de abordagem por estágio (C1-C5)
- Drag and drop entre estágios
- Botões de "Avançar Todos" para movimentação em massa
- Abas de Futuros Clientes e Reuniões Agendadas

### Gestão de Clientes - Tráfego Pago
- KPIs atuais e históricos
- Relatórios semanais com datas de início/término
- Registro de criativos e análise de performance
- Armazenamento de acessos do cliente
- Páginas editáveis estilo Notion

### Gestão de Clientes - Social Media
- Referências visuais
- Copys e conteúdos
- Informações dos clientes
- Páginas editáveis estilo Notion

### Tasks Diárias
- Organização por membro (Davi, Bia, Lucas)
- Visualização diária e semanal
- Criação, edição e exclusão de tarefas
- Marcação de conclusão

## 🛠️ Tecnologias

- **Frontend**: React 19 + Tailwind CSS 4
- **Backend**: Node.js + Express + tRPC
- **Banco de Dados**: MySQL/TiDB + Drizzle ORM
- **Autenticação**: OAuth (Manus)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd ina_agency_site
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
DATABASE_URL=sua_connection_string_mysql
JWT_SECRET=sua_chave_secreta
VITE_APP_TITLE=Agência INA
# Adicione outras variáveis conforme necessário
```

4. Execute as migrações do banco de dados:
```bash
pnpm db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🏗️ Build para Produção

```bash
pnpm build
```

Para executar em produção:
```bash
node dist/index.js
```

## 📁 Estrutura do Projeto

```
ina_agency_site/
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── components/ # Componentes reutilizáveis
│   │   └── lib/        # Bibliotecas e utilitários
├── server/             # Backend Node.js
│   ├── _core/         # Configurações e middleware
│   ├── db.ts          # Funções de query do banco
│   └── routers.ts     # Rotas tRPC
├── drizzle/           # Schema e migrações do banco
└── shared/            # Tipos e constantes compartilhadas
```

## 🔐 Autenticação

O sistema utiliza autenticação OAuth. Para desenvolvimento local, você precisará configurar as credenciais OAuth adequadas.

## 📝 Licença

Projeto privado - Agência INA
