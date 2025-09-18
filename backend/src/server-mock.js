const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Caminho para o arquivo de dados
const DB_PATH = path.join(__dirname, '../data/database.json');

// 🛡️ DADOS BASE PROTEGIDOS - NUNCA MAIS PERCA DADOS!
const DADOS_BASE_PROTEGIDOS = {
  originadores: [
    {
      id: 1,
      nome_originador: "Price",
      volume_aprovado: 1500000,
      taxa_cdi_plus: 7.5,
      taxa_pre_fixada: 0,
      prazo: 24,
      concentracao_cedente: 10,
      concentracao_sacado: 10,
      taxa_subordinacao: 20,
      tipos_ativo: ["duplicatas"],
      observacoes: "Pool #1 - Catálise - R$ 750k e tem 450k disponíveis, mezanino - R$ 1,25 MM",
      created_at: "2025-09-13T20:50:10.054Z",
      updated_at: "2025-09-18T22:50:52.178Z",
      created_by: 1,
      updated_by: 1,
      volume_atual_em_uso: 2000000
    },
    {
      id: 2,
      nome_originador: "Faighus",
      volume_aprovado: 5000000,
      taxa_cdi_plus: 6.0,
      taxa_pre_fixada: 0,
      prazo: 30,
      concentracao_cedente: 10,
      concentracao_sacado: 10,
      taxa_subordinacao: 20,
      tipos_ativo: ["duplicatas"],
      observacoes: "Pool #1 - R$ 1,25MM - Mezanino e mais R$ 1 MM na senior",
      created_at: "2025-09-18T20:23:07.870Z",
      updated_at: "2025-09-18T22:51:53.682Z",
      created_by: 1,
      updated_by: 1,
      volume_atual_em_uso: 2250000
    },
    {
      id: 3,
      nome_originador: "C4",
      volume_aprovado: 900000,
      taxa_cdi_plus: 6.0,
      taxa_pre_fixada: 0,
      prazo: 30,
      concentracao_cedente: 10,
      concentracao_sacado: 10,
      taxa_subordinacao: 20,
      tipos_ativo: ["duplicatas"],
      observacoes: "Pool #2 - R$ 600k - 1º aporte da Catálise (total aprovado R$ 1MM) Pool #3 - R$ 1,5MM - 1º aporte da Coruja (total aprovado R$ 5MM)",
      created_at: "2025-09-18T20:23:07.870Z",
      updated_at: "2025-09-18T20:23:07.870Z",
      created_by: 1,
      updated_by: 1,
      volume_atual_em_uso: 2100000
    }
  ],
  investidores: [
    {
      id: 1,
      nome_investidor: "Coruja",
      tipos_ativo: ["duplicatas"],
      volume_minimo: 1000000,
      taxa_minima_cdi_plus: 6,
      taxa_minima_pre_fixada: 0,
      observacoes: "",
      created_at: "2025-09-18T20:23:07.870Z",
      updated_at: "2025-09-18T20:23:07.870Z",
      created_by: 1,
      updated_by: 1
    }
  ]
};

// 🛡️ FUNÇÃO DE PROTEÇÃO ABSOLUTA - GARANTE QUE OS DADOS BASE SEMPRE EXISTAM
function garantirDadosBase(database) {
  console.log('🛡️ VERIFICANDO PROTEÇÃO DOS DADOS BASE...');

  // Garantir que Price, Faighus e C4 sempre existam
  const nomesBase = ["Price", "Faighus", "C4"];
  let dadosRecriados = false;

  nomesBase.forEach(nome => {
    const existe = database.originadores.find(o => o.nome_originador === nome);
    if (!existe) {
      const dadoBase = DADOS_BASE_PROTEGIDOS.originadores.find(o => o.nome_originador === nome);
      if (dadoBase) {
        console.log(`🔄 RECUPERANDO ${nome} - DADOS PROTEGIDOS`);
        database.originadores.push({ ...dadoBase });
        dadosRecriados = true;
      }
    }
  });

  // Garantir que Coruja sempre exista
  if (!database.investidores.find(i => i.nome_investidor === "Coruja")) {
    console.log('🔄 RECUPERANDO Coruja - DADOS PROTEGIDOS');
    database.investidores.push({ ...DADOS_BASE_PROTEGIDOS.investidores[0] });
    dadosRecriados = true;
  }

  if (dadosRecriados) {
    console.log('✅ DADOS BASE RECUPERADOS COM SUCESSO!');
    saveDatabase(database);
  }

  return database;
}

