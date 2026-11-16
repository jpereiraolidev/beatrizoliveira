// src/cerebro.js

// ─────────────────────────────────────────────────────────────
// ARQUÉTIPOS (12 perfis baseados nos 5 eixos)
// ─────────────────────────────────────────────────────────────
export const ARQUETIPOS = [
  {
    nome: 'A Executora Invisível',
    descricao: 'Você faz acontecer. Tem energia e constância, mas a sua marca não é vista na mesma proporção do seu esforço.',
    forca: 'Execução impecável e foco em resultados.',
    pontoCego: 'Achar que o trabalho duro fala por si só.',
    bloqueio: 'Medo de se expor ou de ser julgada.',
    comportamento: 'Foca na operação, evita o palco, acredita que a qualidade do produto basta.',
    transformacao: 'Quando aprende a comunicar, o negócio decola com a força que já tem.',
    pesos: { EXEC: 15, FIN: 10, CLAREZA: 10, CONF: 10, EXPO: 5 }
  },
  {
    nome: 'A Visionária em Construção',
    descricao: 'Sua mente é um farol. Você tem clareza sobre para onde ir, mas o barco ainda não está pronto para a viagem.',
    forca: 'Visão estratégica e clareza de propósito.',
    pontoCego: 'Achar que planejar é o mesmo que executar.',
    bloqueio: 'Falta de constância e execução.',
    comportamento: 'Passa muito tempo planejando, mas executa pouco.',
    transformacao: 'Quando a visão encontra a disciplina, o negócio cresce de forma estruturada.',
    pesos: { CLAREZA: 15, EXPO: 10, FIN: 10, EXEC: 5, CONF: 10 }
  },
  {
    nome: 'A Estrategista Financeira',
    descricao: 'Você tem controle e organização que a maioria sonha em ter. O dinheiro é gerenciado, mas a marca é um segredo.',
    forca: 'Controle financeiro e previsibilidade.',
    pontoCego: 'Achar que a organização é o suficiente para atrair clientes.',
    bloqueio: 'Medo de aparecer e mostrar o negócio.',
    comportamento: 'Prefere trabalhar nos bastidores, garantindo que os números estejam sempre no azul.',
    transformacao: 'Quando alinha a gestão impecável com uma comunicação forte, se torna uma referência.',
    pesos: { FIN: 15, CLAREZA: 12, EXEC: 10, CONF: 10, EXPO: 5 }
  },
  {
    nome: 'A Comunicadora Nata',
    descricao: 'Você sabe se posicionar e chamar a atenção. Sua voz tem força, mas a base do negócio ainda precisa de pilares.',
    forca: 'Exposição e capacidade de atrair clientes.',
    pontoCego: 'Achar que carisma é o bastante para administrar um negócio.',
    bloqueio: 'Falta de organização e controle financeiro.',
    comportamento: 'Foca na divulgação e no networking, mas descuida da gestão e do caixa.',
    transformacao: 'Quando aprende a gerenciar a casa por dentro, se torna uma líder inspiradora e sustentável.',
    pesos: { EXPO: 15, EXEC: 10, CLAREZA: 10, FIN: 5, CONF: 10 }
  },
  {
    nome: 'O Planejador Paralisado',
    descricao: 'Você tem o mapa, mas não dá o primeiro passo. O medo de errar e a busca pela perfeição impedem a ação.',
    forca: 'Clareza e planejamento.',
    pontoCego: 'Achar que precisa estar 100% pronto para começar.',
    bloqueio: 'Medo de errar e falta de atitude.',
    comportamento: 'Pensa em todos os cenários possíveis, mas raramente executa algo.',
    transformacao: 'Quando aprende a agir mesmo com medo, descobre que o plano se ajusta no caminho.',
    pesos: { CLAREZA: 15, CONF: 8, EXPO: 8, EXEC: 5, FIN: 10 }
  },
  {
    nome: 'A Potência Adormecida',
    descricao: 'Existe um negócio inteiro na sua cabeça, mas ele ainda está esperando o primeiro passo sair do papel.',
    forca: 'Criatividade e potencial de mercado.',
    pontoCego: 'Achar que ter uma ideia boa é o suficiente.',
    bloqueio: 'Falta de ação e insegurança paralisante.',
    comportamento: 'Tem várias ideias, mas fica esperando o momento perfeito ou o medo a paralisa.',
    transformacao: 'Quando dá o primeiro passo, a ideia se transforma em um negócio real.',
    pesos: { CLAREZA: 12, EXPO: 10, CONF: 5, FIN: 8, EXEC: 5 }
  },
  {
    nome: 'O Gestor Sobrecarregado',
    descricao: 'Você é o centro de tudo. Apaga incêndios, resolve problemas, mas sente que o negócio não anda sem você.',
    forca: 'Resiliência e capacidade de resolver problemas.',
    pontoCego: 'Achar que só você sabe fazer as coisas do jeito certo.',
    bloqueio: 'Falta de delegação e de processos claros.',
    comportamento: 'Trabalha 12 horas por dia, foca no operacional e não tem tempo para o estratégico.',
    transformacao: 'Quando aprende a delegar, o negócio cresce sem depender exclusivamente de você.',
    pesos: { EXEC: 15, FIN: 8, CLAREZA: 8, CONF: 10, EXPO: 9 }
  },
  {
    nome: 'A Aprendiz Insegura',
    descricao: 'Você está começando, tem vontade, mas a comparação com os outros faz você achar que não é capaz.',
    forca: 'Vontade de aprender e se desenvolver.',
    pontoCego: 'Achar que todo mundo sabe mais do que você.',
    bloqueio: 'Insegurança e síndrome do impostor.',
    comportamento: 'Consome muito conteúdo, mas não se sente pronta para agir.',
    transformacao: 'Quando foca no próprio progresso, o medo dá lugar à confiança.',
    pesos: { CONF: 5, CLAREZA: 10, EXEC: 8, FIN: 10, EXPO: 8 }
  },
  {
    nome: 'A Vendedora Improvisada',
    descricao: 'Você vende bem e tem jogo de cintura. Mas a falta de estrutura faz com que o negócio seja uma montanha-russa.',
    forca: 'Habilidade de negociação e vendas.',
    pontoCego: 'Achar que não precisa de processo, só de jeito.',
    bloqueio: 'Falta de organização e constância.',
    comportamento: 'Fecha contratos no grito, mas se perde no pós-venda e nas finanças.',
    transformacao: 'Quando cria processos e organiza o caixa, a venda se transforma em lucro sustentável.',
    pesos: { EXPO: 14, FIN: 5, EXEC: 10, CONF: 12, CLAREZA: 9 }
  },
  {
    nome: 'O Construtor de Castelos',
    descricao: 'Você tem ideias grandiosas, mas a execução fica no meio do caminho. Começa muitos projetos e não termina nenhum.',
    forca: 'Ambicioso e criativo.',
    pontoCego: 'Achar que pode fazer tudo ao mesmo tempo.',
    bloqueio: 'Falta de foco e priorização.',
    comportamento: 'Inicia várias frentes, mas perde o ritmo quando o entusiasmo acaba.',
    transformacao: 'Quando aprende a focar em uma coisa de cada vez, se torna um empreendedor de alto impacto.',
    pesos: { EXPO: 10, CLAREZA: 12, EXEC: 5, FIN: 8, CONF: 10 }
  },
  {
    nome: 'A Executiva Solitária',
    descricao: 'Você produz, entrega, mas sente que carrega o mundo nas costas. Falta apoio e falta tempo para o próprio negócio.',
    forca: 'Dedicação e resiliência.',
    pontoCego: 'Achar que precisa dar conta de tudo sozinha.',
    bloqueio: 'Dificuldade de pedir ajuda e de confiar na equipe.',
    comportamento: 'Trabalha duro, se isola no operacional e acredita que só ela resolve.',
    transformacao: 'Quando entende que a força está na equipe, o negócio se torna escalável.',
    pesos: { EXEC: 14, CONF: 8, FIN: 10, EXPO: 8, CLAREZA: 10 }
  },
  {
    nome: 'A Visionária Desfocada',
    descricao: 'Você tem clareza do que quer, mas se perde em mil ideias. Falta foco e priorização para colocar os planos em prática.',
    forca: 'Criatividade e visão de futuro.',
    pontoCego: 'Achar que o entusiasmo é suficiente para executar.',
    bloqueio: 'Falta de foco e desorganização.',
    comportamento: 'Quer abraçar o mundo, mas começa muitas coisas e não termina.',
    transformacao: 'Quando aprende a priorizar, a visão se torna realidade com foco e direção.',
    pesos: { CLAREZA: 15, EXPO: 12, EXEC: 5, FIN: 8, CONF: 10 }
  }
];

