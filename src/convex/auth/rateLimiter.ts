import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

export const checkAndIncrementOtpRateLimit = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("otpRateLimits")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existing) {
      await ctx.db.insert("otpRateLimits", { email, count: 1, windowStart: now });
      return { allowed: true, retryAfterMs: 0 };
    }

    // Reset window if expired
    if (now - existing.windowStart > WINDOW_MS) {
      await ctx.db.patch(existing._id, { count: 1, windowStart: now });
      return { allowed: true, retryAfterMs: 0 };
    }

    if (existing.count >= MAX_REQUESTS) {
      const retryAfterMs = WINDOW_MS - (now - existing.windowStart);
      return { allowed: false, retryAfterMs };
    }

    await ctx.db.patch(existing._id, { count: existing.count + 1 });
    return { allowed: true, retryAfterMs: 0 };
  },
});
