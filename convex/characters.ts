import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

export const get = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("characters")
      .withIndex("by_project_id", (q) => q.eq("projectId", projectId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    visible: v.boolean(),
    order: v.number(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const characterId = await ctx.db.insert("characters", args);
    return characterId;
  },
});

export const update = mutation({
  args: {
    id: v.id("characters"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
    visible: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...rest }) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    await ctx.db.patch(id, rest);
  },
});

export const deleteCharacter = mutation({
  args: { id: v.id("characters") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const character = await ctx.db.get(args.id);
    if (!character) {
      throw new Error("Character not found");
    }

    // First, remove the character from any events they are a part of.
    const events = await ctx.db
      .query("timeline_events")
      .withIndex("by_project_id", (q) => q.eq("projectId", character.projectId))
      .collect();

    for (const event of events) {
      const newParticipants = event.participants.filter(
        (charId) => charId !== args.id
      );
      if (newParticipants.length < event.participants.length) {
        await ctx.db.patch(event._id, { participants: newParticipants });
      }
    }
    // Then, delete the character.
    await ctx.db.delete(args.id);
  },
});

export const reorder = mutation({
  args: {
    reorderedCharacters: v.array(
      v.object({
        _id: v.id("characters"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await Promise.all(
      args.reorderedCharacters.map((char) =>
        ctx.db.patch(char._id, { order: char.order })
      )
    );
  },
});
