import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Store file metadata after upload
export const saveFileMetadata = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileCategory: v.union(v.literal("logo"), v.literal("signature"), v.literal("seal")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const fileId = await ctx.db.insert("userFiles", {
      userId: user._id,
      storageId: args.storageId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileCategory: args.fileCategory,
    });

    return fileId;
  },
});

// Get all files for current user
export const listUserFiles = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const files = await ctx.db
      .query("userFiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Get URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const url = await ctx.storage.getUrl(file.storageId);
        return {
          ...file,
          url,
        };
      })
    );

    return filesWithUrls;
  },
});

// Delete a file
export const deleteFile = mutation({
  args: { id: v.id("userFiles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const file = await ctx.db.get(args.id);
    if (!file || file.userId !== user._id) {
      throw new Error("File not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Generate upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }
    
    return await ctx.storage.generateUploadUrl();
  },
});
