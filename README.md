# Boiler-plate-webapp-cloudflare

A full-stack boilerplate web application built to run entirely on the Cloudflare
Workers platform. It is implemented as a "Real Estate Referral Portal" that lets
**partners** submit and track client referrals while **admins** manage users and
review all referrals.

## Tech Stack

- **Cloudflare Workers** – edge runtime hosting both the API and static assets
- **Cloudflare D1** – SQLite-compatible database, accessed via **Drizzle ORM**
- **Hono** – lightweight web framework for the backend API, with Hono RPC used
  to share type-safe API contracts with the frontend
- **better-auth** – authentication (email/password) with session management
- **React 19** + **React Router** – single-page application frontend
- **Tailwind CSS** – utility-first styling
- **Zod** – request payload validation on API endpoints
- **Vitest** – unit tests (using `@cloudflare/vitest-pool-workers`)
- **Playwright** – end-to-end tests

## Features Implemented So Far

- Email/password sign up and sign in (`better-auth`)
- Role-based access control (RBAC) with `admin` and `partner` roles
- User account status flow: `pending` → `active` / `deactivated`, with a
  "pending approval" page shown to new partners
- Partner dashboard for submitting and tracking referrals
  (client name/email/phone, notes, status, deal value, estimated commission)
- Admin dashboard for managing users and reviewing all referrals
- Backend API (Hono) routes for referrals (`/api/referrals`) and admin user
  management (`/api/admin/users`), enforcing that partners can only access
  their own referrals
- Database schema and migrations (Drizzle) for `users`, `referrals`,
  `sessions`, `accounts`, and `verifications` tables
- Security hardening: secure HTTP headers, CORS restricted to the configured
  origin, and Zod-based input validation
- Unit tests for backend routes and end-to-end tests for auth, admin, and
  partner flows

## Project Structure

```
src/
  backend/        Hono API (routes, auth, RBAC middleware)
  db/             Drizzle schema and database access
  frontend/       React app (pages, components, lib)
  tests/          Unit tests
e2e/              Playwright end-to-end tests
drizzle/          Generated SQL migrations
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the app locally with Vite:

```bash
npm run dev
```

Build and preview using Wrangler (Cloudflare Workers runtime):

```bash
npm run preview
```

Deploy to Cloudflare:

```bash
npm run deploy
```

### Environment / Configuration

Configure the D1 database binding and `BETTER_AUTH_URL` in `wrangler.jsonc`,
and set the `BETTER_AUTH_SECRET` secret (e.g. via `wrangler secret put
BETTER_AUTH_SECRET`) before deploying.

`BETTER_AUTH_URL` **must** match the exact origin your app is served from in
production (e.g. `https://your-worker-name.your-subdomain.workers.dev` or a
custom domain), otherwise sign-in/sign-up requests will fail with an
`Invalid origin` error. If you need to trust additional origins (for example
while migrating domains), set the optional `BETTER_AUTH_TRUSTED_ORIGINS`
variable to a comma-separated list of extra origins. Local development
origins (`http://localhost:5173` and `http://localhost:8787`) are always
trusted automatically.

### Seeding Initial Users

After applying migrations, you can seed the database with one active user per
role (`admin` and `partner`) so you can sign in right away:

```bash
npm run db:seed:generate   # (re)generates drizzle/seed/seed.sql with fresh hashed passwords
npm run db:seed            # applies drizzle/seed/seed.sql to the local D1 database
npm run db:seed:remote     # applies drizzle/seed/seed.sql to the remote/production D1 database
```

Seeded accounts (all use the password `garland123`):

| Email | Role |
| --- | --- |
| `admin@example.com` | admin |
| `partner@example.com` | partner |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build the client and worker for production |
| `npm run preview` | Build then run locally with Wrangler |
| `npm run deploy` | Build then deploy to Cloudflare |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check both client and worker TypeScript configs |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run db:generate` | Generate Drizzle migrations from the schema |
| `npm run db:seed:generate` | Regenerate `drizzle/seed/seed.sql` with fresh hashed passwords |
| `npm run db:seed` | Seed the local D1 database with initial users |
| `npm run db:seed:remote` | Seed the remote/production D1 database with initial users |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on the initial Cloudflare
deployment and how Continuous Deployment to Cloudflare works on merge to `main`.
