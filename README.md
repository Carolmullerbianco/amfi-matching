# AmFi Matching System

Sistema de Matching para conectar Originadores e Investidores da AmFi Finance.

## 🌟 Características Principais

- **Autenticação Segura**: JWT + bcrypt com restrição de email (@amfi.finance)
- **Matching Inteligente**: Lógica específica de negócio para conectar originadores e investidores
- **Upload de Arquivos**: Suporte para documentos de elegibilidade (PDF, JPG, PNG)
- **Exportação**: Relatórios em Excel e PDF
- **Auditoria Completa**: Histórico de todas as alterações
- **Interface Responsiva**: Design moderno com Tailwind CSS
- **Formatação Brasileira**: Moeda, percentuais e datas no padrão brasileiro

## 🛠 Stack Tecnológica

### Backend
- **Node.js** + **Express.js** + **TypeScript**
- **PostgreSQL** para banco de dados
- **JWT** + **bcrypt** para autenticação
- **Multer** para upload de arquivos
- **ExcelJS** para exportação Excel
- **jsPDF** para exportação PDF
- **Nodemailer** para envio de emails

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** para estilização
- **React Router Dom** para roteamento
- **React Hook Form** para formulários
- **Axios** para requisições HTTP
- **React Hot Toast** para notificações
- **Lucide React** para ícones

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd amfi-matching
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

#### Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/amfi_matching
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amfi_matching
DB_USER=username
DB_PASSWORD=password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@amfi.finance
EMAIL_PASSWORD=your_app_password
```

#### Configurar Banco de Dados

1. Crie o banco de dados PostgreSQL:

```sql
CREATE DATABASE amfi_matching;
```

2. Execute as migrações:

```bash
npm run migration:run
```

3. Popule o banco com dados de exemplo:

```bash
npm run seed
```

#### Iniciar o Backend

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

O backend estará disponível em: `http://localhost:3001`

### 3. Configuração do Frontend

```bash
cd frontend
npm install
```

#### Configurar Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` na pasta frontend se necessário:

```env
VITE_API_URL=http://localhost:3001/api
```

#### Iniciar o Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
```

O frontend estará disponível em: `http://localhost:3000`

## 👥 Usuários de Teste

Após executar o seed, você pode fazer login com:

- **Email**: `carolmullerbianco@gmail.com`
- **Email**: `admin@amfi.finance`
- **Email**: `analista@amfi.finance`
- **Senha**: `123456` (para todos os usuários)

## 🔐 Autenticação

O sistema permite acesso apenas para:
- Emails que terminam com `@amfi.finance`
- Email específico: `carolmullerbianco@gmail.com`

## 📊 Módulos do Sistema

### 1. **Originadores**
Campos:
- nome_originador
- volume_aprovado (R$)
- taxa_cdi_plus (%)
- taxa_pre_fixada (%)
- prazo (meses)
- concentracao_cedente (%)
- concentracao_sacado (%)
- taxa_subordinacao (%)
- tipo_ativo (enum)
- arquivo_elegibilidade (upload)
- volume_serie_senior (calculado automaticamente)

### 2. **Investidores**
Campos:
- nome_investidor
- tipo_ativo (enum)
- volume_minimo (R$)
- taxa_minima_cdi_plus (%)
- taxa_minima_pre_fixada (%)
- observacoes

### 3. **Lógica de Matching**

Um match é válido quando:
1. `originador.volume_serie_senior >= investidor.volume_minimo`
2. `originador.tipo_ativo === investidor.tipo_ativo`
3. **PELO MENOS UMA** das condições de taxa é verdadeira:
   - `originador.taxa_cdi_plus >= investidor.taxa_minima_cdi_plus` OU
   - `originador.taxa_pre_fixada >= investidor.taxa_minima_pre_fixada`

## 🎨 Design System

### Cores AmFi
- **Primária**: #8B5CF6 (roxo)
- **Secundária**: #EC4899 (rosa)
- **Gradientes**: roxo-rosa nos botões principais

### Formatação
- **Moeda**: R$ 1.000.000,00
- **Percentual**: 12,50%
- **Datas**: dd/mm/aaaa
- **Prazo**: X meses

## 📡 APIs Disponíveis

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Dados do usuário

### Originadores
- `GET /api/originadores` - Listar
- `POST /api/originadores` - Criar
- `GET /api/originadores/:id` - Buscar por ID
- `PUT /api/originadores/:id` - Atualizar
- `DELETE /api/originadores/:id` - Excluir

### Investidores
- `GET /api/investidores` - Listar
- `POST /api/investidores` - Criar
- `GET /api/investidores/:id` - Buscar por ID
- `PUT /api/investidores/:id` - Atualizar
- `DELETE /api/investidores/:id` - Excluir

### Matches
- `GET /api/matches` - Listar matches com filtros
- `GET /api/matches/stats` - Estatísticas

### Upload
- `POST /api/upload` - Upload de arquivo
- `GET /api/upload/:filename` - Download de arquivo
- `DELETE /api/upload/:filename` - Excluir arquivo

### Exportação
- `GET /api/export/matches/excel` - Exportar matches para Excel
- `GET /api/export/matches/pdf` - Exportar matches para PDF

### Auditoria
- `GET /api/audit` - Histórico de alterações
- `GET /api/audit/:table_name/:record_id` - Histórico de registro específico

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm start            # Iniciar produção
npm run migration:run # Executar migrações
npm run seed         # Popular banco com dados de teste
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

## 📁 Estrutura de Pastas

```
amfi-matching/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── database/       # Configuração e migrations
│   │   └── utils/          # Utilitários
│   ├── uploads/           # Arquivos enviados
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços de API
│   │   ├── types/         # Definições TypeScript
│   │   └── utils/         # Utilitários
│   └── package.json
└── README.md
```

## 🚨 Funcionalidades NÃO Implementadas

- Estatísticas no dashboard (conforme especificado)
- Gráficos ou charts
- Sistema de roles/permissões diferentes
- Integração com APIs externas
- Chat ou mensagens

## 🐛 Troubleshooting

### Erro de Conexão com Banco
1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Certifique-se de que o banco `amfi_matching` existe

### Erro de Upload de Arquivos
1. Verifique se a pasta `backend/uploads` existe
2. Confirme as permissões de escrita
3. Verifique o tamanho do arquivo (limite: 10MB)

### Erro de CORS
1. Verifique se o frontend está rodando na porta 3000
2. Confirme a configuração de CORS no backend

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento da AmFi Finance.

---

**AmFi Matching System** - Conectando Originadores e Investidores 🚀