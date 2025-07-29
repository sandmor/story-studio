import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

export const list = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("timeline_events")
      .withIndex("by_project_id", (q) => q.eq("projectId", projectId))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    participants: v.array(v.id("characters")),
    color: v.string(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const eventId = await ctx.db.insert("timeline_events", args);
    return eventId;
  },
});

export const update = mutation({
  args: {
    id: v.id("timeline_events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    participants: v.optional(v.array(v.id("characters"))),
    color: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    await ctx.db.patch(id, rest);
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("timeline_events") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    await ctx.db.delete(args.id);
  },
});
