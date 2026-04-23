import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const HTML_ENTITIES = {
  ldquo: '\u201C', rdquo: '\u201D', lsquo: '\u2018', rsquo: '\u2019',
  amp: '&', mdash: '\u2014', ndash: '\u2013', hellip: '\u2026', nbsp: '\u00A0',
};
const decodeEntities = (s) => typeof s === 'string'
  ? s.replace(/&(ldquo|rdquo|lsquo|rsquo|amp|mdash|ndash|hellip|nbsp);/g, (_, k) => HTML_ENTITIES[k])
  : s;
const decodeDeep = (v) => {
  if (typeof v === 'string') return decodeEntities(v);
  if (Array.isArray(v)) return v.map(decodeDeep);
  if (v && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v)) out[k] = decodeDeep(v[k]);
    return out;
  }
  return v;
};
const data = decodeDeep(JSON.parse(fs.readFileSync(path.join(root, 'public/data.json'), 'utf-8')));
const outputPath = path.join(root, process.env.OUT || 'public/a4.pdf');
const FONT_SET = process.env.FONT_SET || 'atkinson';

const fontPath = (f) => path.join(root, 'node_modules/@fontsource', f);
const FONT_SETS = {
  helvetica: {
    body: 'Helvetica',
    bodyBold: 'Helvetica-Bold',
    bodyItalic: 'Helvetica-Oblique',
    bodyBoldItalic: 'Helvetica-BoldOblique',
    heading: 'Times-Bold',
  },
  inter: {
    body: fontPath('inter/files/inter-latin-400-normal.woff'),
    bodyBold: fontPath('inter/files/inter-latin-700-normal.woff'),
    bodyItalic: fontPath('inter/files/inter-latin-400-italic.woff'),
    bodyBoldItalic: fontPath('inter/files/inter-latin-700-italic.woff'),
    heading: 'Times-Bold',
  },
  'ibm-plex-sans': {
    body: fontPath('ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff'),
    bodyBold: fontPath('ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff'),
    bodyItalic: fontPath('ibm-plex-sans/files/ibm-plex-sans-latin-400-italic.woff'),
    bodyBoldItalic: fontPath('ibm-plex-sans/files/ibm-plex-sans-latin-700-italic.woff'),
    heading: 'Times-Bold',
  },
  atkinson: {
    body: path.join(root, 'fonts/variants/AtkinsonHyperlegible-Regular.ttf'),
    bodyBold: path.join(root, 'fonts/variants/AtkinsonHyperlegible-Bold.ttf'),
    bodyItalic: path.join(root, 'fonts/variants/AtkinsonHyperlegible-Italic.ttf'),
    bodyBoldItalic: path.join(root, 'fonts/variants/AtkinsonHyperlegible-BoldItalic.ttf'),
    heading: 'Times-Bold',
  },
  'fira-sans': {
    body: path.join(root, 'fonts/variants/FiraSans-Regular.ttf'),
    bodyBold: path.join(root, 'fonts/variants/FiraSans-Bold.ttf'),
    bodyItalic: path.join(root, 'fonts/variants/FiraSans-Italic.ttf'),
    bodyBoldItalic: path.join(root, 'fonts/variants/FiraSans-BoldItalic.ttf'),
    heading: 'Times-Bold',
  },
  'dm-sans': {
    body: fontPath('dm-sans/files/dm-sans-latin-400-normal.woff'),
    bodyBold: fontPath('dm-sans/files/dm-sans-latin-700-normal.woff'),
    bodyItalic: fontPath('dm-sans/files/dm-sans-latin-400-italic.woff'),
    bodyBoldItalic: fontPath('dm-sans/files/dm-sans-latin-700-italic.woff'),
    heading: 'Times-Bold',
  },
  manrope: {
    body: fontPath('manrope/files/manrope-latin-400-normal.woff'),
    bodyBold: fontPath('manrope/files/manrope-latin-700-normal.woff'),
    bodyItalic: fontPath('manrope/files/manrope-latin-400-normal.woff'),
    bodyBoldItalic: fontPath('manrope/files/manrope-latin-700-normal.woff'),
    heading: 'Times-Bold',
  },
};

