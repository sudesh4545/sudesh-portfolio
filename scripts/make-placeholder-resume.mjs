/**
 * Generates `public/resume/placeholder-resume.pdf` — a clearly-marked
 * placeholder so the "View resume" button has a real, valid file to open
 * before you add your own CV.
 *
 * Run with:  node scripts/make-placeholder-resume.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '../public/resume/placeholder-resume.pdf');

const lines = [
  ['/F1 26 Tf', '0.98 0.98 0.99 rg', 72, 720, 'PLACEHOLDER RESUME'],
  ['/F1 12 Tf', '0.58 0.65 0.72 rg', 72, 692, 'This file ships with the portfolio template.'],
  ['/F1 12 Tf', '0.58 0.65 0.72 rg', 72, 674, 'Replace it with your real CV:'],
  ['/F1 12 Tf', '0.00 0.85 0.95 rg', 72, 646, '1.  Put your PDF in  public/resume/'],
  ['/F1 12 Tf', '0.00 0.85 0.95 rg', 72, 628, '2.  Set  personal.resumeUrl  in  src/data/portfolio.ts'],
  ['/F1 12 Tf', '0.58 0.65 0.72 rg', 72, 594, 'Set resumeUrl to null to disable the button instead.'],
];

const content =
  '0.008 0.020 0.039 rg\n0 0 612 792 re f\n' +
  lines
    .map(([font, colour, x, y, text]) => `BT\n${font}\n${colour}\n1 0 0 1 ${x} ${y} Tm\n(${text}) Tj\nET`)
    .join('\n') +
  '\n0.00 0.85 0.95 RG\n1 w\n72 760 m 540 760 l S\n';

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
];

let pdf = '%PDF-1.4\n';
const offsets = [];
objects.forEach((body, index) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefStart = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, Buffer.from(pdf, 'latin1'));
console.log(`wrote ${target} (${Buffer.byteLength(pdf, 'latin1')} bytes)`);
