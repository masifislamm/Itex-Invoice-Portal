import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Invoice status enum
export const INVOICE_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;

export const invoiceStatusValidator = v.union(
  v.literal(INVOICE_STATUS.DRAFT),
  v.literal(INVOICE_STATUS.SENT),
  v.literal(INVOICE_STATUS.PAID),
  v.literal(INVOICE_STATUS.OVERDUE),
  v.literal(INVOICE_STATUS.CANCELLED),
);
export type InvoiceStatus = Infer<typeof invoiceStatusValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Invoices table
    invoices: defineTable({
      userId: v.id("users"),
      invoiceNumber: v.string(),
      
      // Company details (from)
      companyName: v.string(),
      companyAddress: v.string(),
      companyCity: v.string(),
      companyState: v.string(),
      companyZip: v.string(),
      companyCountry: v.string(),
      companyEmail: v.string(),
      companyPhone: v.string(),
      
      // Client details (to)
      clientName: v.string(),
      clientAddress: v.string(),
      clientCity: v.string(),
      clientState: v.string(),
      clientZip: v.string(),
      clientCountry: v.string(),
      clientEmail: v.optional(v.string()),
      clientPhone: v.optional(v.string()),
      clientFax: v.optional(v.string()),
      
      // Invoice details
      issueDate: v.string(),
      dueDate: v.string(),
      status: invoiceStatusValidator,
      
      // Line items
      items: v.array(v.object({
        description: v.string(),
        quantity: v.number(),
        rate: v.number(),
        amount: v.number(),
        // Allow description-only lines that don't affect totals
        isNote: v.optional(v.boolean()),
      })),
      
      // Totals
      subtotal: v.number(),
      taxRate: v.number(),
      taxAmount: v.number(),
      total: v.number(),
      currency: v.optional(v.string()),
      // Add commission percent
      commissionPercent: v.optional(v.number()),
      
      // Additional fields
      notes: v.optional(v.string()),
      terms: v.optional(v.string()),
      // Added optional company meta fields
      reference: v.optional(v.string()),
      agentName: v.optional(v.string()),
      agentMobile: v.optional(v.string()),
      tin: v.optional(v.string()),
      bin: v.optional(v.string()),
      // Bank info and total in words
      bankBeneficiaryName: v.optional(v.string()),
      bankAccountNumber: v.optional(v.string()),
      bankName: v.optional(v.string()),
      bankBranch: v.optional(v.string()),
      bankAddress: v.optional(v.string()),
      bankSwiftCode: v.optional(v.string()),
      totalInWords: v.optional(v.string()),
      signatureUrl: v.optional(v.string()),
      sealUrl: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_status", ["userId", "status"])
      .index("by_invoice_number", ["invoiceNumber"]),

    // Analytics events table
    analytics: defineTable({
      userId: v.id("users"),
      invoiceId: v.optional(v.id("invoices")),
      eventType: v.string(), // "invoice_created", "invoice_sent", "invoice_paid", etc.
      eventData: v.optional(v.object({
        amount: v.optional(v.number()),
        status: v.optional(v.string()),
        metadata: v.optional(v.string()),
      })),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_event", ["userId", "eventType"]),

    // Proforma Invoices table
    proformaInvoices: defineTable({
      userId: v.id("users"),
      invoiceNumber: v.string(),
      
      // Company details (shipper)
      companyName: v.string(),
      companyAddress: v.string(),
      companyLogoUrl: v.optional(v.string()),
      companySealUrl: v.optional(v.string()),
      
      // Client details (to)
      clientName: v.string(),
      clientAddress: v.string(),
      
      // Invoice metadata
      date: v.string(),
      shipper: v.string(),
      telephoneNumber: v.string(),
      destination: v.string(),
      deliveryTime: v.string(),
      paymentTerm: v.string(),
      
      // Items table
      items: v.array(v.object({
        shippingMarks: v.string(),
        description: v.string(),
        unitPrice: v.string(),
        amount: v.number(),
      })),
      
      // Total
      total: v.number(),
      totalInWords: v.string(),
      
      // Bank information
      advisingBank: v.string(),
      bankAddress: v.string(),
      beneficiaryName: v.string(),
      accountNumber: v.string(),
      swiftCode: v.string(),
      
      // Shipping details
      origin: v.string(),
      portOfLoading: v.string(),
      portOfDestination: v.string(),
      partialShipment: v.string(),
      transshipment: v.string(),
      
      // Terms
      terms: v.string(),
      
      status: v.optional(invoiceStatusValidator),
    })
      .index("by_user", ["userId"])
      .index("by_invoice_number", ["invoiceNumber"]),

    // Local Proformas table
    localProformas: defineTable({
      userId: v.id("users"),
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
      status: v.optional(invoiceStatusValidator),
    })
      .index("by_user", ["userId"])
      .index("by_invoice_number", ["invoiceNumber"]),

    // User Files table for uploaded logos and signatures
    userFiles: defineTable({
      userId: v.id("users"),
      storageId: v.id("_storage"),
      fileName: v.string(),
      fileType: v.string(),
      fileCategory: v.union(v.literal("logo"), v.literal("signature"), v.literal("seal")),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_category", ["userId", "fileCategory"]),

    // Local Chalans table
    localChalans: defineTable({
      userId: v.id("users"),
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
      status: v.optional(invoiceStatusValidator),
    })
      .index("by_user", ["userId"])
      .index("by_invoice_number", ["invoiceNumber"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;