// teste.js
// ─────────────────────────────────────────────────────────────
// Testa as rotas do servidor e imprime o que é retornado
// Uso: node teste.js
// Requer: servidor rodando em http://localhost:3000
// ─────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:3000';

// ─────────────────────────────────────────────────────────────
// Helpers de log
// ─────────────────────────────────────────────────────────────
function titulo(txt) {
  console.log('\n' + '═'.repeat(60));
  console.log('  ' + txt);
  console.log('═'.repeat(60));
}

function subtitulo(txt) {
  console.log('\n── ' + txt + ' ' + '─'.repeat(Math.max(0, 55 - txt.length)));
}

function ok(txt) { console.log('  ✅ ' + txt); }
function erro(txt) { console.log('  ❌ ' + txt); }
function info(txt) { console.log('  ℹ️  ' + txt); }

// ─────────────────────────────────────────────────────────────
// 1. GET /api/perguntas
// ─────────────────────────────────────────────────────────────
async function testarGetPerguntas() {
  titulo('TESTE 1 — GET /api/perguntas');

  const res = await fetch(`${API_BASE}/api/perguntas`);
  info(`Status HTTP: ${res.status}`);

  if (!res.ok) {
    erro(`Falhou com status ${res.status}`);
    return null;
  }

  const perguntas = await res.json();
  ok(`Recebidas ${perguntas.length} perguntas`);

  if (!Array.isArray(perguntas) || perguntas.length === 0) {
    erro('Array vazio — rode o seed (npx prisma db seed)');
    return null;
  }

  // Mostra estrutura da primeira pergunta
  subtitulo('Estrutura da pergunta 1');
  console.log(JSON.stringify(perguntas[0], null, 2));

  // Resumo de todas
  subtitulo('Resumo das perguntas');
  perguntas.forEach(p => {
    const letras = p.alternativas.map(a => a.letra).sort().join('');
    console.log(
      `  Q${String(p.numero).padStart(2, '0')} [bloco ${p.bloco}] ` +
      `alternativas: ${letras} — ${p.enunciado.slice(0, 60)}...`
    );
  });

  // Valida que cada alternativa tem `scores`
  subtitulo('Validação de scores');
  let problemas = 0;
  perguntas.forEach(p => {
    p.alternativas.forEach(a => {
      if (!a.scores || typeof a.scores !== 'object') {
        erro(`Q${p.numero} letra ${a.letra} sem scores`);
        problemas++;
      }
    });
  });
  if (problemas === 0) ok('Todas as alternativas têm scores válidos');
  else erro(`${problemas} alternativas sem scores`);

  return perguntas;
}

// ─────────────────────────────────────────────────────────────
// 2. POST /api/diagnostico/enviar
// ─────────────────────────────────────────────────────────────
async function testarPostDiagnostico(nomeCenario, respostas) {
  titulo(`TESTE 2 — POST /api/diagnostico/enviar (${nomeCenario})`);

  subtitulo('Payload enviado (respostas)');
  console.log(JSON.stringify(respostas, null, 2));

  // Simula eventos de navegação
  const eventosNavegacao = Object.entries(respostas).map(([numero, letra]) => ({
    perguntaNumero: Number(numero),
    tempoGastoSegundos: Math.floor(Math.random() * 40) + 10,
    status: 'respondido'
  }));

  const payload = {
    email: `teste-${Date.now()}@exemplo.com`,
    segmento: 'teste-automatizado',
    tempoTotalSegundos: 300,
    respostas,
    respostaAberta: 'Este é um teste automatizado.',
    eventosNavegacao
  };

  const res = await fetch(`${API_BASE}/api/diagnostico/enviar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  info(`Status HTTP: ${res.status}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    erro(`Falhou: ${JSON.stringify(err)}`);
    return null;
  }

  const data = await res.json();
  ok(`Lead salvo com id: ${data.leadId}`);

  const r = data.resultado;
  subtitulo('Resultado da análise');
  console.log(`  Perfil:            ${r.perfil}`);
  console.log(`  Gargalo (Q13):     ${r.gargaloPrincipal}`);
  console.log(`  Top 2 eixos:       ${r.top2.join(' + ')}`);
  console.log(`  Eixos (scores):    ${JSON.stringify(r.eixos)}`);

  subtitulo('Textos narrativos');
  console.log(`  📌 Sugestão:\n     ${r.sugestao}`);
  console.log(`\n  📌 Atenção:\n     ${r.atencao}`);
  console.log(`\n  📌 Primeiro movimento:\n     ${r.primeiroMovimento}`);

  if (r.contradicao) {
    console.log(`\n  ⚠️  Contradição [${r.contradicao.tipo}]:`);
    console.log(`     ${r.contradicao.texto}`);
  } else {
    console.log(`\n  ✅ Nenhuma contradição detectada`);
  }

  console.log(`\n  ℹ️  Disclaimer:\n     ${r.disclaimer}`);

  return data;
}

