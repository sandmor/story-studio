import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreate = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { clerkId, name }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (user) {
      return user._id;
    }

    return ctx.db.insert("users", {
      clerkId,
      name,
    });
  },
});
