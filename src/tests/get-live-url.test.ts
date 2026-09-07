import { describe, expect, it } from "vitest";
import {
  getLiveUrlFromWranglerConfig,
  stripJsonComments,
} from "../../scripts/get-live-url.mjs";

describe("stripJsonComments", () => {
  it("removes full-line comments", () => {
    const jsonc = `{\n  // a comment\n  "a": 1\n}`;
    expect(stripJsonComments(jsonc)).toBe(`{\n  \n  "a": 1\n}`);
  });

  it("removes block comments", () => {
    const jsonc = `{\n  /* a block\n comment */\n  "a": 1\n}`;
    expect(stripJsonComments(jsonc)).toBe(`{\n  \n  "a": 1\n}`);
  });

  it("does not strip // inside string values (e.g. URLs)", () => {
    const jsonc = `{ "url": "https://example.com" }`;
    expect(stripJsonComments(jsonc)).toBe(jsonc);
  });
});

describe("getLiveUrlFromWranglerConfig", () => {
  it("returns vars.BETTER_AUTH_URL from a wrangler.jsonc-style config", () => {
    const jsonc = `{
      // wrangler config
      "name": "my-app",
      "vars": {
        "BETTER_AUTH_URL": "https://my-app.example.workers.dev"
      }
    }`;

    expect(getLiveUrlFromWranglerConfig(jsonc)).toBe(
      "https://my-app.example.workers.dev",
    );
  });

  it("returns undefined when vars.BETTER_AUTH_URL is missing", () => {
    const jsonc = `{ "name": "my-app" }`;

    expect(getLiveUrlFromWranglerConfig(jsonc)).toBeUndefined();
  });
});
