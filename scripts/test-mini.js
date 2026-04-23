import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
const root = '/home/inggo/Projects/Resume';
const doc = new PDFDocument({ size: 'A4', margins: { top: 100, bottom: 70, left: 50, right: 50 }, bufferPages: true });
doc.pipe(fs.createWriteStream('/tmp/mini.pdf'));
const bi = path.join(root, 'fonts/variants/AtkinsonHyperlegible-BoldItalic.ttf');
const rg = path.join(root, 'fonts/variants/AtkinsonHyperlegible-Regular.ttf');

const contentX = 194.96, contentW = 350.32, y = 290.84;
doc.font(rg).fontSize(9).fillColor('#666').text('-', 186.96, y, { width: 8, lineBreak: false });
doc.y = y;
console.log('before:', { y: doc.y, x: doc.x });
doc.font(bi).fontSize(9).fillColor('#222')
   .text('4th International Research Colloquium towards Disaster Risk Transfer (4IRC-DRT)', contentX, y, { width: contentW, continued: true });
console.log('after desc:', { y: doc.y, x: doc.x });
doc.font(rg).fontSize(8.5).fillColor('#666')
   .text(' · November 9-10, 2019', { continued: true });
console.log('after date:', { y: doc.y, x: doc.x });
doc.flushPages();
doc.end();