// Função para carregar dados do arquivo COM PROTEÇÃO TOTAL E UTF-8
function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, { encoding: 'utf8' });
      let parsedData = JSON.parse(data);

      console.log('📂 Dados existentes carregados:');
      console.log(`   👤 ${parsedData.users?.length || 0} usuários`);
      console.log(`   🏢 ${parsedData.originadores?.length || 0} originadores`);
      console.log(`   💰 ${parsedData.investidores?.length || 0} investidores`);

      // 🛡️ APLICAR PROTEÇÃO ABSOLUTA
      parsedData = garantirDadosBase(parsedData);

      return parsedData;
    } else {
      // Criar estrutura inicial APENAS se o arquivo não existir
      console.log('🆕 Criando estrutura inicial do banco de dados...');
      const initialData = {
        users: [
          {
            id: 1,
            email: "carolmullerbianco@gmail.com",
            name: "Carol Muller Bianco",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            email: "admin@amfi.finance",
            name: "Admin AmFi",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        originadores: [...DADOS_BASE_PROTEGIDOS.originadores],
        investidores: [...DADOS_BASE_PROTEGIDOS.investidores]
      };

      saveDatabase(initialData);
      return initialData;
    }
  } catch (error) {
    console.error('❌ ERRO CRÍTICO ao carregar banco de dados:', error);

    // Tentar recuperar de backup
    try {
      const backupDir = path.join(__dirname, '../data/backups');
      if (fs.existsSync(backupDir)) {
        const backupFiles = fs.readdirSync(backupDir)
          .filter(file => file.startsWith('database-backup-'))
          .sort()
          .reverse();

        if (backupFiles.length > 0) {
          console.log(`🔄 RECUPERANDO do backup: ${backupFiles[0]}`);
          const backupPath = path.join(backupDir, backupFiles[0]);
          const backupData = JSON.parse(fs.readFileSync(backupPath, { encoding: 'utf8' }));

          // Salvar dados recuperados
          fs.writeFileSync(DB_PATH, JSON.stringify(backupData, null, 2), 'utf8');

          console.log('✅ DADOS RECUPERADOS DO BACKUP!');
          return backupData;
        }
      }
    } catch (recoveryError) {
      console.error('❌ Falha na recuperação do backup:', recoveryError);
    }

    // Último recurso - estrutura vazia
    return {
      users: [
        {
          id: 1,
          email: "carolmullerbianco@gmail.com",
          name: "Carol Muller Bianco",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      originadores: [],
      investidores: []
    };
  }
}

// ==========================================
// SISTEMA DE BACKUP ROBUSTO - NUNCA MAIS PERCA DADOS!
// ==========================================

// Função para criar backup com timestamp
function createBackup(data) {
  try {
    const backupDir = path.join(__dirname, '../data/backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `database-backup-${timestamp}.json`);

    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
    console.log(`🛡️  BACKUP CRIADO: ${backupPath}`);

    // Manter apenas os últimos 10 backups
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('database-backup-'))
      .sort()
      .reverse();

    if (backupFiles.length > 10) {
      backupFiles.slice(10).forEach(file => {
        fs.unlinkSync(path.join(backupDir, file));
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error);
    return false;
  }
}

// Função para salvar dados no arquivo COM BACKUP AUTOMÁTICO
function saveDatabase(data) {
  try {
    // 1. SEMPRE criar backup antes de salvar
    createBackup(data);

    // 2. Criar diretório principal se não existir
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 3. Salvar dados principais com UTF-8 explícito
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), { encoding: 'utf8' });
    console.log(`💾 Dados salvos com sucesso! Originadores: ${data.originadores.length}, Investidores: ${data.investidores.length}`);

    return true;
  } catch (error) {
    console.error('❌ ERRO CRÍTICO ao salvar banco de dados:', error);

    // Tentar recuperar do backup mais recente
    try {
      const backupDir = path.join(__dirname, '../data/backups');
      if (fs.existsSync(backupDir)) {
        const backupFiles = fs.readdirSync(backupDir)
          .filter(file => file.startsWith('database-backup-'))
          .sort()
          .reverse();

        if (backupFiles.length > 0) {
          console.log(`🔄 Tentando recuperar do backup: ${backupFiles[0]}`);
          const backupData = JSON.parse(fs.readFileSync(path.join(backupDir, backupFiles[0]), 'utf8'));
          fs.writeFileSync(DB_PATH, JSON.stringify(backupData, null, 2), 'utf8');
          console.log('✅ Dados recuperados do backup!');
        }
      }
    } catch (recoveryError) {
      console.error('❌ Falha na recuperação do backup:', recoveryError);
    }

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

// ==========================================
// ROTAS DE ADMINISTRAÇÃO E BACKUP
// ==========================================

// Listar todos os backups disponíveis
app.get('/api/admin/backups', (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../data/backups');

    if (!fs.existsSync(backupDir)) {
      return res.json({
        message: 'Nenhum backup encontrado',
        backups: [],
        total: 0
      });
    }

    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('database-backup-'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        const data = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));

        return {
          filename: file,
          created: stats.birthtime,
          size: stats.size,
          originadores: data.originadores?.length || 0,
          investidores: data.investidores?.length || 0,
          users: data.users?.length || 0
        };
      })
      .sort((a, b) => b.created - a.created);

    res.json({
      message: 'Backups listados com sucesso',
      backups: backupFiles,
      total: backupFiles.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar backups',
      details: error.message
    });
  }
});

// Criar backup manual
app.post('/api/admin/backup', (req, res) => {
  try {
    const success = createBackup(database);

    if (success) {
      res.json({
        message: 'Backup manual criado com sucesso',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: 'Falha ao criar backup manual'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar backup',
      details: error.message
    });
  }
});

// Recuperar dados de um backup específico
app.post('/api/admin/restore/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const backupDir = path.join(__dirname, '../data/backups');
    const backupPath = path.join(backupDir, filename);

    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({
        error: 'Backup não encontrado'
      });
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, { encoding: 'utf8' }));

    // Criar backup do estado atual antes de restaurar
    createBackup(database);

    // Restaurar dados do backup
    database.users = backupData.users || [];
    database.originadores = backupData.originadores || [];
    database.investidores = backupData.investidores || [];

    // Salvar dados restaurados
    const success = saveDatabase(database);

    if (success) {
      res.json({
        message: 'Dados restaurados com sucesso',
        restored: {
          users: database.users.length,
          originadores: database.originadores.length,
          investidores: database.investidores.length
        }
      });
    } else {
      res.status(500).json({
        error: 'Falha ao salvar dados restaurados'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao restaurar backup',
      details: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AmFi Matching API - Sistema com Backup Automático',
    timestamp: new Date().toISOString(),
    environment: 'mock',
    database_status: {
      users: database.users?.length || 0,
      originadores: database.originadores?.length || 0,
      investidores: database.investidores?.length || 0
    }
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