const COLOR = {
  primary: '#6a1b3d',
  text: '#222222',
  muted: '#666666',
  rule: '#e2d4da',
};

const PAGE = { margin: 50, top: 100, bottom: 70 };
const FOOTER_LEFT = 'R.I.M.ESPINOSA.2026';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: PAGE.top, bottom: PAGE.bottom, left: PAGE.margin, right: PAGE.margin },
  bufferPages: true,
  info: { Title: `${data.info.full_name} — Resume`, Author: data.info.full_name },
});

doc.pipe(fs.createWriteStream(outputPath));

const pageWidth = doc.page.width;
const pageHeight = doc.page.height;
const contentWidth = pageWidth - PAGE.margin * 2;
const leftColW = contentWidth * 0.22;
const rightColW = contentWidth - leftColW - 10;
const rightColX = PAGE.margin + leftColW + 10;

const FONT = FONT_SETS[FONT_SET] || FONT_SETS.helvetica;

const ensureSpace = (height) => {
  if (doc.y + height > pageHeight - PAGE.bottom) doc.addPage();
};

const rule = (color = COLOR.rule, width = 0.75) => {
  doc.moveTo(PAGE.margin, doc.y).lineTo(pageWidth - PAGE.margin, doc.y)
     .lineWidth(width).strokeColor(color).stroke();
};

const sectionHeading = (text) => {
  ensureSpace(140);
  doc.moveDown(0.4);
  doc.font(FONT.heading).fontSize(15).fillColor(COLOR.primary).text(text, PAGE.margin);
  doc.moveDown(0.15);
  rule(COLOR.primary, 1.2);
  doc.moveDown(0.1);
};

const measureDate = (text) => {
  return doc.font(FONT.body).fontSize(9.5).widthOfString(text) + 6;
};

