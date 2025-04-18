import React, { useEffect } from 'react';

/**
 * Ce composant ne rend rien dans l'interface, mais fournit des instructions
 * pour générer toutes les versions de favicon et icônes nécessaires.
 * 
 * Pour créer toutes les versions d'icônes requises:
 * 
 * 1. Assurez-vous que le fichier public/icon.svg existe
 * 2. Installez les dépendances:
 *    npm install sharp svgexport
 * 
 * 3. Créez un script dans package.json:
 *    "generate-icons": "node scripts/generate-icons.js"
 * 
 * 4. Créez le fichier scripts/generate-icons.js avec:
 */

const iconGenerationScript = `
// scripts/generate-icons.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const FAVICON_SIZES = [16, 32, 48, 64, 96, 128, 256];
const APPLE_TOUCH_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180];
const ANDROID_ICON_SIZES = [36, 48, 72, 96, 144, 192, 512];

const PUBLIC_DIR = path.join(__dirname, '../public');
const SVG_ICON = path.join(PUBLIC_DIR, 'icon.svg');

if (!fs.existsSync(SVG_ICON)) {
  console.error('SVG icon not found at ' + SVG_ICON);
  process.exit(1);
}

// Assurez-vous que le dossier icons existe
const iconsDir = path.join(PUBLIC_DIR, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Fonction pour convertir SVG en PNG
async function convertSvgToPng(inputSvg, outputPng, size) {
  console.log(\`Converting \${inputSvg} to \${outputPng} (size: \${size}x\${size})\`);
  try {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(outputPng);
  } catch (error) {
    console.error(\`Error converting \${inputSvg} to \${outputPng}: \${error.message}\`);
  }
}

// Générer favicon.ico (multi-size ICO)
async function generateFavicon() {
  // Générer PNGs temporaires pour chaque taille
  const tempFiles = [];
  for (const size of [16, 32, 48]) {
    const tempFile = path.join(PUBLIC_DIR, \`favicon-\${size}.png\`);
    await convertSvgToPng(SVG_ICON, tempFile, size);
    tempFiles.push(tempFile);
  }
  
  // Installer et utiliser png-to-ico si nécessaire
  console.log('Generating favicon.ico...');
  try {
    require.resolve('png-to-ico');
  } catch (e) {
    execSync('npm install png-to-ico --no-save');
  }
  
  const pngToIco = require('png-to-ico');
  const pngPaths = tempFiles;
  pngToIco(pngPaths)
    .then(buf => {
      fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), buf);
      console.log('favicon.ico created successfully!');
      
      // Nettoyer les fichiers temporaires
      pngPaths.forEach(file => fs.unlinkSync(file));
    })
    .catch(err => console.error('Error creating favicon.ico:', err));
}

// Générer apple-touch-icon.png
async function generateAppleTouchIcon() {
  const outputFile = path.join(PUBLIC_DIR, 'apple-touch-icon.png');
  await convertSvgToPng(SVG_ICON, outputFile, 180);
  console.log('apple-touch-icon.png created successfully!');
}

// Générer les tailles d'icônes pour Android
async function generateAndroidIcons() {
  for (const size of ANDROID_ICON_SIZES) {
    const outputFile = path.join(iconsDir, \`android-\${size}x\${size}.png\`);
    await convertSvgToPng(SVG_ICON, outputFile, size);
  }
  console.log('Android icons created successfully!');
}

// Générer les tailles d'icônes standard
async function generateStandardIcons() {
  for (const size of FAVICON_SIZES) {
    const outputFile = path.join(iconsDir, \`favicon-\${size}x\${size}.png\`);
    await convertSvgToPng(SVG_ICON, outputFile, size);
  }
  console.log('Standard icons created successfully!');
}

// Générer site.webmanifest
function generateWebManifest() {
  const manifest = {
    name: "Nour Al-Qalb",
    short_name: "Nour Al-Qalb",
    icons: [
      {
        src: "/icons/android-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/android-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#be963c",
    background_color: "#000000",
    display: "standalone"
  };

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('site.webmanifest created successfully!');
}

// Exécuter toutes les fonctions
async function generateAllIcons() {
  await generateFavicon();
  await generateAppleTouchIcon();
  await generateAndroidIcons();
  await generateStandardIcons();
  generateWebManifest();
  console.log('All icons generated successfully!');
}

generateAllIcons();
`;

const FaviconGenerator: React.FC = () => {
  useEffect(() => {
    // Ce composant ne fait rien lors du rendu
    console.log('Pour générer les favicons, suivez les instructions dans le fichier FaviconGenerator.tsx');
  }, []);

  return (
    <div style={{ display: 'none' }}>
      {/* 
        Ceci est juste un composant utilitaire pour générer les favicons.
        Il ne rend rien dans l'interface.
        
        Pour l'utiliser, suivez les instructions ci-dessus.
      */}
    </div>
  );
};

export default FaviconGenerator; 
 