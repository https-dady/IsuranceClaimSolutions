# Insurance Claim Solution — Recovered Frontend

This project packages the recovered production frontend so it can run locally and be deployed without Hostinger.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build

```bash
npm run build
```

The deployable output will be created in `dist/`.

## Deploy

You can push this repository to GitHub and deploy it on:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages (requires SPA routing configuration)
- Any static hosting provider

## Important

The recovered JavaScript is the original production bundle exported from the website backup. It is compiled/minified, not the original Agentic component source tree.

The website itself remains independent of Hostinger and can be run/deployed from this repository.
