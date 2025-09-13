# 🚀 Setup Automático - AmFi Matching

## 📋 PRÉ-REQUISITOS (você precisa instalar):

1. **Node.js 18+**: https://nodejs.org/
2. **PostgreSQL**: https://www.postgresql.org/download/
3. **Git**: https://git-scm.com/

## 🔧 SCRIPT AUTOMÁTICO

### 1. **Setup PostgreSQL** (execute no terminal do PostgreSQL):
```sql
-- Conecte no psql como postgres e execute:
CREATE DATABASE amfi_matching;
CREATE USER amfi_user WITH PASSWORD 'amfi123456';
GRANT ALL PRIVILEGES ON DATABASE amfi_matching TO amfi_user;
```

### 2. **Setup Backend** (copie e cole no terminal):
```bash
# Navegar para backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env automaticamente
cat > .env << 'EOF'
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=amfi_matching
DB_USER=amfi_user
DB_PASSWORD=amfi123456

JWT_SECRET=amfi_super_secret_jwt_key_2024_very_secure_token_here
JWT_EXPIRES_IN=24h

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=admin@amfi.finance
EMAIL_PASSWORD=app_password_here
EOF

# Executar migrations e seeds
npm run migration:run && npm run seed

echo "✅ Backend configurado! Execute: npm run dev"
```

### 3. **Setup Frontend** (novo terminal):
```bash
# Navegar para frontend
cd frontend

# Instalar dependências
npm install

echo "✅ Frontend configurado! Execute: npm run dev"
```

### 4. **Iniciar Servidores** (2 terminais separados):

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🎯 CREDENCIAIS DE ACESSO:
- URL: http://localhost:3000
- Email: carolmullerbianco@gmail.com
- Senha: 123456

---

## 📞 SE DER ERRO:

1. **PostgreSQL não conecta:**
   - Verifique se está instalado e rodando
   - Use suas próprias credenciais no .env

2. **Porta ocupada:**
   ```bash
   npx kill-port 3000
   npx kill-port 3001
   ```

3. **Dependências:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```