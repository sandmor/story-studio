import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

export const get = query({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return null;
    }
    return ctx.db.get(id);
  },
});

export const getForCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return [];
    }

    return ctx.db
      .query("projects")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return ctx.db.insert("projects", {
      name,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(id);
    if (project?.userId !== userId) {
      throw new Error("Not authorized");
    }

    return ctx.db.patch(id, { name });
  },
});

export const deleteProject = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(id);
    if (project?.userId !== userId) {
      throw new Error("Not authorized");
    }

    const characters = await ctx.db
      .query("characters")
      .withIndex("by_project_id", (q) => q.eq("projectId", id))
      .collect();

    for (const character of characters) {
      await ctx.db.delete(character._id);
    }

    const events = await ctx.db
      .query("timeline_events")
      .withIndex("by_project_id", (q) => q.eq("projectId", id))
      .collect();

    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    return ctx.db.delete(id);
  },
});