// ─────────────────────────────────────────────────────────────
// BLOCOS DE ANÁLISE (Mantidos inalterados)
// ─────────────────────────────────────────────────────────────

// Q2 - O que mais tem dificultado o crescimento?
export const DORES = {
  A: "O seu maior gargalo hoje é a atração. Você sente que o negócio não cresce porque falta um fluxo constante de pessoas interessadas no que você faz.",
  B: "Sua principal batalha tem sido com o caixa. A sensação de não saber exatamente para onde o dinheiro vai ou quanto realmente sobra é o que mais tira o seu sono.",
  C: "Você sabe entregar, mas tem dificuldade em comunicar o valor do que faz. A dor atual está na vitrine: mostrar para o mercado por que a sua solução é a melhor.",
  D: "O que mais te incomoda é a falta de um sistema. Você até tem demanda, mas a desorganização e a falta de um plano claro fazem os dias parecerem caóticos."
};

// Q7 - O que mais incomoda quando pensa em mostrar o negócio?
export const BARREIRAS = {
  A: "Existe um receio profundo do julgamento. O medo da crítica de pessoas próximas ou de antigos contatos tem funcionado como um freio de mão na sua divulgação.",
  B: "A síndrome do impostor bate à porta quando você pensa em se posicionar. O medo de não parecer suficientemente profissional ou de não transmitir autoridade trava os seus movimentos.",
  C: "A sua insegurança está no retorno. Você tem receio de dedicar tempo, energia e dinheiro e acabar não tendo o reconhecimento ou o retorno financeiro esperado.",
  D: "Não é medo, é falta de mira. Você sente coragem para aparecer, mas o desafio é direcionar essa energia para o público certo, em vez de atirar para todos os lados."
};

