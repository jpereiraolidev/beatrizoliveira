// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const PERGUNTAS = [
  {
    numero: 1,
    texto: 'Quando você olha para o seu negócio hoje, qual dessas situações mais representa sua realidade?',
    alternativas: [
      { letra: 'A', texto: 'Tenho um negócio funcionando, mas sinto que estou no mesmo lugar há muito tempo.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 0, CONF: 1 } },
      { letra: 'B', texto: 'Trabalho bastante, tenho clientes, mas parece que nunca consigo organizar tudo.', scores: { CLAREZA: 1, EXEC: 2, FIN: 0, EXPO: 1, CONF: 1 } },
      { letra: 'C', texto: 'Tenho boas ideias e vontade de crescer, mas dificuldade para transformá-las em resultados.', scores: { CLAREZA: 0, EXEC: 0, FIN: 1, EXPO: 1, CONF: 0 } },
      { letra: 'D', texto: 'Meu negócio está caminhando, mas sei que poderia estar muito melhor.', scores: { CLAREZA: 2, EXEC: 2, FIN: 2, EXPO: 1, CONF: 1 } },
    ],
  },
  {
    numero: 2,
    texto: 'O que mais tem dificultado o crescimento do seu negócio atualmente?',
    alternativas: [
      { letra: 'A', texto: 'Não consigo atrair clientes novos com frequência.', scores: { CLAREZA: 1, EXEC: 1, FIN: 0, EXPO: 3, CONF: 0 } },
      { letra: 'B', texto: 'Tenho dificuldade para organizar dinheiro, custos, entradas e saídas.', scores: { CLAREZA: 1, EXEC: 0, FIN: 3, EXPO: 1, CONF: 0 } },
      { letra: 'C', texto: 'Não sei como divulgar meu negócio e mostrar o valor do que vendo.', scores: { CLAREZA: 1, EXEC: 1, FIN: 0, EXPO: 2, CONF: 1 } },
      { letra: 'D', texto: 'Sinto que falta organização, planejamento e direção para tomar decisões.', scores: { CLAREZA: 3, EXEC: 1, FIN: 1, EXPO: 0, CONF: 1 } },
    ],
  },
  {
    numero: 3,
    texto: 'Quando você termina um dia de trabalho, qual sensação costuma ficar?',
    alternativas: [
      { letra: 'A', texto: 'Fiz muita coisa, mas não sei se realmente avancei.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'B', texto: 'Sinto que estou sempre correndo atrás de problemas.', scores: { CLAREZA: 0, EXEC: 1, FIN: 1, EXPO: 0, CONF: 0 } },
      { letra: 'C', texto: 'Fico satisfeito, mas preocupado com o que ainda preciso resolver.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'D', texto: 'Tenho a sensação de que estou construindo algo, mesmo que lentamente.', scores: { CLAREZA: 2, EXEC: 2, FIN: 2, EXPO: 2, CONF: 2 } },
    ],
  },
  {
    numero: 4,
    texto: 'Quando aparece uma oportunidade de melhorar ou divulgar seu negócio, o que geralmente acontece?',
    alternativas: [
      { letra: 'A', texto: 'Fico animado, mas acabo deixando para depois.', scores: { CLAREZA: 1, EXEC: 0, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'B', texto: 'Começo a fazer, mas tenho dificuldade para manter a consistência.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'C', texto: 'Penso demais, tenho dúvidas e acabo não tomando uma decisão.', scores: { CLAREZA: 0, EXEC: 1, FIN: 0, EXPO: 1, CONF: 1 } },
      { letra: 'D', texto: 'Procuro entender como fazer e tento colocar em prática.', scores: { CLAREZA: 2, EXEC: 2, FIN: 2, EXPO: 2, CONF: 2 } },
    ],
  },
  {
    numero: 5,
    texto: 'Como você costuma cuidar do dinheiro do seu negócio?',
    alternativas: [
      { letra: 'A', texto: 'Misturo o dinheiro pessoal com o dinheiro da empresa.', scores: { CLAREZA: 0, EXEC: 0, FIN: 0, EXPO: 1, CONF: 0 } },
      { letra: 'B', texto: 'Tenho algum controle, mas não sei exatamente quanto sobra de lucro.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'C', texto: 'Sei quanto entra e sai, mas tenho dificuldade para planejar os próximos passos.', scores: { CLAREZA: 1, EXEC: 1, FIN: 2, EXPO: 1, CONF: 1 } },
      { letra: 'D', texto: 'Tenho organização financeira e acompanho os resultados regularmente.', scores: { CLAREZA: 2, EXEC: 2, FIN: 3, EXPO: 2, CONF: 2 } },
    ],
  },
  {
    numero: 6,
    texto: 'Quando você precisa divulgar seu negócio nas redes sociais, como se sente?',
    alternativas: [
      { letra: 'A', texto: 'Tenho vergonha de aparecer e receio do julgamento das pessoas.', scores: { CLAREZA: 0, EXEC: 1, FIN: 0, EXPO: 0, CONF: 0 } },
      { letra: 'B', texto: 'Apareço ou publico alguma coisa, mas sem saber exatamente o que comunicar.', scores: { CLAREZA: 0, EXEC: 1, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'C', texto: 'Sei que preciso divulgar, mas sempre encontro outras prioridades.', scores: { CLAREZA: 1, EXEC: 0, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'D', texto: 'Consigo divulgar, mas sinto que minha comunicação ainda não transmite o verdadeiro valor do meu negócio.', scores: { CLAREZA: 1, EXEC: 2, FIN: 1, EXPO: 2, CONF: 2 } },
    ],
  },
  {
    numero: 7,
    texto: 'O que mais incomoda você quando pensa em mostrar seu negócio para mais pessoas?',
    alternativas: [
      { letra: 'A', texto: 'Medo de ser julgado ou criticado por quem me conhece.', scores: { CLAREZA: 0, EXEC: 0, FIN: 0, EXPO: 0, CONF: 0 } },
      { letra: 'B', texto: 'Medo de não parecer profissional ou não transmitir confiança.', scores: { CLAREZA: 0, EXEC: 1, FIN: 0, EXPO: 1, CONF: 0 } },
      { letra: 'C', texto: 'Medo de investir tempo e esforço e ninguém se interessar.', scores: { CLAREZA: 1, EXEC: 0, FIN: 1, EXPO: 0, CONF: 0 } },
      { letra: 'D', texto: 'Não sinto medo específico, mas não sei como chamar a atenção das pessoas certas.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 2, CONF: 2 } },
    ],
  },
  {
    numero: 8,
    texto: 'Você sente que existe alguma coisa que gostaria de fazer pelo seu negócio, mas continua adiando?',
    alternativas: [
      { letra: 'A', texto: 'Sim. Tenho medo de começar e não conseguir dar continuidade.', scores: { CLAREZA: 1, EXEC: 0, FIN: 0, EXPO: 1, CONF: 0 } },
      { letra: 'B', texto: 'Sim. Sei o que deveria fazer, mas parece que nunca encontro o momento certo.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'C', texto: 'Sim. Tenho receio de investir e acabar perdendo dinheiro.', scores: { CLAREZA: 1, EXEC: 0, FIN: 0, EXPO: 1, CONF: 0 } },
      { letra: 'D', texto: 'Não identifico algo específico que esteja adiando.', scores: { CLAREZA: 3, EXEC: 3, FIN: 2, EXPO: 2, CONF: 3 } },
    ],
  },
  {
    numero: 9,
    texto: 'Quando você compara seu negócio com outros que parecem estar crescendo, o que costuma sentir?',
    alternativas: [
      { letra: 'A', texto: 'Sinto que estou ficando para trás e deveria ter avançado mais.', scores: { CLAREZA: 0, EXEC: 1, FIN: 1, EXPO: 1, CONF: 0 } },
      { letra: 'B', texto: 'Fico motivado, mas também questiono minha capacidade de conseguir o mesmo.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 1, CONF: 0 } },
      { letra: 'C', texto: 'Tenho vontade de crescer, mas não sei o que essas pessoas fazem de diferente.', scores: { CLAREZA: 0, EXEC: 1, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'D', texto: 'Uso essas referências para aprender, sem sentir que preciso seguir o mesmo caminho.', scores: { CLAREZA: 3, EXEC: 2, FIN: 2, EXPO: 2, CONF: 3 } },
    ],
  },
  {
    numero: 10,
    texto: 'Se seu negócio começasse a crescer como você deseja, o que mudaria mais significativamente na sua vida?',
    alternativas: [
      { letra: 'A', texto: 'Teria mais tranquilidade financeira e segurança.', scores: { CLAREZA: 1, EXEC: 1, FIN: 3, EXPO: 1, CONF: 2 } },
      { letra: 'B', texto: 'Teria mais liberdade e não precisaria trabalhar o tempo inteiro.', scores: { CLAREZA: 1, EXEC: 2, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'C', texto: 'Sentiria orgulho de ter construído algo reconhecido pelas pessoas.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 3, CONF: 2 } },
      { letra: 'D', texto: 'Conseguiria realizar projetos e proporcionar uma vida melhor para mim e minha família.', scores: { CLAREZA: 2, EXEC: 2, FIN: 2, EXPO: 1, CONF: 2 } },
    ],
  },
  {
    numero: 11,
    texto: 'Imagine que daqui a um ano seu negócio esteja exatamente como você gostaria. O que você acredita que precisaria ter mudado para chegar lá?',
    alternativas: [
      { letra: 'A', texto: 'Minha maneira de me posicionar, divulgar e atrair clientes.', scores: { CLAREZA: 2, EXEC: 1, FIN: 1, EXPO: 3, CONF: 2 } },
      { letra: 'B', texto: 'Minha organização financeira e administrativa.', scores: { CLAREZA: 1, EXEC: 2, FIN: 3, EXPO: 1, CONF: 1 } },
      { letra: 'C', texto: 'Minha disciplina, constância e capacidade de executar.', scores: { CLAREZA: 1, EXEC: 3, FIN: 1, EXPO: 1, CONF: 2 } },
      { letra: 'D', texto: 'Minha visão estratégica e minha capacidade de tomar decisões.', scores: { CLAREZA: 3, EXEC: 2, FIN: 2, EXPO: 1, CONF: 2 } },
    ],
  },
  {
    numero: 12,
    texto: 'Olhando para suas respostas até aqui, qual afirmação mais representa o que você percebe sobre si mesmo?',
    alternativas: [
      { letra: 'A', texto: 'Talvez eu esteja tão ocupado trabalhando que não esteja dedicando tempo para desenvolver meu negócio.', scores: { CLAREZA: 1, EXEC: 2, FIN: 1, EXPO: 1, CONF: 1 } },
      { letra: 'B', texto: 'Percebo que algumas inseguranças podem estar influenciando minhas decisões.', scores: { CLAREZA: 1, EXEC: 1, FIN: 1, EXPO: 1, CONF: 2 } },
      { letra: 'C', texto: 'Entendo que preciso aprender a administrar melhor meu negócio, não apenas executar tarefas.', scores: { CLAREZA: 2, EXEC: 2, FIN: 3, EXPO: 1, CONF: 2 } },
      { letra: 'D', texto: 'Percebo que tenho capacidade e vontade, mas preciso de mais direção e organização.', scores: { CLAREZA: 3, EXEC: 1, FIN: 2, EXPO: 1, CONF: 1 } },
    ],
  },
  {
    numero: 13,
    texto: 'Se você pudesse resolver apenas uma dificuldade do seu negócio nos próximos 30 dias, qual escolheria?',
    alternativas: [
      { letra: 'A', texto: 'Aprender a divulgar meu negócio e atrair mais clientes.', scores: { CLAREZA: 1, EXEC: 1, FIN: 0, EXPO: 3, CONF: 1 } },
      { letra: 'B', texto: 'Organizar minhas finanças e entender melhor meus resultados.', scores: { CLAREZA: 1, EXEC: 1, FIN: 3, EXPO: 0, CONF: 1 } },
      { letra: 'C', texto: 'Desenvolver minha comunicação e ter mais confiança para aparecer.', scores: { CLAREZA: 1, EXEC: 1, FIN: 0, EXPO: 2, CONF: 3 } },
      { letra: 'D', texto: 'Criar uma rotina, estabelecer prioridades e finalmente executar o que planejo.', scores: { CLAREZA: 2, EXEC: 3, FIN: 1, EXPO: 1, CONF: 1 } },
    ],
  },
];

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpa na ordem correta para não quebrar as chaves estrangeiras
  await prisma.opcao.deleteMany();
  await prisma.pergunta.deleteMany();

  for (const p of PERGUNTAS) {
    const pergunta = await prisma.pergunta.create({
      data: {
        numero: p.numero,
        texto: p.texto,
        opcoes: {
          create: p.alternativas.map((alt) => ({
            letra: alt.letra,
            texto: alt.texto,
            scores: alt.scores,
          })),
        },
      },
      include: { opcoes: true },
    });

    console.log(`✅ Pergunta ${p.numero} criada com ${pergunta.opcoes.length} alternativas`);
  }

  console.log('🎉 Seed concluído com sucesso.');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());