const drawHeader = () => {
  const { info } = data;
  const photoW = 78;
  const photoH = 98;
  const photoPath = info.photo ? path.join(root, 'public', info.photo.replace(/^\//, '')) : null;
  const hasPhoto = photoPath && fs.existsSync(photoPath);

  const startY = 20;
  const textStartY = 40;
  const textX = PAGE.margin;
  const textW = hasPhoto ? contentWidth - photoW - 16 : contentWidth;

  doc.font(FONT.heading).fontSize(22).fillColor(COLOR.primary)
     .text(info.full_name, textX, textStartY, { width: textW, align: 'center', lineGap: -6 });
  doc.font(FONT.bodyItalic).fontSize(13).fillColor('#444')
     .text(info.title, textX, doc.y, { width: textW, align: 'center', lineGap: -2 });
  doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.primary)
     .text(`${info.links.website}  ·  ${info.links.github}  ·  ${info.links.email}  ·  ${info.links.mobile.label}`,
           textX, doc.y, { width: textW, align: 'center', lineBreak: false });
  const addr = info.address;
  doc.font(FONT.body).fontSize(9).fillColor(COLOR.muted)
     .text(`${addr.line1}, ${addr.line2}, ${addr.city}, ${addr.province}, ${addr.country} ${addr.zip}`,
           textX, doc.y + 2, { width: textW, align: 'center' });
  const textEndY = doc.y;

  if (hasPhoto) {
    const photoX = pageWidth - photoW - 15;
    try {
      doc.save();
      doc.rect(photoX, startY, photoW, photoH).clip();
      doc.image(photoPath, photoX, startY, { cover: [photoW, photoH], align: 'center', valign: 'center' });
      doc.restore();
      doc.lineWidth(1.2).strokeColor(COLOR.primary)
         .rect(photoX, startY, photoW, photoH).stroke();
    } catch (e) {
      console.warn('Could not embed photo:', e.message);
    }
  }

  doc.y = Math.max(textEndY, startY + (hasPhoto ? photoH : 0)) + 8;
};

const currentPageIndex = () => {
  const r = doc.bufferedPageRange();
  return r.start + r.count - 1;
};

const twoColRow = (leftLines, rightRender) => {
  ensureSpace(60);
  rule();
  doc.moveDown(0.3);
  const startY = doc.y;
  const startPageIdx = currentPageIndex();

  leftLines.forEach((line, i) => {
    if (line == null) return;
    if (i === 0) {
      doc.font(FONT.bodyBold).fontSize(10.5).fillColor(COLOR.text)
         .text(line, PAGE.margin, doc.y, { width: leftColW });
    } else {
      doc.font(FONT.body).fontSize(9).fillColor(COLOR.muted)
         .text(line, PAGE.margin, doc.y, { width: leftColW });
    }
  });
  const leftEndY = doc.y;
  const leftEndPageIdx = currentPageIndex();

  if (leftEndPageIdx !== startPageIdx) doc.switchToPage(startPageIdx);
  doc.y = startY;

  const mainHeading = leftLines.find((l) => l != null) || '';
  const onPageAdded = () => {
    const resumeY = doc.y;
    const prevFontName = doc._font && doc._font.name;
    const prevSize = doc._fontSize;
    const prevFill = doc._fillColor;
    doc.font(FONT.bodyBold).fontSize(10.5).fillColor(COLOR.text)
       .text(`${mainHeading} (Continued)`, PAGE.margin, PAGE.top, { width: leftColW });
    if (prevFontName) doc.font(prevFontName);
    if (prevSize) doc.fontSize(prevSize);
    if (prevFill && prevFill[0]) doc.fillColor(prevFill[0], prevFill[1]);
    doc.y = resumeY;
  };
  doc.on('pageAdded', onPageAdded);
  try {
    rightRender(rightColX, rightColW);
  } finally {
    doc.off('pageAdded', onPageAdded);
  }
  const rightEndY = doc.y;
  const rightEndPageIdx = currentPageIndex();

  if (rightEndPageIdx > startPageIdx) {
    doc.y = rightEndY;
  } else {
    doc.y = Math.max(leftEndY, rightEndY);
  }
  doc.moveDown(0.3);
};

const drawBullet = (text, x, width, opts = {}) => {
  const bullet = opts.bullet || '•';
  const indent = opts.indent != null ? opts.indent : 10;
  ensureSpace(12);
  const y = doc.y;
  doc.text(bullet, x, y, { width: indent, lineBreak: false });
  doc.y = y;
  doc.text(text, x + indent, y, { width: width - indent, align: 'left' });
};

const parseConventionString = (s) => {
  const clean = s.replace(/\s*\.\s*$/, '').trim();
  const m = clean.match(/^(.+?)[,;]\s+(.+?\s+\d{4})\s*,\s*(.+)$/);
  if (m) return { description: m[1].trim(), date: m[2].trim(), venue: m[3].trim() };
  return { description: clean };
};

const drawStructuredSubitem = (obj, x, width) => {
  const bullet = '-';
  const indent = 8;
  ensureSpace(12);
  const y = doc.y;
  doc.font(FONT.body).fontSize(9).fillColor(COLOR.muted)
     .text(bullet, x, y, { width: indent, lineBreak: false });
  doc.y = y;
  const contentX = x + indent;
  const contentW = width - indent;

  const desc = (obj.description || '').trim();
  const date = (obj.date || '').trim();
  const venue = (obj.venue || '').trim();
  const role = (obj.role || '').trim();

  const hasTrail = date || venue || role;
  doc.font(FONT.bodyBoldItalic).fontSize(9).fillColor(COLOR.text)
     .text(desc, contentX, y, { width: contentW, continued: hasTrail });
  if (date) {
    doc.font(FONT.body).fontSize(8.5).fillColor(COLOR.muted)
       .text(` · ${date}`, { continued: Boolean(venue || role) });
  }
  if (venue) {
    doc.font(FONT.bodyItalic).fontSize(8.5).fillColor(COLOR.muted)
       .text(` · ${venue}`, { continued: Boolean(role) });
  }
  if (role) {
    doc.font(FONT.body).fontSize(8.5).fillColor(COLOR.muted)
       .text(` · [${role}]`);
  }
};

const bulletList = (items, x, width) => {
  doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.text);
  items.forEach((item) => {
    drawBullet(item, x + 4, width - 4);
  });
};

