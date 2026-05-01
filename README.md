# 🌸 Lash by Juliana — Site de Lash Design

Site profissional de alta conversão para negócio de lash design (extensão de cílios).
Design elegante e sofisticado com foco em agendamentos.

---

## 📁 Estrutura de Arquivos

```
lash-site/
├── index.html       → Estrutura HTML completa (9 seções)
├── styles.css       → Estilos, animações, responsividade
├── script.js        → Funcionalidades interativas
└── README.md        → Instruções (este arquivo)
```

---

## 🚀 Como Rodar Localmente

### Opção 1 — Abrir direto no navegador (mais simples)
1. Abra a pasta `lash-site/` no seu gerenciador de arquivos
2. Dê dois cliques em `index.html`
3. O site abrirá no seu navegador padrão ✅

> **Nota:** As imagens são carregadas do Unsplash via URL. É necessário conexão com a internet para exibi-las. Se offline, gradientes coloridos são exibidos automaticamente como fallback.

---

### Opção 2 — Servidor local com VS Code (recomendado)
1. Instale a extensão **Live Server** no VS Code
2. Abra a pasta `lash-site/` no VS Code
3. Clique com o botão direito em `index.html` → **"Open with Live Server"**
4. O site abrirá em `http://127.0.0.1:5500` com hot-reload ✅

---

### Opção 3 — Servidor local com Python
```bash
# Python 3
cd lash-site
python -m http.server 8080

# Acesse: http://localhost:8080
```

---

### Opção 4 — Servidor local com Node.js
```bash
# Instalar o serve globalmente (uma vez)
npm install -g serve

# Rodar na pasta do projeto
cd lash-site
serve .

# Acesse: http://localhost:3000
```

---

## ✏️ Personalização

### 🎨 Cores e Tipografia
Edite as variáveis no topo de `styles.css`:
```css
:root {
  --rose:   #C2778A;   /* Rosa principal */
  --gold:   #C9A96E;   /* Dourado */
  --cream:  #F9F2EE;   /* Creme de fundo */
  --charcoal: #2A2025; /* Texto escuro */
}
```

### 📝 Textos e Conteúdo
Edite diretamente no `index.html`:
- **Nome da profissional:** busque por "Isabelle Moreira"
- **Endereço:** busque por "Rua das Flores"
- **Telefone/WhatsApp:** busque por "5511999999999" e substitua pelo número real
- **Instagram:** busque por "lasbyisabelle"

### 🗺️ Google Maps
Substitua a URL do `<iframe>` na seção `#localizacao` pelo embed do seu endereço real:
1. Acesse [maps.google.com](https://maps.google.com)
2. Busque seu endereço
3. Clique em Compartilhar → Incorporar mapa
4. Copie o `src` do iframe gerado

### 💬 WhatsApp
Substitua `5511999999999` pelo número real com DDD (sem espaços ou símbolos):
```html
href="https://wa.me/5511999999999?text=..."
```

### 📷 Imagens
As imagens atuais são do Unsplash (demonstração). Para produção:
1. Crie a pasta `assets/images/`
2. Adicione suas fotos reais de trabalhos realizados
3. Substitua os `src` das tags `<img>` no HTML

---

## 🔗 Integração com Backend (Formulário de Agendamento)

O formulário atual salva os dados no console (simulação).
Para enviar para um backend real, edite o `script.js`:

```javascript
// Substitua o console.log por:
await fetch('/api/agendamentos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

Opções simples de backend:
- **Formspree** (sem código): `action="https://formspree.io/f/SEU_ID"`
- **EmailJS** (email direto): [emailjs.com](https://emailjs.com)
- **Node.js + Express** + Nodemailer para envio de e-mail
- **WhatsApp API** para confirmação automática

---

## 📱 Funcionalidades Implementadas

- [x] Navbar fixa com efeito glassmorphism ao scroll
- [x] Menu hamburger para mobile
- [x] Hero com animações de entrada (CSS puro)
- [x] Scroll reveal com IntersectionObserver
- [x] Cards de procedimentos com hover effects
- [x] Galeria com tabs e animação de filtro
- [x] Formulário com validação completa em tempo real
- [x] Máscara de telefone automática
- [x] Bloqueio de datas passadas no datepicker
- [x] Feedback visual de sucesso após envio
- [x] Botão flutuante de WhatsApp
- [x] Scroll suave para âncoras
- [x] Highlight de seção ativa na navbar
- [x] Design 100% responsivo (mobile-first)
- [x] SEO básico (meta tags, Open Graph)
- [x] Acessibilidade (ARIA labels, roles)
- [x] Gradientes fallback para imagens offline

---

## 🌐 Deploy Gratuito

Para publicar online gratuitamente:

| Plataforma | Como fazer |
|---|---|
| **Vercel** | Arraste a pasta no [vercel.com](https://vercel.com) |
| **Netlify** | Arraste a pasta em [app.netlify.com](https://app.netlify.com) |
| **GitHub Pages** | Suba o repo e ative Pages nas Settings |

---

Desenvolvido com 💗 para Lash by Isabelle · 2026
