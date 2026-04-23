import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
const root = '/home/inggo/Projects/Resume';
const doc = new PDFDocument({ size: 'A4', margins: { top: 100, bottom: 70, left: 50, right: 50 }, bufferPages: true });
doc.pipe(fs.createWriteStream('/tmp/test.pdf'));

const bi = path.join(root, 'fonts/variants/AtkinsonHyperlegible-BoldItalic.ttf');
const rg = path.join(root, 'fonts/variants/AtkinsonHyperlegible-Regular.ttf');
const it = path.join(root, 'fonts/variants/AtkinsonHyperlegible-Italic.ttf');

// Register a noop pageAdded handler
doc.on('pageAdded', () => {});

const x = 222, width = 358;
const indent = 8;
const y = 100;
doc.font(rg).fontSize(9).fillColor('#666')
   .text('-', x, y, { width: indent, lineBreak: false });
doc.y = y;

const contentX = x + indent, contentW = width - indent;
doc.font(bi).fontSize(9).fillColor('#222')
   .text('4th International Research Colloquium towards Disaster Risk Transfer (4IRC-DRT)', contentX, y, { width: contentW, continued: true });
doc.font(rg).fontSize(8.5).fillColor('#666')
   .text(' · November 9-10, 2019', { continued: true });
doc.font(it).fontSize(8.5).fillColor('#666')
   .text(' · Quezon City Experience (QCX) Theater, Quezon City Circle', { continued: true });
doc.font(rg).fontSize(8.5).fillColor('#666')
   .text(' · [Organizer]');

doc.flushPages();
doc.end();
