# 🚀 Deploy do Site Agência INA na Vercel

## 📋 Pré-requisitos

- Conta no GitHub (já tem ✅)
- Conta na Vercel (já tem ✅)
- Conta no Railway (vamos criar - GRÁTIS)

---

## PASSO 1: Configurar Banco de Dados no Railway (GRÁTIS)

### 1.1 Criar conta no Railway
1. Acesse: https://railway.app/
2. Clique em "Start a New Project"
3. Faça login com GitHub

### 1.2 Criar banco MySQL
1. Clique em "+ New Project"
2. Escolha "Provision MySQL"
3. Aguarde criar (uns 30 segundos)

### 1.3 Copiar URL de conexão
1. Clique no banco MySQL criado
2. Vá na aba "Connect"
3. Copie a **"MySQL Connection URL"** (algo como: `mysql://root:senha@containers-us-west-xxx.railway.app:7453/railway`)
4. **GUARDE ESSA URL** - você vai precisar!

---

## PASSO 2: Subir Código no GitHub

### 2.1 Preparar repositório
1. No seu repositório GitHub (`siteina`), delete todos os arquivos atuais
2. Faça upload de TODOS os arquivos desta pasta (`ina_vercel_deploy`)
3. **IMPORTANTE:** Suba TUDO, incluindo pastas `client/`, `server/`, `drizzle/`, etc.

### 2.2 Arquivos importantes que DEVEM estar no GitHub:
```
✅ package.json
✅ vercel.json
✅ client/ (pasta completa)
✅ server/ (pasta completa)
✅ drizzle/ (pasta completa)
✅ shared/ (pasta completa)
✅ storage/ (pasta completa)
```

---

## PASSO 3: Deploy na Vercel

### 3.1 Importar projeto
1. Na Vercel, clique em "Import Project" (ou "Add New...")
2. Escolha "Import Git Repository"
3. Selecione seu repositório `siteina`
4. Clique em "Import"

### 3.2 Configurar variáveis de ambiente
**ANTES de fazer deploy**, clique em "Environment Variables" e adicione:

| Nome da Variável | Valor |
|------------------|-------|
| `DATABASE_URL` | Cole a URL do Railway (passo 1.3) |
| `JWT_SECRET` | `sua-chave-secreta-aqui-123456` |
| `NODE_ENV` | `production` |

### 3.3 Configurações do Build
- **Framework Preset:** Vite
- **Build Command:** `pnpm install && pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### 3.4 Fazer Deploy
1. Clique em "Deploy"
2. Aguarde 2-5 minutos
3. Pronto! Seu site estará no ar! 🎉

---

## PASSO 4: Configurar Banco de Dados

### 4.1 Rodar migrations
Após o primeiro deploy, você precisa criar as tabelas no banco:

1. Na Vercel, vá em "Settings" → "Functions"
2. Ou use o terminal local:
```bash
# Instalar dependências
pnpm install

# Configurar variável de ambiente local
export DATABASE_URL="sua-url-do-railway-aqui"

# Rodar migrations
pnpm db:push
```

---

## ✅ Pronto! Seu site está no ar!

URL do site: `https://siteina.vercel.app` (ou similar)

### Login:
- **Usuário:** agencia ina
- **Senha:** 12davi34

---

## 🔧 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se a variável `DATABASE_URL` está correta na Vercel
- Certifique-se que o banco Railway está ativo

### Erro: "Build failed"
- Verifique se todos os arquivos foram enviados pro GitHub
- Certifique-se que `package.json` está na raiz do projeto

### Site carrega mas está em branco
- Verifique se as migrations foram rodadas (`pnpm db:push`)
- Confira se todas as variáveis de ambiente estão configuradas

---

## 📞 Precisa de ajuda?

Se tiver qualquer problema, me avise que te ajudo a resolver!
