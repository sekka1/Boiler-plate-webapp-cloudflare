# Cloudflare Deployment Guide

This document describes how to perform the initial (one-time) manual deployment
of this application to Cloudflare, and how automatic Continuous Deployment (CD)
works once that setup is complete.

## 1. Prerequisites

- A Cloudflare account with Workers and D1 enabled.
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (already
  included as a dev dependency, available via `npx wrangler`).
- A Cloudflare API Token with permissions to edit Workers Scripts and D1
  databases, and your Cloudflare Account ID.

## 2. One-Time Initial Setup

### Step A: Authenticate Wrangler

```bash
npx wrangler login
```

### Step B: Create the production D1 database

```bash
npx wrangler d1 create referral-portal-db
```

Note the `database_id` returned in the output.

### Step C: Update `wrangler.jsonc`

Replace the placeholder `database_id` in `wrangler.jsonc` with the ID from the
previous step:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "referral-portal-db",
    "database_id": "<your-database-id-here>",
    "migrations_dir": "drizzle"
  }
]
```

### Step D: Apply database migrations

```bash
npx wrangler d1 migrations apply referral-portal-db --remote
```

### Step E: Build and deploy the application

```bash
npm run deploy
```

This runs `npm run build` followed by `wrangler deploy`, which builds the
client/worker bundle and publishes it to Cloudflare Workers.

## 3. Continuous Deployment (GitHub Actions)

Once the initial setup above is complete, the workflow defined in
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) automatically
deploys every push to the `main` branch (for example, when a pull request is
merged). The workflow:

1. Installs dependencies.
2. Applies any pending D1 migrations to the production database.
3. Builds the application.
4. Deploys the Worker (and static assets) via `wrangler deploy`.

### Required GitHub Secrets

Configure the following repository (or environment) secrets under
**Settings → Secrets and variables → Actions** so the CD workflow can
authenticate with Cloudflare:

| Secret                  | Description                                              |
| ------------------------ | --------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`   | API token with Workers Scripts and D1 edit permissions.   |
| `CLOUDFLARE_ACCOUNT_ID`  | Your Cloudflare account ID.                               |

Once these secrets are configured, merging to `main` will automatically run
database migrations and deploy the latest code to Cloudflare.
