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
    }),
  ),
});

export const getRecentAttempts = query({
  args: {
    cursor: v.optional(v.string()),
    gitShaPrefix: v.optional(v.string()),
    limit: v.optional(v.number()),
    project: v.optional(v.string()),
    task: v.optional(v.string()),
    wasGranted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 50, 100);

    const attempts = await ctx.db
      .query("claimAttempts")
      .withIndex("by_attemptedAt")
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems: limit });

    // Apply filters in memory since we can't use indexes for multiple filter conditions
    let filteredAttempts = attempts.page;

    if (args.project) {
      filteredAttempts = filteredAttempts.filter(
        (a) => a.project === args.project,
      );
    }

    if (args.task) {
      filteredAttempts = filteredAttempts.filter((a) => a.task === args.task);
    }

    if (args.wasGranted !== undefined) {
      filteredAttempts = filteredAttempts.filter(
        (a) => a.wasGranted === args.wasGranted,
      );
    }

    if (args.gitShaPrefix) {
      filteredAttempts = filteredAttempts.filter((a) =>
        a.gitSha.startsWith(args.gitShaPrefix!),
      );
    }

    return {
      attempts: filteredAttempts,
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
      }),
    ),
    nextCursor: v.union(v.string(), v.null()),
  }),
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    // Stream results to avoid loading all rows into memory
    let totalAttempts = 0;
    let attemptsLast24h = 0;
    let duplicatesBlocked = 0;
    let duplicatesBlockedLast24h = 0;

    // Group by project
    const byProjectMap = new Map<
      string,
      { blocked: number; project: string; total: number }
    >();

    // Group by task
    const byTaskMap = new Map<
      string,
      { blocked: number; task: string; total: number }
    >();

    // Stream through all attempts without loading into memory
    for await (const attempt of ctx.db.query("claimAttempts")) {
      totalAttempts++;

      if (attempt.attemptedAt >= twentyFourHoursAgo) {
        attemptsLast24h++;
      }

      if (!attempt.wasGranted) {
        duplicatesBlocked++;
        if (attempt.attemptedAt >= twentyFourHoursAgo) {
          duplicatesBlockedLast24h++;
        }
      }

      // Group by project
      const projectEntry = byProjectMap.get(attempt.project) ?? {
        blocked: 0,
        project: attempt.project,
        total: 0,
      };
      projectEntry.total++;
      if (!attempt.wasGranted) {
        projectEntry.blocked++;
      }
      byProjectMap.set(attempt.project, projectEntry);

      // Group by task
      const taskEntry = byTaskMap.get(attempt.task) ?? {
        blocked: 0,
        task: attempt.task,
        total: 0,
      };
      taskEntry.total++;
      if (!attempt.wasGranted) {
        taskEntry.blocked++;
      }
      byTaskMap.set(attempt.task, taskEntry);
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
      }),
    ),
    byTask: v.array(
      v.object({
        blocked: v.number(),
        task: v.string(),
        total: v.number(),
      }),
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
