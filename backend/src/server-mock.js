const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Caminho para o arquivo de dados
const DB_PATH = path.join(__dirname, '../data/database.json');

// Função para carregar dados do arquivo
function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    } else {
      // Criar estrutura inicial se o arquivo não existir
      const initialData = {
        users: [],
        originadores: [],
        investidores: []
      };
      saveDatabase(initialData);
      return initialData;
    }
  } catch (error) {
    console.error('Erro ao carregar banco de dados:', error);
    return {
      users: [],
      originadores: [],
      investidores: []
    };
  }
}

// Função para salvar dados no arquivo
function saveDatabase(data) {
  try {
    // Criar diretório se não existir
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar banco de dados:', error);
    return false;
  }
}

// Carregar dados iniciais
let database = loadDatabase();

// Acessar dados via database
const users = database.users;
const originadores = database.originadores;
const investidores = database.investidores;

// Função para gerar próximo ID
function getNextId(array) {
  if (array.length === 0) return 1;
  const maxId = Math.max(...array.map(item => item.id));
  return maxId + 1;
}

// Calcular matches
const matches = [];
originadores.forEach(orig => {
  investidores.forEach(inv => {
    if (orig.tipo_ativo === inv.tipo_ativo && 
        orig.volume_serie_senior >= inv.volume_minimo &&
        (orig.taxa_cdi_plus >= inv.taxa_minima_cdi_plus || 
         orig.taxa_pre_fixada >= inv.taxa_minima_pre_fixada)) {
      matches.push({
        originador: orig,
        investidor: inv,
        match_score: Math.floor(Math.random() * 40) + 60 // Score entre 60-100
      });
    }
  });
});

console.log('🎯 Dados mockados carregados:');
console.log(`👤 ${users.length} usuários`);
console.log(`🏢 ${originadores.length} originadores`);  
console.log(`💰 ${investidores.length} investidores`);
console.log(`✨ ${matches.length} matches encontrados`);

// Rotas da API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Validar email AmFi
  if (!email.endsWith('@amfi.finance') && email !== 'carolmullerbianco@gmail.com') {
    return res.status(403).json({ 
      error: 'Acesso restrito a emails @amfi.finance ou carolmullerbianco@gmail.com' 
    });
  }

  const user = users.find(u => u.email === email);
  if (user && password === '123456') {
    res.json({ 
      message: 'Login realizado com sucesso',
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email.endsWith('@amfi.finance') && email !== 'carolmullerbianco@gmail.com') {
    return res.status(403).json({ 
      error: 'Acesso restrito a emails @amfi.finance ou carolmullerbianco@gmail.com' 
    });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    message: 'Usuário criado com sucesso',
    token: 'mock-jwt-token-' + Date.now(),
    user: newUser
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: users[0] });
});

app.get('/api/originadores', (req, res) => {
  res.json({
    message: 'Originadores listados com sucesso',
    originadores
  });
});

app.get('/api/investidores', (req, res) => {
  res.json({
    message: 'Investidores listados com sucesso',
    investidores
  });
});

app.get('/api/matches', (req, res) => {
  // Calcular matches com lógica simplificada - sem score
  const newMatches = [];
  originadores.forEach(orig => {
    investidores.forEach(inv => {
      // 1. Verificar se há interseção entre os tipos de ativo
      const hasCommonAsset = orig.tipos_ativo.some(origAtivo =>
        inv.tipos_ativo.includes(origAtivo)
      );

      // 2. Verificar se volume aprovado >= volume mínimo do investidor
      const volumeMatch = orig.volume_aprovado >= inv.volume_minimo;

      // 3. Verificar se pelo menos uma das taxas atende ao critério
      const taxaMatch = (orig.taxa_cdi_plus >= inv.taxa_minima_cdi_plus) ||
                       (orig.taxa_pre_fixada >= inv.taxa_minima_pre_fixada);

      // Match acontece quando TODOS os critérios são atendidos
      if (hasCommonAsset && volumeMatch && taxaMatch) {
        newMatches.push({
          originador: orig,
          investidor: inv,
          criterios_atendidos: {
            ativo_compativel: hasCommonAsset,
            volume_suficiente: volumeMatch,
            taxa_adequada: taxaMatch
          }
        });
      }
    });
  });

  res.json({
    message: 'Matches encontrados com sucesso',
    matches: newMatches,
    total: newMatches.length
  });
});

