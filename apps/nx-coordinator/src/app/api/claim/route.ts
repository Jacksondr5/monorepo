import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";

import { api } from "../../../../convex/_generated/api";

// Initialize Convex client for server-side mutations
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ClaimRequestBody {
  agentId: string;
  gitSha: string;
  project: string;
  task: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClaimRequestBody;
    const { agentId, gitSha, project, task } = body;

    // Validate required fields
    if (!agentId || !gitSha || !project || !task) {
      return NextResponse.json(
        { error: "Missing required fields: project, task, gitSha, agentId" },
        { status: 400 },
      );
    }

    // Call the Convex mutation
    const result = await convex.mutation(api.mutations.claimTask, {
      agentId,
      gitSha,
      project,
      task,
    });

    if (result.acquired) {
      return NextResponse.json({ proceed: true });
    }

    return NextResponse.json({
      message: `Task already claimed by ${result.claimedBy}`,
      proceed: false,
    });
  } catch (error) {
    console.error("Error claiming task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
