// testatudo.js (Atualizado para Vercel)
import 'dotenv/config';

// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÃO
// ─────────────────────────────────────────────────────────────
const BASE_URL = 'https://beatrizoliveira-sigma.vercel.app/api';
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

async function main() {
  console.log(`${c.bold}🧪 TESTE COMPLETO DA API (VERCEL)${c.reset}`);
  console.log(`${c.dim}URL: ${BASE_URL}${c.reset}`);
  console.log(`${c.dim}Chave lida do .env: ${API_KEY === 'teste' ? '"teste"' : '(custom)'}${c.reset}`);
  console.log(`${c.dim}Node: ${process.version}${c.reset}`);

  const rootUrl = BASE_URL.replace('/api', '');

  // ─── BLOCO 1: HEALTH CHECK ───
  titulo('1. HEALTH CHECK (/health)');
  try {
    const res = await fetch(`${rootUrl}/health`);
    const data = await res.json().catch(() => ({}));
    assert(res.status === 200, 'Status 200', `Recebido: ${res.status}`);
    assert(data.status === 'ok', 'Campo "status" = "ok"', JSON.stringify(data));
  } catch (err) {
    assert(false, 'Health check acessível', err.message);
  }

  // ─── BLOCO 2: AUTENTICAÇÃO ───
  titulo('2. AUTENTICAÇÃO');

  {
    const r = await request('GET', '/perguntas');
    assert(r.status === 401, 'GET /perguntas SEM chave → 401', `Recebido: ${r.status}`);
  }

  {
    const r = await request('GET', '/perguntas', { headers: { 'x-api-key': 'chave_errada' } });
    assert(r.status === 403, 'GET /perguntas COM chave errada → 403', `Recebido: ${r.status}`);
  }

  let chaveOk = false;
  {
    const r = await request('GET', '/perguntas', { headers: { 'x-api-key': API_KEY } });
    chaveOk = r.status === 200;
    assert(chaveOk, `GET /perguntas COM chave correta → 200`, `Recebido: ${r.status} — ${JSON.stringify(r.data).slice(0, 120)}`);
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
    }
  } else {
    console.log(`${c.yellow}  ⏭️  Pulando (auth falhou)${c.reset}`);
  }

  // ─── BLOCO 4: MÉTODOS NÃO PERMITIDOS ───
  titulo('4. MÉTODOS NÃO PERMITIDOS (405)');
  {
    const r = await request('DELETE', '/perguntas', { headers: { 'x-api-key': API_KEY } });
    assert(r.status === 405, 'DELETE /perguntas → 405', `Recebido: ${r.status}`);
  }

  // ─── BLOCO 5: ROTA INEXISTENTE ───
  titulo('5. ROTA INEXISTENTE (404)');
  {
    const r = await request('GET', '/rota-que-nao-existe', { headers: { 'x-api-key': API_KEY } });
    assert(r.status === 404, 'GET /api/rota-inexistente → 404', `Recebido: ${r.status}`);
  }

  // ─── RESULTADO FINAL ───
  titulo('RESULTADO FINAL');
  const percentual = totalTestes ? Math.round((passou / totalTestes) * 100) : 0;
  const corFinal = falhou === 0 ? c.green : falhou <= 2 ? c.yellow : c.red;

  console.log(`${corFinal}${c.bold}  ${passou}/${totalTestes} testes passaram (${percentual}%)${c.reset}`);
  if (falhou > 0) {
    console.log(`${c.red}  ${falhou} falharam${c.reset}`);
  } else {
    console.log(`${c.green}  🎉 Tudo funcionando na Vercel!${c.reset}`);
  }
  console.log('');

  process.exit(falhou > 0 ? 1 : 0);
}

main().catch(err => {
  console.error(`${c.red}Erro fatal no testartudo:${c.reset}`, err);
  process.exit(1);
});