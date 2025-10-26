import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new local proforma
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
      itemDescription: v.string(),
      quantityInKg: v.number(),
      unitPriceTk: v.number(),
      totalPriceTk: v.number(),
    })),
    totalInWords: v.string(),
    paymentTerms: v.string(),
    signatureUrl: v.optional(v.string()),
    sealUrl: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const localProformaId = await ctx.db.insert("localProformas", {
      userId: user._id,
      ...args,
    });

    return localProformaId;
  },
});

// Get all local proformas for current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("localProformas")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get local proforma by ID
export const getById = query({
  args: { id: v.id("localProformas") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const localProforma = await ctx.db.get(args.id);
    if (!localProforma || localProforma.userId !== user._id) {
      throw new Error("Local proforma not found");
    }

    return localProforma;
  },
});

// Update local proforma
export const update = mutation({
  args: {
    id: v.id("localProformas"),
    invoiceNumber: v.optional(v.string()),
    date: v.optional(v.string()),
    toName: v.optional(v.string()),
    toAddress: v.optional(v.string()),
    fromName: v.optional(v.string()),
    fromAddress: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      sln: v.number(),
      itemDescription: v.string(),
      quantityInKg: v.number(),
      unitPriceTk: v.number(),
      totalPriceTk: v.number(),
    }))),
    totalInWords: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
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
    const localProforma = await ctx.db.get(id);
    
    if (!localProforma || localProforma.userId !== user._id) {
      throw new Error("Local proforma not found");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete local proforma
export const remove = mutation({
  args: { id: v.id("localProformas") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const localProforma = await ctx.db.get(args.id);
    if (!localProforma || localProforma.userId !== user._id) {
      throw new Error("Local proforma not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Generate next local proforma invoice number
export const generateInvoiceNumber = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const localProformas = await ctx.db
      .query("localProformas")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const now = new Date();
    const y = now.getFullYear().toString();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const datePrefix = `IGS${y}${m}${d}`;

    const todays = localProformas.filter((inv) =>
      inv.invoiceNumber?.startsWith(datePrefix)
    );

    const nextNumber = todays.length + 1;
    return `${datePrefix}`;
  },
});
