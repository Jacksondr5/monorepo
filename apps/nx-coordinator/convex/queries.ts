import { v } from "convex/values";
import { query } from "./_generated/server";

export const getAttemptsForSha = query({
  args: {
    gitSha: v.string(),
  },
  handler: async (ctx, args) => {
    const attempts = await ctx.db
      .query("claimAttempts")
      .withIndex("by_gitSha", (q) => q.eq("gitSha", args.gitSha))
      .order("desc")
      .collect();

    return attempts;
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id("claimAttempts"),
      agentId: v.string(),
      attemptedAt: v.number(),
      gitSha: v.string(),
      project: v.string(),
      task: v.string(),
      taskKey: v.string(),
      wasGranted: v.boolean(),
    })
  ),
});

export const getRecentAttempts = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 50, 100);

    const attempts = await ctx.db
      .query("claimAttempts")
      .withIndex("by_attemptedAt")
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems: limit });

    return {
      attempts: attempts.page,
      nextCursor: attempts.continueCursor,
    };
  },
  returns: v.object({
    attempts: v.array(
      v.object({
        _creationTime: v.number(),
        _id: v.id("claimAttempts"),
        agentId: v.string(),
        attemptedAt: v.number(),
        gitSha: v.string(),
        project: v.string(),
        task: v.string(),
        taskKey: v.string(),
        wasGranted: v.boolean(),
      })
    ),
    nextCursor: v.union(v.string(), v.null()),
  }),
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    // Get all attempts
    const allAttempts = await ctx.db.query("claimAttempts").collect();

    const totalAttempts = allAttempts.length;
    const attemptsLast24h = allAttempts.filter(
      (a) => a.attemptedAt >= twentyFourHoursAgo
    ).length;

    const duplicatesBlocked = allAttempts.filter((a) => !a.wasGranted).length;
    const duplicatesBlockedLast24h = allAttempts.filter(
      (a) => !a.wasGranted && a.attemptedAt >= twentyFourHoursAgo
    ).length;

    // Group by project
    const byProjectMap = new Map<
      string,
      { project: string; total: number; blocked: number }
    >();
    for (const attempt of allAttempts) {
      const existing = byProjectMap.get(attempt.project) ?? {
        blocked: 0,
        project: attempt.project,
        total: 0,
      };
      existing.total++;
      if (!attempt.wasGranted) {
        existing.blocked++;
      }
      byProjectMap.set(attempt.project, existing);
    }

    // Group by task
    const byTaskMap = new Map<
      string,
      { task: string; total: number; blocked: number }
    >();
    for (const attempt of allAttempts) {
      const existing = byTaskMap.get(attempt.task) ?? {
        blocked: 0,
        task: attempt.task,
        total: 0,
      };
      existing.total++;
      if (!attempt.wasGranted) {
        existing.blocked++;
      }
      byTaskMap.set(attempt.task, existing);
    }

    return {
      attemptsLast24h,
      byProject: Array.from(byProjectMap.values()),
      byTask: Array.from(byTaskMap.values()),
      duplicatesBlocked,
      duplicatesBlockedLast24h,
      totalAttempts,
    };
  },
  returns: v.object({
    attemptsLast24h: v.number(),
    byProject: v.array(
      v.object({
        blocked: v.number(),
        project: v.string(),
        total: v.number(),
      })
    ),
    byTask: v.array(
      v.object({
        blocked: v.number(),
        task: v.string(),
        total: v.number(),
      })
    ),
    duplicatesBlocked: v.number(),
    duplicatesBlockedLast24h: v.number(),
    totalAttempts: v.number(),
  }),
});

export const healthCheck = query({
  args: {},
  handler: async () => {
    // Simple query that just returns a timestamp to verify database connectivity
    return { status: "ok" as const, timestamp: Date.now() };
  },
  returns: v.object({
    status: v.literal("ok"),
    timestamp: v.number(),
  }),
});