// CRUD Originadores
app.post('/api/originadores', (req, res) => {
  const {
    nome_originador,
    volume_aprovado,
    volume_atual_em_uso,
    taxa_cdi_plus,
    taxa_pre_fixada,
    prazo,
    concentracao_cedente,
    concentracao_sacado,
    taxa_subordinacao,
    tipos_ativo,
    observacoes
  } = req.body;

  if (!nome_originador || !volume_aprovado || !tipos_ativo || tipos_ativo.length === 0) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome_originador, volume_aprovado, tipos_ativo' });
  }

  const newOriginador = {
    id: getNextId(originadores),
    nome_originador,
    volume_aprovado: parseFloat(volume_aprovado),
    volume_atual_em_uso: parseFloat(volume_atual_em_uso) || 0,
    taxa_cdi_plus: parseFloat(taxa_cdi_plus) || 0,
    taxa_pre_fixada: parseFloat(taxa_pre_fixada) || 0,
    prazo: parseInt(prazo) || 12,
    concentracao_cedente: parseFloat(concentracao_cedente) || 0,
    concentracao_sacado: parseFloat(concentracao_sacado) || 0,
    taxa_subordinacao: parseFloat(taxa_subordinacao) || 0,
    tipos_ativo: Array.isArray(tipos_ativo) ? tipos_ativo : [tipos_ativo],
    observacoes: observacoes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    updated_by: 1
  };

  originadores.push(newOriginador);

  // Salvar no arquivo
  if (saveDatabase(database)) {
    res.status(201).json({
      message: 'Originador criado com sucesso',
      originador: newOriginador
    });
  } else {
    res.status(500).json({
      error: 'Erro ao salvar dados no arquivo'
    });
  }
});

app.put('/api/originadores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const originadorIndex = originadores.findIndex(o => o.id === id);

  if (originadorIndex === -1) {
    return res.status(404).json({ error: 'Originador não encontrado' });
  }

  const updatedData = {
    ...req.body,
    volume_aprovado: parseFloat(req.body.volume_aprovado),
    volume_atual_em_uso: parseFloat(req.body.volume_atual_em_uso) || 0,
    taxa_cdi_plus: parseFloat(req.body.taxa_cdi_plus),
    taxa_pre_fixada: parseFloat(req.body.taxa_pre_fixada),
    prazo: parseInt(req.body.prazo),
    concentracao_cedente: parseFloat(req.body.concentracao_cedente),
    concentracao_sacado: parseFloat(req.body.concentracao_sacado),
    taxa_subordinacao: parseFloat(req.body.taxa_subordinacao),
    tipos_ativo: Array.isArray(req.body.tipos_ativo) ? req.body.tipos_ativo : [req.body.tipos_ativo],
    observacoes: req.body.observacoes || '',
    updated_at: new Date().toISOString(),
    updated_by: 1
  };

  originadores[originadorIndex] = { ...originadores[originadorIndex], ...updatedData };

  // Salvar no arquivo
  if (saveDatabase(database)) {
    res.json({
      message: 'Originador atualizado com sucesso',
      originador: originadores[originadorIndex]
    });
  } else {
    res.status(500).json({
      error: 'Erro ao salvar dados no arquivo'
    });
  }
});

app.delete('/api/originadores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const originadorIndex = originadores.findIndex(o => o.id === id);

  if (originadorIndex === -1) {
    return res.status(404).json({ error: 'Originador não encontrado' });
  }

  const deletedOriginador = originadores.splice(originadorIndex, 1)[0];

  // Salvar no arquivo
  if (saveDatabase(database)) {
    res.json({
      message: 'Originador excluído com sucesso',
      originador: deletedOriginador
    });
  } else {
    res.status(500).json({
      error: 'Erro ao salvar dados no arquivo'
    });
  }
});

