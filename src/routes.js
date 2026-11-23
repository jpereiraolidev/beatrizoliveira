// src/routes.js
import { Router } from 'express';
import { processar } from './processar.js';
import prisma from './prisma.js';
import { autenticarApiKey } from './auth.js'; // Importa o middleware

const router = Router();

// Aplica o middleware de autenticação a TODAS as rotas deste router
router.use(autenticarApiKey); 

// GET /perguntas — lista todas as perguntas com opções
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

// POST /processar-formulario
router.post('/processar-formulario', processar);

// 405 para métodos não permitidos
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