const puppeteer = require('puppeteer');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'src', 'content', 'guia-animais-clo2.html');
const pdfPath = path.join(projectRoot, 'public', 'downloads', 'livro-cds-animais.pdf');

async function convert() {
  console.log('Iniciando conversao HTML -> PDF...');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-size:8px;text-align:center;width:100%;color:#999;">Metodo Corpo Limpo — Guia CDS para Animais — Pagina <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
  });

  await browser.close();
  console.log('PDF gerado:', pdfPath);
}

convert().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