// CRUD Investidores
app.post('/api/investidores', (req, res) => {
  const {
    nome_investidor,
    tipos_ativo,
    volume_minimo,
    taxa_minima_cdi_plus,
    taxa_minima_pre_fixada,
    observacoes
  } = req.body;

  if (!nome_investidor || !tipos_ativo || tipos_ativo.length === 0 || !volume_minimo) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome_investidor, tipos_ativo, volume_minimo' });
  }

  const newInvestidor = {
    id: getNextId(investidores),
    nome_investidor,
    tipos_ativo: Array.isArray(tipos_ativo) ? tipos_ativo : [tipos_ativo],
    volume_minimo: parseFloat(volume_minimo),
    taxa_minima_cdi_plus: parseFloat(taxa_minima_cdi_plus) || 0,
    taxa_minima_pre_fixada: parseFloat(taxa_minima_pre_fixada) || 0,
    observacoes: observacoes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    updated_by: 1
  };

  investidores.push(newInvestidor);

  // Salvar no arquivo
  if (saveDatabase(database)) {
    res.status(201).json({
      message: 'Investidor criado com sucesso',
      investidor: newInvestidor
    });
  } else {
    res.status(500).json({
      error: 'Erro ao salvar dados no arquivo'
    });
  }
});

app.put('/api/investidores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const investidorIndex = investidores.findIndex(i => i.id === id);

  if (investidorIndex === -1) {
    return res.status(404).json({ error: 'Investidor não encontrado' });
  }

  const updatedData = {
    ...req.body,
    tipos_ativo: Array.isArray(req.body.tipos_ativo) ? req.body.tipos_ativo : [req.body.tipos_ativo],
    volume_minimo: parseFloat(req.body.volume_minimo),
    taxa_minima_cdi_plus: parseFloat(req.body.taxa_minima_cdi_plus),
    taxa_minima_pre_fixada: parseFloat(req.body.taxa_minima_pre_fixada),
    observacoes: req.body.observacoes || '',
    updated_at: new Date().toISOString(),
    updated_by: 1
  };

  investidores[investidorIndex] = { ...investidores[investidorIndex], ...updatedData };

  // Salvar no arquivo
  if (saveDatabase(database)) {
    res.json({
      message: 'Investidor atualizado com sucesso',
      investidor: investidores[investidorIndex]
    });
  } else {
    res.status(500).json({
      error: 'Erro ao salvar dados no arquivo'
    });
  }
});

app.delete('/api/investidores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const investidorIndex = investidores.findIndex(i => i.id === id);

  if (investidorIndex === -1) {
    return res.status(404).json({ error: 'Investidor não encontrado' });
  }

  const deletedInvestidor = investidores.splice(investidorIndex, 1)[0];

  // Salvar no arquivo
  if (saveDatabase(database)) {
    res.json({
      message: 'Investidor excluído com sucesso',
      investidor: deletedInvestidor
    });
  } else {
    res.status(500).json({
      error: 'Erro ao salvar dados no arquivo'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'AmFi Matching API - Versão Mock',
    timestamp: new Date().toISOString(),
    environment: 'mock'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'AmFi Matching API - Sistema de Matching para Originadores e Investidores',
    version: '1.0.0-mock',
    endpoints: {
      auth: '/api/auth',
      originadores: '/api/originadores',
      investidores: '/api/investidores', 
      matches: '/api/matches'
    }
  });
});

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    message: `${req.method} ${req.originalUrl} não existe`
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('🚀 AmFi Matching Mock Server rodando!');
  console.log(`📍 Porta: ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('✅ Pronto para receber conexões do frontend!');
  console.log('');
  console.log('🔐 Credenciais de teste:');
  console.log('👑 ADMIN: carolmullerbianco@gmail.com');
  console.log('📧 Outros: admin@amfi.finance');
  console.log('🔑 Senha: 123456');
});