# 🚀 COMO INICIAR O AMFI MATCHING - VERSÃO SIMPLIFICADA

## 📋 PASSO 1: Verificar Node.js

Abra o **terminal/prompt** e digite:
```bash
node --version
npm --version
```

Se aparecer versões (ex: v18.17.0), está instalado ✅
Se der erro, instale em: https://nodejs.org/

## 🚀 PASSO 2: Iniciar Backend Mock (SEM PostgreSQL)

**Terminal 1:**
```bash
# Entrar na pasta backend
cd backend

# Instalar dependências básicas
npm init -y
npm install express cors

# Iniciar servidor mock
node src/server-mock.js
```

**Você deve ver:**
```
🚀 AmFi Matching Mock Server rodando!
📍 Porta: 3001
🔗 API: http://localhost:3001/api
✅ Pronto para receber conexões do frontend!
```

## 🎨 PASSO 3: Iniciar Frontend

**Terminal 2 (novo terminal):**
```bash
# Entrar na pasta frontend  
cd frontend

# Instalar dependências
npm install

# Iniciar frontend
npm run dev
```

**Você deve ver:**
```
VITE v5.0.6  ready in 1234 ms
➜  Local:   http://localhost:3000/
```

## 🎯 PASSO 4: Testar

1. **Abra:** http://localhost:3000
2. **Login:**
   - Email: `carolmullerbianco@gmail.com`
   - Senha: `123456`

## ✅ O QUE VAI FUNCIONAR:

- ✅ Login/Logout
- ✅ Dashboard com dados reais
- ✅ Visualização de originadores
- ✅ Visualização de investidores  
- ✅ Matches calculados
- ✅ Interface completa
- ✅ Formatação brasileira

## 🔧 SE DER PROBLEMA:

**"command not found":**
```bash
# Instalar Node.js: https://nodejs.org/
```

**"porta ocupada":**
```bash
# Matar processos
npx kill-port 3000
npx kill-port 3001
```

**"Cannot find module":**
```bash
# Instalar dependências novamente
npm install
```

---

## 🎉 RESULTADO FINAL:
- Backend rodando em: http://localhost:3001
- Frontend rodando em: http://localhost:3000
- Sistema 100% funcional sem banco de dados!