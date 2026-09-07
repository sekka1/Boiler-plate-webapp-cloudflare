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

/**
 * Strips `//` and `/* *\/` comments from a JSONC string so it can be parsed
 * with `JSON.parse`. Exported for unit testing.
 */
export function stripJsonComments(jsonc) {
  return jsonc
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"])\/\/.*$/gm, "$1");
}

/**
 * Parses a `wrangler.jsonc` file's contents and returns its configured
 * `vars.BETTER_AUTH_URL`, or `undefined` if it isn't set. Exported for unit
 * testing.
 */
export function getLiveUrlFromWranglerConfig(wranglerJsoncContents) {
  const config = JSON.parse(stripJsonComments(wranglerJsoncContents));
  return config?.vars?.BETTER_AUTH_URL;
}

function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const wranglerPath = path.join(__dirname, "..", "wrangler.jsonc");
  const raw = fs.readFileSync(wranglerPath, "utf8");
  const liveUrl = getLiveUrlFromWranglerConfig(raw);

  if (!liveUrl) {
    console.error(
      "Could not find vars.BETTER_AUTH_URL in wrangler.jsonc. Set it to your deployed Worker's URL.",
    );
    process.exit(1);
  }

  console.log(liveUrl);
}

// Only run the CLI logic when this file is executed directly (e.g. `node
// scripts/get-live-url.mjs`), not when it's imported for unit testing.
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
