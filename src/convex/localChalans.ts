import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new local chalan
export const create = mutation({
  args: {
    invoiceNumber: v.string(),
    date: v.string(),
    toName: v.string(),
    toAddress: v.string(),
    fromName: v.string(),
    fromAddress: v.string(),
    items: v.array(v.object({
      sln: v.number(),
      description: v.string(),
      unit: v.string(),
      quantity: v.number(),
    })),
    inWords: v.string(),
    signatureUrl: v.optional(v.string()),
    sealUrl: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const localChalanId = await ctx.db.insert("localChalans", {
      userId: user._id,
      ...args,
    });

    return localChalanId;
  },
});

// Get all local chalans for current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("localChalans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get local chalan by ID
export const getById = query({
  args: { id: v.id("localChalans") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const localChalan = await ctx.db.get(args.id);
    if (!localChalan || localChalan.userId !== user._id) {
      throw new Error("Local chalan not found");
    }

    return localChalan;
  },
});

// Update local chalan
export const update = mutation({
  args: {
    id: v.id("localChalans"),
    invoiceNumber: v.optional(v.string()),
    date: v.optional(v.string()),
    toName: v.optional(v.string()),
    toAddress: v.optional(v.string()),
    fromName: v.optional(v.string()),
    fromAddress: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      sln: v.number(),
      description: v.string(),
      unit: v.string(),
      quantity: v.number(),
    }))),
    inWords: v.optional(v.string()),
    signatureUrl: v.optional(v.string()),
    sealUrl: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const { id, ...updates } = args;
    const localChalan = await ctx.db.get(id);
    
    if (!localChalan || localChalan.userId !== user._id) {
      throw new Error("Local chalan not found");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete local chalan
export const remove = mutation({
  args: { id: v.id("localChalans") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const localChalan = await ctx.db.get(args.id);
    if (!localChalan || localChalan.userId !== user._id) {
      throw new Error("Local chalan not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Generate next local chalan invoice number
export const generateInvoiceNumber = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const localChalans = await ctx.db
      .query("localChalans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const now = new Date();
    const y = now.getFullYear().toString();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const datePrefix = `IGS${y}${m}${d}`;

    const todays = localChalans.filter((inv) =>
      inv.invoiceNumber?.startsWith(datePrefix)
    );

    const nextNumber = todays.length + 1;
    return `${datePrefix}`;
  },
});
