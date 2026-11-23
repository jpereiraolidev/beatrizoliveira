// testartudo.js
import 'dotenv/config';

// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÃO
// ─────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:3000/api';
const API_KEY = process.env.API_KEY || 'teste';

// Cores para o terminal (Windows PowerShell aceita ANSI)
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
let totalTestes = 0;
let passou = 0;
let falhou = 0;

function titulo(nome) {
  console.log(`\n${c.cyan}${c.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`);
  console.log(`${c.cyan}${c.bold}  ${nome}${c.reset}`);
  console.log(`${c.cyan}${c.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`);
}

function assert(condicao, descricao, detalhe = '') {
  totalTestes++;
  if (condicao) {
    passou++;
    console.log(`${c.green}  ✅ ${descricao}${c.reset}`);
  } else {
    falhou++;
    console.log(`${c.red}  ❌ ${descricao}${c.reset}`);
    if (detalhe) console.log(`${c.dim}     → ${detalhe}${c.reset}`);
  }
}

async function request(method, path, { headers = {}, body } = {}) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);
    let data = null;
    const texto = await res.text();
    try { data = JSON.parse(texto); } catch { data = texto; }
    return { status: res.status, data, headers: res.headers };
  } catch (err) {
    return { status: 0, data: { erro: err.message }, headers: null };
  }
}

