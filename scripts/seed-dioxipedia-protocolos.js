// Script para popular protocolos na Universidade Dioxi
// Executar: node scripts/seed-dioxipedia-protocolos.js

const { readFileSync } = require('fs');
const { resolve } = require('path');

// Ler .env.local
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
// PROTOCOLOS — UNIVERSIDADE DIOXI (Metodo Corpo Limpo)
// Todos os 26 protocolos de A a Z
// ============================================================

const ARTICLES = [
  // =====================================================
  // PROTOCOLO A — Iniciante
  // =====================================================
  {
    slug: 'protocolo-a-iniciante',
    title: 'Protocolo A — Para Iniciantes',
    excerpt: 'O protocolo ideal para quem esta comecando. Aprenda o passo a passo do Protocolo A com doses suaves e progressivas para uma adaptacao tranquila ao CDS.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo A?</h2>
<p>O Protocolo A e o <strong>ponto de partida perfeito</strong> para quem esta conhecendo o CDS agora. Ele foi pensado especialmente para pessoas que querem comecar de forma segura, com doses bem suaves e um aumento gradual.</p>
<p>Se voce tem alguma hesitacao ou simplesmente quer ir com calma, este e o protocolo certo para voce. Aqui no <strong>Metodo Corpo Limpo</strong>, sempre recomendamos comecar pelo Protocolo A antes de avancar para protocolos mais intensos.</p>

<h2>Dosagem do Protocolo A</h2>
<p>A dose-alvo do Protocolo A e de <strong>5 ml de CDS</strong> (a 0,3% ou 3000 ppm) por dia. Mas voce nao comeca com essa dose — a ideia e ir subindo aos poucos:</p>

<h3>Dia 1 — Primeira Dose</h3>
<ul>
<li>Misture <strong>2 ml de CDS</strong> em <strong>200 ml de agua</strong></li>
<li>Tome antes de dormir</li>
</ul>

<h3>Dia 2 em diante — Dose Diaria</h3>
<ul>
<li>Misture <strong>3 ml de CDS</strong> em <strong>1 litro de agua</strong></li>
<li>Divida em <strong>5 tomadas</strong> ao longo do dia</li>
<li>Beba uma porcao a cada 2-3 horas</li>
</ul>

<h3>Escalonamento Progressivo</h3>
<table>
<thead><tr><th>Dia</th><th>Dose de CDS</th><th>Volume de Agua</th><th>Tomadas</th></tr></thead>
<tbody>
<tr><td>Dia 1</td><td>2 ml</td><td>200 ml</td><td>1 (antes de dormir)</td></tr>
<tr><td>Dia 2</td><td>3 ml</td><td>1 litro</td><td>5 ao longo do dia</td></tr>
<tr><td>Dia 3</td><td>4 ml</td><td>1 litro</td><td>5 ao longo do dia</td></tr>
<tr><td>Dia 4+</td><td>5 ml</td><td>1 litro</td><td>5 ao longo do dia</td></tr>
</tbody>
</table>
<p>Aumente <strong>1 ml por dia</strong> ate atingir o alvo de 5 ml em 1 litro de agua por dia.</p>

<h2>Quando Reduzir a Dose?</h2>
<blockquote>Se voce sentir qualquer desconforto (nausea leve, dor de cabeca, cansaco), <strong>reduza para a dose anterior</strong> e mantenha ate se sentir confortavel novamente. Isso e completamente normal e faz parte do processo de adaptacao.</blockquote>

<h2>Para que Serve o Protocolo A?</h2>
<p>O Protocolo A e adequado para:</p>
<ul>
<li><strong>Uso a longo prazo</strong> — manutencao diaria</li>
<li><strong>Profilaxia</strong> — prevencao e protecao geral</li>
<li><strong>Adaptacao</strong> — preparacao do corpo para protocolos mais fortes</li>
</ul>

<h2>Progressao para o Protocolo C</h2>
<p>Apos 7 dias no Protocolo A, voce pode aumentar <strong>1 ml por dia</strong> ate atingir <strong>10 ml de CDS por litro</strong> — nesse ponto voce ja estara fazendo o <strong>Protocolo C</strong>, que e o protocolo padrao.</p>
<p>Essa transicao e natural e suave. Seu corpo ja estara acostumado e a mudanca sera tranquila.</p>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Use agua filtrada ou mineral (nunca agua da torneira com cloro)</li>
<li>Prepare a garrafa de 1 litro pela manha e va tomando ao longo do dia</li>
<li>Mantenha o CDS na geladeira para preservar a potencia</li>
<li>Tome longe das refeicoes (pelo menos 30 minutos antes ou 1 hora depois)</li>
<li>Se estiver tomando outros medicamentos, espere 1 hora entre o medicamento e o CDS</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO B — Banho
  // =====================================================
  {
    slug: 'protocolo-b-banho',
    title: 'Protocolo B — Banho com CDS',
    excerpt: 'Ideal para quem nao pode ou nao quer ingerir CDS. O Protocolo B utiliza banhos de imersao para desintoxicacao pela pele de forma simples e eficaz.',
    category: 'protocolos',
    reading_time_minutes: 5,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo B?</h2>
<p>O Protocolo B e um <strong>banho de imersao com CDS</strong> projetado para desintoxicacao atraves da pele. E uma excelente alternativa para quem nao pode ou prefere nao ingerir CDS por via oral.</p>
<p>A pele e o maior orgao do corpo e absorve substancias de forma eficiente — o Protocolo B aproveita essa capacidade natural para promover a limpeza do organismo.</p>

<h2>Dosagem Padrao</h2>
<ul>
<li><strong>150 ml de CDS</strong> (0,3% / 3000 ppm) em <strong>100 litros de agua</strong></li>
<li>Proporcao de preparo: <strong>15 ml de CDS para cada 2 litros de agua</strong></li>
<li>Duracao do banho: <strong>20 minutos</strong></li>
</ul>

<h3>Para Casos Mais Intensos</h3>
<p>Em situacoes que exigem uma resposta mais forte, a dosagem pode ser aumentada para ate <strong>250 ml de CDS em 100 litros de agua</strong>.</p>

<h2>Como Fazer o Banho</h2>
<ol>
<li>Encha a banheira com agua a aproximadamente <strong>34 graus Celsius</strong></li>
<li>Certifique-se de que a banheira esteja <strong>limpa e livre de sabao</strong> ou produtos quimicos</li>
<li>Adicione o CDS na agua e misture bem</li>
<li>Entre na banheira e <strong>submirja o corpo inteiro</strong>, incluindo cabeca e couro cabeludo</li>
<li>Permaneca na agua por pelo menos 20 minutos (pode ficar ate a agua esfriar)</li>
</ol>

<h2>Cuidados de Seguranca</h2>
<blockquote>Mantenha a porta do banheiro <strong>aberta</strong> para garantir boa ventilacao. Isso e especialmente importante em banheiros pequenos.</blockquote>
<ul>
<li>Nesta diluicao, o CDS <strong>nao prejudica os olhos</strong> caso entre agua durante o banho</li>
<li>A liberacao de gas continua independente do volume de agua</li>
<li>Banheiros pequenos precisam de ventilacao adequada</li>
</ul>

<h2>Metodo Alternativo (sem CDS pronto)</h2>
<p>Se voce nao tiver CDS pronto, pode usar o metodo com clorito de sodio:</p>
<ol>
<li>Ative <strong>50 gotas de clorito de sodio</strong> com ativador HCl 4%</li>
<li>Aguarde <strong>1 minuto</strong> de ativacao</li>
<li>Despeje lentamente na agua do banho e misture</li>
</ol>
<p><strong>Importante:</strong> Nunca prepare esta mistura em recipiente fechado — os gases sao reativos sob pressao.</p>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Faca o banho no final do dia para relaxar</li>
<li>Nao use shampoo, sabonete ou outros produtos durante o banho com CDS</li>
<li>Apos o banho, pode enxaguar com agua limpa se preferir</li>
<li>Combinar com o Protocolo C por via oral potencializa os resultados</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO C — Padrao
  // =====================================================
  {
    slug: 'protocolo-c-padrao',
    title: 'Protocolo C — O Protocolo Padrao',
    excerpt: 'O protocolo mais utilizado e a base de todos os outros. Aprenda a dosagem correta, como administrar e quando ajustar o Protocolo C para obter os melhores resultados.',
    category: 'protocolos',
    reading_time_minutes: 7,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo C?</h2>
<p>O Protocolo C e o <strong>protocolo padrao e mais utilizado</strong> do Metodo Corpo Limpo. Ele serve como base para a maioria dos outros protocolos e e o que recomendamos para uso diario e tratamento geral.</p>
<p>Se voce ja fez a adaptacao com o Protocolo A, o Protocolo C e o proximo passo natural.</p>

<h2>Dosagem Padrao</h2>
<ul>
<li>Misture <strong>10 ml de CDS</strong> (3000 ppm) em <strong>1 litro de agua potavel</strong></li>
<li>Divida em <strong>10 doses de 100 ml</strong></li>
<li>Tome <strong>1 dose a cada hora</strong> ao longo do dia</li>
</ul>

<h3>Concentracao e Seguranca</h3>
<table>
<thead><tr><th>Parametro</th><th>Valor</th></tr></thead>
<tbody>
<tr><td>Concentracao diaria</td><td>0,0003% (30 ppm)</td></tr>
<tr><td>Por dose individual</td><td>3 mg de ClO2</td></tr>
<tr><td>Total diario</td><td>30 mg de ClO2</td></tr>
<tr><td>Perfil</td><td>Dentro da faixa segura e nao toxica</td></tr>
</tbody>
</table>

<h2>Como Administrar</h2>
<ol>
<li>Prepare a garrafa de 1 litro pela manha</li>
<li>Tome 100 ml a cada hora (use um timer no celular se precisar)</li>
<li>Se estiver tomando medicamentos, <strong>aguarde 1 hora</strong> antes de consumir o CDS</li>
<li>Continue ate terminar a garrafa</li>
</ol>

<h2>Ajustes de Dose</h2>
<p>A dose pode ser ajustada conforme necessidade:</p>

<h3>Para Aumentar (condicoes que exigem mais)</h3>
<ul>
<li>Aumente progressivamente ate <strong>15 ml em doses separadas</strong></li>
<li>Maximo recomendado: <strong>30 ml por litro</strong> (para prevenir secura na garganta)</li>
<li>Para casos severos acima de 60 ml em 12 tomadas diarias, prepare garrafas adicionais</li>
</ul>

<h3>Para Reduzir</h3>
<ul>
<li>Se sentir desconforto ou nausea, <strong>reduza a dose</strong> imediatamente</li>
<li>Volte ao nivel anterior e mantenha ate se sentir bem</li>
</ul>

<h2>Efeitos Esperados</h2>
<p>Nas doses especificadas, <strong>nenhum efeito colateral serio</strong> ou interacoes indesejadas sao relatados. A solucao e completamente absorvida no estomago, nao causando diarreia.</p>

<h2>Duracao do Tratamento</h2>
<p>Continue ate sentir-se recuperado. Devido ao perfil seguro nas doses indicadas, o Protocolo C pode ser mantido por tempo indeterminado para manutencao e prevencao.</p>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Prepare a garrafa pela manha e guarde em local fresco e escuro</li>
<li>Use garrafa de vidro escuro ou cubra com papel aluminio para proteger da luz</li>
<li>Nao misture com suco de laranja ou vitamina C — eles neutralizam o CDS</li>
<li>Tome longe das refeicoes para melhor absorcao</li>
<li>Beba bastante agua pura ao longo do dia alem do litro com CDS</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO D — Pele (Dermatologico)
  // =====================================================
  {
    slug: 'protocolo-d-pele',
    title: 'Protocolo D — Dermatologico (Pele)',
    excerpt: 'CDS aplicado diretamente na pele com pulverizador. Ideal para infeccoes cutaneas, feridas, queimaduras e prevencao de contagio. Aprenda as tecnicas corretas.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo D?</h2>
<p>O Protocolo D e a aplicacao <strong>dermatologica do CDS</strong> — ou seja, diretamente na pele. Utilizando um pulverizador (spray), voce aplica a solucao nas areas afetadas para tratar diversos problemas cutaneos.</p>

<h2>Para que Serve?</h2>
<p>O Protocolo D e indicado para <strong>todos os tipos de infeccoes de pele</strong>, incluindo:</p>
<ul>
<li>Feridas abertas e cortes</li>
<li>Queimaduras</li>
<li>Infeccoes resistentes (como MRSA)</li>
<li>Acne e problemas de pele variados</li>
<li>Picadas de inseto infeccionadas</li>
</ul>

<h2>Como Aplicar</h2>
<h3>Aplicacao Padrao</h3>
<ol>
<li>Coloque <strong>CDS puro (0,3% / 3000 ppm)</strong> em um <strong>frasco spray</strong></li>
<li>Pulverize diretamente nas areas afetadas</li>
<li><strong>Nao cubra</strong> a area apos a aplicacao — deixe a pele respirar</li>
<li>Reaplicar quantas vezes quiser ao longo do dia (ate a cada hora)</li>
<li>Continue ate a remissao completa</li>
</ol>
<p>A solucao <strong>alivia a dor e auxilia na cicatrizacao</strong>, sem causar irritacao na pele.</p>

<h2>Protocolo DC — Prevencao de Contagio</h2>
<p>Uma variacao especial para <strong>prevenir contagio</strong> apos contato com pessoas doentes:</p>
<ul>
<li>Dilua 1 parte de CDS 3000 ppm com <strong>3 partes de soro fisiologico</strong> em frasco spray</li>
<li>Apos contato com pessoas doentes, pulverize sobre <strong>boca, nariz e olhos</strong></li>
<li>Para membranas mucosas sensíveis, dilua ainda mais: <strong>1:10 em soro fisiologico</strong></li>
</ul>

<h2>Cuidados Importantes</h2>
<blockquote>O CDS puro pode ser aplicado na pele sem problemas, mas existem algumas precaucoes essenciais:</blockquote>
<ul>
<li><strong>Nao use curativos oclusivos</strong> com solucao concentrada — a pele precisa respirar</li>
<li><strong>Nao aplique forma concentrada no umbigo</strong> cobrindo por periodos prolongados</li>
<li>Mecanismos do pulverizador podem <strong>corroer apos alguns dias</strong> — substitua se notar sinais de corrosao</li>
<li>Para uso prolongado, tenha frascos spray extras a disposicao</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Mantenha um frasco spray com CDS na geladeira sempre pronto para uso</li>
<li>Para feridas, combine o Protocolo D com o Protocolo C por via oral para resultados mais rapidos</li>
<li>Use frascos de vidro escuro com borrifador para maior durabilidade</li>
<li>O CDS spray tambem funciona como excelente desinfetante para as maos</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO E — Enemas
  // =====================================================
  {
    slug: 'protocolo-e-enemas',
    title: 'Protocolo E — Enemas com CDS',
    excerpt: 'O protocolo de limpeza intestinal profunda com CDS. Aprenda o procedimento completo, frequencias recomendadas e as variacoes clinicas para diferentes necessidades.',
    category: 'protocolos',
    reading_time_minutes: 8,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo E?</h2>
<p>O Protocolo E utiliza <strong>enemas com CDS</strong> para limpeza intestinal profunda. E uma ferramenta poderosa para desintoxicacao e tratamento de condicoes que afetam o trato gastrointestinal.</p>

<h2>Dosagem Padrao</h2>
<p><strong>10 ml de CDS</strong> (0,3% / 3000 ppm) por litro de agua.</p>

<h2>Procedimento do Enema Padrao</h2>
<h3>Preparo</h3>
<ol>
<li>Aqueca a agua ate a <strong>temperatura corporal</strong> (aproximadamente 37 graus)</li>
<li>Misture o CDS na agua dentro de um <strong>irrigador intestinal de 2 litros</strong></li>
<li>Lubrifique a ponta do irrigador com <strong>vaselina</strong></li>
</ol>

<h3>Aplicacao</h3>
<ol>
<li>Deite-se sobre o <strong>lado esquerdo</strong> — isso facilita a penetracao profunda da agua no intestino</li>
<li>Insira a ponta lubrificada com cuidado</li>
<li>Deixe a agua fluir lentamente</li>
<li>Retenha o liquido por <strong>aproximadamente 3 minutos</strong> (maximo de 5 minutos)</li>
<li>Evacue normalmente</li>
</ol>

<h3>Frequencia Recomendada</h3>
<ul>
<li><strong>Padrao:</strong> 1 vez ao dia, preferencialmente a noite</li>
<li><strong>Alternativo:</strong> A cada 2-3 dias, por 1-2 semanas</li>
<li><strong>Casos serios:</strong> Ate 2 vezes ao dia</li>
</ul>

<h3>Adicao Opcional</h3>
<p>Agua do mar pode ser adicionada na proporcao de <strong>1:3</strong> (1 parte de agua do mar para 3 partes de agua doce) para enriquecer com minerais.</p>

<h2>Sistema Yogui — Cronograma Completo</h2>
<p>Este cronograma sistematico distribui <strong>12 enemas em 39 dias</strong>:</p>
<table>
<thead><tr><th>Fase</th><th>Frequencia</th><th>Total</th></tr></thead>
<tbody>
<tr><td>Fase 1</td><td>3 noites consecutivas</td><td>3 enemas</td></tr>
<tr><td>Fase 2</td><td>3 enemas em noites alternadas</td><td>3 enemas</td></tr>
<tr><td>Fase 3</td><td>3 enemas a cada 3 dias</td><td>3 enemas</td></tr>
<tr><td>Fase 4</td><td>3 enemas semanais</td><td>3 enemas</td></tr>
</tbody>
</table>

<h2>Protocolo EC — Enema Clinico de Absorcao Lenta</h2>
<p>Variacao avancada que utiliza set de venoclise (soro) com tubo macio inserido no reto, permitindo absorcao lenta e controlada ao longo da noite:</p>

<table>
<thead><tr><th>Variante</th><th>Soro</th><th>CDS</th><th>Duracao</th></tr></thead>
<tbody>
<tr><td><strong>EC10</strong></td><td>0,5 litro</td><td>10 ml (3000 ppm)</td><td>6-8 horas</td></tr>
<tr><td><strong>EC20</strong></td><td>0,75 litro</td><td>20 ml (3000 ppm)</td><td>8-10 horas</td></tr>
<tr><td><strong>EC30</strong></td><td>1 litro</td><td>30 ml (3000 ppm)</td><td>10-12 horas</td></tr>
</tbody>
</table>
<p>As taxas de gotejamento devem ser ajustadas com base na tolerancia. Administrar a noite com agua morna.</p>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Faca o enema preferencialmente a noite antes de dormir</li>
<li>Certifique-se de estar proximo ao banheiro</li>
<li>Comece com o enema padrao antes de tentar o EC</li>
<li>A agua deve estar morna — nunca quente ou fria demais</li>
<li>Combine com Protocolo C por via oral para melhores resultados</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO F — Febre
  // =====================================================
  {
    slug: 'protocolo-f-febre',
    title: 'Protocolo F — Febre e Infeccoes Agudas',
    excerpt: 'Protocolo de doses frequentes para combater febre, infeccoes virais e bacterianas agudas. Doses a cada 15 minutos para acao rapida nos momentos que mais importam.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo F?</h2>
<p>O Protocolo F e o protocolo de <strong>acao rapida</strong> do Metodo Corpo Limpo. Ele utiliza doses <strong>frequentes a cada 15 minutos</strong> por 2 horas para combater febre e infeccoes agudas de forma intensa.</p>
<p>E altamente recomendado para casos subitos de desconforto, como intoxicacoes alimentares ou doencas bacterianas e virais.</p>

<h2>Dosagem Basica</h2>
<ul>
<li><strong>10 ml de CDS</strong> (3000 ppm) em <strong>0,5 litro de agua</strong></li>
<li>Tomar <strong>8 doses de 60 ml</strong> a cada <strong>15 minutos</strong></li>
<li>Duracao total: <strong>2 horas</strong></li>
</ul>
<blockquote>Use um timer no celular! As doses devem ser tomadas a cada 15 minutos — nao mais distantes que isso.</blockquote>

<h2>Variantes de Dosagem</h2>
<table>
<thead><tr><th>Variante</th><th>CDS</th><th>Agua</th><th>Dose</th><th>Frequencia</th></tr></thead>
<tbody>
<tr><td><strong>F10</strong></td><td>10 ml</td><td>0,5 litro</td><td>60 ml</td><td>A cada 15 min (8 doses)</td></tr>
<tr><td><strong>F15</strong></td><td>15 ml</td><td>0,5 litro</td><td>60 ml</td><td>A cada 15 min (8 doses)</td></tr>
<tr><td><strong>F20</strong></td><td>20 ml</td><td>0,75 litro</td><td>60 ml</td><td>A cada 15 min (8 doses)</td></tr>
<tr><td><strong>F30</strong> (severo)</td><td>30 ml</td><td>1 litro</td><td>125 ml</td><td>A cada 15 min (8 doses)</td></tr>
</tbody>
</table>

<h2>Repeticoes</h2>
<p>Em casos severos, o Protocolo F pode ser repetido <strong>ate 3 vezes ao dia</strong>, desde que haja um intervalo de <strong>pelo menos 2 horas</strong> entre cada rodada.</p>

<h2>Apos o Protocolo F</h2>
<p>Depois de completar o Protocolo F, continue com o <strong>Protocolo C</strong> para manutencao. Para casos severos, adicione o <strong>Protocolo EC</strong> (enema clinico) a noite.</p>

<h2>Quando Usar o Protocolo F</h2>
<ul>
<li>Febre alta</li>
<li>Infeccoes virais agudas</li>
<li>Infeccoes bacterianas</li>
<li>Intoxicacao alimentar</li>
<li>Mal-estar subito e intenso</li>
<li>Doencas de progressao rapida</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Comece com o F10 e suba para F15 ou F20 se precisar de mais intensidade</li>
<li>Mantenha-se hidratado com agua pura entre as rodadas</li>
<li>Descanse durante e apos o protocolo</li>
<li>Anote os horarios de cada dose para nao perder nenhuma</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO G — Gas
  // =====================================================
  {
    slug: 'protocolo-g-gas',
    title: 'Protocolo G — Aplicacao Gasosa',
    excerpt: 'Utilize o gas do CDS para tratamentos localizados. Dois metodos eficazes: o protocolo do copo para areas pequenas e o protocolo do saco para tratamento corporal amplo.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo G?</h2>
<p>O Protocolo G utiliza o <strong>gas liberado pelo CDS</strong> para tratamento localizado. Sao dois metodos distintos, cada um ideal para diferentes situacoes.</p>

<h2>Metodo A — Protocolo do Copo</h2>
<h3>Como Funciona</h3>
<ol>
<li>Coloque <strong>10 ml de CDS puro</strong> em um copo (sem adicionar agua)</li>
<li>Posicione a area afetada sobre a abertura do copo</li>
<li>Garanta que o <strong>gas nao escape</strong> — o copo deve estar bem encostado na pele</li>
</ol>

<h3>Tempo de Exposicao</h3>
<ul>
<li><strong>Duracao padrao:</strong> 3 minutos</li>
<li><strong>Maximo:</strong> 5 minutos (para evitar irritacao)</li>
<li>Pode repetir com intervalo <strong>minimo de 1 hora</strong> entre cada aplicacao</li>
</ul>

<h3>Indicacoes Especificas</h3>
<p>O metodo do copo e indicado especialmente para <strong>infeccoes do ouvido externo</strong>.</p>
<blockquote>Para infeccoes do ouvido interno, recomendamos os Protocolos C e J combinados, alem de algumas gotas de CDS puro no ouvido por 30 segundos.</blockquote>

<h2>Metodo B — Protocolo do Saco</h2>
<p>Trata <strong>grandes areas de pele</strong> quando ingestao ou banho sao impraticaveis.</p>

<h3>Como Funciona</h3>
<ol>
<li>Junte dois sacos grandes (tipo saco de lixo) e cole-os para cobrir a area de tratamento</li>
<li>Coloque <strong>30 ml de CDS puro</strong> (sem agua) em um recipiente de vidro ou porcelana dentro do saco</li>
<li>A pessoa entra despida no saco</li>
<li>Feche o saco <strong>no nivel do pescoco</strong></li>
<li>Permaneca dentro por <strong>5 a 10 minutos</strong></li>
</ol>

<h3>Seguranca Critica</h3>
<blockquote><strong>A cabeca deve SEMPRE permanecer fora do saco!</strong> Nunca inale os vapores de gas em grandes quantidades.</blockquote>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>O metodo do copo e simples e pode ser feito em casa facilmente</li>
<li>Para o metodo do saco, peca ajuda de alguem para fechar e monitorar</li>
<li>Use recipientes de vidro — plastico pode reagir com o CDS concentrado</li>
<li>Combine com Protocolo C por via oral para resultados mais completos</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO H — Ambiente (Habitat)
  // =====================================================
  {
    slug: 'protocolo-h-ambiente',
    title: 'Protocolo H — Protecao do Ambiente',
    excerpt: 'Proteja seu quarto e ambiente domestico contra contagios e infeccoes respiratorias. O Protocolo H utiliza a evaporacao do CDS para purificar o ar de forma segura.',
    category: 'protocolos',
    reading_time_minutes: 5,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo H?</h2>
<p>O Protocolo H e uma forma de <strong>proteger seu ambiente</strong> — quarto, sala ou qualquer comodo — contra contagios e infeccoes respiratorias. Ele funciona pela evaporacao lenta e controlada do CDS no ar.</p>

<h2>Como Funciona</h2>
<ol>
<li>Coloque <strong>30 a 50 ml de CDS puro</strong> (3000 ppm) em um copo seco, preferencialmente <strong>opaco</strong></li>
<li>Posicione o copo a <strong>1 a 2 metros</strong> da pessoa</li>
<li>A solucao evapora lentamente, liberando dioxido de cloro no ar</li>
<li>Em ambientes mais quentes, a evaporacao e mais rapida</li>
</ol>

<h3>Quando Trocar a Solucao</h3>
<p>Quando a <strong>cor amarela caracteristica desaparecer</strong>, a solucao perdeu sua potencia e deve ser substituida por uma nova.</p>

<h2>Aviso Critico de Seguranca</h2>
<blockquote><strong>Inalacao direta NAO e recomendada!</strong> O Protocolo H e de evaporacao passiva — voce nao deve inalar diretamente o CDS. Apenas medicos treinados podem administrar doses inaladas minimas sob supervisao estrita.</blockquote>

<h3>Riscos da Inalacao Direta</h3>
<p>Quantidades substanciais de inalacao podem causar <strong>problemas respiratorios serios</strong> ao ocupar os alveolos pulmonares. Caso isso ocorra acidentalmente:</p>
<ul>
<li>O tratamento envolve antioxidantes e corticosteroides</li>
<li>A recuperacao completa e esperada em aproximadamente <strong>14 dias</strong></li>
</ul>

<h2>Indicacoes</h2>
<ul>
<li>Purificacao do ar em quartos de pessoas doentes</li>
<li>Prevencao de contagio em ambientes fechados</li>
<li>Protecao durante surtos respiratorios</li>
<li>Eliminacao de patogenos aéreos no ambiente</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Use um copo escuro ou envolva com papel aluminio para proteger o CDS da luz</li>
<li>Mantenha fora do alcance de criancas e animais</li>
<li>Troque a solucao diariamente ou quando perder a cor</li>
<li>Funciona muito bem combinado com outros protocolos por via oral</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO I — Picadas de Inseto
  // =====================================================
  {
    slug: 'protocolo-i-picadas',
    title: 'Protocolo I — Picadas de Inseto',
    excerpt: 'Alivio rapido e eficaz para picadas de inseto, mordidas e queimaduras. Aprenda a aplicar o CDS corretamente com toalha de papel para desinfeccao e reducao do inchaco.',
    category: 'protocolos',
    reading_time_minutes: 4,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo I?</h2>
<p>O Protocolo I e o tratamento rapido para <strong>picadas de inseto, mordidas e queimaduras</strong>. Ele utiliza CDS aplicado com toalha de papel para proporcionar alivio imediato e prevenir infeccoes.</p>

<h2>Como Aplicar</h2>
<ol>
<li>Primeiro, <strong>verifique se ha ferroes ou espinhos</strong> que precisam ser removidos</li>
<li>Embeba uma <strong>toalha de papel macia</strong> com CDS puro (3000 ppm)</li>
<li>Aplique diretamente sobre a picada ou mordida</li>
<li>Deixe secar naturalmente</li>
<li>Repita conforme necessario <strong>sem precisar lavar com agua</strong></li>
</ol>

<h3>Dica Importante sobre o Material</h3>
<blockquote>Use apenas <strong>toalha de papel</strong>! Nao use pano, algodao ou materiais oclusivos que possam causar queimaduras por contato prolongado.</blockquote>

<h2>Armazenamento para Pronto Uso</h2>
<p>Mantenha o CDS concentrado na <strong>geladeira</strong>. Quando aplicado gelado, ele ajuda a reduzir o <strong>inchaco e a dor</strong> imediatamente.</p>

<h2>Caso Especial — Picadas de Agua-viva</h2>
<p>Para picadas de agua-viva na praia:</p>
<ol>
<li>Aplique algumas gotas de <strong>clorito de sodio diretamente</strong> na area afetada</li>
<li>Deixe agir por <strong>no maximo 1 minuto</strong></li>
<li>Lave com <strong>agua do mar</strong></li>
</ol>
<p>O clorito de sodio mantem estabilidade por muitos anos e nao e afetado pela luz solar ou calor.</p>

<h2>O Protocolo I Tambem Funciona Para</h2>
<ul>
<li>Picadas de mosquito, aranha e escorpiao</li>
<li>Mordidas de carrapato</li>
<li>Queimaduras leves</li>
<li>Feridas menores</li>
<li>Irritacoes na pele</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Tenha sempre um frasco de CDS no kit de primeiros socorros</li>
<li>Para viagens, leve um frasco pequeno de CDS concentrado</li>
<li>A aplicacao gelada (direto da geladeira) alivia mais rapido</li>
<li>Combine com o Protocolo C por via oral se a picada for mais seria</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO J — Boca (Jaw)
  // =====================================================
  {
    slug: 'protocolo-j-boca',
    title: 'Protocolo J — Saude Bucal',
    excerpt: 'Enxague oral com CDS para saude dos dentes, gengivas e garganta. Aprenda a preparar a solucao, a frequencia ideal e a variacao profissional para cuidados dentarios.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo J?</h2>
<p>O Protocolo J e dedicado a <strong>saude bucal</strong> — dentes, gengivas, garganta e toda a cavidade oral. E um dos protocolos mais simples e pode fazer uma diferenca enorme na sua higiene diaria.</p>

<h2>Preparo da Solucao</h2>
<ul>
<li><strong>10 ml de CDS</strong> (3000 ppm) em <strong>200 ml de agua</strong> (um copo)</li>
</ul>

<h2>Como Usar</h2>
<h3>Fase Inicial (Tratamento)</h3>
<ol>
<li>Faca <strong>enxagues orais e gargarejos</strong> com a solucao</li>
<li>Mantenha na boca por <strong>3 minutos</strong> antes de cuspir</li>
<li>Repita <strong>3 a 4 vezes ao dia</strong></li>
</ol>

<h3>Fase de Manutencao</h3>
<p>Apos observar melhora, reduza para <strong>1 vez ao dia</strong> como manutencao.</p>

<h3>Escovacao com CDS</h3>
<p>Voce tambem pode usar a mistura para <strong>escovar os dentes e massagear as gengivas</strong> com uma escova macia. Isso ajuda a alcançar areas mais dificeis.</p>

<h2>Opcao Avancada — Com DMSO</h2>
<p>Para infeccoes mais profundas nas gengivas ou raizes dos dentes:</p>
<ul>
<li>Adicione <strong>1 ml de DMSO</strong> (Dimetilsulfoxido) a solucao</li>
<li>O DMSO permite <strong>penetracao mais profunda</strong> nos tecidos</li>
</ul>
<blockquote>Nota: O DMSO gradualmente reduz a eficacia do CDS devido ao seu conteudo de enxofre, portanto use apenas quando realmente necessario.</blockquote>

<h2>Aplicacoes Odontologicas Profissionais (Protocolo JO)</h2>
<p>Para profissionais da saude bucal, o CDS em concentracoes de <strong>300 a 500 ppm</strong> pode ser usado para:</p>
<ul>
<li>Eliminar mau halito e estomatite aftosa</li>
<li>Desinfeccao endodontica (apos hipoclorito)</li>
<li>Penetracao em canais dentarios (como gas dissolvido em solucao)</li>
<li>Lavagem de areas cirurgicas dentais para prevenir infeccoes</li>
</ul>
<p>A formulacao <strong>preserva celulas saudaveis</strong> enquanto evita complicacoes.</p>

<h2>Beneficios Relatados</h2>
<ul>
<li>Gengivas mais saudaveis e firmes</li>
<li>Reducao da sensibilidade dentaria</li>
<li>Eliminacao do mau halito</li>
<li>Prevencao de caries</li>
<li>Auxilio no clareamento natural dos dentes</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Faca o enxague logo ao acordar e antes de dormir</li>
<li>Nao engula a solucao de enxague — cuspa e depois beba agua</li>
<li>Combine com Protocolo C por via oral para tratar infeccoes dentarias de dentro para fora</li>
<li>Use escova de cerdas macias para nao irritar as gengivas</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO K — DMSO
  // =====================================================
  {
    slug: 'protocolo-k-dmso',
    title: 'Protocolo K — CDS com DMSO',
    excerpt: 'A combinacao poderosa de CDS com DMSO para penetracao profunda nos tecidos. Aprenda a sequencia correta de aplicacao, teste de alergia e cuidados essenciais.',
    category: 'protocolos',
    reading_time_minutes: 8,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo K?</h2>
<p>O Protocolo K combina <strong>CDS com DMSO</strong> (Dimetilsulfoxido a 70%) para tratamento topico. O DMSO e um solvente natural que <strong>penetra profundamente nos tecidos</strong>, levando o CDS ate camadas que a aplicacao normal nao alcanca.</p>

<h2>Teste de Alergia — OBRIGATORIO</h2>
<blockquote><strong>Antes de iniciar o Protocolo K, voce DEVE fazer o teste de alergia!</strong> Aplique algumas gotas de DMSO 70% no antebraco e espere secar completamente. Se nao houver reacao adversa, pode prosseguir.</blockquote>

<h2>Sequencia de Aplicacao</h2>
<p>A ordem e <strong>fundamental</strong> para o sucesso do protocolo:</p>
<ol>
<li><strong>Primeiro:</strong> Aplique CDS puro (3000 ppm) na area — deixe secar</li>
<li><strong>Segundo:</strong> Aplique DMSO 70% (ou 50% para parte superior do corpo) — deixe secar</li>
<li><strong>Terceiro:</strong> Finalize com CDS puro novamente — deixe secar</li>
</ol>

<h3>Frequencia</h3>
<ul>
<li>A cada hora, se necessario</li>
<li><strong>5 a 8 vezes ao dia</strong></li>
</ul>

<h3>Cronograma Semanal</h3>
<ul>
<li><strong>3 dias de tratamento</strong> seguidos por <strong>4 dias de descanso</strong> (regeneracao)</li>
</ul>

<h2>Preparacao do DMSO</h2>
<p>Se o DMSO for 99,9% puro, dilua com <strong>30% de agua destilada</strong> para obter a concentracao de 70%.</p>
<ul>
<li>Armazene em <strong>temperatura ambiente</strong></li>
<li>O DMSO congela a 18 graus, mas isso nao causa problemas — basta descongelar</li>
</ul>

<h2>Cuidados com a Pele</h2>
<ul>
<li>Para ressecamento apos uso prolongado: aplique <strong>oleo de coco, azeite extra virgem ou aloe vera</strong> depois</li>
<li>Se a irritacao for excessiva, <strong>reduza a concentracao ou pause o tratamento</strong></li>
<li>A area tratada deve estar <strong>perfeitamente limpa</strong> — sem perfumes, oleos ou outras substancias</li>
</ul>

<h2>Contraindicacoes de Materiais</h2>
<blockquote><strong>NUNCA use com DMSO:</strong> recipientes ou luvas de borracha, PVC, acrilico, ABS ou PET. O DMSO dissolve esses materiais e pode levar substancias toxicas para dentro do corpo.</blockquote>
<p>Materiais seguros: <strong>vidro, PE ou HDPE</strong> (plastico branco).</p>

<h2>Metodos de Aplicacao</h2>
<ul>
<li>Escova de <strong>cerdas naturais</strong></li>
<li>Aplicacao manual (maos limpas)</li>
<li>Atomizador/spray</li>
</ul>
<p>Apos o tratamento, use <strong>roupas brancas</strong> (sem corantes que o DMSO possa carregar para a pele).</p>

<h2>Lembretes Importantes</h2>
<ul>
<li><strong>Nao use DMSO em enemas!</strong></li>
<li>Faca sempre o teste de alergia antes</li>
<li>Mantenha a pele limpa antes de cada aplicacao</li>
<li>Combine com Protocolo C por via oral para resultados mais completos</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO L — Lava-pes
  // =====================================================
  {
    slug: 'protocolo-l-lavapes',
    title: 'Protocolo L — Banho de Pes (Lava-pes)',
    excerpt: 'Banho de pes terapeutico com CDS para tratar fungos, pe de atleta, acido urico, neuropatia diabetica e muito mais. Simples, eficaz e acessivel para todos.',
    category: 'protocolos',
    reading_time_minutes: 5,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo L?</h2>
<p>O Protocolo L e um <strong>banho de pes terapeutico</strong> com CDS. E uma forma simples e acessivel de tratamento, especialmente indicada para pessoas que nao podem receber outros tipos de terapia.</p>

<h2>Dosagem e Preparo</h2>
<ol>
<li>Adicione <strong>30 a 40 ml de CDS</strong> (3000 ppm) a uma bacia</li>
<li>Use <strong>2 a 3 litros de agua</strong> a aproximadamente <strong>37 graus Celsius</strong></li>
<li>Mergulhe os pes ate a <strong>temperatura da agua diminuir</strong></li>
</ol>

<h2>Indicacoes</h2>
<p>O Protocolo L e indicado para uma variedade de condicoes:</p>
<ul>
<li><strong>Fungos nos pes</strong> e unhas</li>
<li><strong>Pe de atleta</strong></li>
<li><strong>Acido urico</strong> elevado</li>
<li><strong>Coceira e irritacao</strong> nos pes</li>
<li><strong>Dores e fadiga cronica</strong></li>
<li><strong>Desintoxicacao geral</strong></li>
<li><strong>Neuropatia diabetica</strong></li>
<li><strong>Fasceite plantar</strong></li>
<li><strong>Varizes</strong></li>
</ul>

<h2>Protocolo Especial para Feridas Diabeticas</h2>
<p>Para feridas de pe diabetico, a sequencia recomendada e:</p>
<ol>
<li><strong>Protocolo D</strong> — limpe a ferida pulverizando CDS diretamente</li>
<li><strong>Protocolo L</strong> — faca o banho de pes com CDS</li>
<li><strong>Protocolo C10-20</strong> — tome CDS por via oral simultaneamente</li>
</ol>

<h2>Para Quem e Mais Indicado</h2>
<p>O Protocolo L e especialmente util para:</p>
<ul>
<li>Pessoas que <strong>nao podem ingerir CDS</strong> por via oral</li>
<li>Idosos com problemas de circulacao nos pes</li>
<li>Diabeticos com neuropatia periferica</li>
<li>Quem busca uma forma suave de desintoxicacao</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Faca o banho de pes a noite antes de dormir — e relaxante e terapeutico</li>
<li>Use uma bacia funda o suficiente para cobrir os pes ate os tornozelos</li>
<li>A agua deve estar morna, nunca quente demais</li>
<li>Para fungos, faca diariamente ate os sintomas desaparecerem</li>
<li>Apos o banho, seque bem os pes e aplique Protocolo D nas areas afetadas se necessario</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO M — Malaria
  // =====================================================
  {
    slug: 'protocolo-m-malaria',
    title: 'Protocolo M — Protocolo Antimalaria',
    excerpt: 'Protocolo intensivo de CDS com doses divididas ao longo do dia. Inclui dosagens para adultos e criancas, com cronograma detalhado e acompanhamento.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo M?</h2>
<p>O Protocolo M e um protocolo <strong>intensivo de CDS</strong> desenvolvido para o tratamento da malaria. Ele utiliza doses mais altas divididas estrategicamente ao longo do dia.</p>

<h2>Protocolo Padrao</h2>
<ul>
<li><strong>40 ml de CDS</strong> (3000 ppm) por dia</li>
<li>Dividido em <strong>6 tomadas</strong></li>
<li>Cada dose misturada com <strong>100 ml de agua</strong></li>
</ul>

<h2>Cronograma Detalhado para Adultos</h2>
<table>
<thead><tr><th>Horario</th><th>Dose de CDS</th><th>Observacao</th></tr></thead>
<tbody>
<tr><td>1a tomada (manha)</td><td>8 ml</td><td>Dose inicial mais alta</td></tr>
<tr><td>2a hora</td><td>5 ml</td><td>Dose de manutencao</td></tr>
<tr><td>4a hora</td><td>5 ml</td><td>Dose de manutencao</td></tr>
<tr><td>6a hora</td><td>6 ml</td><td>Dose intermediaria</td></tr>
<tr><td>8a hora</td><td>8 ml</td><td>Dose alta</td></tr>
<tr><td>Antes de dormir</td><td>8 ml</td><td>Dose noturna</td></tr>
</tbody>
</table>
<p><strong>Total diario:</strong> 40 ml de CDS</p>

<h2>Resultados Esperados</h2>
<p>Os sintomas severos e a febre devem <strong>melhorar significativamente em 1 a 2 dias</strong>. Se a febre persistir:</p>
<ol>
<li>Aumente a dose final para <strong>10 ml</strong></li>
<li>Continue com o <strong>Protocolo C20</strong> ate a remissao completa</li>
</ol>

<h2>Dosagem para Criancas</h2>
<table>
<thead><tr><th>Faixa</th><th>CDS</th><th>Agua</th><th>Divisao</th><th>Duracao</th></tr></thead>
<tbody>
<tr><td><strong>Bebes</strong></td><td>2 ml</td><td>100 ml</td><td>8 doses diarias</td><td>3-4 dias</td></tr>
<tr><td><strong>Criancas</strong></td><td>10 ml</td><td>500 ml</td><td>8 doses diarias</td><td>3-4 dias</td></tr>
</tbody>
</table>
<p>Continue ambos os tratamentos por <strong>3 a 4 dias</strong> ate a remissao completa.</p>

<h2>Diferenca entre Malaria e Dengue</h2>
<p>E importante distinguir:</p>
<ul>
<li><strong>Malaria:</strong> causada por parasita (Plasmodium) transmitido por mosquito — o Protocolo M e especifico para isso</li>
<li><strong>Dengue:</strong> causada por virus — requer tratamento diferente (Protocolo F e C combinados)</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Comece o tratamento o mais rapido possivel apos os primeiros sintomas</li>
<li>Mantenha-se hidratado com muita agua pura</li>
<li>Descanse o maximo possivel durante o tratamento</li>
<li>Monitore a febre — se nao houver melhora em 2 dias, ajuste as doses</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO N — Criancas
  // =====================================================
  {
    slug: 'protocolo-n-criancas',
    title: 'Protocolo N — Para Criancas e Adolescentes',
    excerpt: 'Dosagem segura e adaptada para criancas e adolescentes. Tabela completa por idade e peso, dicas para administracao e como superar a rejeicao pelo sabor.',
    category: 'protocolos',
    reading_time_minutes: 5,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo N?</h2>
<p>O Protocolo N foi desenvolvido especificamente para <strong>criancas e adolescentes</strong>. Ele utiliza uma formula simples baseada no consumo de agua adequado para cada faixa etaria.</p>
<p>A regra basica e: <strong>1 ml de CDS para cada 100 ml de agua por dia</strong>, dividido em 6 a 8 tomadas.</p>

<h2>Tabela de Dosagem por Volume</h2>
<table>
<thead><tr><th>CDS</th><th>Agua</th><th>Tomadas por Dia</th></tr></thead>
<tbody>
<tr><td>1 ml</td><td>100 ml</td><td>6-8</td></tr>
<tr><td>2 ml</td><td>200 ml</td><td>6-8</td></tr>
<tr><td>3 ml</td><td>300 ml</td><td>6-8</td></tr>
<tr><td>4 ml</td><td>400 ml</td><td>6-8</td></tr>
<tr><td>5 ml</td><td>500 ml</td><td>6-8</td></tr>
<tr><td>6 ml</td><td>600 ml</td><td>6-8</td></tr>
<tr><td>7 ml</td><td>700 ml</td><td>6-8</td></tr>
<tr><td>8 ml</td><td>800 ml</td><td>6-8</td></tr>
<tr><td>9 ml</td><td>900 ml</td><td>6-8</td></tr>
<tr><td>10 ml</td><td>1000 ml</td><td>6-8</td></tr>
</tbody>
</table>

<h2>Referencia por Idade</h2>
<ul>
<li><strong>Bebes:</strong> geralmente bebem 100 a 200 ml por dia — usar 1 a 2 ml de CDS</li>
<li><strong>Criancas de 5 anos:</strong> consomem cerca de 500 ml — usar 5 ml de CDS</li>
<li><strong>Adolescentes:</strong> bebem aproximadamente 1 litro — usar 10 ml de CDS (igual ao Protocolo C adulto)</li>
</ul>

<h2>Dicas de Administracao</h2>
<h3>Para Bebes</h3>
<p>Pode ser administrado com <strong>seringa</strong> (sem agulha), dando aos poucos ao longo do dia.</p>

<h3>Para Criancas</h3>
<blockquote>Prefira garrafas com <strong>dispensador ou canudo</strong> ao inves de copo aberto. Isso evita que a crianca sinta o odor do CDS e rejeite a bebida.</blockquote>

<h2>Superando a Rejeicao pelo Sabor</h2>
<p>Uma solucao desenvolvida por pesquisadores e usar <strong>agua de coco</strong> como base ao inves de agua pura. A mistura de CDS com agua de coco e:</p>
<ul>
<li>Mais palatavel para criancas</li>
<li>Estavel por mais de <strong>8 meses</strong></li>
<li>Mascara o sabor e odor do CDS</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Comece sempre com a dose mais baixa e aumente gradualmente</li>
<li>Observe a reacao da crianca a cada novo nivel de dose</li>
<li>Use garrafinhas coloridas ou divertidas para tornar o processo mais leve</li>
<li>Nunca force — se a crianca rejeitar, tente com agua de coco</li>
<li>Mantenha a proporcao de 1 ml por 100 ml de agua como regra segura</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO O — Olhos e Nariz
  // =====================================================
  {
    slug: 'protocolo-o-olhos-nariz',
    title: 'Protocolo O — Olhos e Nariz (Oftalmologico)',
    excerpt: 'Colirio e gotas nasais caseiros com CDS para tratar condicoes oculares e sinusite. Receita completa, forma de preparo e cuidados com armazenamento.',
    category: 'protocolos',
    reading_time_minutes: 5,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo O?</h2>
<p>O Protocolo O e um protocolo <strong>oftalmologico e otorrinolaringologico</strong> — ou seja, para os <strong>olhos e nariz</strong>. Ele utiliza uma solucao diluida de CDS aplicada como colirio ou gotas nasais.</p>

<h2>Ingredientes</h2>
<ul>
<li><strong>50 ml de soro fisiologico</strong> (NaCl 0,9%)</li>
<li><strong>0,5 ml de CDS</strong> (Solucao de Dioxido de Cloro)</li>
<li><strong>Opcional:</strong> 0,3 ml de DMSO (70%)</li>
</ul>

<h2>Modo de Preparo</h2>
<ol>
<li>Utilize um <strong>frasco de vidro pequeno</strong> e limpo</li>
<li>Adicione o soro fisiologico</li>
<li>Acrescente o CDS</li>
<li>Se desejar, adicione o DMSO</li>
<li>Misture bem</li>
<li>Use <strong>conta-gotas de polietileno</strong> ou conta-gotas oftalmico de HDPE</li>
</ol>

<h2>Como Aplicar</h2>
<ul>
<li>Aplique <strong>algumas gotas</strong> no olho ou nariz afetado</li>
<li>Frequencia: <strong>a cada 2 horas</strong></li>
<li>Continue ate observar melhora</li>
</ul>

<h2>Armazenamento</h2>
<blockquote>A solucao permanece eficaz por aproximadamente <strong>3 dias</strong> quando mantida em local fresco e escuro. Quando a solucao ficar <strong>clara e transparente</strong>, ela perdeu a potencia e precisa ser preparada novamente.</blockquote>

<h2>Precaucoes Criticas</h2>
<ul>
<li><strong>Nao use DMSO</strong> em pacientes com lentes intraoculares de acrilico</li>
<li>O CDS em si <strong>nao afeta adversamente</strong> nenhum tipo de lente intraocular</li>
<li>Nao existe risco de infeccao pela solucao, pois o CDS possui <strong>propriedades desinfetantes</strong> naturais</li>
</ul>

<h2>Indicacoes</h2>
<ul>
<li>Conjuntivite</li>
<li>Irritacao ocular</li>
<li>Sinusite</li>
<li>Rinite</li>
<li>Infeccoes oculares</li>
<li>Congestao nasal</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Prepare pequenas quantidades e use em ate 3 dias</li>
<li>Guarde no escuro e em local fresco (pode ser na geladeira)</li>
<li>Use frascos de vidro escuro para maior durabilidade</li>
<li>Para sinusite, combine as gotas nasais com Protocolo C por via oral</li>
<li>As gotas podem arder levemente nos primeiros segundos — isso e normal</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO P — Parasitas
  // =====================================================
  {
    slug: 'protocolo-p-parasitas',
    title: 'Protocolo P — Antiparasitario Intensivo',
    excerpt: 'Protocolo completo de 3 meses para eliminacao de parasitas. Inclui cronograma detalhado dia a dia, suplementos auxiliares, enemas e cuidados com interacoes medicamentosas.',
    category: 'protocolos',
    reading_time_minutes: 12,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo P?</h2>
<p>O Protocolo P e um programa <strong>antiparasitario intensivo e completo</strong>, que pode durar ate 3 meses. Ele combina CDS com suplementos naturais e medicamentos antiparasitarios em um cronograma rigoroso e detalhado.</p>

<h2>Fase 1 — Dias 1 a 8</h2>

<h3>Dia 1</h3>
<ul>
<li><strong>Pamoato de pirantel:</strong> 10 mg/kg dose unica pela manha (para adulto de 60 kg: 3 colheres de cha do liquido ou 3 comprimidos)</li>
<li><strong>Terra diatomacea:</strong> 2 colheres de sobremesa por dia (manha e noite, junto com refeicoes)</li>
<li><strong>Opcional:</strong> combinar terra diatomacea com zeolita clinoptilolita de calcio (proporcao metade/metade)</li>
</ul>

<h3>Dias 2 a 4 e 6 a 8</h3>
<ul>
<li><strong>Mebendazol:</strong> 100 mg duas vezes ao dia (manha e noite)</li>
<li><strong>Terra diatomacea:</strong> 2 colheres de sobremesa por dia</li>
<li><strong>Enema diario</strong> (Protocolo E)</li>
</ul>

<h3>Dias 3 e 6 — Adicional</h3>
<ul>
<li><strong>Oleo de ricino:</strong> 2 colheres de sopa em jejum</li>
</ul>

<h3>Dia 5</h3>
<ul>
<li><strong>Pamoato de pirantel:</strong> 10 mg/kg dose unica</li>
<li><strong>Terra diatomacea:</strong> 2 colheres de sobremesa por dia</li>
<li><strong>Enema</strong></li>
</ul>

<h2>Fase 2 — Protocolo Estendido (Dias 9 a 18, repetir por 3 meses)</h2>

<h3>Mes 1 — Dias 9 a 18</h3>
<ul>
<li><strong>Oleo de ricino:</strong> 2 colheres de sopa em jejum (ajustar se causar diarreia)</li>
<li><strong>Terra diatomacea:</strong> 1 colher de sobremesa duas vezes ao dia</li>
<li><strong>Infusao de neem:</strong> 3 colheres de cha rasas em 1 litro de agua, ferver 5 minutos, beber ao longo do dia (por 9 dias)</li>
<li><strong>Enemas continuos</strong></li>
</ul>

<h3>Mes 2 — Dias 9 a 18</h3>
<ul>
<li><strong>Oleo de ricino:</strong> 2 colheres de sopa em jejum</li>
<li><strong>Terra diatomacea:</strong> 1 colher de sobremesa duas vezes ao dia</li>
<li><strong>Infusao de epazote</strong> (3 dias): 1-2 colheres de sopa de folhas em 1 litro de agua, ferver 10 minutos, beber 1 xicara em jejum por 3 dias consecutivos</li>
<li><strong>Gel de aloe vera</strong> em jejum nos dias sem epazote</li>
<li><strong>Enemas continuos</strong></li>
</ul>

<h3>Mes 3 — Dias 9 a 18</h3>
<ul>
<li><strong>Oleo de ricino:</strong> 2 colheres de sopa em jejum</li>
<li><strong>Terra diatomacea:</strong> 1 colher de sobremesa duas vezes ao dia</li>
<li><strong>Infusao de neem</strong> (9 dias) ou infusao antiparasitaria alternativa</li>
<li><strong>Enemas continuos</strong></li>
<li>Se parasitas persistirem, repita o cronograma do Mes 1</li>
</ul>

<h3>Dias 19 a 30 — Descanso</h3>
<p>Periodo de descanso onde se continua <strong>apenas o Protocolo C</strong>.</p>

<h2>Tratamentos Complementares</h2>
<h3>Quebra-pedra (Lepidium latifolium)</h3>
<ul>
<li>Multiplas infusoes diarias ou gotas</li>
<li>Adultos: 20-25 gotas</li>
<li>Criancas mais velhas: 15 gotas</li>
<li>Criancas pequenas: 7 gotas</li>
</ul>

<h3>Agua do Mar Isotonica</h3>
<p>Misturar <strong>1 parte de agua do mar com 3 partes de agua mineral</strong>:</p>
<table>
<thead><tr><th>Peso</th><th>Agua do mar</th><th>Agua mineral</th></tr></thead>
<tbody>
<tr><td>Ate 14 kg</td><td>10 ml</td><td>30 ml</td></tr>
<tr><td>14-23 kg</td><td>20 ml</td><td>60 ml</td></tr>
<tr><td>24-35 kg</td><td>30 ml</td><td>90 ml</td></tr>
<tr><td>Acima de 35 kg</td><td>50-150 ml</td><td>150-450 ml</td></tr>
</tbody>
</table>
<p>Tomar <strong>3 ou mais vezes ao dia</strong>.</p>

<h3>Infusoes Aromaticas</h3>
<p>Cha de <strong>camomila ou calendula</strong> para alivio de sintomas gastrointestinais.</p>

<h2>INTERACOES MEDICAMENTOSAS — LEIA COM ATENCAO</h2>
<blockquote><strong>NAO combine mebendazol com:</strong> Flagyl (metronidazol), Tagamet, Etotoina, Penicilina, Zithromax, Amoxicilina, Mefenitoina ou Carbamazepina.</blockquote>
<p><strong>AVISO SEVERO:</strong> Mebendazol e metronidazol <strong>NUNCA devem ser usados juntos</strong> — a combinacao pode causar sindrome de Stevens-Johnson, uma condicao muito seria.</p>
<p>O CDS em si <strong>nao interage</strong> com esses medicamentos.</p>

<h2>Efeitos Colaterais Possiveis</h2>
<p>O mebendazol pode causar efeitos leves como nausea, vomito, dor abdominal e diarreia — geralmente causados pela <strong>liberacao de toxinas</strong> dos parasitas, e nao pelo medicamento em si.</p>
`
  },

  // =====================================================
  // PROTOCOLO Q — Queimaduras
  // =====================================================
  {
    slug: 'protocolo-q-queimaduras',
    title: 'Protocolo Q — Queimaduras',
    excerpt: 'Tratamento de queimaduras com CDS — desde queimaduras leves ate casos severos. Aprenda o metodo correto de aplicacao, quando repetir e como prevenir cicatrizes.',
    category: 'protocolos',
    reading_time_minutes: 5,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo Q?</h2>
<p>O Protocolo Q e o tratamento especializado para <strong>queimaduras</strong> utilizando CDS. Ele tem duas abordagens: uma para queimaduras comuns e outra para queimaduras severas.</p>

<h2>Queimaduras Comuns</h2>
<h3>Como Aplicar</h3>
<ol>
<li>Embeba um <strong>guardanapo ou toalha de papel</strong> com CDS puro (3000 ppm)</li>
<li>Coloque sobre a area queimada</li>
<li>Deixe secar na pele</li>
<li>Repita quantas vezes quiser, <strong>sem precisar lavar</strong> entre as aplicacoes</li>
</ol>

<h2>Queimaduras Severas</h2>
<h3>Como Aplicar</h3>
<ol>
<li>Aplique <strong>CDS puro (3000 ppm) diretamente como spray</strong> na queimadura</li>
<li>Repita a pulverizacao <strong>assim que a dor retornar</strong></li>
<li><strong>NAO aplique bandagens</strong> — a pele precisa respirar</li>
</ol>
<blockquote>Para queimaduras severas, combine com o <strong>Protocolo C20</strong> por via oral para tratamento interno simultaneo.</blockquote>

<h2>O que o CDS Faz na Queimadura</h2>
<ul>
<li>Elimina completamente a <strong>infeccao</strong> na area queimada</li>
<li>Remove o excesso de <strong>acido latico</strong> na ferida</li>
<li>Reduz a dor de forma significativa</li>
<li>Dispensa o uso de antibioticos adicionais</li>
</ul>

<h2>Prevencao de Cicatrizes</h2>
<p>Apos o tratamento com CDS, aplique <strong>aloe vera natural</strong> (babosa) para:</p>
<ul>
<li>Prevenir formacao de cicatrizes</li>
<li>Acelerar a recuperacao da pele</li>
<li>Manter a pele hidratada durante a cicatrizacao</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Quanto mais rapido aplicar o CDS apos a queimadura, melhor sera o resultado</li>
<li>Nunca cubra a queimadura com bandagens apos aplicar CDS</li>
<li>Use guardanapo de papel — nao use algodao ou pano</li>
<li>Para queimaduras de sol, o CDS spray tambem funciona muito bem</li>
<li>Mantenha um frasco spray de CDS acessivel na cozinha (onde queimaduras mais acontecem)</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO R — Retal
  // =====================================================
  {
    slug: 'protocolo-r-retal',
    title: 'Protocolo R — Retal (Pera de Enema)',
    excerpt: 'Aplicacao retal localizada com pera de enema para tratar condicoes especificas da regiao. Procedimento completo, dosagem e frequencia recomendada.',
    category: 'protocolos',
    reading_time_minutes: 5,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo R?</h2>
<p>O Protocolo R e uma <strong>aplicacao retal localizada</strong> utilizando pera de enema (dispositivo menor que o irrigador do Protocolo E). E indicado para condicoes especificas da regiao retal e proxima.</p>

<h2>Indicacoes</h2>
<ul>
<li>Problemas de prostata</li>
<li>Condicoes retais e do colon</li>
<li>Fissuras anais</li>
<li>Hemorroidas</li>
</ul>

<h2>Materiais Necessarios</h2>
<ul>
<li><strong>6 ml de CDS</strong> a 3000 ppm</li>
<li><strong>150 ml de agua</strong> a temperatura corporal</li>
<li><strong>Pera de enema</strong> (aplicador)</li>
<li>Vaselina ou creme lubrificante</li>
</ul>

<h2>Procedimento Completo</h2>
<ol>
<li>Misture <strong>6 ml de CDS em um copo com 150 ml de agua</strong> a temperatura corporal</li>
<li>Aspire a solucao na pera de enema, <strong>eliminando o ar</strong> interno</li>
<li>Aplique <strong>vaselina ou creme lubrificante</strong> na ponta da pera</li>
<li>Insira a pera no reto com cuidado</li>
<li>Esvazie a pera completamente</li>
<li>Retenha o liquido por aproximadamente <strong>3 minutos</strong></li>
<li>Evacue normalmente</li>
</ol>

<h2>Frequencia</h2>
<ul>
<li><strong>Padrao:</strong> apos cada defecacao</li>
<li><strong>Casos severos:</strong> ate <strong>8 vezes ao dia</strong></li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>A agua deve estar morna — a temperatura corporal ideal e em torno de 37 graus</li>
<li>Lubrifique bem a ponta para evitar desconforto</li>
<li>Elimine todo o ar da pera antes de inserir</li>
<li>Combine com Protocolo C por via oral para tratamento mais completo</li>
<li>Para hemorroidas, o alivio costuma ser sentido ja nas primeiras aplicacoes</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO S — Sensivel
  // =====================================================
  {
    slug: 'protocolo-s-sensivel',
    title: 'Protocolo S — Para Pessoas Sensiveis',
    excerpt: 'Protocolo de dosagem ultra-suave para pessoas com sensibilidade quimica, alergias multiplas ou que nao toleraram a dosagem padrao. Aumento gradual e seguro.',
    category: 'protocolos',
    reading_time_minutes: 4,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo S?</h2>
<p>O Protocolo S foi desenvolvido para pessoas com <strong>alta sensibilidade</strong> — incluindo aquelas com alergias quimicas multiplas, intolerancia a substancias ou que simplesmente nao conseguiram tolerar a dosagem padrao do Protocolo A.</p>
<p>Ele envolve um <strong>aumento extremamente gradual</strong> da dose para garantir conforto e seguranca.</p>

<h2>Cronograma de Dosagem</h2>
<table>
<thead><tr><th>Dia</th><th>CDS</th><th>Agua</th></tr></thead>
<tbody>
<tr><td>Dia 1</td><td>1 ml</td><td>500 ml</td></tr>
<tr><td>Dia 2</td><td>2 ml</td><td>1 litro</td></tr>
<tr><td>Dia 3</td><td>3 ml</td><td>1 litro</td></tr>
<tr><td>Dia 4</td><td>4 ml</td><td>1 litro</td></tr>
<tr><td>Dia 5</td><td>5 ml</td><td>1 litro</td></tr>
<tr><td>Dia 6</td><td>6 ml</td><td>1 litro</td></tr>
<tr><td>Dia 7</td><td>7 ml</td><td>1 litro</td></tr>
<tr><td>Dia 8</td><td>8 ml</td><td>1 litro</td></tr>
<tr><td>Dia 9</td><td>9 ml</td><td>1 litro</td></tr>
<tr><td>Dia 10</td><td>10 ml</td><td>1 litro</td></tr>
</tbody>
</table>
<p>Aumente <strong>1 ml por litro diariamente</strong> ate atingir o maximo de <strong>10 ml de CDS por litro de agua</strong>.</p>

<h2>Regra de Ouro</h2>
<blockquote>Se voce sentir <strong>qualquer desconforto</strong> em qualquer estagio, <strong>reduza imediatamente</strong> para a dose anterior. Mantenha nessa dose ate se sentir completamente confortavel antes de tentar subir novamente.</blockquote>

<h2>Para Quem e Indicado</h2>
<ul>
<li>Pessoas com <strong>sensibilidades quimicas multiplas</strong></li>
<li>Pessoas com <strong>alergias</strong> diversas</li>
<li>Quem teve <strong>reacao ao Protocolo A</strong> na dose mais baixa</li>
<li>Pessoas com sistema imunologico muito debilitado</li>
<li>Idosos frageis que precisam de cautela extra</li>
</ul>

<h2>Diferenca para o Protocolo A</h2>
<p>A principal diferenca e que o Protocolo S comeca com uma <strong>dose ainda menor</strong> (1 ml em 500 ml) e sobe mais devagar, dando ao corpo mais tempo para se adaptar.</p>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Nao tenha pressa — cada corpo tem seu ritmo</li>
<li>Se ficar 3-4 dias na mesma dose, nao tem problema nenhum</li>
<li>Anote como se sente a cada dia em um caderno</li>
<li>Quando atingir 10 ml, voce estara no Protocolo C padrao</li>
<li>Escute sempre o seu corpo — ele e seu melhor guia</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO T — Terminal
  // =====================================================
  {
    slug: 'protocolo-t-terminal',
    title: 'Protocolo T — Para Casos Severos e Terminais',
    excerpt: 'Protocolo intensivo de longo prazo com doses escalonadas para casos graves. Envolve dieta especifica, doses crescentes de CDS e acompanhamento por semanas a meses.',
    category: 'protocolos',
    reading_time_minutes: 7,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo T?</h2>
<p>O Protocolo T e o protocolo mais <strong>intensivo e de longo prazo</strong> do Metodo Corpo Limpo. Ele foi desenvolvido para situacoes <strong>graves e terminais</strong>, especialmente relacionadas a cancer.</p>
<blockquote><strong>Importante:</strong> Este protocolo deve ser conduzido com acompanhamento e nao substitui o tratamento medico convencional. Consulte sempre um profissional de saude.</blockquote>

<h2>Caracteristicas Gerais</h2>
<ul>
<li><strong>Doses diarias crescentes</strong> de CDS, podendo chegar ate 42 ml por dia</li>
<li>Duracao de <strong>semanas a meses</strong></li>
<li>Combinado com <strong>dieta especifica</strong> e eliminacao de certos grupos alimentares</li>
<li>Monitoramento constante da resposta do organismo</li>
</ul>

<h2>Principios do Protocolo T</h2>
<h3>Escalonamento Gradual</h3>
<p>A dose de CDS e aumentada <strong>progressivamente</strong> ao longo das semanas:</p>
<ol>
<li>Comece com doses baixas (como no Protocolo A ou C)</li>
<li>Aumente gradualmente conforme a tolerancia</li>
<li>Alcance doses mais altas quando o corpo estiver adaptado</li>
<li>Monitore a resposta continuamente</li>
</ol>

<h3>Dieta de Acompanhamento</h3>
<p>Durante o Protocolo T, recomenda-se:</p>
<ul>
<li><strong>Eliminar acucar refinado</strong> — alimenta celulas prejudiciais</li>
<li><strong>Reduzir carnes processadas</strong></li>
<li><strong>Aumentar vegetais e alimentos alcalinos</strong></li>
<li><strong>Evitar alcool e tabaco</strong></li>
<li><strong>Manter hidratacao adequada</strong> com agua pura</li>
</ul>

<h3>Protocolos Complementares</h3>
<p>O Protocolo T frequentemente combina:</p>
<ul>
<li><strong>Protocolo C</strong> como base diaria</li>
<li><strong>Protocolo E ou EC</strong> (enemas) a noite</li>
<li><strong>Protocolo K</strong> (DMSO) para aplicacao topica localizada</li>
<li><strong>Protocolo F</strong> em momentos de crise</li>
<li>Terapia de frequencias como complemento</li>
</ul>

<h2>Monitoramento</h2>
<ul>
<li>Faca exames regulares para acompanhar evolucao</li>
<li>Observe sinais de melhora ou piora</li>
<li>Ajuste as doses conforme necessario</li>
<li>Mantenha comunicacao constante com sua equipe de saude</li>
</ul>

<h2>Orientacoes da Nossa Equipe</h2>
<ul>
<li>O Protocolo T exige <strong>disciplina e constancia</strong></li>
<li>Nao pule doses nem dias</li>
<li>A dieta e tao importante quanto o CDS</li>
<li>Tenha paciencia — resultados significativos levam semanas ou meses</li>
<li>Procure apoio emocional e familiar durante o processo</li>
<li>Mantenha um diario de evolucao com sintomas, doses e como se sente</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO U — Urgencia
  // =====================================================
  {
    slug: 'protocolo-u-urgencia',
    title: 'Protocolo U — Urgencia (Emergencia)',
    excerpt: 'O protocolo de emergencia para situacoes agudas — intoxicacao alimentar, cistite, febre alta, vomito subito e mais. Dose inicial forte seguida de manutencao.',
    category: 'protocolos',
    reading_time_minutes: 5,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo U?</h2>
<p>O Protocolo U e o seu <strong>protocolo de emergencia</strong>. Quando algo grave aparece de repente — intoxicacao alimentar, infeccao aguda, febre alta — o Protocolo U e a primeira linha de acao.</p>

<h2>Quando Usar</h2>
<ul>
<li><strong>Intoxicacao alimentar</strong></li>
<li><strong>Infeccoes agudas</strong> — cistite, infeccao renal, otite, gastroenterite</li>
<li><strong>Febre alta subita</strong></li>
<li><strong>Vomito subito e diarreia</strong></li>
<li><strong>Mal-estar severo</strong> sem causa aparente</li>
<li><strong>Dor severa</strong> associada a doenca de progressao rapida</li>
</ul>

<h2>Dosagem</h2>
<h3>Dose Inicial</h3>
<ul>
<li><strong>6 ml de CDS</strong> em <strong>200 ml de agua</strong></li>
<li>Tome imediatamente</li>
</ul>

<h3>Continuacao</h3>
<ol>
<li>Apos <strong>2 horas</strong>, repita a dose de 6 ml</li>
<li>A partir dai, tome <strong>3 ml de CDS a cada 2 horas</strong></li>
<li>Alvo: <strong>8 a 10 tomadas por dia</strong></li>
</ol>

<h3>Dose Alternativa (Tolerancia Reduzida)</h3>
<p>Se 6 ml for intenso demais, comece com <strong>4 ml</strong> na dose inicial e ajuste conforme tolerancia.</p>

<h2>Para Casos Severos</h2>
<p>Adicione o <strong>Protocolo E</strong> (enema) ao Protocolo U para maximizar a desintoxicacao.</p>

<h2>Resultado Esperado</h2>
<blockquote>Ao final do dia, uma <strong>melhora clara</strong> deve ser notada. Se nao houver melhora significativa, <strong>procure um medico de emergencia</strong>.</blockquote>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Tenha CDS sempre acessivel em casa — emergencias nao avisam</li>
<li>Nao hesite em usar o Protocolo U ao primeiro sinal de problema</li>
<li>Quanto mais cedo comecar, melhores os resultados</li>
<li>Mantenha-se hidratado com agua pura entre as doses</li>
<li>Se nao melhorar, procure atendimento medico — o CDS complementa mas nao substitui a medicina de emergencia</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO V — Vaginal
  // =====================================================
  {
    slug: 'protocolo-v-vaginal',
    title: 'Protocolo V — Irrigacao Vaginal',
    excerpt: 'Protocolo de irrigacao vaginal com CDS para saude intima feminina. Dois metodos de aplicacao, dosagens, frequencia e a variacao com copo menstrual.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo V?</h2>
<p>O Protocolo V e dedicado a <strong>saude intima feminina</strong>, utilizando irrigacao vaginal com CDS. Ele oferece dois metodos de aplicacao e uma variacao com copo menstrual.</p>

<h2>Metodo 1 — Irrigador Vaginal</h2>
<ul>
<li>Misture <strong>5 ml de CDS</strong> em <strong>500 ml de agua</strong> a temperatura ambiente ou morna</li>
<li>Use um irrigador vaginal limpo</li>
</ul>

<h2>Metodo 2 — Garrafa Plastica</h2>
<ul>
<li>Misture <strong>10 ml de CDS</strong> em <strong>500 ml de agua</strong> a temperatura corporal</li>
<li>Use uma garrafa plastica limpa e flexivel</li>
</ul>

<h3>Procedimento de Aplicacao</h3>
<ol>
<li>Sente-se na banheira ou no vaso sanitario</li>
<li>Introduza a mistura <strong>apertando a garrafa com movimentos de vai e vem</strong></li>
<li>Retenha por <strong>3 a 5 minutos</strong></li>
<li>Repita varias horas depois se necessario</li>
</ol>

<h2>Diretrizes de Seguranca</h2>
<ul>
<li><strong>Evite introduzir ar</strong></li>
<li>Use <strong>agua potavel, osmotizada ou esterilizada</strong></li>
<li>Mantenha a agua <strong>morna</strong> (nunca quente)</li>
<li>Se sentir desconforto, <strong>reduza a concentracao de CDS</strong></li>
</ul>

<h2>Variacao com Copo Menstrual</h2>
<h3>Preparo</h3>
<ul>
<li>Lave o copo menstrual com <strong>agua quente e sabao</strong> antes do uso</li>
<li>Coloque no maximo <strong>5 ml de CDS e a mesma quantidade de agua</strong> no copo</li>
</ul>

<h3>Duracao</h3>
<ul>
<li>Maximo de <strong>2 horas por insercao</strong></li>
</ul>

<h3>Frequencia (Baseada na Severidade)</h3>
<table>
<thead><tr><th>Severidade</th><th>Frequencia</th></tr></thead>
<tbody>
<tr><td><strong>Casos leves</strong></td><td>Dia sim, dia nao</td></tr>
<tr><td><strong>Casos severos</strong></td><td>1 vez ao dia por 8 horas OU 2 vezes ao dia por 4 horas</td></tr>
</tbody>
</table>

<h2>Acompanhamento</h2>
<p>Recomenda-se <strong>avaliacao ginecologica aos 3 meses</strong> de uso para monitorar os resultados.</p>

<h2>Indicacoes</h2>
<ul>
<li>Candidíase</li>
<li>Infeccoes vaginais recorrentes</li>
<li>Corrimento excessivo</li>
<li>Higiene intima complementar</li>
<li>Prevencao de infeccoes</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Comece com a concentracao menor (5 ml em 500 ml) e ajuste conforme necessidade</li>
<li>O copo menstrual deve ser de silicone medico para seguranca</li>
<li>Combine com Protocolo C por via oral para tratar infeccoes de dentro para fora</li>
<li>Mantenha a higiene rigorosa dos materiais utilizados</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO W — Usos Diversos
  // =====================================================
  {
    slug: 'protocolo-w-usos-diversos',
    title: 'Protocolo W — Usos Diversos do CDS',
    excerpt: 'Descubra as multiplas aplicacoes do CDS no dia a dia: higiene oral, desodorante natural, conservacao de alimentos, cuidado com plantas, animais e muito mais.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo W?</h2>
<p>O Protocolo W reune as <strong>diversas aplicacoes praticas do CDS</strong> no dia a dia. Sao usos que vao alem do tratamento de saude e mostram a versatilidade dessa solucao.</p>

<h2>Limpeza de Ouvido</h2>
<ol>
<li>Embeba <strong>dois cotonetes</strong> com CDS (diluido conforme Protocolo C)</li>
<li>Limpe os ouvidos normalmente</li>
<li>Insira os cotonetes <strong>cuidadosamente no canal auditivo por 1 minuto</strong></li>
</ol>

<h2>Tratamento Ocular</h2>
<ol>
<li>Embeba <strong>dois discos de algodao</strong> (tipo removedor de maquiagem) com CDS diluido (conforme Protocolo C)</li>
<li>Coloque sobre os <strong>olhos fechados</strong></li>
<li>Mantenha por <strong>30 minutos</strong></li>
</ol>

<h2>Desodorante Natural</h2>
<ul>
<li>Use CDS na concentracao de <strong>0,3% diretamente na pele</strong> com frasco spray</li>
<li>Pulverize nas axilas apos o banho</li>
<li>Eficaz contra o odor por eliminar as bacterias causadoras</li>
</ul>

<h2>Higiene Oral</h2>
<ul>
<li>Use como <strong>enxaguante bucal diario</strong></li>
<li>Ajuda no <strong>clareamento natural dos dentes</strong></li>
<li>Para mais detalhes, veja o <strong>Protocolo J</strong></li>
</ul>

<h2>Banho de Pes Rapido</h2>
<ul>
<li><strong>10 a 30 ml de CDS</strong> em uma bacia com <strong>2 a 5 litros de agua morna</strong></li>
<li>Duracao: <strong>15 a 20 minutos</strong></li>
<li>Para tratamento mais intenso, veja o <strong>Protocolo L</strong></li>
</ul>

<h2>Conservacao de Alimentos</h2>
<ul>
<li>Prepare uma garrafa de <strong>500 ml de agua com 50 ml de CDS</strong></li>
<li>Deixe <strong>aberta na geladeira</strong></li>
<li>O gas liberado ajuda a conservar os alimentos por mais tempo</li>
</ul>

<h2>Cuidado com Plantas</h2>
<ul>
<li>Use concentracoes baixas de <strong>10 a 20 ppm</strong> para regar plantas</li>
<li>Ajuda a combater pragas e fungos no solo</li>
<li>Melhora a saude geral das plantas</li>
</ul>

<h2>Uso em Animais</h2>
<ul>
<li><strong>Via oral:</strong> mesma concentracao do Protocolo C (ajustar ao peso do animal)</li>
<li><strong>Enema animal:</strong> 10 a 20 ml de CDS por litro de agua</li>
<li>Consulte um veterinario holístico para orientacao especifica</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>O CDS e incrivelmente versatil — tenha sempre um frasco em casa</li>
<li>Para cada uso, respeite as concentracoes indicadas</li>
<li>Como desodorante, e uma alternativa natural sem aluminio e sem quimicos</li>
<li>Para alimentos, a garrafa aberta na geladeira estende a durabilidade surpreendentemente</li>
<li>Para animais, comece com doses menores e observe a reacao</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO X — Intimo
  // =====================================================
  {
    slug: 'protocolo-x-intimo',
    title: 'Protocolo X — Cuidado Intimo',
    excerpt: 'Protocolo de higiene intima pos-relacao com CDS. Dosagem, modo de uso e indicacoes para prevencao e cuidado da saude intima do casal.',
    category: 'protocolos',
    reading_time_minutes: 4,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo X?</h2>
<p>O Protocolo X e dedicado ao <strong>cuidado intimo</strong> do casal, especialmente como higiene pos-relacao. Ele utiliza CDS diluido para limpeza e prevencao.</p>

<h2>Dosagem</h2>
<ul>
<li><strong>10 ml de CDS</strong> (3000 ppm) diluido em <strong>500 ml de agua</strong></li>
</ul>

<h2>Indicacoes</h2>
<ul>
<li>Higiene intima pos-relacao</li>
<li>Prevencao de infeccoes</li>
<li>Cuidado com a saude intima do casal</li>
</ul>

<h2>Como Usar</h2>
<h3>Para Prevencao</h3>
<ul>
<li>Aplicar <strong>apos os primeiros 20 minutos</strong> da relacao sexual</li>
<li>Usar apos cada relacao</li>
</ul>

<h3>Para Quem Busca Fertilidade</h3>
<ul>
<li>Aplicar <strong>5 a 8 horas antes</strong> da relacao sexual</li>
<li>Isso permite a higienizacao sem interferir</li>
</ul>

<h2>Protocolos Relacionados</h2>
<p>Para necessidades especificas, consulte tambem:</p>
<ul>
<li><strong>Protocolo V</strong> — irrigacao vaginal completa</li>
<li><strong>Protocolo D</strong> — aplicacao dermatologica para questoes de pele intima</li>
</ul>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Prepare a solucao com antecedencia e mantenha a temperatura ambiente</li>
<li>A agua deve ser potavel ou esterilizada</li>
<li>Ambos os parceiros podem se beneficiar da higienizacao</li>
<li>Combine com Protocolo C por via oral para saude intima mais completa</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO Y — Intravenoso (CDI)
  // =====================================================
  {
    slug: 'protocolo-y-intravenoso',
    title: 'Protocolo Y — Intravenoso (CDI)',
    excerpt: 'Protocolo de aplicacao intravenosa de dioxido de cloro EXCLUSIVAMENTE para profissionais de saude. Dosagens, requisitos, monitoramento e variantes subcutaneas.',
    category: 'protocolos',
    reading_time_minutes: 8,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo Y?</h2>
<p>O Protocolo Y e o protocolo de <strong>aplicacao intravenosa de dioxido de cloro (CDI)</strong>. Este e o unico protocolo do Metodo Corpo Limpo que e <strong>RESTRITO A MEDICOS E PROFISSIONAIS DE SAUDE</strong>.</p>
<blockquote><strong>AVISO: Este protocolo NAO deve ser realizado em casa. Somente profissionais de saude qualificados devem administra-lo, com todos os equipamentos e monitoramento adequados.</strong></blockquote>

<h2>Formula Base</h2>
<ul>
<li><strong>5 ml de CDS</strong> (ou CDE — Eletrolito de Dioxido de Cloro a 3000 ppm)</li>
<li>Em <strong>500 ml de soro fisiologico</strong> (NaCl 0,9%)</li>
</ul>

<h2>Requisitos Pre-Tratamento</h2>
<ul>
<li><strong>Consentimento informado</strong> do paciente (conforme Protocolo de Helsinki)</li>
<li>Paciente deve completar <strong>protocolos orais/retais por 7 dias antes</strong> (exceto em casos agudos)</li>
<li>Cateter IV periferico de calibre <strong>18-20 gauge</strong></li>
<li>Alternar bracos entre as sessoes</li>
</ul>

<h2>Dosagem Intravenosa</h2>
<table>
<thead><tr><th>Parametro</th><th>Especificacao</th></tr></thead>
<tbody>
<tr><td>Dose padrao</td><td>5 ml de CDE (3000 ppm) em 500 ml de soro</td></tr>
<tr><td>Dose maxima</td><td>Dobro da dose padrao (administrar mais lentamente)</td></tr>
<tr><td>Duracao de infusao</td><td>3-6 horas por bolsa de 500 ml</td></tr>
<tr><td>pH alvo</td><td>7,6</td></tr>
<tr><td>Tamponamento</td><td>1-2 ml de bicarbonato 8% por bolsa</td></tr>
<tr><td>Temperatura</td><td>Ambiente, protegida da luz UV</td></tr>
</tbody>
</table>

<h3>Cronograma de Sessoes</h3>
<ul>
<li><strong>Casos agudos:</strong> 4 dias consecutivos</li>
<li><strong>Casos cronicos:</strong> 2 vezes por semana</li>
</ul>

<h2>Protocolo Subcutaneo</h2>
<ul>
<li>Concentracao: <strong>50 ppm</strong> (0,005%)</li>
<li>pH: <strong>7,6</strong></li>
<li>Volume: <strong>2-5 ml</strong> proximo a area afetada</li>
</ul>

<h2>Aplicacoes Cirurgicas</h2>
<table>
<thead><tr><th>Uso</th><th>Concentracao</th></tr></thead>
<tbody>
<tr><td>Desinfeccao de feridas</td><td>300-400 ppm</td></tr>
<tr><td>Sangramentos sem coagulacao</td><td>500-1000 ppm</td></tr>
</tbody>
</table>

<h2>Monitoramento Obrigatorio</h2>
<ul>
<li><strong>Gasometria venosa</strong> antes e apos o tratamento</li>
<li>Verificar <strong>pH da solucao</strong> antes de cada infusao</li>
<li>Teste com gota ocular para confirmacao do pH</li>
<li>Monitoramento continuo do paciente durante a infusao</li>
</ul>

<h2>Orientacoes Importantes</h2>
<ul>
<li>Este protocolo requer <strong>formacao especifica</strong></li>
<li>Nunca tente administrar IV sem qualificacao medica</li>
<li>Todos os materiais devem ser estereis</li>
<li>Respeitar rigorosamente os parametros de pH e concentracao</li>
<li>Em caso de qualquer reacao adversa, interromper imediatamente</li>
</ul>
`
  },

  // =====================================================
  // PROTOCOLO Z — Frequencias
  // =====================================================
  {
    slug: 'protocolo-z-frequencias',
    title: 'Protocolo Z — Terapia de Frequencias',
    excerpt: 'Protocolo complementar usando geradores de frequencia de microcorrente e plasma frio. Instrucoes de uso dos dispositivos, programas e recomendacoes de seguranca.',
    category: 'protocolos',
    reading_time_minutes: 6,
    published: true,
    published_at: new Date().toISOString(),
    content: `
<h2>O que e o Protocolo Z?</h2>
<p>O Protocolo Z e um <strong>protocolo complementar</strong> que utiliza <strong>geradores de frequencia de microcorrente</strong> e <strong>pulsos de plasma frio</strong> para auxiliar na recuperacao e bem-estar geral. E a uniao da abordagem eletromolecular com o CDS.</p>

<h2>Dispositivos de Frequencia</h2>

<h3>Gerador de Microcorrente</h3>
<p>Dispositivo que emite frequencias especificas atraves de eletrodos segurados nas maos:</p>
<ol>
<li>Selecione o <strong>programa correspondente</strong> a sua condicao</li>
<li>Segure os eletrodos com as maos</li>
<li>Pressione para iniciar</li>
<li>O dispositivo opera <strong>automaticamente</strong> e desliga quando completo</li>
</ol>
<p><strong>Dica:</strong> Se ouvir um sinal sonoro, use um <strong>guardanapo de papel umido</strong> para melhorar a condutividade entre a pele e os eletrodos.</p>
<p>Para <strong>criancas ou idosos</strong> que nao conseguem segurar os eletrodos por muito tempo, coloque uma meia nas maos para manter o contato.</p>

<h3>Gerador de Plasma Frio</h3>
<p>Dispositivo que emite impulsos de plasma frio, especialmente eficaz como complemento para diversas condicoes:</p>
<ol>
<li>Selecione o programa apropriado</li>
<li>Recline confortavelmente de lado</li>
<li>Os programas duram de <strong>30 minutos a aproximadamente 1 hora</strong></li>
<li>O dispositivo desliga automaticamente ao final</li>
</ol>

<h2>Recomendacoes de Uso</h2>
<ol>
<li><strong>Ambiente tranquilo:</strong> sem joias, TV ou celulares ativos durante a sessao</li>
<li><strong>Comece pelo geral:</strong> use programas gerais antes de abordar condicoes especificas</li>
<li><strong>Limite diario:</strong> maximo de <strong>2 a 3 programas por dia</strong>, espacados por <strong>5 horas</strong></li>
<li><strong>Eletrodos no corpo:</strong> mantenha a potencia <strong>abaixo de 30%</strong></li>
</ol>

<h2>Contraindicacoes</h2>
<blockquote><strong>NAO utilize dispositivos de frequencia se voce:</strong></blockquote>
<ul>
<li>Usa <strong>marca-passo</strong></li>
<li>Possui <strong>valvula coronaria metalica</strong></li>
<li>Esta <strong>gravida</strong> (pesquisa insuficiente)</li>
</ul>

<h2>Melhor Resultado: Frequencia + CDS</h2>
<p>A combinacao de terapia de frequencias com o <strong>Protocolo C</strong> (CDS por via oral) e considerada a abordagem mais completa. A chamada <strong>medicina eletromolecular</strong> une o poder da oxidacao seletiva do CDS com a acao das frequencias nos tecidos.</p>

<h2>Dicas da Nossa Equipe</h2>
<ul>
<li>Sempre comece com os programas mais basicos para adaptar o corpo</li>
<li>Nao use multiplos programas seguidos — respeite o intervalo de 5 horas</li>
<li>Remova joias e aparelhos eletronicos do ambiente durante a sessao</li>
<li>Use em conjunto com o Protocolo C para resultados potencializados</li>
<li>Registre como se sente antes e depois de cada sessao</li>
</ul>
`
  },
];

// ============================================================
// FUNCAO DE SEED
// ============================================================

async function seed() {
  console.log('Inserindo protocolos na Universidade Dioxi...');
  console.log(`Total de protocolos: ${ARTICLES.length}`);
  console.log('---');

  let success = 0;
  let errors = 0;

  for (const article of ARTICLES) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(article),
    });
    if (res.ok) {
      console.log(`✓ ${article.title}`);
      success++;
    } else {
      const err = await res.text();
      console.log(`✗ ${article.title}: ${err}`);
      errors++;
    }
  }

  console.log('---');
  console.log(`Pronto! ${success} inseridos, ${errors} erros.`);
}

seed();
