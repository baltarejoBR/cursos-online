// Script para popular a base de conhecimento com Q&A extraídos da Knowledge Base CDS
// Executar: node scripts/seed-knowledge-base.js
// Depois executar: node scripts/generate-embeddings.js (para gerar embeddings)
//
// Requer as env vars: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY

const { readFileSync } = require('fs');
const { resolve } = require('path');

// Ler .env.local manualmente
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

// ============================================================
// KNOWLEDGE BASE Q&A PAIRS
// Extraídos dos 17 arquivos .md da Knowledge Base CDS
// REGRA: NUNCA incluir dosagens específicas (ml) — conteúdo pago
// ============================================================

const SEED_DATA = [
  // =====================================================
  // GERAL — O que é CDS (fonte: o-que-e-cds.md)
  // =====================================================
  {
    question: 'O que e CDS?',
    answer: 'CDS (Chlorine Dioxide Solution) e uma solucao aquosa contendo gas dioxido de cloro (ClO2) dissolvido em agua pura. E um gas amarelo-esverdeado, soluvel em agua, com sabor quase imperceptivel e pH neutro. O CDS funciona como um oxidante seletivo — ele busca e elimina virus, bacterias, fungos e metais pesados no corpo, sem agredir as celulas saudaveis. Depois de agir, se transforma apenas em cloreto e oxigenio — substancias que ja existem naturalmente no corpo. O Gabriel costuma dizer: "E como ganhar um pulmao extra bebendo agua."',
    category: 'geral',
    tags: ['iniciante', 'basico', 'definicao'],
  },
  {
    question: 'Qual a diferenca entre MMS e CDS?',
    answer: 'O MMS (Miracle Mineral Supplement) e a mistura direta de clorito de sodio com acido — tem gosto forte e desagradavel, pode causar nausea e diarreia, e contem residuos de clorito e acido que nao reagiram. O CDS e a evolucao: o gas dioxido de cloro e separado e dissolvido em agua pura. O resultado e uma solucao com sabor quase imperceptivel, pH neutro, sem subprodutos toxicos e muito mais segura. Como o Gabriel explica: "O MMS e ativado no momento. O CDS ja e engarrafado."',
    category: 'geral',
    tags: ['iniciante', 'basico', 'diferenca'],
  },
  {
    question: 'Como o CDS funciona no corpo?',
    answer: 'O CDS age por oxidacao seletiva — ele busca reagir com compostos acidos e cargas eletricas especificas encontradas nas membranas de virus, bacterias, fungos e metais pesados. Seu potencial de oxidacao (0,95V) e MENOR que o do oxigenio (1,23V), por isso nao destroi celulas saudaveis. Ele tem 5 eletrons livres para doar, permanece ate 1 hora no organismo, e apos oxidar os patogenos, se decompoe em cloreto e oxigenio — substancias naturais do corpo. E essencialmente um suplemento de oxigenio.',
    category: 'geral',
    tags: ['mecanismo', 'oxidacao', 'ciencia'],
  },
  {
    question: 'CDS e a mesma coisa que agua sanitaria?',
    answer: 'NAO! Sao substancias completamente diferentes. CDS e dioxido de cloro (ClO2) — seguro, com potencial de oxidacao de 0,95V. Agua sanitaria e hipoclorito de sodio (NaClO) — perigoso, com potencial de 1,49V. Sao formulas quimicas diferentes com efeitos totalmente diferentes. E como comparar oxigenio (O2) com monoxido de carbono (CO) — ambos tem oxigenio na formula, mas sao substancias completamente distintas. Essa confusao e intencional por parte de quem quer desacreditar o CDS.',
    category: 'geral',
    tags: ['mito', 'agua-sanitaria', 'esclarecimento'],
  },
  {
    question: 'O que sao biofilmes e qual a relacao com CDS?',
    answer: 'Biofilmes sao camadas protetoras criadas por colonias de bacterias, fungos e parasitas no intestino e mucosas. Funcionam como uma "capa protetora" que impede o sistema imunologico e medicamentos de alcancar os patogenos. O CDS e capaz de romper esses biofilmes, expondo os patogenos para eliminacao. O material que sai nos enemas (amarelado/esverdeado) sao esses biofilmes sendo eliminados. Como o Gabriel diz: "Colonizou. Voce nao tira mais. So quando usar o CDS para romper o biofilme."',
    category: 'geral',
    tags: ['biofilme', 'intestino', 'limpeza'],
  },
  {
    question: 'O que e a Reacao de Herxheimer?',
    answer: 'A Reacao de Herxheimer e a fase de desintoxicacao que acontece quando voce comeca a tomar CDS. Quando bacterias, fungos e parasitas morrem, eles liberam toxinas, causando sintomas temporarios como urina mais forte, erupcoes na pele, cansaco, dor de cabeca e enjoo. NAO sao efeitos colaterais do CDS — e o corpo se limpando. E como fazer uma faxina grande na casa: antes de ficar limpo, levanta toda a poeira. Regra de ouro: se piorou muito, diminui a dose. Melhorando: mantem. Nao melhorando: aumenta.',
    category: 'geral',
    tags: ['herxheimer', 'desintoxicacao', 'efeitos'],
  },
  {
    question: 'Quanto tempo o CDS dura na geladeira?',
    answer: 'O CDS bem armazenado dura meses a anos na geladeira! O Gabriel diz: "Passou duzentos anos. Voce abriu a geladeira. Ta amarelo. Pode ter certeza que vai resolver o seu problema." A cor amarela indica que o CDS esta ativo. Guarde em frasco de vidro, bem vedado, na geladeira, protegido da luz. Se ficar incolor, perdeu a eficacia.',
    category: 'geral',
    tags: ['armazenamento', 'validade', 'conservacao'],
  },
  {
    question: 'CDS e melhor que ozonio?',
    answer: 'Sim, em varios aspectos. O CDS nao gera radicais livres (ozonio gera), tem seletividade alta (ozonio tem menor), e muito mais seguro para criancas, e tem molecula menor que atravessa barreiras que o ozonio nao consegue. O Gabriel diz: "Quem conhece o ozonio vai abandonar o ozonio. Porque o CDS e melhor em tudo." E como pegar o ozonio e tirar toda a inseguranca dele.',
    category: 'geral',
    tags: ['comparacao', 'ozonio'],
  },

  // =====================================================
  // SEGURANCA (fonte: seguranca-cds.md)
  // =====================================================
  {
    question: 'O CDS e seguro?',
    answer: 'Sim, o CDS e seguro! O potencial de oxidacao do CDS (0,95V) e MENOR que o do oxigenio que voce respira (1,23V). Isso significa que ele nao destroi celulas saudaveis. E o unico oxidante que nao gera radicais livres nem substancias cancerigenas. A Sabesp usa dioxido de cloro para tratar agua potavel, a Bolivia aprovou por lei a distribuicao, mais de 10.000 medicos fazem parte da COMUSAV, e o Gabriel toma CDS todos os dias ha mais de 6 anos. Na historia, houve apenas 1 morte (queda em tanque industrial) e 3 tentativas de suicidio com CDS — as 3 falharam.',
    category: 'seguranca',
    tags: ['seguranca', 'prioridade', 'evidencias'],
  },
  {
    question: 'CDS gera radicais livres?',
    answer: 'Nao! O CDS e o UNICO oxidante que nao gera radicais livres toxicos e nao gera trihalometanos (substancias cancerigenas). Apos agir no corpo, ele se decompoe apenas em cloreto (Cl-) e oxigenio (O2) — substancias que ja existem naturalmente no seu corpo. Isso e confirmado pelo biofisico Andreas Kalcker.',
    category: 'seguranca',
    tags: ['radicais-livres', 'seguranca'],
  },
  {
    question: 'Crianca pode tomar CDS?',
    answer: 'Sim! O CDS e seguro para criancas com dosagem adequada ao peso. O Enzo, filho adotivo do Gabriel (12 anos), toma CDS normalmente. Uma menina de 2 anos com anemia falciforme toma CDS ate hoje — o Gabriel diz: "O CDS e o oxigenio dessa menina." Irmaos autistas de 26 anos que nunca falaram comecaram a falar na primeira semana de CDS. Para criancas, o ideal e ter orientacao — no curso ou na consultoria, o Gabriel ensina as dosagens corretas por faixa etaria.',
    category: 'seguranca',
    tags: ['crianca', 'infantil', 'seguranca'],
  },
  {
    question: 'Posso tomar CDS com outros remedios?',
    answer: 'Sim, desde que haja um intervalo de pelo menos 1 hora entre o CDS e qualquer medicamento. O CDS pode oxidar e reduzir o efeito dos remedios se tomado junto. A UNICA excecao seria e a Varfarina — nao deve ser combinada com CDS, pois pode causar hemorragia. Para anticoagulantes e remedios de pressao, e bom monitorar, pois o CDS melhora o fluxo sanguineo e pode ser necessario ajustar a medicacao.',
    category: 'seguranca',
    tags: ['medicamento', 'interacao', 'varfarina'],
  },
  {
    question: 'CDS faz mal para o estomago? E quem tem gastrite?',
    answer: 'O CDS tem pH neutro e potencial de oxidacao menor que o oxigenio. Nao agride mucosas — nossas mucosas suportam ate 1,3V e o CDS tem apenas 0,95V. Pessoas com gastrite podem tomar, comecando com doses menores e aumentando gradualmente. Se sentir desconforto, diminua a dose pela metade.',
    category: 'seguranca',
    tags: ['estomago', 'gastrite', 'mucosas'],
  },
  {
    question: 'E verdade que pessoas morreram por causa do CDS?',
    answer: 'Na historia inteira do CDS, houve apenas 1 morte — uma pessoa que caiu dentro de um tanque industrial de dioxido de cloro (exposicao massiva, nao uso terapeutico). Alem disso, 3 pessoas tentaram suicidio com dioxido de cloro — as 3 sobreviveram. Isso mostra o quao seguro o CDS e quando usado em dosagens adequadas.',
    category: 'seguranca',
    tags: ['morte', 'seguranca', 'mito'],
  },
  {
    question: 'CDS e pessoa com G6PD pode usar?',
    answer: 'Sim! O Andreas Kalcker confirmou na entrevista com Gabriel: "O dioxido de cloro nao contem molecula de cloro livre. Nao ha cloracao. Nao tem nenhum efeito negativo em G6PD." Portanto, pessoas com deficiencia de G6PD podem usar CDS normalmente.',
    category: 'seguranca',
    tags: ['g6pd', 'contraindicacao', 'kalcker'],
  },
  {
    question: 'O que nao posso misturar com CDS?',
    answer: 'Evite misturar CDS com substancias acidas e antioxidantes, pois cancelam o efeito. Isso inclui: vitamina C, limao, vinagre, bicarbonato, suco de laranja e acerola. Mantenha intervalo de 1 hora entre CDS e alimentos ou suplementos. Tambem NUNCA use DMSO no enema (reabsorve toxinas). A unica contraindicacao seria e a Varfarina.',
    category: 'seguranca',
    tags: ['interacao', 'vitamina-c', 'cuidados'],
  },
  {
    question: 'A internet diz que CDS e perigoso. E verdade?',
    answer: 'A confusao e INTENCIONAL. Orgaos reguladores pegam os efeitos colaterais do hipoclorito de sodio (agua sanitaria - NaClO) e atribuem ao dioxido de cloro (CDS - ClO2). Sao substancias completamente diferentes! A FDA dos EUA removeu a nota de toxicidade especifica do CDS. A Sabesp usa dioxido de cloro para tratar agua potavel. A Bolivia aprovou por lei. Mais de 10.000 medicos usam na COMUSAV. Quer ver os estudos? Temos artigos na Universidade Dioxi do nosso site: metodocorpolimpo.com.br',
    category: 'seguranca',
    tags: ['mito', 'internet', 'desinformacao'],
  },

  // =====================================================
  // HISTORIA (fonte: historia-e-origem.md)
  // =====================================================
  {
    question: 'Quem descobriu o CDS?',
    answer: 'A historia comecou em 1994 com Jim Humble, que estava minerando ouro nas Guianas quando sua equipe pegou malaria. Ele tinha consigo substancias para potabilizar agua (clorito de sodio + acido) e deu para a equipe — na mesma noite estavam todos curados. Ele criou o MMS. Em 2006, o biofisico Andreas Kalcker evoluiu o MMS para o CDS, separando o gas e dissolvendo em agua pura — uma revolucao em seguranca. Kalcker tem patentes registradas e um predio no Mexico dedicado a estudos.',
    category: 'geral',
    tags: ['historia', 'jim-humble', 'kalcker'],
  },
  {
    question: 'O que e a COMUSAV?',
    answer: 'COMUSAV e a Coalizao Mundial de Medicos "Saude e Vida" — uma rede com mais de 10.000 medicos no mundo todo que estudam e recomendam o uso do dioxido de cloro. Tem reunioes todo sabado, 4-5 horas, com especialistas de diversas areas. O Gabriel diz que foi a "faculdade" dele — assistia e retransmitia no Instagram. As palestras estao disponiveis no DioxyTube.',
    category: 'geral',
    tags: ['comusav', 'medicos', 'autoridade'],
  },
  {
    question: 'Quem e Andreas Kalcker?',
    answer: 'Andreas Kalcker e um biofisico (nao medico) que revolucionou o uso do dioxido de cloro a partir de 2006. Ele ensinou a separar o gas do CDS da mistura bruta do MMS, tornando muito mais seguro. Tem patentes registradas internacionalmente para tratamento de inflamacao, infeccoes e COVID-19. Mantem os servidores do DioxyTube e DioxyPedia, e tem um predio no Mexico dedicado a estudos. Seu livro foi traduzido pelo Gabriel para os alunos do curso.',
    category: 'geral',
    tags: ['kalcker', 'biofisico', 'pesquisador'],
  },
  {
    question: 'CDS e aprovado em algum pais?',
    answer: 'Sim! A Bolivia aprovou por lei a distribuicao de dioxido de cloro. La, universidades produzem e vendem CDS. A historia comecou quando uma enfermeira testou CDS intravenoso no avo com COVID e ele se recuperou. O prefeito de Sao Jose dos Tiquitos adotou no hospital, e a medica Patricia Callisperis conseguiu aprovar a lei. Alem disso, dioxido de cloro e usado mundialmente para potabilizar agua (Sabesp usa no Brasil).',
    category: 'geral',
    tags: ['bolivia', 'lei', 'aprovacao'],
  },

  // =====================================================
  // GABRIEL (fonte: jornada-gabriel.md)
  // =====================================================
  {
    question: 'Quem e o Gabriel Baltarejo?',
    answer: 'Gabriel Baltarejo e engenheiro mecanico e pesquisador independente de CDS. Tudo comecou quando seu cachorro Tom (Golden Retriever) foi diagnosticado com leishmaniose, erliquiose e babesia — a veterinaria recomendou sacrificar. Gabriel nao aceitou, fez um protocolo de 3 meses com CDS, acordando de hora em hora para dar a dose. Em 2 meses, Tom estava 100% curado! Desde entao, Gabriel estuda CDS intensamente ha mais de 6 anos, assistiu centenas de horas da COMUSAV, traduziu o livro do Kalcker e ja acompanhou centenas de pessoas. Mora em Lencois, Chapada Diamantina.',
    category: 'geral',
    tags: ['gabriel', 'historia', 'quem-somos'],
  },
  {
    question: 'O Gabriel e medico?',
    answer: 'Nao. Gabriel e engenheiro mecanico e pesquisador independente de CDS. Ele sempre deixa isso claro. Sua credibilidade vem de mais de 6 anos de estudo intenso, centenas de horas assistindo a COMUSAV (coalizao mundial de medicos), traducao do livro do Kalcker, e experiencia pratica acompanhando centenas de pessoas. Ele diz: "Todas as pessoas que eu conversei, todas melhoraram. Todas estao bem hoje."',
    category: 'geral',
    tags: ['gabriel', 'credibilidade'],
  },

  // =====================================================
  // PROTOCOLOS — visao geral sem dosagens (fonte: protocolos-gerais.md)
  // =====================================================
  {
    question: 'Quais sao os principais protocolos do CDS?',
    answer: 'Existem 26 protocolos de A a Z desenvolvidos pelo Andreas Kalcker. Os mais usados sao: Protocolo C (manutencao diaria), Protocolo F (viroses e urgencias), Protocolo K (com DMSO para problemas localizados), Protocolo E (enema para limpeza intestinal), Protocolo D (dermatologico), Protocolo O (olhos e ouvidos), e Protocolo N (criancas). Cada protocolo tem indicacoes especificas. No curso do Metodo Corpo Limpo (R$297), o Gabriel ensina todos os 26 protocolos com dosagens detalhadas.',
    category: 'protocolo',
    tags: ['protocolos', 'visao-geral'],
  },
  {
    question: 'O que e o Protocolo C?',
    answer: 'O Protocolo C e o protocolo basico de manutencao diaria do CDS — o mais usado e indicado para iniciantes. Consiste em diluir CDS em agua e tomar ao longo do dia. O Gabriel simplifica: "Duas tampinhas num litro de agua." E indicado para desintoxicacao geral, prevencao e manutencao da saude. No curso, voce aprende as dosagens exatas e como ajustar para o seu corpo.',
    category: 'protocolo',
    tags: ['protocolo-c', 'basico', 'manutencao'],
  },
  {
    question: 'O que e o Protocolo F?',
    answer: 'O Protocolo F (Frequente) e o protocolo de urgencia, usado para viroses, dengue, gripe forte, infeccoes graves e situacoes criticas. E mais intenso que o Protocolo C — as doses sao mais frequentes ao longo do dia. O Gabriel diz: "Voce da uma bombardeada na pessoa e a pessoa recupera rapidinho." As dosagens exatas estao no curso completo.',
    category: 'protocolo',
    tags: ['protocolo-f', 'urgencia', 'virose'],
  },
  {
    question: 'O que e o Protocolo K e o DMSO?',
    answer: 'O Protocolo K combina CDS com DMSO (dimetilsulfoxido), um transportador natural que leva o CDS para tecidos profundos. E usado quando se sabe a localizacao do problema — cerebro, ossos, nervos, medula, articulacoes. A aplicacao e topica no formato "sanduiche": CDS na pele, depois DMSO, depois CDS novamente. O DMSO e 7 vezes menos toxico que aspirina. No curso, o Gabriel ensina as proporcoes e protocolos de 21 dias. Temos tambem um guia gratuito do Protocolo K disponivel no site.',
    category: 'protocolo',
    tags: ['protocolo-k', 'dmso', 'topico'],
  },
  {
    question: 'O que e enema com CDS?',
    answer: 'O enema e a lavagem intestinal com CDS — fundamental para limpeza profunda do intestino, remocao de biofilmes e desparasitacao. O Gabriel diz: "Enema e fundamental. A saude final mora no intestino." O procedimento envolve CDS diluido em agua morna, deitando do lado esquerdo. IMPORTANTE: nunca usar DMSO no enema (reabsorve toxinas). O protocolo completo com detalhes esta no curso.',
    category: 'protocolo',
    tags: ['enema', 'intestino', 'limpeza'],
  },
  {
    question: 'O que e o Protocolo Sanduiche?',
    answer: 'O Protocolo Sanduiche e a aplicacao topica de CDS com DMSO em 3 camadas: primeiro CDS na pele, depois DMSO (que transporta o CDS para os tecidos profundos), e depois CDS novamente. E indicado para dores articulares, artrite, artrose, psoriase, queimaduras e problemas de pele. O Gabriel ensina: "Espirra o CDS, limpa bem, deixa secar, DMSO, depois CDS de novo." O protocolo detalhado esta no curso.',
    category: 'protocolo',
    tags: ['sanduiche', 'topico', 'pele'],
  },

  // =====================================================
  // PROTOCOLOS POR DOENÇA (fonte: protocolos-por-doenca.md)
  // =====================================================
  {
    question: 'CDS funciona para cancer?',
    answer: 'Sim, o CDS tem protocolos especificos para diferentes tipos de cancer. O Andreas Kalcker explica que o CDS elimina o acido latico, que e o principal metabolismo do cancer. Temos depoimentos incriveis: a mae da Geni (86 anos) teve nodulo no seio que regrediu visivelmente em dias; Luanda teve cancer de mama com metastase ossea e "a mancha sumiu" nos exames; a cunhada do Gabriel com cancer de cerebro esta zerada. Para cancer, geralmente combina-se protocolos orais com enemas e DMSO topico. O curso ensina os protocolos completos, e a consultoria (R$620) e ideal para casos complexos.',
    category: 'protocolo',
    tags: ['cancer', 'tumor', 'depoimento'],
  },
  {
    question: 'CDS funciona para problemas de pele?',
    answer: 'Sim! Problemas de pele como psoriase, dermatite, fungos, acne e staphylococcus respondem muito bem ao CDS. O Gabriel conta que um amigo musico com psoriase "tomou um dia e no dia seguinte ja estava funcionando." O CDS age limpando de dentro pra fora — muitos problemas de pele estao ligados ao intestino. Os protocolos combinam uso oral com aplicacao topica (Protocolo Sanduiche). No curso, voce aprende o protocolo completo.',
    category: 'protocolo',
    tags: ['pele', 'psoriase', 'dermatite'],
  },
  {
    question: 'CDS funciona para artrite e dores nas articulacoes?',
    answer: 'Sim! Para artrite, artrose, bursite e dores em geral, o CDS e incrivel. O Gabriel diz: "No primeiro dia, segundo dia, essa pessoa ja te agradece." O protocolo combina CDS oral com DMSO topico (Protocolo Sanduiche), que leva o CDS direto para os tecidos profundos das articulacoes. No curso voce aprende as dosagens certas e a frequencia de aplicacao.',
    category: 'protocolo',
    tags: ['artrite', 'artrose', 'dor'],
  },
  {
    question: 'CDS funciona para diabetes?',
    answer: 'Sim, existem protocolos de CDS para diabetes. O CDS ajuda na oxigenacao dos tecidos e na desintoxicacao do corpo, o que pode auxiliar no controle da glicemia. E importante monitorar os niveis de glicose durante o uso. O curso ensina o protocolo especifico, e para casos mais complexos, a consultoria individual com Gabriel (R$620) e o ideal — ele cria um protocolo personalizado para o seu caso.',
    category: 'protocolo',
    tags: ['diabetes', 'glicemia'],
  },
  {
    question: 'CDS funciona para gripe e viroses?',
    answer: 'Sim, e um dos usos mais rapidos do CDS! O Protocolo F (frequente) e especifico para viroses, gripe, dengue e infeccoes agudas. O Gabriel conta que um amigo com gripe forte "dormiu, suou muito, acordou beleza incrivel." E a esposa do Junior, que estava gripada e cheirou o gas do CDS: "No outro dia de manha, acordou zerada." Para viroses, o CDS costuma agir em questao de horas.',
    category: 'protocolo',
    tags: ['gripe', 'virose', 'dengue'],
  },
  {
    question: 'CDS funciona para autismo?',
    answer: 'Sim, existem protocolos especificos para TEA (Transtorno do Espectro Autista). O Gabriel conta o caso de irmaos autistas de 26 anos que nao falavam uma palavra e se batiam: "Na primeira semana de CDS, comecaram a falar e nao se batiam mais." O protocolo geralmente combina CDS oral com enemas e desparasitacao. Para criancas com autismo, o ideal e a consultoria individual (R$620) para o Gabriel montar um protocolo personalizado.',
    category: 'protocolo',
    tags: ['autismo', 'tea', 'crianca'],
  },
  {
    question: 'CDS funciona para AVC?',
    answer: 'Sim! O caso mais impressionante e de uma medica mexicana da COMUSAV: a mae dela de 79 anos teve AVC e entrou em coma. Recebeu CDS endovenoso e "em 30 minutos voltou a falar." O video teve 20.000 pessoas assistindo e chorando. O vizinho do Gabriel tambem teve AVC com sequelas, recebeu CDS oral e "ta zerado, trabalha de guardinha de transito." Para casos de AVC, procure a consultoria com Gabriel para orientacao adequada.',
    category: 'protocolo',
    tags: ['avc', 'derrame', 'emergencia'],
  },
  {
    question: 'CDS funciona para problemas nos olhos?',
    answer: 'Sim! O Protocolo O (Oftalmologico) e usado para problemas nos olhos e ouvidos. O CDS muito diluido pode ser usado como colirio para conjuntivite, e ha depoimentos de melhora em glaucoma e ate catarata (a cachorra Pipoca do Gabriel teve catarata que reverteu com CDS). Tambem funciona para zumbido no ouvido (gotas otologicas). As concentracoes exatas estao no curso.',
    category: 'protocolo',
    tags: ['olhos', 'colirio', 'catarata'],
  },
  {
    question: 'CDS funciona para problemas respiratorios? Sinusite?',
    answer: 'Sim! Para sinusite, rinite, asma e problemas respiratorios, usa-se o Protocolo G (inalacao controlada do gas) e lavagem nasal com CDS. O Gabriel diz: "Todo mundo deve fazer lavagem nasal." O Kalcker tambem desenvolveu um protocolo de nebulizacao. Combinado com o Protocolo C oral, os resultados para problemas respiratorios sao muito bons. Detalhes completos no curso.',
    category: 'protocolo',
    tags: ['sinusite', 'rinite', 'respiratorio'],
  },
  {
    question: 'CDS funciona para candidíase?',
    answer: 'Sim! O Protocolo V (Vaginal) e especifico para candidiase e infeccoes vaginais. O caso da Nazare e impressionante: fez lavagem vaginal com CDS e 3 horas depois liberou colonia intensa de candida. Houve dores de garganta, calafrios e febre (desintoxicacao intensa), mas foi o corpo se limpando. O protocolo combina lavagem vaginal com CDS oral. Detalhes completos no curso ou na consultoria.',
    category: 'protocolo',
    tags: ['candidiase', 'vaginal', 'feminino'],
  },
  {
    question: 'CDS funciona para problemas no coracao e circulacao?',
    answer: 'Sim! O caso do marido da Geni e impressionante: tinha arteria do coracao 100% obstruida. Com alimentacao crua e CDS, desobstruiu completamente. Tirou remedios de pressao e anticoagulante, e os exames do InCor ficaram otimos. O medico ficou feliz com "seu tratamento." Para casos cardiovasculares, o ideal e consultoria individual com Gabriel para acompanhamento adequado.',
    category: 'protocolo',
    tags: ['coracao', 'circulacao', 'arteria'],
  },
  {
    question: 'CDS funciona para animais?',
    answer: 'Sim! Foi assim que tudo comecou para o Gabriel — curando seu cachorro Tom de leishmaniose terminal em 2 meses! A Pipoca (17 anos) teve cancer de mama e intestino curados com CDS. Temos protocolos para caes, gatos, animais de fazenda e mais. O Guia CDS para Animais (R$67) tem 43 protocolos especificos. Tambem temos o Curso CDS para Animais (R$197) com conteudo mais completo.',
    category: 'protocolo',
    tags: ['animal', 'cachorro', 'gato', 'veterinario'],
  },
  {
    question: 'Para quantas doencas o CDS tem protocolo?',
    answer: 'O CDS tem protocolos para mais de 150 condicoes de saude, organizados pelo biofisico Andreas Kalcker em 26 protocolos de A a Z. Isso inclui: infeccoes (gripe, dengue, COVID), cancer (diversos tipos), problemas de pele (psoriase, acne, fungos), sistema musculoesqueletico (artrite, artrose), circulatorio, nervoso, olhos, respiratorio, ginecologico, infantil (autismo) e animais. No curso (R$297), o Gabriel ensina todos os protocolos com dosagens. Para casos complexos, a consultoria individual (R$620) e o caminho ideal.',
    category: 'protocolo',
    tags: ['doencas', 'lista', 'quantidade'],
  },

  // =====================================================
  // OBJECOES E MITOS (fonte: objecoes-e-mitos.md)
  // =====================================================
  {
    question: 'Passei mal quando tomei CDS. E normal?',
    answer: 'Sim, e mais comum do que voce imagina — e na verdade e uma boa noticia! O que voce sentiu provavelmente foi a Reacao de Herxheimer: quando bacterias, fungos e parasitas morrem, eles liberam toxinas que causam dor de cabeca, nausea, cansaco, erupcoes na pele ou diarreia. NAO sao efeitos colaterais do CDS — e seu corpo se limpando. E como fazer uma faxina grande na casa: antes de ficar limpo, levanta toda a poeira. Regra: piorou muito? Diminui a dose pela metade. No curso, o Gabriel ensina como ajustar a dosagem para uma desintoxicacao confortavel.',
    category: 'seguranca',
    tags: ['efeito-colateral', 'herxheimer', 'nausea'],
  },
  {
    question: 'Nao acredito que CDS funciona. Tem prova?',
    answer: 'Ceticismo saudavel e importante! Aqui estao as evidencias: mais de 10.000 medicos na COMUSAV usam e recomendam. Ha ensaios clinicos documentados com mais de 3.000 pacientes (apenas 6% com efeitos leves, nenhum grave). Existem 4 patentes internacionais registradas por Kalcker. A Bolivia aprovou por lei. E usado mundialmente para potabilizar agua. Temos centenas de depoimentos documentados: Tom curado de leishmaniose, cancer de mama que regrediu, irmaos autistas que falaram pela primeira vez. Quer ver? Acesse nosso site: metodocorpolimpo.com.br',
    category: 'geral',
    tags: ['ceticismo', 'prova', 'evidencia'],
  },
  {
    question: 'CDS e muito caro?',
    answer: 'Na verdade, o CDS e provavelmente a solucao de saude mais acessivel que existe! Produzindo em casa (o curso ensina), o custo fica em cerca de R$1,20 por litro. Mesmo comprando pronto na loja (clo2br.com.br), custa muito menos que uma consulta medica ou remedio controlado. A Zila, consultanda do Gabriel, disse: "Quando olhei o preco da consultoria, em vista de tudo que eu ja gastei esta de graca. Eu vendi um imovel tentando me curar." O investimento real e no conhecimento de como usar corretamente.',
    category: 'geral',
    tags: ['preco', 'custo', 'acessivel'],
  },
  {
    question: 'Meu medico disse que CDS e perigoso',
    answer: 'E natural que seu medico tenha essa posicao — a maioria dos medicos nao estudou dioxido de cloro na faculdade. Na Bolivia, o CDS entrou nas faculdades de engenharia, nao de medicina. A confusao com agua sanitaria e disseminada ate entre profissionais de saude. Porem, mais de 10.000 medicos que ESTUDARAM o CDS fazem parte da COMUSAV e recomendam. No nosso site (metodocorpolimpo.com.br), temos os estudos cientificos que voce pode ate mostrar para o seu medico. Conhecimento nunca e demais!',
    category: 'geral',
    tags: ['medico', 'ceticismo', 'faculdade'],
  },
  {
    question: 'Tenho medo de dar CDS para meu filho',
    answer: 'O cuidado com criancas e super importante! O CDS e seguro para criancas — o potencial de oxidacao (0,95V) e menor que o do oxigenio que elas respiram (1,23V). O Enzo (12 anos, filho adotivo do Gabriel) toma normalmente. Uma menina de 2 anos com anemia falciforme toma ate hoje. Irmaos autistas de 26 anos melhoraram na primeira semana. A dosagem infantil e menor e vai aumentando gradualmente. Para criancas, o ideal e ter acompanhamento — o Gabriel oferece consultoria (R$620) para orientar o protocolo certinho.',
    category: 'seguranca',
    tags: ['crianca', 'medo', 'filho'],
  },
  {
    question: 'Nao tenho tempo para fazer protocolo com CDS',
    answer: 'O CDS basico e super simples! O Gabriel diz: "Duas tampinhas num litro de agua. Bebe ao longo do dia." Nao precisa de preparacao elaborada. O CDS pronto ja vem prontinho para diluir. Sao 2 minutos por dia para a manutencao. Na loja (clo2br.com.br), voce encontra o CDS ja pronto. Mais facil que tomar um remedio!',
    category: 'geral',
    tags: ['tempo', 'praticidade', 'simples'],
  },

  // =====================================================
  // MITOS (fonte: objecoes-e-mitos.md)
  // =====================================================
  {
    question: 'CDS e alvejante? E cloro?',
    answer: 'Mito! CDS (ClO2) e dioxido de cloro. Alvejante (NaClO) e hipoclorito de sodio. Sao substancias COMPLETAMENTE diferentes com formulas quimicas distintas. O dioxido de cloro e usado mundialmente para purificar agua potavel — a Sabesp usa! E como dizer que agua (H2O) e perigosa porque agua oxigenada (H2O2) e corrosiva.',
    category: 'seguranca',
    tags: ['mito', 'alvejante', 'cloro'],
  },
  {
    question: 'CDS causa corrosao no estomago?',
    answer: 'Mito! O CDS tem pH neutro e potencial de oxidacao (0,95V) MENOR que o oxigenio (1,23V). Nossas mucosas suportam ate 1,3V. O CDS nao corroi nada — nem mucosas, nem estomago, nem orgaos. E considerado um dos oxidantes mais suaves que existem.',
    category: 'seguranca',
    tags: ['mito', 'corrosao', 'estomago'],
  },
  {
    question: 'Se CDS funcionasse, a medicina ja usaria',
    answer: 'Mito! O dioxido de cloro nao e patenteavel (e uma molecula natural). Sem patente = sem investimento de grandes laboratorios = sem estudos patrocinados pela industria farmaceutica. Nao e que nao funciona — e que nao da lucro para a industria. Mesmo assim, mais de 10.000 medicos na COMUSAV usam, a Bolivia aprovou por lei, e universidades produzem e vendem CDS.',
    category: 'geral',
    tags: ['mito', 'medicina', 'industria'],
  },

  // =====================================================
  // PRECOS E PRODUTOS (fonte: conteudo-pago.md + products.js)
  // =====================================================
  {
    question: 'Quanto custa o curso de CDS?',
    answer: 'O Curso Completo do Metodo Corpo Limpo custa R$297 (pagamento unico, acesso vitalicio). Inclui 6 modulos com video-aulas, todos os 26 protocolos com dosagens, guia de doencas A-Z, como produzir CDS em casa, protocolos especiais (nebulizacao, enema, topico), material complementar em PDF e acesso a comunidade exclusiva de alunos. Link: https://pay.hotmart.com/X100011388O?checkoutMode=10',
    category: 'geral',
    tags: ['preco', 'curso', 'compra'],
  },
  {
    question: 'Quanto custa a consultoria com o Gabriel?',
    answer: 'A Consultoria Individual com o Gabriel custa R$620. Inclui: atendimento por Zoom (ate 1h30), explicacao clara sobre o CDS, analise do seu caso pessoal (historico, sintomas, objetivos), protocolos personalizados (dosagens, horarios, formas de uso), e acompanhamento por WhatsApp durante 30 dias para tirar duvidas e ajustar protocolos. Agende pelo WhatsApp: https://wa.me/75998546139',
    category: 'geral',
    tags: ['preco', 'consultoria', 'mentoria'],
  },
  {
    question: 'Onde comprar CDS pronto?',
    answer: 'Voce pode comprar CDS pronto na loja CLO2BR: clo2br.com.br/cds — tem CDS pronto, kits para produzir em casa, DMSO e outros produtos. Entrega para todo o Brasil. Dica do Gabriel: "O primeiro CDS e gratis" — ele sempre diz isso porque quer que todo mundo experimente!',
    category: 'geral',
    tags: ['compra', 'loja', 'clo2br'],
  },
  {
    question: 'Tem conteudo gratuito sobre CDS?',
    answer: 'Sim! Temos varios conteudos gratuitos: 1) Universidade Dioxi no site (metodocorpolimpo.com.br) com artigos e estudos. 2) Grupo Telegram Corpo Limpo (gratis): https://t.me/+YFVp36x1zKhmM2Ix 3) Guia Basico para Iniciantes em PDF gratis. 4) Guia do Protocolo K gratis. 5) Forum CDS: forumcds.com. Comece por la e depois, se quiser se aprofundar, temos o curso completo (R$297).',
    category: 'geral',
    tags: ['gratuito', 'gratis', 'iniciante'],
  },
  {
    question: 'Qual a diferenca entre o curso e a consultoria?',
    answer: 'O Curso (R$297) ensina TUDO sobre CDS de forma geral: 26 protocolos, dosagens, producao, guia de doencas A-Z — e o conhecimento completo. A Consultoria (R$620) e atendimento INDIVIDUAL com o Gabriel: ele analisa seu caso pessoal, cria protocolos personalizados para voce e te acompanha por 30 dias via WhatsApp. Se seu caso e simples, o curso basta. Se e complexo (cancer, multiplas condicoes, etc.), a consultoria e o ideal.',
    category: 'geral',
    tags: ['diferenca', 'curso', 'consultoria'],
  },
  {
    question: 'Tem livro sobre CDS?',
    answer: 'Sim! Temos o Ebook Completo + Protocolos Biooxidativos de A a Z por R$97 (livro digital completo). Tambem temos o Livro CDS para Animais por R$67. Os ebooks estao disponiveis no site: metodocorpolimpo.com.br. O ebook geral e otimo para quem quer uma referencia de consulta rapida sobre todos os protocolos.',
    category: 'geral',
    tags: ['livro', 'ebook', 'compra'],
  },

  // =====================================================
  // DEPOIMENTOS (fonte: depoimentos-resumo.md)
  // =====================================================
  {
    question: 'Tem depoimentos de pessoas que usaram CDS?',
    answer: 'Sim, temos centenas de depoimentos documentados! Alguns dos mais impressionantes: Tom (cachorro do Gabriel) curado de leishmaniose terminal em 2 meses. Mae da Geni (86 anos) com nodulo no seio que regrediu em dias. Luanda com cancer de mama e metastase ossea — "a mancha sumiu" nos exames. Marido da Geni com arteria 100% obstruida que desobstruiu. Irmaos autistas que comecaram a falar na primeira semana. Vizinho pos-AVC que voltou a trabalhar normalmente. Veja mais em nosso site: metodocorpolimpo.com.br/depoimentos',
    category: 'geral',
    tags: ['depoimento', 'caso-real', 'resultado'],
  },

  // =====================================================
  // ESTUDOS CIENTIFICOS (fonte: estudos-cientificos.md)
  // =====================================================
  {
    question: 'Existem estudos cientificos sobre CDS?',
    answer: 'Sim! Existem 3 ensaios clinicos formais com mais de 3.000 pacientes, onde apenas 6% relataram efeitos colaterais leves e nenhum efeito adverso grave. O biofisico Andreas Kalcker tem 4 patentes internacionais registradas para tratamento com dioxido de cloro (inflamacao, infeccoes, COVID-19 e regeneracao celular). Ha tambem estudos sobre CDS como agente antimicrobiano nao-toxico, efetividade no tratamento de COVID-19, e dossiê de ensaio clinico completo. Temos artigos sobre esses estudos na Universidade Dioxi do nosso site.',
    category: 'ciencia',
    tags: ['estudo', 'cientifico', 'patente'],
  },
  {
    question: 'O CDS tem patentes registradas?',
    answer: 'Sim! Andreas Kalcker tem 4 patentes internacionais registradas: WO2018185347A1 (tratamento de inflamacao), WO2018185346A1 (tratamento de infeccoes e sepse), 11136-CH 00506/20 (tratamento de COVID-19), e uma patente de celulas-tronco para regeneracao celular. Alem de Kalcker, existem mais de 30 patentes de diversos pesquisadores desde 1982, incluindo documentos da OMS, EPA e CDC sobre dioxido de cloro.',
    category: 'ciencia',
    tags: ['patente', 'kalcker', 'ciencia'],
  },

  // =====================================================
  // USO PRATICO (fonte: dosagem-e-preparacao.md)
  // =====================================================
  {
    question: 'E possivel fazer CDS em casa?',
    answer: 'Sim! Produzir CDS em casa e simples e muito economico — o custo fica em torno de R$1,20 por litro. Voce precisa de clorito de sodio + acido, um sistema de producao (garrafa, bombinha, vedacao) e agua. O processo envolve ativar os componentes e capturar o gas em agua. O curso completo (R$297) ensina todo o passo a passo com video. Na loja (clo2br.com.br), voce encontra kits prontos para producao.',
    category: 'protocolo',
    tags: ['producao', 'caseiro', 'custo'],
  },
  {
    question: 'Posso tomar CDS com suco ou comida?',
    answer: 'Evite! O CDS deve ser tomado em jejum, com intervalo de pelo menos 1 hora antes e depois de comer. Nao misture com substancias acidas (limao, vinagre, vitamina C, bicarbonato) pois cancelam o efeito. Suco de laranja e limao sao especialmente problematicos. O ideal e tomar o CDS diluido em agua pura, distribuido ao longo do dia.',
    category: 'protocolo',
    tags: ['alimentacao', 'jejum', 'interacao'],
  },
  {
    question: 'CDS pode ser usado para limpar a casa?',
    answer: 'Sim! CDS puro no chao substitui agua sanitaria para limpeza. Tambem elimina mofo (gas do CDS em banheiro fechado), fungos em sapatos e desinfeta ambientes. E muito mais seguro que agua sanitaria para limpeza domestica. O Protocolo H (Habitacao) e especifico para desinfeccao de ambientes.',
    category: 'geral',
    tags: ['limpeza', 'ambiente', 'casa'],
  },
  {
    question: 'Como comecar a usar CDS?',
    answer: 'Se voce esta comecando, siga estes passos: 1) Informe-se — acesse a Universidade Dioxi no nosso site (gratis). 2) Compre CDS pronto na loja (clo2br.com.br) ou aprenda a produzir no curso. 3) Comece pelo Protocolo C basico: doses baixas, aumentando gradualmente. 4) Observe seu corpo — se sentir desconforto, diminua a dose. 5) Para orientacao personalizada, a consultoria com Gabriel (R$620) inclui 30 dias de acompanhamento. O Gabriel diz: "O primeiro CDS e gratis" — comece!',
    category: 'geral',
    tags: ['iniciante', 'comecar', 'primeiro-uso'],
  },

  // =====================================================
  // SUBSTANCIAS COMPLEMENTARES
  // =====================================================
  {
    question: 'O que e DMSO e para que serve?',
    answer: 'DMSO (Dimetilsulfoxido) e um transportador natural extraido da madeira. Ele penetra nos tecidos e leva substancias (como o CDS) para camadas profundas do corpo — ossos, nervos, medula. O Gabriel diz que o DMSO e 7 vezes menos toxico que aspirina. E usado no Protocolo K (Sanduiche) combinado com CDS para problemas localizados como artrite, tumores e dores. Pode ser usado topicamente (na pele) ou oralmente. IMPORTANTE: nunca usar DMSO no enema. No curso, voce aprende as diluicoes e protocolos corretos.',
    category: 'protocolo',
    tags: ['dmso', 'transportador', 'complementar'],
  },

  // =====================================================
  // SOBRE O SITE E RECURSOS
  // =====================================================
  {
    question: 'Qual o site do Metodo Corpo Limpo?',
    answer: 'Nosso site principal e metodocorpolimpo.com.br — la voce encontra a Universidade Dioxi com artigos gratuitos, informacoes sobre o CDS, cursos, livros e a consultoria. A loja de produtos e clo2br.com.br/cds. Tambem temos o Forum CDS em forumcds.com e o Grupo Telegram gratuito Corpo Limpo.',
    category: 'geral',
    tags: ['site', 'link', 'recursos'],
  },
  {
    question: 'O que e a Universidade Dioxi?',
    answer: 'A Universidade Dioxi e a secao gratuita do nosso site (metodocorpolimpo.com.br) com artigos educativos, estudos cientificos e conteudo sobre CDS e Terapias Bio-oxidativas. La voce encontra informacoes sobre o que e CDS, por que e seguro, protocolos gerais, mitos desvendados e muito mais. E 100% gratuito e ideal para quem esta comecando a aprender sobre CDS!',
    category: 'geral',
    tags: ['universidade', 'gratis', 'artigos'],
  },
];

