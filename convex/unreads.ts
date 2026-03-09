import { UnreadTracking } from "convex-unread-tracking";
import { components } from "./_generated/api.js";
import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

const unreads = new UnreadTracking(components.unreadTracking);

// ─── Message Operations ────────────────────────────────────────

export const sendMessage = mutation({
  args: {
    channelId: v.string(),
    userId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Insert the app message
    const msgId = await ctx.db.insert("messages", {
      channelId: args.channelId,
      userId: args.userId,
      text: args.text,
      timestamp: now,
    });

    // Register with unread tracking (same transaction)
    await unreads.insertMessage(ctx, {
      channelId: args.channelId,
      timestamp: now,
      authorId: args.userId,
    });

    return msgId;
  },
});

export const deleteMsg = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const msg = await ctx.db.get(args.messageId);
    if (!msg) return;

    await ctx.db.delete(args.messageId);
    await unreads.deleteMessage(ctx, {
      channelId: msg.channelId,
      timestamp: msg.timestamp,
    });
  },
});

export const getMessages = query({
  args: { channelId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .order("asc")
      .collect();
  },
});

// ─── Read Tracking ─────────────────────────────────────────────

export const markRead = mutation({
  args: {
    userId: v.string(),
    channelId: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await unreads.markReadUpTo(ctx, args);
  },
});

export const markOneUnread = mutation({
  args: {
    userId: v.string(),
    channelId: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await unreads.markOneUnread(ctx, args);
  },
});

export const getLastRead = query({
  args: {
    userId: v.string(),
    channelId: v.string(),
  },
  handler: async (ctx, args) => {
    return await unreads.getLastRead(ctx, args);
  },
});

// ─── Unread Counts ─────────────────────────────────────────────

export const getUnreadCount = query({
  args: {
    userId: v.string(),
    channelId: v.string(),
  },
  handler: async (ctx, args) => {
    return await unreads.getUnreadCount(ctx, args);
  },
});

export const getTotalUnread = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await unreads.getTotalUnreadCount(ctx, args);
  },
});

export const getBatchUnreads = query({
  args: {
    userId: v.string(),
    channelIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await unreads.getSingleUnreads(ctx, args);
  },
});

// ─── Subscriptions ─────────────────────────────────────────────

export const subscribe = mutation({
  args: { userId: v.string(), channelId: v.string() },
  handler: async (ctx, args) => {
    await unreads.subscribe(ctx, args);
  },
});

export const unsubscribe = mutation({
  args: { userId: v.string(), channelId: v.string() },
  handler: async (ctx, args) => {
    await unreads.unsubscribe(ctx, args);
  },
});

// ─── Groups ────────────────────────────────────────────────────

export const addToGroup = mutation({
  args: { groupId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    await unreads.addToGroup(ctx, args);
  },
});

export const subscribeGroupToChannel = mutation({
  args: { groupId: v.string(), channelId: v.string() },
  handler: async (ctx, args) => {
    return await unreads.subscribeAll(ctx, args);
  },
});
