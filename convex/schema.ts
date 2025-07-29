import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  characters: defineTable({
    name: v.string(),
    color: v.string(),
    visible: v.boolean(),
    order: v.number(),
  }).index("by_order", ["order"]),
  timeline_events: defineTable({
    title: v.string(),
    description: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    participants: v.array(v.id("characters")),
    color: v.string(),
  }),
});
