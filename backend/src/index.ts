import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import originadorRoutes from './routes/originadores';
import investidorRoutes from './routes/investidores';
import matchRoutes from './routes/matches';
import auditRoutes from './routes/audit';
import uploadRoutes from './routes/upload';
import exportRoutes from './routes/export';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "blob:"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://amfi-matching.vercel.app', 'https://amfi-matching.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/originadores', originadorRoutes);
app.use('/api/investidores', investidorRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/export', exportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'AmFi Matching API - Sistema de Matching para Originadores e Investidores',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      originadores: '/api/originadores',
      investidores: '/api/investidores', 
      matches: '/api/matches',
      audit: '/api/audit',
      upload: '/api/upload',
      export: '/api/export'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Arquivo muito grande. Limite: 10MB' });
  }
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    message: `${req.method} ${req.originalUrl} não existe`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor AmFi Matching rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API disponível em: http://localhost:${PORT}/api`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;