const drawWork = () => {
  sectionHeading('Work Experience');
  data.work_experience.forEach((job) => {
    const leftLines = [job.company || job.organization, job.location];
    twoColRow(leftLines, (x, w) => {
      job.titles.forEach((t, idx) => {
        if (idx > 0) doc.moveDown(0.3);
        ensureSpace(30);
        const startY = doc.y;
        const dateW = measureDate(t.date);
        doc.font(FONT.bodyBold).fontSize(10.5).fillColor(COLOR.text)
           .text(t.name, x, startY, { width: w - dateW - 8 });
        const nameEndY = doc.y;
        doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.muted)
           .text(t.date, x + w - dateW, startY, { width: dateW, align: 'right', lineBreak: false });
        doc.y = Math.max(nameEndY, doc.y);
        doc.moveDown(0.15);
        bulletList(t.responsibilities, x, w);
      });
    });
  });
};

const drawEducation = () => {
  sectionHeading('Education');
  const groupEdu = (list) => {
    const groups = [];
    list.forEach((e) => {
      const key = `${e.institution}||${e.campus || ''}`;
      const last = groups[groups.length - 1];
      if (last && last.key === key) {
        last.entries.push(e);
      } else {
        groups.push({ key, institution: e.institution, campus: e.campus, entries: [e] });
      }
    });
    return groups;
  };
  const renderEdu = (list) => (x, w) => {
    const groups = groupEdu(list);
    groups.forEach((g, idx) => {
      if (idx > 0) doc.moveDown(0.25);
      ensureSpace(28);
      const header = `${g.institution}${g.campus ? `, ${g.campus}` : ''}`;
      const sharedDetail = g.entries.every((e) => (e.link || e.location || '') === (g.entries[0].link || g.entries[0].location || ''))
        ? (g.entries[0].link || g.entries[0].location || '')
        : '';
      const detailW = sharedDetail ? doc.font(FONT.body).fontSize(9).widthOfString(sharedDetail) + 6 : 0;
      const headerStartY = doc.y;
      doc.font(FONT.bodyBold).fontSize(10.5).fillColor(COLOR.text)
         .text(header, x, headerStartY, { width: w - detailW - 8 });
      const headerEndY = doc.y;
      if (sharedDetail) {
        doc.font(FONT.body).fontSize(9).fillColor(COLOR.muted)
           .text(sharedDetail, x + w - detailW, headerStartY, { width: detailW, align: 'right', lineBreak: false });
      }
      doc.y = Math.max(headerEndY, doc.y);

      g.entries.forEach((e) => {
        doc.moveDown(0.05);
        const dateW = measureDate(e.date);
        const rowY = doc.y;
        const perDetail = sharedDetail ? '' : (e.link || e.location || '');
        const rightW = dateW + (perDetail ? doc.font(FONT.body).fontSize(9).widthOfString(perDetail) + 6 : 0);
        doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.text)
           .text(e.degree, x, rowY, { width: w - rightW - 8 });
        const degreeEndY = doc.y;
        doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.muted)
           .text(e.date, x + w - dateW, rowY, { width: dateW, align: 'right', lineBreak: false });
        doc.y = Math.max(degreeEndY, doc.y);
      });
    });
  };
  twoColRow(['Tertiary Education'], renderEdu(data.education.tertiary));
  twoColRow(['Primary & Secondary'], renderEdu(data.education['primary-secondary']));
};

