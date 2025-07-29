import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("timeline_events").collect();
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
  },
  handler: async (ctx, args) => {
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
    await ctx.db.patch(id, rest);
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("timeline_events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
