import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new invoice
export const create = mutation({
  args: {
    invoiceNumber: v.string(),
    companyName: v.string(),
    companyAddress: v.string(),
    companyCity: v.string(),
    companyState: v.string(),
    companyZip: v.string(),
    companyCountry: v.string(),
    companyEmail: v.string(),
    companyPhone: v.string(),
    clientName: v.string(),
    clientAddress: v.string(),
    clientCity: v.string(),
    clientState: v.string(),
    clientZip: v.string(),
    clientCountry: v.string(),
    clientEmail: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    clientFax: v.optional(v.string()),
    issueDate: v.string(),
    dueDate: v.string(),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled")),
    items: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      rate: v.number(),
      amount: v.number(),
      isNote: v.optional(v.boolean()),
    })),
    subtotal: v.number(),
    taxRate: v.number(),
    taxAmount: v.number(),
    total: v.number(),
    notes: v.optional(v.string()),
    terms: v.optional(v.string()),
    currency: v.optional(v.string()),
    // Add commission percent
    commissionPercent: v.optional(v.number()),
    reference: v.optional(v.string()),
    agentName: v.optional(v.string()),
    agentMobile: v.optional(v.string()),
    tin: v.optional(v.string()),
    bin: v.optional(v.string()),
    bankBeneficiaryName: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string()),
    bankName: v.optional(v.string()),
    bankBranch: v.optional(v.string()),
    bankAddress: v.optional(v.string()),
    bankSwiftCode: v.optional(v.string()),
    totalInWords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const invoiceId = await ctx.db.insert("invoices", {
      userId: user._id,
      ...args,
    });

    // Log analytics event
    await ctx.db.insert("analytics", {
      userId: user._id,
      invoiceId,
      eventType: "invoice_created",
      eventData: {
        amount: args.total,
        status: args.status,
      },
    });

    return invoiceId;
  },
});

// Get all invoices for current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get invoice by ID
export const getById = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== user._id) {
      throw new Error("Invoice not found");
    }

    return invoice;
  },
});

// Update invoice
export const update = mutation({
  args: {
    id: v.id("invoices"),
    invoiceNumber: v.optional(v.string()),
    companyName: v.optional(v.string()),
    companyAddress: v.optional(v.string()),
    companyCity: v.optional(v.string()),
    companyState: v.optional(v.string()),
    companyZip: v.optional(v.string()),
    companyCountry: v.optional(v.string()),
    companyEmail: v.optional(v.string()),
    companyPhone: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientAddress: v.optional(v.string()),
    clientCity: v.optional(v.string()),
    clientState: v.optional(v.string()),
    clientZip: v.optional(v.string()),
    clientCountry: v.optional(v.string()),
    clientEmail: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    clientFax: v.optional(v.string()),
    issueDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled"))),
    items: v.optional(v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      rate: v.number(),
      amount: v.number(),
      isNote: v.optional(v.boolean()),
    }))),
    subtotal: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    total: v.optional(v.number()),
    notes: v.optional(v.string()),
    terms: v.optional(v.string()),
    currency: v.optional(v.string()),
    // Add commission percent
    commissionPercent: v.optional(v.number()),
    reference: v.optional(v.string()),
    agentName: v.optional(v.string()),
    agentMobile: v.optional(v.string()),
    tin: v.optional(v.string()),
    bin: v.optional(v.string()),
    bankBeneficiaryName: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string()),
    bankName: v.optional(v.string()),
    bankBranch: v.optional(v.string()),
    bankAddress: v.optional(v.string()),
    bankSwiftCode: v.optional(v.string()),
    totalInWords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const { id, ...updates } = args;
    const invoice = await ctx.db.get(id);
    
    if (!invoice || invoice.userId !== user._id) {
      throw new Error("Invoice not found");
    }

    await ctx.db.patch(id, updates);

    // Log analytics event if status changed
    if (updates.status && updates.status !== invoice.status) {
      await ctx.db.insert("analytics", {
        userId: user._id,
        invoiceId: id,
        eventType: "invoice_status_changed",
        eventData: {
          amount: updates.total || invoice.total,
          status: updates.status,
        },
      });
    }

    return id;
  },
});

// Delete invoice
export const remove = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== user._id) {
      throw new Error("Invoice not found");
    }

    await ctx.db.delete(args.id);

    // Log analytics event
    await ctx.db.insert("analytics", {
      userId: user._id,
      invoiceId: args.id,
      eventType: "invoice_deleted",
      eventData: {
        amount: invoice.total,
        status: invoice.status,
      },
    });

    return args.id;
  },
});

// Generate next invoice number
export const generateInvoiceNumber = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Build date prefix IGSYYYYMMDD
    const now = new Date();
    const y = now.getFullYear().toString();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const datePrefix = `IGS${y}${m}${d}`;

    const todays = invoices.filter((inv) =>
      inv.invoiceNumber?.startsWith(datePrefix)
    );

    const nextNumber = todays.length + 1;
    return `${datePrefix}${nextNumber.toString().padStart(2, "0")}`;
  },
});