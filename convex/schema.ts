import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  projects: defineTable({
    name: v.string(),
    userId: v.id("users"),
  }).index("by_user_id", ["userId"]),

  characters: defineTable({
    name: v.string(),
    color: v.string(),
    visible: v.boolean(),
    order: v.number(),
    projectId: v.id("projects"),
  })
    .index("by_order", ["order"])
    .index("by_project_id", ["projectId"]),

  timeline_events: defineTable({
    title: v.string(),
    description: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    participants: v.array(v.id("characters")),
    color: v.string(),
    projectId: v.id("projects"),
  }).index("by_project_id", ["projectId"]),
});
