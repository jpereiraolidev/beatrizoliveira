// src/processar.js
import {
  calcularPesosUsuario,
  obterOuCriarPerfil,
  registrarLead,
} from './services.js';

export async function processar(req, res) {
  try {
    // ─── 1. VALIDAÇÃO E SEGURANÇA NA ENTRADA ───
    const { respostasIds, nome, telefone } = req.body;

    if (!Array.isArray(respostasIds) || respostasIds.length === 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'O campo "respostasIds" é obrigatório e não pode estar vazio.',
      });
    }

    // ─── 2. LÓGICA DE PESOS E MAPEAMENTO DAS RESPOSTAS ───
    // Retorna { pesos: { CLAREZA: 15, EXEC: 10, ... }, respostasMap: { '1': 'A', '2': 'B', ... } }
    const dados = await calcularPesosUsuario(respostasIds);

    if (!dados) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nenhuma opção válida encontrada para os IDs fornecidos.',
      });
    }

    // ─── 3. DECISÃO DO ARQUÉTIPO E MONTAGEM DO TEXTO ───
    // O services.js vai usar os pesos para achar o arquétipo no cerebro.js
    // e as respostasMap para montar os blocos de texto personalizados
    const { perfil, analise, reutilizado } = await obterOuCriarPerfil(
      dados.pesos,
      dados.respostasMap
    );

    // ─── 4. REGISTRO DO LEAD ───
    // Salva o lead no banco, vinculado ao arquétipo encontrado
    await registrarLead({
      nome,
      telefone,
      perfilId: perfil.id,
    });

    // ─── 5. RESPOSTA FINAL AO FRONT-END ───
    return res.status(200).json({
      sucesso: true,
      analise,
      reutilizado,
    });

  } catch (error) {
    // ─── 6. TRATAMENTO DE ERROS (RESILIÊNCIA) ───
    console.error('❌ Erro no processamento do formulário:', error);

    return res.status(500).json({
      sucesso: false,
      erro: 'Ocorreu um erro interno ao processar o formulário. Tente novamente mais tarde.',
    });
  }
}