const flattenSkillItem = (item) => {
  if (typeof item === 'string') return { text: item, subitems: null };
  if (!item || typeof item !== 'object') return { text: '', subitems: null };
  const parts = [];
  if (item.description) parts.push(item.description.trim());
  if (item.publication) parts.push(item.publication.trim());
  if (item.publicationExtra) parts.push(item.publicationExtra.trim());
  if (item.date) parts.push(`(${item.date.trim()})`);
  if (item.doi) parts.push(`DOI: ${item.doi.trim()}`);
  const text = parts.filter(Boolean).join(' ');
  return { text, subitems: item.subitems || null };
};

const drawSkills = () => {
  sectionHeading('Skills and Achievements');
  data.skills.forEach((group) => {
    twoColRow([group.category], (x, w) => {
      group.items.forEach((raw) => {
        const { text, subitems } = flattenSkillItem(raw);
        if (!text && !subitems) return;
        if (text) {
          doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.text);
          drawBullet(text, x + 4, w - 4);
        }
        if (subitems) {
          subitems.forEach((s) => {
            const obj = typeof s === 'string' ? parseConventionString(s) : s;
            drawStructuredSubitem(obj, x + 18, w - 18);
          });
        }
      });
    });
  });
};

const drawPortfolio = () => {
  sectionHeading('Featured Project Portfolio');
  data.portfolio.forEach((cat, catIdx) => {
    ensureSpace(140);
    if (catIdx > 0) {
      doc.moveDown(1);
      rule(COLOR.primary, 1);
    }
    doc.moveDown(0.5);
    doc.font(FONT.bodyBoldItalic).fontSize(11).fillColor(COLOR.primary)
       .text(cat.category, PAGE.margin, doc.y, { width: contentWidth });
    doc.moveDown(0.5);

    cat.items.forEach((item, itemIdx) => {
      if (!item.name) return;
      ensureSpace(110);
      rule();
      doc.moveDown(0.15);

      const stripEndDot = (s) => s ? String(s).replace(/\.\s*$/, '') : s;
      const descText = stripEndDot(item.description);
      const subtitleText = stripEndDot(item.subtitle);

      const nameFontSize = 10.5;
      doc.font(FONT.bodyBold).fontSize(nameFontSize);
      const rightW = contentWidth * 0.55;
      const adjNameW = contentWidth - rightW - 10;

      const startY = doc.y;
      doc.font(FONT.bodyBold).fontSize(nameFontSize).fillColor(COLOR.primary)
         .text(item.name, PAGE.margin, startY, { width: adjNameW });
      const nameEndY = doc.y;

      if (descText) {
        doc.font(FONT.bodyItalic).fontSize(8.5).fillColor(COLOR.text)
           .text(descText, PAGE.margin + adjNameW + 10, startY + 2, {
             width: rightW, align: 'right', lineBreak: false, ellipsis: true,
           });
      }
      doc.y = Math.max(nameEndY, doc.y);

      const linkObj = typeof item.link === 'string' ? { url: item.link } : item.link;
      const linkUrl = linkObj && linkObj.url;
      const linkActive = !linkObj || linkObj.active !== false;
      if (linkUrl) {
        const rowY = doc.y + 1;
        const linkWidth = doc.font(FONT.body).fontSize(9).widthOfString(linkUrl) + 6;
        const linkOpts = { width: linkWidth, lineBreak: false };
        if (linkActive) linkOpts.link = linkUrl;
        doc.font(FONT.body).fontSize(9).fillColor(linkActive ? COLOR.primary : COLOR.muted)
           .text(linkUrl, PAGE.margin, rowY, linkOpts);
        const linkEndY = doc.y;
        if (subtitleText) {
          const subX = PAGE.margin + linkWidth + 10;
          const subW = contentWidth - linkWidth - 10;
          doc.font(FONT.bodyItalic).fontSize(8.5).fillColor(COLOR.muted)
             .text(subtitleText, subX, rowY, { width: subW, align: 'right' });
        }
        doc.y = Math.max(linkEndY, doc.y);
      } else if (subtitleText) {
        doc.font(FONT.bodyItalic).fontSize(8.5).fillColor(COLOR.muted)
           .text(subtitleText, PAGE.margin, doc.y + 2, { width: contentWidth, align: 'right' });
      }
      doc.moveDown(0.15);

      const pfRow = (label, render) => {
        ensureSpace(24);
        const labelW = 90;
        const rowX = PAGE.margin + labelW + 8;
        const rowW = contentWidth - labelW - 8;
        const rowStart = doc.y;
        const rowStartPage = currentPageIndex();
        doc.font(FONT.bodyItalic).fontSize(9).fillColor(COLOR.primary)
           .text(label, PAGE.margin, rowStart, { width: labelW, align: 'right' });
        const labelEndY = doc.y;
        const labelEndPage = currentPageIndex();
        if (labelEndPage !== rowStartPage) doc.switchToPage(rowStartPage);
        doc.y = rowStart;
        render(rowX, rowW);
        const renderEndPage = currentPageIndex();
        if (renderEndPage === rowStartPage) {
          doc.y = Math.max(labelEndY, doc.y);
        }
        doc.moveDown(0.1);
      };

      if (item.role) {
        pfRow('Role', (x, w) => {
          doc.font(FONT.bodyBold).fontSize(9.5).fillColor(COLOR.text)
             .text(item.role, x, doc.y, { width: w });
        });
      }
      if (item.responsibilities) {
        pfRow('Responsibilities', (x, w) => {
          doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.text);
          item.responsibilities.forEach((r) => drawBullet(r, x, w));
        });
      }
      if (item.features) {
        pfRow('Main Features', (x, w) => {
          doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.text);
          item.features.forEach((f) => drawBullet(f, x, w));
        });
      }
      if (item.technologies) {
        pfRow('Technologies', (x, w) => {
          doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.text)
             .text(item.technologies.join(', '), x, doc.y, { width: w });
        });
      }
      const drawLeaderRow = (rowX, rowW, label, status, url, active) => {
        ensureSpace(14);
        const y = doc.y;
        const urlStr = url || '';
        doc.font(FONT.body).fontSize(8.5);
        const urlW = urlStr ? doc.widthOfString(urlStr) : 0;

        doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.text);
        const labelW = doc.widthOfString(label);
        doc.text(label, rowX, y, { width: labelW + 2, lineBreak: false });
        let leftEndX = rowX + labelW;

        if (status) {
          doc.font(FONT.bodyItalic).fontSize(8).fillColor(COLOR.muted);
          const statusText = ` (${status})`;
          const statusW = doc.widthOfString(statusText);
          doc.text(statusText, leftEndX, y + 1.5, { width: statusW + 2, lineBreak: false });
          leftEndX += statusW;
        }

        if (urlStr) {
          const urlX = rowX + rowW - urlW;
          const urlOpts = { width: urlW + 2, lineBreak: false };
          if (active) urlOpts.link = urlStr;
          doc.font(FONT.body).fontSize(8.5).fillColor(active ? COLOR.primary : COLOR.muted)
             .text(urlStr, urlX, y + 1.5, urlOpts);

          const dotsStart = leftEndX + 4;
          const dotsEnd = urlX - 4;
          if (dotsEnd > dotsStart) {
            doc.save();
            doc.lineWidth(0.5).strokeColor(COLOR.rule).dash(1, { space: 2 });
            doc.moveTo(dotsStart, y + 8).lineTo(dotsEnd, y + 8).stroke();
            doc.undash();
            doc.restore();
          }
        }
        doc.y = y;
        doc.moveDown(1.1);
      };

      if (item.links && item.links.length) {
        pfRow('Links', (x, w) => {
          item.links.forEach((l) => {
            drawLeaderRow(x, w, l.label, l.status, l.url, l.active !== false);
          });
        });
        doc.moveDown(0.25);
      }
      if (item.samples) {
        pfRow('Samples', (x, w) => {
          item.samples.forEach((s) => {
            drawLeaderRow(x, w, s.name, s.status, s.url, s.active !== false);
          });
        });
        doc.moveDown(0.25);
      }
      doc.moveDown(0.25);
    });
  });
};

