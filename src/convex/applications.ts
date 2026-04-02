import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new application
export const create = mutation({
  args: {
    date: v.string(),
    commissionCurrency: v.string(),
    commissionAmount: v.string(),
    commissionInWords: v.optional(v.string()),
    supplierCompanyName: v.string(),
    supplierCountry: v.string(),
    recipientAccountNumber: v.string(),
    transferCurrency: v.optional(v.string()),
    signatureUrl: v.optional(v.string()),
    sealUrl: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const applicationId = await ctx.db.insert("applications", {
      userId: user._id,
      ...args,
    });

    return applicationId;
  },
});

// Get all applications for current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get application by ID
export const getById = query({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const application = await ctx.db.get(args.id);
    if (!application || application.userId !== user._id) {
      throw new Error("Application not found");
    }

    return application;
  },
});

// Update application
export const update = mutation({
  args: {
    id: v.id("applications"),
    date: v.optional(v.string()),
    commissionCurrency: v.optional(v.string()),
    commissionAmount: v.optional(v.string()),
    commissionInWords: v.optional(v.string()),
    supplierCompanyName: v.optional(v.string()),
    supplierCountry: v.optional(v.string()),
    recipientAccountNumber: v.optional(v.string()),
    transferCurrency: v.optional(v.string()),
    signatureUrl: v.optional(v.string()),
    sealUrl: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const application = await ctx.db.get(args.id);
    if (!application || application.userId !== user._id) {
      throw new Error("Application not found");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete application
export const deleteApplication = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const application = await ctx.db.get(args.id);
    if (!application || application.userId !== user._id) {
      throw new Error("Application not found");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});
