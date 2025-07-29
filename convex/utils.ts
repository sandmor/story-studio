import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) =>
      q.eq("clerkId", identity.subject)
    )
    .unique();
  if (!user) {
    return null;
  }
  return user._id;
}