// ============================================================

async function seed() {
  console.log('=== Seed Knowledge Base do Metodo Corpo Limpo ===\n');
  console.log(`Total de Q&A pairs para inserir: ${SEED_DATA.length}\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const entry of SEED_DATA) {
    // Verificar se ja existe pergunta similar
    const searchTerm = entry.question.slice(0, 30).replace(/[%_]/g, '');
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/knowledge_base?question=ilike.*${encodeURIComponent(searchTerm)}*&select=id&limit=1`,
      { headers }
    );
    const existing = await checkRes.json();

    if (existing && existing.length > 0) {
      console.log(`  [SKIP] ${entry.question.slice(0, 60)}...`);
      skipped++;
      continue;
    }

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_base`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...entry,
        status: 'approved',
        asked_by: 'admin',
        approved_at: new Date().toISOString(),
      }),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error(`  [ERRO] ${entry.question.slice(0, 50)}: ${errText}`);
      errors++;
    } else {
      console.log(`  [OK] ${entry.question.slice(0, 60)}`);
      inserted++;
    }
  }

  console.log('\n=== Resultado ===');
  console.log(`  Inseridas: ${inserted}`);
  console.log(`  Ja existiam: ${skipped}`);
  console.log(`  Erros: ${errors}`);
  console.log(`  Total no script: ${SEED_DATA.length}`);
  console.log('\n>>> Agora execute: node scripts/generate-embeddings.js');
}

seed().catch(console.error);