// ─────────────────────────────────────────────────────────────
// 3. Cenários de teste
// ─────────────────────────────────────────────────────────────

// Cenário A: empreendedor travado por medo de exposição
// - Q6=A (vergonha), Q7=A (medo julgamento), Q10=C (quer reconhecimento)
// → deve disparar contradição "exposicao_vs_confianca"
const CENARIO_EXPOSICAO = {
  '1': 'A', '2': 'C', '3': 'A', '4': 'C', '5': 'B',
  '6': 'A', '7': 'A', '8': 'A', '9': 'B', '10': 'C',
  '11': 'A', '12': 'B', '13': 'C'
};

// Cenário B: empreendedor com foco financeiro
// - Q5=A (mistura dinheiro), Q10=A (quer tranquilidade), Q13=B (organizar finanças)
// → deve disparar contradição "financeiro_vs_desejo"
const CENARIO_FINANCEIRO = {
  '1': 'B', '2': 'B', '3': 'B', '4': 'B', '5': 'A',
  '6': 'C', '7': 'D', '8': 'C', '9': 'C', '10': 'A',
  '11': 'B', '12': 'C', '13': 'B'
};

// Cenário C: empreendedor com dificuldade de execução
// - Q4=A (deixa para depois), Q11=C (precisa constância), Q13=D (criar rotina)
// → deve disparar contradição "execucao_vs_desejo"
const CENARIO_EXECUCAO = {
  '1': 'C', '2': 'D', '3': 'B', '4': 'A', '5': 'C',
  '6': 'B', '7': 'B', '8': 'B', '9': 'A', '10': 'B',
  '11': 'C', '12': 'A', '13': 'D'
};

// ─────────────────────────────────────────────────────────────
// Runner principal
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🧪 Testando servidor em ' + API_BASE);

  // 1. GET perguntas
  const perguntas = await testarGetPerguntas();
  if (!perguntas) {
    console.log('\n⚠️  Abortando: perguntas não carregadas.');
    process.exit(1);
  }

  // 2. POST — três cenários
  const resultados = [];
  for (const [nome, respostas] of [
    ['Cenário A — Exposição / Confiança', CENARIO_EXPOSICAO],
    ['Cenário B — Financeiro',            CENARIO_FINANCEIRO],
    ['Cenário C — Execução',              CENARIO_EXECUCAO]
  ]) {
    const r = await testarPostDiagnostico(nome, respostas);
    if (r) resultados.push({ nome, r });
    // pequeno delay entre requests
    await new Promise(r => setTimeout(r, 300));
  }

  // 3. Resumo comparativo
  titulo('RESUMO COMPARATIVO');
  resultados.forEach(({ nome, r }) => {
    console.log(`\n  ${nome}`);
    console.log(`    Perfil:       ${r.resultado.perfil}`);
    console.log(`    Gargalo:      ${r.resultado.gargaloPrincipal}`);
    console.log(`    Contradição:  ${r.resultado.contradicao ? r.resultado.contradicao.tipo : '—'}`);
  });

  // 4. Validação
  titulo('VALIDAÇÃO');
  let falhas = 0;

  resultados.forEach(({ nome, r }) => {
    if (!r.resultado.perfil) { erro(`${nome}: perfil vazio`); falhas++; }
    if (!r.resultado.gargaloPrincipal) { erro(`${nome}: gargalo vazio`); falhas++; }
    if (!r.resultado.sugestao) { erro(`${nome}: sugestão vazia`); falhas++; }
    if (!r.resultado.primeiroMovimento) { erro(`${nome}: movimento vazio`); falhas++; }
  });

  const cenariosComContradicao = resultados.filter(x => x.r.resultado.contradicao).length;
  info(`Cenários com contradição detectada: ${cenariosComContradicao}/${resultados.length}`);

  if (falhas === 0) {
    ok('Todos os cenários retornaram resultado completo');
    console.log('\n✨ Tudo passou.\n');
  } else {
    erro(`${falhas} falha(s) encontrada(s)`);
    console.log('');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌ Erro no teste:', err);
  process.exit(1);
});