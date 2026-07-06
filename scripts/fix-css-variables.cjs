const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/design-system');
const files = ['Atoms.module.css'];

const replacements = [
  // Fonts
  { regex: /font-family:\s*Space Grotesk;/gi, replace: 'font-family: var(--font-SpaceGrotesk);' },
  { regex: /font-family:\s*"Space Grotesk";/gi, replace: 'font-family: var(--font-SpaceGrotesk);' },
  { regex: /font-family:\s*'Space Grotesk';/gi, replace: 'font-family: var(--font-SpaceGrotesk);' },
  
  // Shadows - these need to come before colors to match the full shadow string
  { regex: /0px\s+0px\s+14px\s+#ffd700/gi, replace: 'var(--yellow-dropshadow)' },
  { regex: /0px\s+0px\s+14px\s+#39ff14/gi, replace: 'var(--green-dropshadow)' },
  { regex: /0px\s+0px\s+14px\s+#ff0000/gi, replace: 'var(--red-dropshadow)' },
  { regex: /0px\s+0px\s+14px\s+#6600c5/gi, replace: 'var(--purple-dropshadow)' },
  // What about drop-shadow function? filter: drop-shadow(0px 0px 14px #ffd700)
  // Our variables are like `0 0 14px var(--yellow)`, which works inside drop-shadow() or box-shadow.

  // Colors
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

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replace);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
