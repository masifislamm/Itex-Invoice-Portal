import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new proforma invoice
export const create = mutation({
  args: {
    invoiceNumber: v.string(),
    companyName: v.string(),
    companyAddress: v.string(),
    companyLogoUrl: v.optional(v.string()),
    companySealUrl: v.optional(v.string()),
    clientName: v.string(),
    clientAddress: v.string(),
    date: v.string(),
    shipper: v.string(),
    telephoneNumber: v.string(),
    destination: v.string(),
    deliveryTime: v.string(),
    paymentTerm: v.string(),
    items: v.array(v.object({
      shippingMarks: v.string(),
      description: v.string(),
      unitPrice: v.string(),
      amount: v.number(),
    })),
    total: v.number(),
    totalInWords: v.string(),
    advisingBank: v.string(),
    bankAddress: v.string(),
    beneficiaryName: v.string(),
    accountNumber: v.string(),
    swiftCode: v.string(),
    origin: v.string(),
    portOfLoading: v.string(),
    portOfDestination: v.string(),
    partialShipment: v.string(),
    transshipment: v.string(),
    terms: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const proformaId = await ctx.db.insert("proformaInvoices", {
      userId: user._id,
      ...args,
    });

    return proformaId;
  },
});

// Get all proforma invoices for current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("proformaInvoices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get proforma invoice by ID
export const getById = query({
  args: { id: v.id("proformaInvoices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const proforma = await ctx.db.get(args.id);
    if (!proforma || proforma.userId !== user._id) {
      throw new Error("Proforma invoice not found");
    }

    return proforma;
  },
});

// Update proforma invoice
export const update = mutation({
  args: {
    id: v.id("proformaInvoices"),
    invoiceNumber: v.optional(v.string()),
    companyName: v.optional(v.string()),
    companyAddress: v.optional(v.string()),
    companyLogoUrl: v.optional(v.string()),
    companySealUrl: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientAddress: v.optional(v.string()),
    date: v.optional(v.string()),
    shipper: v.optional(v.string()),
    telephoneNumber: v.optional(v.string()),
    destination: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    paymentTerm: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      shippingMarks: v.string(),
      description: v.string(),
      unitPrice: v.string(),
      amount: v.number(),
    }))),
    total: v.optional(v.number()),
    totalInWords: v.optional(v.string()),
    advisingBank: v.optional(v.string()),
    bankAddress: v.optional(v.string()),
    beneficiaryName: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    swiftCode: v.optional(v.string()),
    origin: v.optional(v.string()),
    portOfLoading: v.optional(v.string()),
    portOfDestination: v.optional(v.string()),
    partialShipment: v.optional(v.string()),
    transshipment: v.optional(v.string()),
    terms: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const { id, ...updates } = args;
    const proforma = await ctx.db.get(id);
    
    if (!proforma || proforma.userId !== user._id) {
      throw new Error("Proforma invoice not found");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete proforma invoice
export const remove = mutation({
  args: { id: v.id("proformaInvoices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const proforma = await ctx.db.get(args.id);
    if (!proforma || proforma.userId !== user._id) {
      throw new Error("Proforma invoice not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Generate next proforma invoice number
export const generateInvoiceNumber = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const proformas = await ctx.db
      .query("proformaInvoices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const now = new Date();
    const y = now.getFullYear().toString();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const datePrefix = `GD${y}${m}${d}`;

    const todays = proformas.filter((inv) =>
      inv.invoiceNumber?.startsWith(datePrefix)
    );

    const nextNumber = todays.length + 1;
    return `${datePrefix}SAD-${nextNumber}`;
  },
});
