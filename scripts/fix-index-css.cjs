const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/index.css');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const replacements = [
  // Fonts
  { regex: /font-family:\s*"Space Grotesk"(?:,\s*ui-sans-serif,\s*sans-serif)?;/gi, replace: 'font-family: var(--font-SpaceGrotesk);' },
  { regex: /font-family:\s*"Space Grotesk",\s*sans-serif;/gi, replace: 'font-family: var(--font-SpaceGrotesk);' },
  
  // Colors (case insensitive)
  { regex: /#ffd700/gi, replace: 'var(--yellow)' },
  { regex: /#000000\b/gi, replace: 'var(--black)' },
  { regex: /#000\b/gi, replace: 'var(--black)' },
  { regex: /#ffffff\b/gi, replace: 'var(--white)' },
  { regex: /#fff\b/gi, replace: 'var(--white)' },
  { regex: /#ff0000\b/gi, replace: 'var(--red-light)' },
  { regex: /#880000\b/gi, replace: 'var(--red-dark)' },
  { regex: /#39ff14\b/gi, replace: 'var(--green-light)' },
  { regex: /#158300\b/gi, replace: 'var(--green-dark)' },
  { regex: /#c4c4c4\b/gi, replace: 'var(--gray-light)' },
  { regex: /#535353\b/gi, replace: 'var(--gray-medium)' },
  { regex: /#2a2a2a\b/gi, replace: 'var(--gray-dark)' },
  { regex: /#6600c5\b/gi, replace: 'var(--purple-light)' },
  { regex: /#29004f\b/gi, replace: 'var(--purple-dark)' },
];

for (let i = 233; i < lines.length; i++) {
  let line = lines[i];
  
  // Replace colors and fonts
  replacements.forEach(r => {
    line = line.replace(r.regex, r.replace);
  });
  
  lines[i] = line;
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Updated index.css');
