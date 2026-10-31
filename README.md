# AicyLink

Company website for AicyLink — Next.js 15, Tailwind CSS 4, Geist fonts.

## Develop

```bash
npm install
npm run dev
```

## Editing content

All text, products, partners and open roles live in [`src/content/site.ts`](src/content/site.ts).
Add an item to `products`, `partners` or `roles` and the matching section updates automatically;
empty lists show "coming soon" placeholders.

The logo is drawn as SVG in [`src/components/logo.tsx`](src/components/logo.tsx) and [`public/logo.svg`](public/logo.svg).