const drawReferences = () => {
  if (!data.references || !data.references.length) return;
  sectionHeading('References');
  const cardW = (contentWidth - 20) / 2;
  const cardGap = 20;
  const cardH = 95;
  const rows = Math.ceil(data.references.length / 2);
  ensureSpace(rows * cardH + 10);
  const baseY = doc.y;
  data.references.forEach((ref, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = PAGE.margin + col * (cardW + cardGap);
    const y = baseY + row * cardH;
    doc.save();
    doc.lineWidth(3).strokeColor(COLOR.primary)
       .moveTo(x, y).lineTo(x, y + cardH - 10).stroke();
    doc.restore();
    const tx = x + 10;
    const tw = cardW - 10;
    doc.font(FONT.bodyBold).fontSize(12).fillColor(COLOR.primary)
       .text(ref.name, tx, y + 2, { width: tw });
    doc.font(FONT.body).fontSize(10).fillColor(COLOR.text)
       .text(ref.title, tx, doc.y, { width: tw });
    doc.text(ref.organization, tx, doc.y, { width: tw });
    doc.font(FONT.body).fontSize(9.5).fillColor(COLOR.muted)
       .text(ref.phone, tx, doc.y + 3, { width: tw });
    doc.text(ref.email, tx, doc.y, { width: tw, link: `mailto:${ref.email}` });
  });
  doc.y = baseY + rows * cardH;
};

