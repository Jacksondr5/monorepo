import { eq, asc } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { tasks } from "~/server/db/schema/todo";

export const todoRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select({
        createdAt: tasks.createdAt,
        description: tasks.description,
        id: tasks.id,
        isBlocked: tasks.isBlocked,
        isDone: tasks.isDone,
        isImportant: tasks.isImportant,
        isUrgent: tasks.isUrgent,
        title: tasks.title,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .where(eq(tasks.createdById, ctx.auth.userId))
      .orderBy(asc(tasks.createdAt));

    // Map the null values to undefined because that's easier for React
    return data.map((task) => ({
      ...task,
      description: task.description ?? undefined,
      isImportant: task.isImportant ?? undefined,
      isUrgent: task.isUrgent ?? undefined,
    }));
  }),
  create: protectedProcedure
    .input(z.object({ createdAt: z.date(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const thing = await ctx.db
        .insert(tasks)
        .values({
          createdAt: input.createdAt,
          createdById: ctx.auth.userId,
          title: input.title,
        })
        .returning({ id: tasks.id });
      return thing[0]!.id;
    }),
  setDescription: protectedProcedure
    .input(z.object({ id: z.number(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ description: input.description })
        .where(eq(tasks.id, input.id));
    }),
  setIsBlocked: protectedProcedure
    .input(z.object({ id: z.number(), isBlocked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ isBlocked: input.isBlocked })
        .where(eq(tasks.id, input.id));
    }),
  setIsDone: protectedProcedure
    .input(z.object({ id: z.number(), isDone: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ isDone: input.isDone })
        .where(eq(tasks.id, input.id));
    }),
  setIsImportant: protectedProcedure
    .input(z.object({ id: z.number(), isImportant: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ isImportant: input.isImportant ?? null })
        .where(eq(tasks.id, input.id));
    }),
  setIsUrgent: protectedProcedure
    .input(z.object({ id: z.number(), isUrgent: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ isUrgent: input.isUrgent ?? null })
        .where(eq(tasks.id, input.id));
    }),
  setTitle: protectedProcedure
    .input(z.object({ id: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ title: input.title })
        .where(eq(tasks.id, input.id));
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
    }),
});