// Q10 - O que mudaria na sua vida se o negócio crescesse?
export const MOTIVACOES = {
  A: "O seu combustível real é a paz de espírito. Você trabalha duro porque almeja um negócio que proporcione estabilidade, previsibilidade e segurança.",
  B: "O que te move é a possibilidade de ter tempo. O seu sonho não é apenas um negócio gigante, mas um negócio que te devolva a liberdade para viver fora dele.",
  C: "O seu motor é o reconhecimento. Você quer construir algo que as pessoas olhem e digam: 'ela construiu isso' e que seja referência no mercado.",
  D: "Sua motivação principal é o propósito e a família. O negócio é o veículo para transformar a realidade das pessoas que você ama e tirar projetos do papel."
};

// Q11 - O que precisaria ter mudado para chegar lá?
export const VISAO_FUTURO = {
  A: "Para chegar lá, você sabe que precisa mudar a sua forma de se posicionar e atrair clientes.",
  B: "Para chegar lá, você entende que a organização financeira e administrativa é o alicerce fundamental.",
  C: "Para chegar lá, você reconhece que a disciplina e a constância na execução diária são o segredo.",
  D: "Para chegar lá, você precisa desenvolver uma visão mais estratégica e tomar decisões com mais segurança."
};

// Cruzamentos de Contradições (Onde as respostas se chocam)
export const CONTRADICOES = {
  'Q7A_Q10C': "**A contradição que precisa ser resolvida:** Você quer ser reconhecida e construir uma marca forte, mas tem medo do julgamento de quem está à sua volta. Você está se boicotando antes mesmo de tentar.",
  'Q7B_Q10A': "**A contradição que precisa ser resolvida:** Você quer tranquilidade financeira, mas o medo de não parecer profissional está te fazendo postergar atitudes comerciais que trariam esse dinheiro.",
  'Q7C_Q2A': "**A contradição que precisa ser resolvida:** Você quer atrair mais clientes, mas tem medo de investir tempo e ninguém se interessar. O medo do fracasso está impedindo a ação.",
  'Q5A_Q13B': "**A contradição que precisa ser resolvida:** Você colocou organizar as finanças como prioridade, mas admitiu que ainda mistura o caixa pessoal com o da empresa. Enquanto a conta for a mesma, o seu lucro será uma ilusão.",
  'Q5B_Q13B': "**A contradição que precisa ser resolvida:** Você quer organizar as finanças, mas não sabe exatamente quanto sobra de lucro. O controle começa com a separação do que é da empresa e do que é seu.",
  'Q7C_Q2C': "**A contradição que precisa ser resolvida:** Você sente que precisa comunicar melhor, mas tem medo de investir tempo e ninguém se interessar. Esse receio está sabotando justamente o que você sabe que precisa ser feito.",
  'Q7D_Q8A': "**A contradição que precisa ser resolvida:** Você diz que não tem medo específico, mas admite que tem medo de começar e não dar continuidade. Isso mostra que a insegurança ainda está presente, só mudou de forma."
};

// Q13 - Plano de Ação (Próximos 30 dias)
export const PLANO_ACAO = {
  A: "**O seu primeiro movimento:** Seu desafio de 30 dias é o Marketing. Ação prática: Defina o seu cliente ideal em uma frase e publique 3 conteúdos por semana sobre as dores dele. Não espere a arte perfeita, foque na consistência.",
  B: "**O seu primeiro movimento:** Seu desafio de 30 dias é a Gestão Financeira. Ação prática: Separe as contas hoje. Coloque todo o dinheiro do negócio em uma única conta PJ (pode ser gratuita) e pague para si mesmo um pró-labore fixo.",
  C: "**O seu primeiro movimento:** Seu desafio de 30 dias é a Comunicação. Ação prática: Saia da invisibilidade. Grave um vídeo ou áudio curto de 2 minutos por dia explicando um mito sobre a sua área. Treine o desconforto de ser vista.",
  D: "**O seu primeiro movimento:** Seu desafio de 30 dias é a Execução. Ação prática: Abandone a lista de 10 tarefas. Escolha A ÚNICA tarefa que vai desbloquear o seu mês e proteja 1 hora da sua manhã só para ela, sem celular."
};