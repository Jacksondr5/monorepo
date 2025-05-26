import { mutation, query } from "./_generated/server";
import { getCompanyIdByClerkOrgId } from "./model/companies";
import { zCustomQuery, zCustomMutation } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { z } from "zod";
import {
  BoardSchema,
  CreateBoardSchema,
  DeleteBoardSchema,
  UpdateBoardSchema,
} from "../src/server/zod/board";

const boardQuery = zCustomQuery(query, NoOp);
const boardMutation = zCustomMutation(mutation, NoOp);

export const getBoardsByOrgId = boardQuery({
  args: { orgId: z.string() },
  async handler(ctx, args) {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: args.orgId,
    });

    return await ctx.db
      .query("boards")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("asc") // Assuming 'asc' for order
      .collect();
  },
  returns: z.array(BoardSchema),
});

export const getBySlug = boardQuery({
  args: { slug: z.string(), orgId: z.string() },
  async handler(ctx, args) {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: args.orgId,
    });

    if (!companyId) {
      return null;
    }

    const board = await ctx.db
      .query("boards")
      .withIndex("by_company_slug", (q) =>
        q.eq("companyId", companyId).eq("slug", args.slug)
      )
      .unique();
    return board;
  },
  returns: BoardSchema.nullable(),
});

export const addBoard = boardMutation({
  args: CreateBoardSchema.extend({ orgId: z.string() }),
  async handler(ctx, args) {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: args.orgId,
    });

    const lastBoard = await ctx.db
      .query("boards")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("desc")
      .first();

    const newOrder = lastBoard ? lastBoard.order + 1 : 0;

    const slug = args.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    await ctx.db.insert("boards", {
      name: args.name,
      companyId,
      order: newOrder,
      slug: slug,
      kanbanStageIds: [],
    });
  },
});

export const deleteBoard = boardMutation({
  args: DeleteBoardSchema,
  async handler(ctx, args) {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: args.orgId,
    });

    const boardToDelete = await ctx.db.get(args.boardId);
    if (!boardToDelete) {
      throw new Error("Board not found.");
    }
    if (boardToDelete.companyId !== companyId) {
      throw new Error(
        "Permission denied: Board does not belong to this organization.",
      );
    }

    await ctx.db.delete(args.boardId);
  },
});

export const updateBoard = boardMutation({
  args: UpdateBoardSchema,
  async handler(ctx, { orgId, _id, ...updates }) {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });

    const boardToUpdate = await ctx.db.get(_id);
    if (!boardToUpdate) {
      throw new Error("Board not found.");
    }
    if (boardToUpdate.companyId !== companyId) {
      throw new Error(
        "Permission denied: Board does not belong to this organization.",
      );
    }

    await ctx.db.patch(_id, updates);
  },
});

// Placeholder for future mutations if needed
// export const reorderBoards = mutation({ ... });
