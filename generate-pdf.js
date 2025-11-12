const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Iniciando generación de PDFs del tríptico...');

  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();

  // Configurar viewport más amplio para capturar todo el contenido
  await page.setViewport({
    width: 3300,
    height: 1275,
    deviceScaleFactor: 2
  });

  // Cargar el archivo HTML local
  const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
  console.log('Cargando:', htmlPath);

  await page.goto(htmlPath, {
    waitUntil: 'networkidle0'
  });

  // Esperar a que las imágenes carguen
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Ocultar las instrucciones de impresión y los paneles del reverso
  await page.addStyleTag({
    content: `
      .instrucciones-impresion { display: none !important; }
      .panel-back-left, .panel-back-center, .panel-back-right { display: none !important; }
      body { padding: 0 !important; background: white !important; }
      .triptico-container { max-width: none !important; width: 100% !important; }
    `
  });

  console.log('Generando PDF del FRENTE...');
  await page.pdf({
    path: 'triptico-tesla-frente.pdf',
    format: 'Letter',
    landscape: true,
    printBackground: true,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    preferCSSPageSize: false
  });

  console.log('✓ PDF del frente generado: triptico-tesla-frente.pdf');

  // Ahora generar el reverso
  await page.addStyleTag({
    content: `
      .panel-left, .panel-center, .panel-right { display: none !important; }
      .panel-back-left, .panel-back-center, .panel-back-right { display: block !important; }
    `
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Generando PDF del REVERSO...');
  await page.pdf({
    path: 'triptico-tesla-reverso.pdf',
    format: 'Letter',
    landscape: true,
    printBackground: true,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    preferCSSPageSize: false
  });

  console.log('✓ PDF del reverso generado: triptico-tesla-reverso.pdf');

  console.log('\n========================================');
  console.log('PDFs generados exitosamente:');
  console.log('  - triptico-tesla-frente.pdf');
  console.log('  - triptico-tesla-reverso.pdf');
  console.log('========================================\n');
  console.log('Instrucciones de impresión:');
  console.log('1. Imprime primero el FRENTE en hoja carta horizontal');
  console.log('2. Dale vuelta a la hoja de izquierda a derecha');
  console.log('3. Imprime el REVERSO en la misma hoja');
  console.log('4. Dobla el tríptico en 3 partes iguales');
  console.log('========================================');

  await browser.close();
})();
