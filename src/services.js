// src/services.js
import prisma from './prisma.js';
import {
  ARQUETIPOS,
  DORES,
  BARREIRAS,
  MOTIVACOES,
  VISAO_FUTURO,
  CONTRADICOES,
  PLANO_ACAO
} from './cerebro.js';

// ─────────────────────────────────────────────────────────────
// 1. PESOS E EXTRAÇÃO DE DADOS
// ─────────────────────────────────────────────────────────────
export async function calcularPesosUsuario(respostasIds) {
  // Busca as opções marcadas, incluindo os dados da pergunta para saber o número
  const opcoes = await prisma.opcao.findMany({
    where: { id: { in: respostasIds } },
    include: { pergunta: true },
  });

  if (opcoes.length === 0) return null;

  // Soma os pontos de cada eixo
  const pesos = opcoes.reduce((acc, opcao) => {
    for (const [eixo, valor] of Object.entries(opcao.scores || {})) {
      acc[eixo] = (acc[eixo] || 0) + valor;
    }
    return acc;
  }, {});

  // Mapeia as respostas: { '1': 'A', '2': 'B', ... '13': 'D' }
  const respostasMap = {};
  opcoes.forEach(o => {
    respostasMap[o.pergunta.numero] = o.letra;
  });

  return { pesos, respostasMap };
}

// ─────────────────────────────────────────────────────────────
// 2. CLASSIFICAÇÃO (Encontrar o Arquétipo)
// ─────────────────────────────────────────────────────────────
function obterArquetipo(pesosUsuario) {
  let melhorArquetipo = ARQUETIPOS[0];
  let menorDiferenca = Infinity;

  for (const arquetipo of ARQUETIPOS) {
    let diferencaTotal = 0;
    
    // Compara os 5 eixos. Se o arquétipo não tem o eixo, assume 0.
    for (const eixo of ['EXEC', 'FIN', 'CLAREZA', 'CONF', 'EXPO']) {
      const pesoUser = pesosUsuario[eixo] || 0;
      const pesoBase = arquetipo.pesos[eixo] || 0;
      diferencaTotal += Math.abs(pesoUser - pesoBase);
    }

    // O arquétipo com a MENOR diferença total vence
    if (diferencaTotal < menorDiferenca) {
      menorDiferenca = diferencaTotal;
      melhorArquetipo = arquetipo;
    }
  }

  return melhorArquetipo;
}

// ─────────────────────────────────────────────────────────────
// 3. MONTAGEM DA ANÁLISE CRUZADA
// ─────────────────────────────────────────────────────────────
function montarAnalise(arquetipo, respostas) {
  // Pega as respostas específicas (com fallback de segurança para 'A' ou 'D')
  const q2 = respostas['2'] || 'D';
  const q5 = respostas['5'] || 'A';
  const q7 = respostas['7'] || 'A';
  const q8 = respostas['8'] || 'A';
  const q10 = respostas['10'] || 'A';
  const q11 = respostas['11'] || 'A';
  const q13 = respostas['13'] || 'D';

  // Inicia com o Título e a Descrição do Arquétipo
  let analise = `## ${arquetipo.nome}\n*${arquetipo.descricao}*\n\n`;
  
  // Corpo do Diagnóstico
  analise += `${DORES[q2]}\n\n`;
  analise += `${BARREIRAS[q7]}\n\n`;
  analise += `${VISAO_FUTURO[q11]}\n\n`;
  analise += `${MOTIVACOES[q10]}\n\n`;

  // Busca contradições (cruzamentos de respostas que se chocam)
  const chaves = [
    `Q7${q7}_Q10${q10}`,
    `Q7${q7}_Q2${q2}`,
    `Q5${q5}_Q13${q13}`,
    `Q7${q7}_Q8${q8}`
  ];

  let contradicaoEncontrada = null;
  for (const chave of chaves) {
    if (CONTRADICOES[chave]) {
      contradicaoEncontrada = CONTRADICOES[chave];
      break; // Se achar uma, já usa e para de procurar
    }
  }

  if (contradicaoEncontrada) {
    analise += `${contradicaoEncontrada}\n\n`;
  }

  // Plano de Ação
  analise += `${PLANO_ACAO[q13]}\n\n`;

  // Fechamento
  analise += `---\n*Esta devolutiva é construída como um espelho para as suas respostas. Não é uma avaliação psicológica nem substitui uma consultoria aprofundada — mas serve como um norte claro para a sua próxima decisão.*`;

  return analise;
}

// ─────────────────────────────────────────────────────────────
// 4. DECISÃO (Reutilizar Perfil ou Montar Novo)
// ─────────────────────────────────────────────────────────────
export async function obterOuCriarPerfil(pesosUsuario, respostas) {
  // Encontra o arquétipo baseado no cérebro
  const arquetipoSelecionado = obterArquetipo(pesosUsuario);
  console.log(`✅ Arquétipo classificado: ${arquetipoSelecionado.nome}`);

  // Tenta achar esse arquétipo no banco de dados
  let perfilDB = await prisma.perfil.findFirst({
    where: { nome: arquetipoSelecionado.nome }
  });

  // Se não existir no banco (primeiro acesso), cria o registro do arquétipo
  if (!perfilDB) {
    console.log(`🆕 Registrando arquétipo no banco: ${arquetipoSelecionado.nome}`);
    perfilDB = await prisma.perfil.create({
      data: {
        nome: arquetipoSelecionado.nome,
        descricao: arquetipoSelecionado.descricao,
        pesosReferencia: arquetipoSelecionado.pesos,
      }
    });
  }

  // Monta o texto personalizado (varia de acordo com as respostas da pessoa)
  const analiseFinal = montarAnalise(arquetipoSelecionado, respostas);

  return { 
    perfil: perfilDB, 
    analise: analiseFinal, 
    reutilizado: true 
  };
}

// ─────────────────────────────────────────────────────────────
// 5. LEAD
// ─────────────────────────────────────────────────────────────
export async function registrarLead({ nome, telefone, perfilId }) {
  return prisma.lead.create({
    data: { 
      nome: nome || null, 
      telefone: telefone || null, 
      perfilId 
    }
  });
}