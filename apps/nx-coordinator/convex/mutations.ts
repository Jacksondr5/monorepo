import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Attempt to claim a task for exclusive execution.
 *
 * Returns { acquired: true } if this is the first claim for this taskKey.
 * Returns { acquired: false, claimedBy, claimedAt } if already claimed.
 *
 * Either way, a record is inserted to track the attempt.
 */
export const claimTask = mutation({
  args: {
    agentId: v.string(),
    gitSha: v.string(),
    project: v.string(),
    task: v.string(),
  },
  returns: v.union(
    v.object({
      acquired: v.literal(true),
    }),
    v.object({
      acquired: v.literal(false),
      claimedAt: v.number(),
      claimedBy: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const { agentId, gitSha, project, task } = args;
    const taskKey = `${project}:${task}:${gitSha}`;
    const attemptedAt = Date.now();

    // Check if this task has already been granted using the compound index
    const existingGrant = await ctx.db
      .query("claimAttempts")
      .withIndex("by_taskKey_and_wasGranted", (q) =>
        q.eq("taskKey", taskKey).eq("wasGranted", true),
      )
      .first();

    if (existingGrant) {
      // Task already claimed - record attempt as not granted
      await ctx.db.insert("claimAttempts", {
        agentId,
        attemptedAt,
        gitSha,
        project,
        task,
        taskKey,
        wasGranted: false,
      });

      return {
        acquired: false as const,
        claimedAt: existingGrant.attemptedAt,
        claimedBy: existingGrant.agentId,
      };
    }

    // No existing grant - claim the task
    await ctx.db.insert("claimAttempts", {
      agentId,
      attemptedAt,
      gitSha,
      project,
      task,
      taskKey,
      wasGranted: true,
    });

    return {
      acquired: true as const,
    };
  },
});
