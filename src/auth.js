// src/auth.js
export function autenticarApiKey(req, res, next) {
  const chaveEnviada = req.headers['x-api-key'];
  const chaveValida = process.env.API_KEY;

  // Se a chave não foi configurada no servidor, bloqueia por segurança
  if (!chaveValida) {
    console.error('❌ ERRO CRÍTICO: API_KEY não configurada no .env');
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro de configuração no servidor.',
    });
  }

  // Verifica se o cliente enviou a chave
  if (!chaveEnviada) {
    return res.status(401).json({
      sucesso: false,
      erro: 'Acesso negado. Chave de API não fornecida.',
    });
  }

  // Compara a chave enviada com a chave do servidor
  if (chaveEnviada !== chaveValida) {
    return res.status(403).json({
      sucesso: false,
      erro: 'Acesso negado. Chave de API inválida.',
    });
  }

  // Se passou, continua para a rota
  next();
}