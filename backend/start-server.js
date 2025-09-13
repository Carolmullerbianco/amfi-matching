const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Dados de teste
const users = [
  { id: 1, email: 'carolmullerbianco@gmail.com', name: 'Carol Muller Bianco' }
];

// Rota de login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'carolmullerbianco@gmail.com' && password === '123456') {
    res.json({ 
      token: 'test-token',
      user: users[0]
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(3001, () => {
  console.log('✅ SERVIDOR BACKEND FUNCIONANDO!');
  console.log('🔗 Backend: http://localhost:3001');
  console.log('📊 Health: http://localhost:3001/api/health');
  console.log('');
  console.log('Agora abra outro terminal e rode o frontend!');
});