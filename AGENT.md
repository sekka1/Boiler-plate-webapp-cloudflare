# Agent Execution Rules & Security Protocols

You are an automated coding agent developing and maintaining this codebase. You must strictly adhere to the following operational, architectural, and security guidelines on every modification.

## 1. Security First
- **No Hardcoded Secrets:** Never hardcode API keys, auth secrets, or tokens in the repository. Access environment variables via Cloudflare Worker bindings (`c.env`).
- **Strict Authorization:** Enforce Role-Based Access Control (RBAC) on every backend API route. Always verify the session and validate that a `partner` can only read/modify their own referrals (`partnerId === user.id`).
- **Input Sanitization & Validation:** Use `zod` for strict request payload validation on all Hono API endpoints. Never execute raw string interpolation into SQL queries—always use Drizzle ORM query builders or parameterized bindings.
- **OWASP Best Practices:** Protect against CSRF, set secure HTTP security headers (HSTS, Content Security Policy, X-Frame-Options), and enforce strict CORS settings.

## 2. Test Execution Mandate
- **Run Tests Before Commit:** Before proposing changes, finalizing tasks, or committing code, you MUST execute `npm run lint`, `npm run typecheck`, and `npm run test:unit`.
- **Zero Regression Policy:** Never mark a task as complete if any existing test fails. If a feature modification breaks existing unit or E2E tests, update or add tests to reflect the intended behavior.
- **Add Tests for New Features:** Every new API route or business logic addition must be accompanied by unit tests in `/src/tests` and E2E coverage in `/e2e`.

## 3. Edge Runtime Constraints (Cloudflare Workers)
- **Runtime Compatibility:** This application runs on the Cloudflare Workers V8 runtime. Do NOT use Node.js native built-ins (such as `fs`, `path`, or `child_process`) in backend files.
- **Database Access:** Access Cloudflare D1 exclusively through the Drizzle ORM binding (`c.env.DB`). Never attempt direct filesystem SQLite access.

## 4. Code Quality & Architecture
- **Type Safety:** Maintain 100% strict TypeScript types across the backend and frontend. Do not use `any`. Use Hono RPC to export backend endpoint types directly to frontend clients.
- **Atomic Components:** Follow modular React
