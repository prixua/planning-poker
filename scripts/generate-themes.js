#!/usr/bin/env node

/**
 * 🎨 Gerador de Temas - Planning Poker
 * 
 * Este script gera variações de cores para diferentes temas.
 * Execute: node scripts/generate-themes.js [tema]
 * 
 * Temas disponíveis: blue, green, purple, orange, red
 */

const fs = require('fs');
const path = require('path');

const themes = {
  blue: {
    name: 'Azul Profissional',
    primary: '30 64 175',      // blue-800
    primaryHover: '29 78 216', // blue-700
    primaryLight: '59 130 246', // blue-500
    primaryDark: '30 58 138',   // blue-900
    secondary: '147 51 234',    // purple-600
    secondaryHover: '126 34 206', // purple-700
    gradientFrom: '30 58 138',  // blue-900
    gradientTo: '109 40 217',   // purple-800
    coffee: '168 85 247',       // purple-500
    question: '245 158 11',     // amber-500
  },
  
  green: {
    name: 'Verde Natureza',
    primary: '34 197 94',       // green-500
    primaryHover: '22 163 74',  // green-600
    primaryLight: '74 222 128', // green-400
    primaryDark: '21 128 61',   // green-700
    secondary: '59 130 246',    // blue-500
    secondaryHover: '37 99 235', // blue-600
    gradientFrom: '21 128 61',  // green-700
    gradientTo: '34 197 94',    // green-500
    coffee: '168 85 247',       // purple-500
    question: '245 158 11',     // amber-500
  },
  
  purple: {
    name: 'Roxo Criativo',
    primary: '147 51 234',      // purple-600
    primaryHover: '126 34 206', // purple-700
    primaryLight: '168 85 247', // purple-500
    primaryDark: '109 40 217',  // purple-700
    secondary: '59 130 246',    // blue-500
    secondaryHover: '37 99 235', // blue-600
    gradientFrom: '109 40 217', // purple-700
    gradientTo: '147 51 234',   // purple-600
    coffee: '245 158 11',       // amber-500
    question: '34 197 94',      // green-500
  },
  
  orange: {
    name: 'Laranja Energético',
    primary: '234 88 12',       // orange-600
    primaryHover: '194 65 12',  // orange-700
    primaryLight: '251 146 60', // orange-400
    primaryDark: '154 52 18',   // orange-800
    secondary: '147 51 234',    // purple-600
    secondaryHover: '126 34 206', // purple-700
    gradientFrom: '154 52 18',  // orange-800
    gradientTo: '234 88 12',    // orange-600
    coffee: '168 85 247',       // purple-500
    question: '59 130 246',     // blue-500
  },
  
  red: {
    name: 'Vermelho Intenso',
    primary: '220 38 38',       // red-600
    primaryHover: '185 28 28',  // red-700
    primaryLight: '239 68 68',  // red-500
    primaryDark: '153 27 27',   // red-800
    secondary: '147 51 234',    // purple-600
    secondaryHover: '126 34 206', // purple-700
    gradientFrom: '153 27 27',  // red-800
    gradientTo: '220 38 38',    // red-600
    coffee: '168 85 247',       // purple-500
    question: '245 158 11',     // amber-500
  }
};

function generateThemeCSS(themeName, themeData) {
  return `/* ========================================
   PLANNING POKER - TEMA ${themeData.name.toUpperCase()}
   ======================================== */

:root {
  /* === CORES PRINCIPAIS === */
  --color-primary: ${themeData.primary};
  --color-primary-hover: ${themeData.primaryHover};
  --color-primary-light: ${themeData.primaryLight};
  --color-primary-dark: ${themeData.primaryDark};
  
  --color-secondary: ${themeData.secondary};
  --color-secondary-hover: ${themeData.secondaryHover};
  --color-secondary-light: ${themeData.secondary};
  --color-secondary-dark: ${themeData.secondaryHover};

  /* === GRADIENTES === */
  --gradient-bg-from: ${themeData.gradientFrom};
  --gradient-bg-to: ${themeData.gradientTo};
  
  /* === CORES DE STATUS === */
  --color-success: 34 197 94;        /* green-500 */
  --color-success-bg: 220 252 231;   /* green-100 */
  --color-success-hover: 22 163 74;  /* green-600 */
  
  --color-warning: 245 158 11;       /* amber-500 */
  --color-warning-bg: 254 243 199;   /* amber-100 */
  --color-warning-hover: 217 119 6;  /* amber-600 */
  
  --color-danger: 239 68 68;         /* red-500 */
  --color-danger-bg: 254 226 226;    /* red-100 */
  --color-danger-hover: 220 38 38;   /* red-600 */

  /* === CORES NEUTRAS === */
  --color-white: 255 255 255;
  --color-gray-50: 249 250 251;
  --color-gray-100: 243 244 246;
  --color-gray-200: 229 231 235;
  --color-gray-300: 209 213 219;
  --color-gray-400: 156 163 175;
  --color-gray-500: 107 114 128;
  --color-gray-600: 75 85 99;
  --color-gray-700: 55 65 81;
  --color-gray-800: 31 41 55;
  --color-gray-900: 17 24 39;

  /* === CORES DOS CARDS === */
  --color-card-bg: var(--color-white);
  --color-card-border: var(--color-gray-200);
  --color-card-hover: var(--color-gray-50);
  --color-card-selected: var(--color-primary);
  --color-card-selected-bg: var(--color-primary-light);
  --color-card-disabled: var(--color-gray-400);
  --color-card-disabled-bg: var(--color-gray-100);

  /* === CORES DE VOTAÇÃO === */
  --color-vote-revealed: var(--color-success);
  --color-vote-hidden: var(--color-gray-400);
  --color-vote-bg: var(--color-gray-100);

  /* === CORES ESPECIAIS === */
  --color-coffee: ${themeData.coffee};
  --color-question: ${themeData.question};

  /* === CORES DE AVATAR === */
  --color-avatar-voter: var(--color-primary);
  --color-avatar-spectator: var(--color-gray-500);
  --color-avatar-voted: var(--color-success);
  --color-avatar-not-voted: var(--color-gray-400);

  /* === SOMBRAS === */
  --shadow-card: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-card-hover: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-button: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Importar classes utilitárias base */
@import "./colors-base.css";
`;
}

function main() {
  const theme = process.argv[2] || 'blue';
  
  if (!themes[theme]) {
    console.error(`❌ Tema "${theme}" não encontrado!`);
    console.log('📋 Temas disponíveis:', Object.keys(themes).join(', '));
    process.exit(1);
  }
  
  const themeData = themes[theme];
  const css = generateThemeCSS(theme, themeData);
  
  // Criar diretório se não existir
  const themesDir = path.join(__dirname, '..', 'src', 'styles', 'themes');
  if (!fs.existsSync(themesDir)) {
    fs.mkdirSync(themesDir, { recursive: true });
  }
  
  // Salvar arquivo
  const filePath = path.join(themesDir, `${theme}.css`);
  fs.writeFileSync(filePath, css);
  
  console.log(`✅ Tema "${themeData.name}" gerado com sucesso!`);
  console.log(`📁 Arquivo: ${filePath}`);
  console.log(`🎨 Para usar: Copie o conteúdo para src/styles/colors.css`);
}

if (require.main === module) {
  main();
}

module.exports = { themes, generateThemeCSS };