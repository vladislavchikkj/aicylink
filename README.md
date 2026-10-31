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

The form on `/contact` posts to `/api/contact`, which forwards messages to Telegram.
Set these environment variables (locally in `.env.local`, in production in Vercel settings):

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

Without them the form shows an error with a fallback email link.
