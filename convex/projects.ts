import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

export const getForCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return [];
    }

    return ctx.db.query("projects").withIndex("by_user_id", (q) => q.eq("userId", userId)).collect();
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
