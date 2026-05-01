# Portfolio Blog Starter

This is a porfolio site template complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Demo

https://portfolio-blog-starter.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/blog&project-name=blog&repository-name=blog)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

Then, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).

## Strava Cron Setup

Add these environment variables in Vercel Project Settings:

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REFRESH_TOKEN`
- `CRON_SECRET` (Bearer token for `/api/cron/strava` and `/api/strava`)
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob; created when you enable Blob on the project)
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

This project includes a Vercel Cron in `vercel.json` that calls `/api/cron/strava` every day at `21:00 UTC`.
Each run sends a Telegram message with success/failure status.

The latest run JSON is stored in **Vercel Blob** at pathname `strava/latest-run.json` with **private** access (readable only with your blob token on the server, not a public URL).

To manually test the cron endpoint locally:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/strava
```

To fetch the cached latest-run JSON from Blob (also requires Bearer auth):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/strava
```

To simulate Telegram failure handling locally:

```bash
TELEGRAM_BOT_TOKEN=invalid TELEGRAM_CHAT_ID=invalid curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/strava
```
