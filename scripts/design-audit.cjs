const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const reportPath = path.join(__dirname, '../DESIGN_AUDIT.md');

const colors = {
  '#ffd700': 'var(--yellow)',
  '#000000': 'var(--black)',
  '#000': 'var(--black)',
  '#ffffff': 'var(--white)',
  '#fff': 'var(--white)',
  '#ff0000': 'var(--red-light)',
  '#880000': 'var(--red-dark)',
  '#39ff14': 'var(--green-light)',
  '#158300': 'var(--green-dark)',
  '#c4c4c4': 'var(--gray-light)',
  '#535353': 'var(--gray-medium)',
  '#2a2a2a': 'var(--gray-dark)',
  '#6600c5': 'var(--purple-light)',
  '#29004f': 'var(--purple-dark)',
  'rgba(255, 215, 0,': 'var(--yellow) with opacity',
  'rgba(102, 0, 197,': 'var(--purple-light) with opacity',
  'rgba(255, 255, 255,': 'var(--white) with opacity',
  'rgba(0, 0, 0,': 'var(--black) with opacity',
  'space grotesk': 'var(--font-SpaceGrotesk)',
  'inter': 'var(--font-Inter)',
};

const regexes = {
  hexColor: /#(?:[0-9a-fA-F]{3}){1,2}\b/g,
  rgbaColor: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)/gi,
  inlineStyle: /style=\{\{([^}]+)\}\}/g,
  fontFamily: /font-family:\s*([^;]+);/gi,
  tailwindHardcoded: /text-\[#[0-9a-fA-F]+\]|bg-\[#[0-9a-fA-F]+\]|border-\[#[0-9a-fA-F]+\]/gi,
  fontSize: /font-size:\s*(\d+px)/gi,
  lineHeight: /line-height:\s*(\d+px)/gi,
  spacing: /(padding|margin)[a-z-]*:\s*(\d+px)/gi,
};

const results = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (/\.(tsx|ts|jsx|js|css)$/.test(file)) {
      analyzeFile(filePath);
    }
  }
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = path.relative(srcDir, filePath);

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check hex colors
    let match;
    while ((match = regexes.hexColor.exec(line)) !== null) {
      const hex = match[0].toLowerCase();
      // Ignora se siamo in index.css e stiamo definendo variabili
      if (relPath === 'index.css' && line.includes('--')) continue;
      // se è un colore conosciuto, consiglia la variabile
      if (colors[hex]) {
        results.push({
          type: 'Hardcoded Color',
          file: relPath,
          line: lineNum,
          value: match[0],
          suggestion: colors[hex],
          context: line.trim()
        });
      } else {
        results.push({
          type: 'Non-standard Color',
          file: relPath,
          line: lineNum,
          value: match[0],
          suggestion: 'Check if this color should be added to palette',
          context: line.trim()
        });
      }
    }

    // Check tailwind arbitrary values like text-[#FFD700]
    while ((match = regexes.tailwindHardcoded.exec(line)) !== null) {
      results.push({
        type: 'Tailwind Arbitrary Color',
        file: relPath,
        line: lineNum,
        value: match[0],
        suggestion: 'Use Tailwind configured variables (e.g. text-yellow, bg-black)',
        context: line.trim()
      });
    }

    // Check Space Grotesk hardcoded
    if (line.toLowerCase().includes('space grotesk') && relPath !== 'index.css') {
       results.push({
        type: 'Hardcoded Font',
        file: relPath,
        line: lineNum,
        value: 'Space Grotesk',
        suggestion: 'var(--font-SpaceGrotesk)',
        context: line.trim()
      });
    }

    // Shadows hardcoded check
    if (line.toLowerCase().includes('box-shadow') || line.toLowerCase().includes('text-shadow')) {
      if (line.match(/#|rgba/) && relPath !== 'index.css') {
        results.push({
          type: 'Hardcoded Shadow',
          file: relPath,
          line: lineNum,
          value: 'shadow declaration',
          suggestion: 'Use effect variables like var(--yellow-dropshadow)',
          context: line.trim()
        });
      }
    }
    
    // Check inline styles
    if (line.includes('style={{')) {
       results.push({
        type: 'Inline Style',
        file: relPath,
        line: lineNum,
        value: 'style={{ ... }}',
        suggestion: 'Move to CSS/Tailwind using Design System Variables',
        context: line.trim()
      });
    }
  });
}

walk(srcDir);

// Generate Markdown
let md = `# DESIGN_AUDIT.md

## Riepilogo
Questo report evidenzia le discrepanze tra il codice attuale e il design system Figma di riferimento.
Si consiglia di sostituire i valori hardcoded con le variabili CSS definite in \`index.css\`.

## 1. Valori Hardcoded (Colori, Font, Ombre) che dovrebbero usare una variabile
Questi elementi usano colori o stili hardcoded (hex, rgba) e devono essere mappati alle variabili del design system.

| File | Riga | Tipo | Valore Trovato | Suggerimento |
|------|------|------|----------------|--------------|
`;

results.filter(r => r.type.includes('Hardcoded') || r.type === 'Tailwind Arbitrary Color').forEach(r => {
  md += `| \`${r.file}\` | ${r.line} | ${r.type} | \`${r.value}\` | ${r.suggestion} |\n`;
});

md += `

## 2. Inline Styles e CSS non standard
Evitare gli stili inline e utilizzare le classi Tailwind mappate sul design system.

| File | Riga | Contesto |
|------|------|----------|
`;

results.filter(r => r.type === 'Inline Style').forEach(r => {
  // truncate context for markdown table
  let ctx = r.context.substring(0, 50).replace(/\|/g, '');
  md += `| \`${r.file}\` | ${r.line} | \`${ctx}...\` |\n`;
});

md += `

## 3. Incoerenze e Colori non standard
Colori trovati nel codice che non appartengono alla palette Figma.

| File | Riga | Valore Trovato | Contesto |
|------|------|----------------|----------|
`;

results.filter(r => r.type === 'Non-standard Color').forEach(r => {
  let ctx = r.context.substring(0, 50).replace(/\|/g, '');
  md += `| \`${r.file}\` | ${r.line} | \`${r.value}\` | \`${ctx}...\` |\n`;
});

fs.writeFileSync(reportPath, md);
console.log('DESIGN_AUDIT.md generated at', reportPath);
