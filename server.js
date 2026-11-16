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

// ─── Middlewares globais ───
app.use(cors());
app.use(express.json());

// ─── Arquivos estáticos (front-end) ───
app.use(express.static(join(__dirname, 'public')));

// ─── Rotas da API ───
app.use(routes);

// ─── Fallback: qualquer GET que não seja /api/* devolve o index.html ───
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// ─── Handler global de erros ───
app.use((err, req, res, next) => {
  console.error('❌ Erro global não tratado:', err);
  res.status(500).json({
    sucesso: false,
    erro: 'Erro interno do servidor.',
  });
});

// ─── Graceful shutdown (apenas local) ───
if (!process.env.VERCEL) {
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  // ─── Start local ───
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}

// ─── Exporta para a Vercel (Serverless) ───
export default app;