const drawPageChrome = () => {
  const { info } = data;
  const range = doc.bufferedPageRange();
  const total = range.count;
  for (let i = 0; i < total; i++) {
    doc.switchToPage(range.start + i);
    const origMargins = doc.page.margins;
    doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

    if (i > 0) {
      const y = 40;
      doc.font(FONT.heading).fontSize(13).fillColor(COLOR.primary)
         .text(info.full_name, PAGE.margin, y, { width: contentWidth, align: 'center', lineBreak: false });
      doc.font(FONT.body).fontSize(8.5).fillColor(COLOR.muted)
         .text(`${info.title}  ·  ${info.links.website}  ·  ${info.links.email}  ·  ${info.links.mobile.label}`,
               PAGE.margin, doc.y + 1, { width: contentWidth, align: 'center', lineBreak: false });
      const ruleY = doc.y + 3;
      doc.moveTo(PAGE.margin, ruleY).lineTo(pageWidth - PAGE.margin, ruleY)
         .lineWidth(0.5).strokeColor(COLOR.rule).stroke();
    }

    const footerY = pageHeight - 40;
    doc.font(FONT.body).fontSize(8.5).fillColor(COLOR.muted)
       .text(FOOTER_LEFT, PAGE.margin, footerY, { width: contentWidth / 2, align: 'left', lineBreak: false });
    doc.text(`Page ${i + 1} of ${total}`, PAGE.margin + contentWidth / 2, footerY,
             { width: contentWidth / 2, align: 'right', lineBreak: false });

    doc.page.margins = origMargins;
  }
};

drawHeader();
drawWork();
drawEducation();
drawSkills();
drawPortfolio();
drawReferences();

drawPageChrome();

doc.flushPages();
doc.end();
console.log(`Wrote ${outputPath}`);