// ─────────────────────────────────────────────────────────────
// TESTES
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log(`${c.bold}🧪 TESTE COMPLETO DA API${c.reset}`);
  console.log(`${c.dim}URL: ${BASE_URL}${c.reset}`);
  console.log(`${c.dim}Chave lida do .env: ${API_KEY === 'teste' ? '"teste"' : '(custom)'}${c.reset}`);
  console.log(`${c.dim}Node: ${process.version}${c.reset}`);

  // ─── BLOCO 1: HEALTH CHECK ───
  titulo('1. HEALTH CHECK (/health)');
  {
    const r = await request('GET', '/../health');
    // /health fica na raiz, não em /api — vamos testar direto
  }
  {
    const res = await fetch('http://localhost:3000/health');
    const data = await res.json().catch(() => ({}));
    assert(res.status === 200, 'Status 200', `Recebido: ${res.status}`);
    assert(data.status === 'ok', 'Campo "status" = "ok"', JSON.stringify(data));
  }

  // ─── BLOCO 2: AUTENTICAÇÃO ───
  titulo('2. AUTENTICAÇÃO');

  // 2.1 Sem chave
  {
    const r = await request('GET', '/perguntas');
    assert(r.status === 401, 'GET /perguntas SEM chave → 401', `Recebido: ${r.status}`,);
    assert(r.data?.erro?.includes('não fornecida'), 'Mensagem "chave não fornecida"', JSON.stringify(r.data));
  }

  // 2.2 Chave errada
  {
    const r = await request('GET', '/perguntas', { headers: { 'x-api-key': 'chave_errada' } });
    assert(r.status === 403, 'GET /perguntas COM chave errada → 403', `Recebido: ${r.status}`);
    assert(r.data?.erro?.includes('inválida'), 'Mensagem "chave inválida"', JSON.stringify(r.data));
  }

  // 2.3 POST sem chave
  {
    const r = await request('POST', '/processar-formulario', { body: { respostasIds: ['x'] } });
    assert(r.status === 401, 'POST /processar-formulario SEM chave → 401', `Recebido: ${r.status}`);
  }

  // 2.4 Chave correta
  let chaveOk = false;
  {
    const r = await request('GET', '/perguntas', { headers: { 'x-api-key': API_KEY } });
    chaveOk = r.status === 200;
    assert(chaveOk, `GET /perguntas COM chave correta → 200`, `Recebido: ${r.status} — ${JSON.stringify(r.data).slice(0, 120)}`);
    if (!chaveOk && r.status === 500) {
      console.log(`${c.yellow}  ℹ️  Auth passou (500 = banco com problema). Veja o log do nodemon.${c.reset}`);
    }
  }

  // ─── BLOCO 3: CONTEÚDO DAS PERGUNTAS ───
  titulo('3. CONTEÚDO DAS PERGUNTAS');

  let perguntas = [];
  if (chaveOk) {
    const r = await request('GET', '/perguntas', { headers: { 'x-api-key': API_KEY } });
    perguntas = r.data?.perguntas || [];

    assert(Array.isArray(perguntas), 'Retorna array de perguntas', typeof perguntas);
    assert(perguntas.length > 0, `Tem pelo menos 1 pergunta (encontradas: ${perguntas.length})`);

    if (perguntas.length > 0) {
      const p1 = perguntas[0];
      assert(!!p1.id, 'Pergunta tem id', JSON.stringify(p1).slice(0, 100));
      assert(typeof p1.numero === 'number', 'Pergunta tem numero', String(p1.numero));
      assert(!!p1.texto, 'Pergunta tem texto', p1.texto?.slice(0, 60));
      assert(Array.isArray(p1.opcoes) && p1.opcoes.length > 0, `Pergunta 1 tem opções (${p1.opcoes?.length || 0})`);

      if (p1.opcoes?.length) {
        const o1 = p1.opcoes[0];
        assert(!!o1.id, 'Opção tem id', JSON.stringify(o1));
        assert(typeof o1.letra === 'string', 'Opção tem letra', String(o1.letra));
        assert(!!o1.texto, 'Opção tem texto', o1.texto?.slice(0, 60));
      }

      // Ordenação
      const numeros = perguntas.map(p => p.numero);
      const ordenado = [...numeros].sort((a, b) => a - b);
      assert(JSON.stringify(numeros) === JSON.stringify(ordenado), 'Perguntas vêm ordenadas por numero', `Recebido: ${numeros.slice(0, 5)}...`);
    }
  } else {
    console.log(`${c.yellow}  ⏭️  Pulando (auth/banco falhou no bloco anterior)${c.reset}`);
  }

  // ─── BLOCO 4: MÉTODOS NÃO PERMITIDOS ───
  titulo('4. MÉTODOS NÃO PERMITIDOS (405)');

  {
    const r = await request('DELETE', '/perguntas', { headers: { 'x-api-key': API_KEY } });
    assert(r.status === 405, 'DELETE /perguntas → 405', `Recebido: ${r.status}`);
  }
  {
    const r = await request('GET', '/processar-formulario', { headers: { 'x-api-key': API_KEY } });
    assert(r.status === 405, 'GET /processar-formulario → 405', `Recebido: ${r.status}`);
  }

  // ─── BLOCO 5: ROTA INEXISTENTE ───
  titulo('5. ROTA INEXISTENTE (404)');
  {
    const r = await request('GET', '/rota-que-nao-existe', { headers: { 'x-api-key': API_KEY } });
    assert(r.status === 404, 'GET /api/rota-inexistente → 404', `Recebido: ${r.status}`);
  }

  // ─── BLOCO 6: POST /processar-formulario ───
  titulo('6. POST /processar-formulario');

  if (chaveOk && perguntas.length > 0) {
    // 6.1 Sem respostasIds
    {
      const r = await request('POST', '/processar-formulario', {
        headers: { 'x-api-key': API_KEY },
        body: { nome: 'Teste', telefone: '11999999999' },
      });
      assert(r.status === 400, 'POST sem respostasIds → 400', `Recebido: ${r.status}`);
      assert(r.data?.erro?.includes('respostasIds'), 'Mensagem menciona respostasIds', JSON.stringify(r.data));
    }

    // 6.2 respostasIds vazio
    {
      const r = await request('POST', '/processar-formulario', {
        headers: { 'x-api-key': API_KEY },
        body: { respostasIds: [] },
      });
      assert(r.status === 400, 'POST com respostasIds: [] → 400', `Recebido: ${r.status}`);
    }

    // 6.3 Monta um payload com a primeira opção de cada pergunta
    const respostasIds = perguntas
      .map(p => p.opcoes?.[0]?.id)
      .filter(Boolean);

    if (respostasIds.length > 0) {
      console.log(`${c.dim}  📝 Enviando ${respostasIds.length} respostas (1ª opção de cada pergunta)...${c.reset}`);
      const r = await request('POST', '/processar-formulario', {
        headers: { 'x-api-key': API_KEY },
        body: {
          respostasIds,
          nome: 'Lead Teste',
          telefone: '11999999999',
        },
      });

      assert(r.status === 200, 'POST válido → 200', `Recebido: ${r.status} — ${JSON.stringify(r.data).slice(0, 200)}`);
      assert(r.data?.sucesso === true, 'Campo sucesso === true', JSON.stringify(r.data).slice(0, 200));
      assert(typeof r.data?.analise === 'string' && r.data.analise.length > 50, 'Retorna análise (string longa)', `Tamanho: ${r.data?.analise?.length || 0}`);
      assert(r.data?.analise?.startsWith('##'), 'Análise começa com "## " (markdown)', r.data?.analise?.slice(0, 60));

      if (r.data?.analise) {
        console.log(`${c.dim}  ─── Prévia da análise ───${c.reset}`);
        console.log(`${c.dim}  ${r.data.analise.slice(0, 300).replace(/\n/g, '\n  ')}...${c.reset}`);
      }
    } else {
      console.log(`${c.yellow}  ⏭️  Nenhuma opção disponível para montar payload${c.reset}`);
    }
  } else {
    console.log(`${c.yellow}  ⏭️  Pulando (sem perguntas carregadas)${c.reset}`);
  }

  // ─────────────────────────────────────────────────────────────
  // RESULTADO FINAL
  // ─────────────────────────────────────────────────────────────
  titulo('RESULTADO FINAL');
  const percentual = totalTestes ? Math.round((passou / totalTestes) * 100) : 0;
  const corFinal = falhou === 0 ? c.green : falhou <= 2 ? c.yellow : c.red;

  console.log(`${corFinal}${c.bold}  ${passou}/${totalTestes} testes passaram (${percentual}%)${c.reset}`);
  if (falhou > 0) {
    console.log(`${c.red}  ${falhou} falharam${c.reset}`);
  } else {
    console.log(`${c.green}  🎉 Tudo funcionando! Pode partir para o deploy.${c.reset}`);
  }
  console.log('');

  process.exit(falhou > 0 ? 1 : 0);
}

main().catch(err => {
  console.error(`${c.red}Erro fatal no testartudo:${c.reset}`, err);
  process.exit(1);
});