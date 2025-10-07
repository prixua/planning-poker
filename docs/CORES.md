# 🎨 Sistema de Cores - Planning Poker

Este documento explica como utilizar e personalizar o sistema de cores centralizado do Planning Poker.

## 📁 Estrutura dos Arquivos

```
src/
├── styles/
│   └── colors.css          # ← ARQUIVO PRINCIPAL DE CORES
├── app/
│   └── globals.css         # Importa o colors.css
└── tailwind.config.ts      # Configuração do Tailwind
```

## 🎯 Arquivo Principal: `src/styles/colors.css`

**Este é o arquivo que você deve editar para modificar todas as cores da aplicação!**

### Variáveis CSS Disponíveis

```css
/* === CORES PRINCIPAIS === */
--color-primary: 30 64 175;        /* Azul principal */
--color-primary-hover: 29 78 216;  /* Azul hover */
--color-primary-light: 59 130 246; /* Azul claro */
--color-primary-dark: 30 58 138;   /* Azul escuro */

--color-secondary: 147 51 234;     /* Roxo secundário */
--color-secondary-hover: 126 34 206;
--color-secondary-light: 168 85 247;
--color-secondary-dark: 109 40 217;

/* === GRADIENTES === */
--gradient-bg-from: 30 58 138;     /* Gradiente inicial */
--gradient-bg-to: 109 40 217;      /* Gradiente final */

/* === CORES DE STATUS === */
--color-success: 34 197 94;        /* Verde sucesso */
--color-warning: 245 158 11;       /* Amarelo warning */
--color-danger: 239 68 68;         /* Vermelho erro */

/* === CORES DOS CARDS === */
--color-card-bg: var(--color-white);
--color-card-border: var(--color-gray-200);
--color-card-selected: var(--color-primary);

/* === CORES ESPECIAIS === */
--color-coffee: 168 85 247;        /* Roxo para café ☕ */
--color-question: 245 158 11;      /* Amarelo para ? */
```

## 🚀 Como Personalizar as Cores

### 1. **Modificar Cores Principais**

Para mudar a cor principal do azul para verde:

```css
/* Em src/styles/colors.css */
--color-primary: 34 197 94;        /* Verde em vez de azul */
--color-primary-hover: 22 163 74;
--color-primary-light: 74 222 128;
--color-primary-dark: 21 128 61;
```

### 2. **Modificar Gradiente de Fundo**

Para mudar o gradiente da tela inicial:

```css
--gradient-bg-from: 34 197 94;     /* Verde */
--gradient-bg-to: 59 130 246;     /* Azul */
```

### 3. **Cores dos Cards Especiais**

Para mudar as cores do café e interrogação:

```css
--color-coffee: 239 68 68;         /* Vermelho para café */
--color-question: 34 197 94;       /* Verde para interrogação */
```

## 📋 Classes Utilitárias Prontas

### Backgrounds
- `.bg-primary` - Cor principal
- `.bg-primary-hover` - Cor principal hover
- `.bg-success` - Verde sucesso
- `.bg-warning` - Amarelo warning
- `.bg-danger` - Vermelho erro

### Textos
- `.text-primary` - Texto cor principal
- `.text-success` - Texto verde
- `.text-warning` - Texto amarelo
- `.text-danger` - Texto vermelho

### Bordas
- `.border-primary` - Borda cor principal
- `.border-success` - Borda verde
- `.border-gray-light` - Borda cinza claro

### Sombras
- `.shadow-card` - Sombra padrão dos cards
- `.shadow-card-hover` - Sombra hover dos cards
- `.shadow-button` - Sombra dos botões

### Gradientes
- `.bg-gradient-primary` - Gradiente de fundo

## 🎨 Exemplos de Uso

### No código JSX/TSX:

```tsx
// Usando classes do Tailwind customizadas
<div className="bg-primary text-white p-4 rounded-lg shadow-card">
  Conteúdo com cor principal
</div>

// Usando classe utilitária customizada
<button className="bg-gradient-primary text-white">
  Botão com gradiente
</button>

// Componente com classe customizada
<div className="voting-card">
  Card de votação
</div>
```

## 🔧 Configuração do Tailwind

O arquivo `tailwind.config.ts` já está configurado para usar nossas cores:

```typescript
colors: {
  primary: {
    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
    hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
    light: 'rgb(var(--color-primary-light) / <alpha-value>)',
    dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
  },
  // ... outras cores
}
```

## 📱 Temas Pré-definidos

### Tema Azul (Padrão)
```css
--color-primary: 30 64 175;        /* blue-800 */
--color-secondary: 147 51 234;     /* purple-600 */
--gradient-bg-from: 30 58 138;     /* blue-900 */
--gradient-bg-to: 109 40 217;      /* purple-800 */
```

### Tema Verde
```css
--color-primary: 34 197 94;        /* green-500 */
--color-secondary: 59 130 246;     /* blue-500 */
--gradient-bg-from: 21 128 61;     /* green-700 */
--gradient-bg-to: 34 197 94;       /* green-500 */
```

### Tema Roxo
```css
--color-primary: 147 51 234;       /* purple-600 */
--color-secondary: 59 130 246;     /* blue-500 */
--gradient-bg-from: 109 40 217;    /* purple-700 */
--gradient-bg-to: 147 51 234;      /* purple-600 */
```

## 🛠️ Componentes que Usam o Sistema

- ✅ **VotingCard** - Cards de votação
- ✅ **UserAvatar** - Avatares dos usuários
- 🔄 **Páginas** - Fundos e layouts (próximo)
- 🔄 **Botões** - Todos os botões (próximo)

## 🚀 Como Aplicar Mudanças

1. **Edite** `src/styles/colors.css`
2. **Salve** o arquivo
3. **Recompile** a aplicação (`npm run build`)
4. **Veja** as mudanças automaticamente aplicadas

## 💡 Dicas Importantes

- **Formato RGB**: Use valores RGB separados por espaço (ex: `255 0 0`)
- **Transparência**: Funciona automaticamente com `<alpha-value>`
- **Hover States**: Defina sempre uma cor de hover
- **Acessibilidade**: Mantenha contraste adequado
- **Consistência**: Use o sistema de cores em toda aplicação

---

**🎨 Para personalizar o visual, edite apenas: `src/styles/colors.css`**