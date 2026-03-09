import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    channelId: v.string(),
    userId: v.string(),
    text: v.string(),
    timestamp: v.number(),
  }).index("by_channel", ["channelId"]),
});
