This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Uses [pnpm](https://pnpm.io). Enable via Corepack: `corepack enable`

Node **20 LTS** recommended (`.nvmrc`). Playwright 1.60.x breaks on Node 24 with `@playwright/test@1.61+`.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test:e2e` | Playwright e2e (requires `E2E_*` in `.env.local`) |
| `pnpm db:push` | Apply Supabase migrations |

## Deploy on Vercel

Set **Install Command** to `pnpm install` (Corepack reads `packageManager` from `package.json` automatically on Vercel).
