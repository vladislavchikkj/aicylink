# AicyLink

Company website for AicyLink — Next.js 15, Tailwind CSS 4, Motion, Lenis, cobe.

## Develop

```bash
npm install
npm run dev
```

## Editing content

All text, products, metrics, team, roles, news and partners live in
[`src/content/site.ts`](src/content/site.ts). Entries marked `DEMO` are placeholders —
replace them with real data and set `site.demo` to `false`. While `demo` is `true`
the site is hidden from search engines (`noindex` + `robots.txt` disallow).

Legal pages in `src/app/legal/` contain template text and should be reviewed by a lawyer.

## Contact form

There is no backend: the form on `/contact` opens the visitor's email app with a
pre-filled message to `site.email`.

## SEO and domain

The canonical address is `site.url` (default `https://aicylink.vercel.app`).
When a custom domain is connected, set `NEXT_PUBLIC_SITE_URL` in Vercel (or edit
`site.url`) and redeploy — sitemap, canonical links and social previews follow.

To verify the site in Google Search Console, choose the "HTML tag" method and paste
the `content` value into `site.googleVerification`.
