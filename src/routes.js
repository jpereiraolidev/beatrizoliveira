// src/routes.js
import { Router } from 'express';
import { processar } from './processar.js';
import prisma from './prisma.js';
const express = require('express');
const cors = require('cors'); // 1. Importe o pacote cors

const app = express();

// 2. Configure o CORS ANTES das rotas
// Para desenvolvimento, você pode permitir tudo:
app.use(cors()); 

// OU, para maior segurança, permita apenas origens específicas:
// app.use(cors({
//   origin: ['http://127.0.0.1:5500', 'https://seu-frontend.vercel.app'] 
// }));

// ... suas outras configurações (bodyParser, etc.)

// 3. Suas rotas vêm DEPOIS do CORS
app.use('/', require('./src/routes')); // Exemplo de como você importa suas rotas

const router = Router();

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