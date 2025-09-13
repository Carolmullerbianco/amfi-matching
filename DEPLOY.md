# AmFi Matching - Guia de Deploy

## Como compartilhar o sistema com sua equipe

### 1. Preparar o código para deploy

Seu sistema já está pronto para deploy! Os arquivos foram configurados para funcionar tanto localmente quanto na nuvem.

### 2. Fazer deploy no Render.com (GRATUITO)

1. **Criar conta no Render.com**
   - Acesse: https://render.com
   - Faça login com GitHub (recomendado)

2. **Criar repositório no GitHub**
   - Crie um repositório público no GitHub
   - Faça upload de todos os arquivos do projeto

3. **Conectar Render ao GitHub**
   - No Render, clique em "New +"
   - Selecione "Web Service"
   - Conecte sua conta do GitHub
   - Escolha o repositório do AmFi Matching

4. **Configurar o serviço**
   - **Name**: `amfi-matching-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (gratuito)

5. **Configurar frontend estático**
   - Clique em "New +" novamente
   - Selecione "Static Site"
   - Conecte o mesmo repositório
   - **Name**: `amfi-matching-frontend`
   - **Build Command**: `echo "No build required"`
   - **Publish Directory**: `frontend`

### 3. URLs de acesso

Após o deploy, você terá:
- **Backend API**: `https://amfi-matching-backend.onrender.com`
- **Frontend**: `https://amfi-matching-frontend.onrender.com`

### 4. Compartilhar com a equipe

Envie o link do frontend para sua equipe:
- URL: `https://amfi-matching-frontend.onrender.com/teste-simples.html`
- **Credenciais**:
  - Email: `carolmullerbianco@gmail.com` ou `admin@amfi.finance`
  - Senha: `123456`

### 5. Limitações do plano gratuito

- **Render Free**:
  - 750 horas/mês (suficiente para uso normal)
  - Pode "dormir" após 15min sem uso (demora ~30s para acordar)
  - Dados persistem normalmente

### 6. Alternativas gratuitas

Se precisar de outras opções:
- **Vercel** (frontend) + **Railway** (backend)
- **Netlify** (frontend) + **Heroku** (backend)

## Troubleshooting

### Problema: Site não carrega
- Aguarde 30 segundos (servidor pode estar "dormindo")
- Verifique se ambos os serviços estão rodando no painel do Render

### Problema: Dados não salvam
- Verifique se o backend está conectado
- Logs disponíveis no painel do Render

## Suporte

- GitHub do projeto: [seu-repositorio]
- Render Docs: https://render.com/docs