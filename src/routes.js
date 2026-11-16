// src/routes.js
import { Router } from 'express';
import { processar } from './processar.js';
import prisma from './prisma.js';

const router = Router();

// ─────────────────────────────────────────────────────────────
// GET /api/perguntas — lista todas as perguntas com opções
// (não expõe `scores`, só id, letra e texto)
// ─────────────────────────────────────────────────────────────
router.get('/api/perguntas', async (req, res) => {
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
// POST /api/processar-formulario — processa as respostas
// ─────────────────────────────────────────────────────────────
router.post('/api/processar-formulario', processar);

// ─────────────────────────────────────────────────────────────
// Qualquer outro método na rota de processamento → 405
// ─────────────────────────────────────────────────────────────
router.all('/api/processar-formulario', (req, res) => {
  return res.status(405).json({
    sucesso: false,
    erro: `Método ${req.method} não permitido. Use POST.`,
  });
});

// ─────────────────────────────────────────────────────────────
// Qualquer outro método na rota de perguntas → 405
// ─────────────────────────────────────────────────────────────
router.all('/api/perguntas', (req, res) => {
  return res.status(405).json({
    sucesso: false,
    erro: `Método ${req.method} não permitido. Use GET.`,
  });
});

export default router;