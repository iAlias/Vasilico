import fs from 'fs';
import path from 'path';

const colorMap = {
  '#1A1A1A': '#1E3F20', // Dark Basil Green
  '#F5F2ED': '#F0F5F1', // Light Green Background
  '#B89C72': '#4A7C59', // Medium Green Accent
  '#8A7553': '#3A6345', // Darker Green Accent
  '#F9F8F6': '#E8F0E9', // Very Light Green Accent Background
};

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    content = content.replace(new RegExp(oldColor, 'g'), newColor);
    content = content.replace(new RegExp(oldColor.toLowerCase(), 'g'), newColor);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated colors in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      replaceColorsInFile(fullPath);
    }
  }
}

walkDir('./src');
