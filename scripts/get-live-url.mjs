#!/usr/bin/env node
/**
 * Prints the deployed site's base URL, sourced from `vars.BETTER_AUTH_URL`
 * in `wrangler.jsonc` - the single place that value should be configured
 * (see `wrangler.jsonc`).
 *
 * Used by the CD workflow (`.github/workflows/deploy.yml`) to populate
 * `LIVE_URL` for the post-deploy E2E smoke tests, so it never has to be
 * duplicated in a separate GitHub Actions variable.
 *
 * Usage:
 *   node scripts/get-live-url.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wranglerPath = path.join(__dirname, "..", "wrangler.jsonc");

function stripJsonComments(jsonc) {
  return jsonc
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"])\/\/.*$/gm, "$1");
}

const raw = fs.readFileSync(wranglerPath, "utf8");
const config = JSON.parse(stripJsonComments(raw));
const liveUrl = config?.vars?.BETTER_AUTH_URL;

if (!liveUrl) {
  console.error(
    "Could not find vars.BETTER_AUTH_URL in wrangler.jsonc. Set it to your deployed Worker's URL.",
  );
  process.exit(1);
}

console.log(liveUrl);
