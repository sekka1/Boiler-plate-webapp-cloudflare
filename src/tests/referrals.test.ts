import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("API authentication", () => {
  it("rejects unauthenticated requests to /api/referrals", async () => {
    const res = await SELF.fetch("https://example.com/api/referrals");
    expect(res.status).toBe(401);
  });

  it("rejects unauthenticated requests to /api/admin/users", async () => {
    const res = await SELF.fetch("https://example.com/api/admin/users");
    expect(res.status).toBe(401);
  });
});
