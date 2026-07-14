# Alex Sander — Ação Social em Aparecida de Goiânia

Landing page one-page (HTML/CSS/JS estático, sem build).

## Estrutura
- `index.html` — página
- `css/styles.css` — design system e estilos
- `js/main.js` — interações (scroll suave, reveal, menu, carrossel)
- `js/lenis.min.js` — smooth scroll (auto-hospedado)
- `img/` — imagens otimizadas (WebP + fallback JPG/PNG)
- `robots.txt`, `sitemap.xml` — SEO

## Rodar localmente
Qualquer servidor estático, por exemplo:

```bash
npx serve .
```

Ou abra o `index.html` diretamente no navegador.

## Deploy
Site estático — compatível com GitHub Pages, Netlify ou Vercel sem configuração de build. Os caminhos de assets são relativos, então funciona também em subpasta.

> Os domínios em `canonical`/Open Graph/`sitemap.xml` apontam para `alexsander.com.br` (domínio de produção pretendido). Ajuste se for usar outro endereço.
