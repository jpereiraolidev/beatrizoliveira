// src/routes.js
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { processar } from './processar.js';
import prisma from './prisma.js';

const router = Router();

// ─────────────────────────────────────────────────────────────
// RATE LIMIT — proteção contra abuso (spam de requisições)
// ─────────────────────────────────────────────────────────────
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30,                   // 30 requisições por IP por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    sucesso: false,
    erro: 'Muitas requisições. Aguarde alguns minutos e tente novamente.',
  },
});

// Aplica rate limit a TODAS as rotas deste router
router.use(limitador);

// ─────────────────────────────────────────────────────────────
// GET /perguntas — lista todas as perguntas com opções
// ─────────────────────────────────────────────────────────────
router.get('/perguntas', async (req, res) => {
  try {
    const perguntas = await prisma.pergunta.findMany({
      orderBy: { numero: 'asc' },
      include: {
        opcoes: {
          select: { id: true, letra: true, texto: true },
          orderBy: { letra: 'asc' },
        },
      },
    });
    return res.json({ sucesso: true, perguntas });
  } catch (error) {
    console.error('❌ Erro ao buscar perguntas:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao carregar perguntas.',
    });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /processar-formulario
// ─────────────────────────────────────────────────────────────
router.post('/processar-formulario', processar);

// ─────────────────────────────────────────────────────────────
// 405 para métodos não permitidos
// ─────────────────────────────────────────────────────────────
router.all('/processar-formulario', (req, res) => {
  return res.status(405).json({
    sucesso: false,
    erro: `Método ${req.method} não permitido. Use POST.`,
  });
});

router.all('/perguntas', (req, res) => {
  return res.status(405).json({
    sucesso: false,
    erro: `Método ${req.method} não permitido. Use GET.`,
  });
});

export default router;