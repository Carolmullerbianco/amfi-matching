const express = require('express');
const cors = require('cors');

const app = express();

// CORS mais específico
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'],
  credentials: true
}));

app.use(express.json());

// Middleware para logs
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

console.log('🚀 Iniciando servidor AmFi Matching...');

// Dados de teste
const users = [
  { id: 1, email: 'carolmullerbianco@gmail.com', name: 'Carol Muller Bianco' }
];

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log(`📝 Tentativa de login: ${email}`);
  
  if (email === 'carolmullerbianco@gmail.com' && password === '123456') {
    console.log('✅ Login bem-sucedido!');
    res.json({ 
      token: 'test-token-12345',
      user: users[0]
    });
  } else {
    console.log('❌ Login falhou');
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK - AmFi Matching Backend' });
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('✅ SERVIDOR BACKEND FUNCIONANDO!');
  console.log(`🔗 Backend: http://localhost:${PORT}`);
  console.log(`🔗 Backend: http://127.0.0.1:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('🔐 Credenciais de teste:');
  console.log('Email: carolmullerbianco@gmail.com');
  console.log('Senha: 123456');
  console.log('');
  console.log('👂 Aguardando conexões...');
});