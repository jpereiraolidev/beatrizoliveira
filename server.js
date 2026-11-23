// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './src/routes.js';
import prisma from './src/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ─────────────────────────────────────────────────────────────
// 1. CONFIGURAÇÃO DE PROXY (essencial em Vercel, Render, Railway)
// ─────────────────────────────────────────────────────────────
// Garante que req.ip, req.protocol e req.hostname reflitam o cliente real
// quando estiver atrás de load balancers / proxies.
app.set('trust proxy', 1);

app.use(cors({
  origin: [
    'https://mapadaclarezabiaoli.vercel.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
  credentials: true,
}));

// Garante resposta imediata para requisições OPTIONS (Preflight do CORS)
app.options('*', cors());

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// ─────────────────────────────────────────────────────────────
// 3. HEALTH CHECK (útil para Render, Railway, UptimeRobot etc.)
// ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────
// 4. ARQUIVOS ESTÁTICOS (funciona local; em Vercel, é servido direto)
// ─────────────────────────────────────────────────────────────
app.use(express.static(join(__dirname, 'public'), {
  maxAge: '1h', // cache leve para assets
  etag: true,
}));

// ─────────────────────────────────────────────────────────────
// 5. ROTAS DA API
// ─────────────────────────────────────────────────────────────
app.use('/api', routes); // prefixo /api aplicado UMA vez aqui

// ─────────────────────────────────────────────────────────────
// 6. FALLBACK SPA (compatível com Express 4 e 5)
// ─────────────────────────────────────────────────────────────
// Não usa regex (que muda comportamento entre versões do Express).
// Serve index.html apenas para GET que não sejam de /api nem /health.
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  if (req.path === '/health') return next();
  if (req.path.includes('.')) return next(); // deixa passar arquivos (ex: .js, .css)

  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// ─────────────────────────────────────────────────────────────
// 7. 404 PARA ROTAS /api NÃO ENCONTRADAS
// ─────────────────────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({
    sucesso: false,
    erro: `Rota de API não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// ─────────────────────────────────────────────────────────────
// 8. HANDLER GLOBAL DE ERROS
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Erro global não tratado:', err);

  // Erros de JSON malformado no body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      sucesso: false,
      erro: 'JSON inválido no corpo da requisição.',
    });
  }

  res.status(err.status || 500).json({
    sucesso: false,
    erro: process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor.'
      : err.message,
  });
});

// ─────────────────────────────────────────────────────────────
// 9. GRACEFUL SHUTDOWN (apenas em ambiente local/container)
// ─────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  const shutdown = async (signal) => {
    console.log(`\n🛑 Recebido ${signal}. Encerrando...`);
    try {
      await prisma.$disconnect();
      console.log('✅ Prisma desconectado.');
    } catch (e) {
      console.error('Erro ao desconectar Prisma:', e);
    }
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // ─────────────────────────────────────────────────────────────
  // 10. START LOCAL
  // ─────────────────────────────────────────────────────────────
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
}

// ─────────────────────────────────────────────────────────────
// 11. EXPORT PARA VERCEL (Serverless)
// ─────────────────────────────────────────────────────────────
export default app;