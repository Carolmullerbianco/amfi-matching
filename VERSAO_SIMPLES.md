# 🚀 AmFi Matching - Versão Simplificada (Sem PostgreSQL)

## 📝 Para testar SEM instalar PostgreSQL:

### 1. **Backend Mock** (substitui o banco por dados em memória):
```bash
cd backend
npm install

# Criar versão simplificada do servidor
cat > src/index-mock.ts << 'EOF'
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Dados mockados
const users = [
  { id: 1, email: 'carolmullerbianco@gmail.com', name: 'Carol Muller', password: '123456' }
];

const originadores = [
  {
    id: 1,
    nome_originador: 'Factoring Alpha Ltda',
    volume_aprovado: 5000000,
    taxa_cdi_plus: 2.50,
    tipo_ativo: 'duplicata',
    created_at: new Date().toISOString()
  }
];

const investidores = [
  {
    id: 1,
    nome_investidor: 'Fundo XYZ',
    tipo_ativo: 'duplicata',
    volume_minimo: 2000000,
    created_at: new Date().toISOString()
  }
];

// Rotas simplificadas
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ 
      token: 'mock-token-12345',
      user: { id: user.id, email: user.email, name: user.name }
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: users[0] });
});

app.get('/api/originadores', (req, res) => {
  res.json({ originadores });
});

app.get('/api/investidores', (req, res) => {
  res.json({ investidores });
});

app.get('/api/matches', (req, res) => {
  res.json({ matches: [], total: 0 });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK - Mock Version' });
});

app.listen(3001, () => {
  console.log('🚀 Mock Server rodando na porta 3001');
});
EOF

# Compilar e rodar
npx tsx src/index-mock.ts
```

### 2. **Frontend** (terminal separado):
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Acesse: http://localhost:3000
- Email: carolmullerbianco@gmail.com  
- Senha: 123456