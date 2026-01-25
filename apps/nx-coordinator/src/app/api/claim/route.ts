import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";

import { api } from "../../../../convex/_generated/api";

interface ClaimRequestBody {
  agentId: string;
  gitSha: string;
  project: string;
  task: string;
}

export async function POST(request: Request) {
  try {
    // Validate CONVEX_URL at runtime to avoid import-time failures
    const convexUrl = process.env.CONVEX_URL;
    if (!convexUrl) {
      console.error("CONVEX_URL environment variable is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const body = (await request.json()) as ClaimRequestBody;
    const { agentId, gitSha, project, task } = body;

    // Validate required fields
    if (!agentId || !gitSha || !project || !task) {
      return NextResponse.json(
        { error: "Missing required fields: project, task, gitSha, agentId" },
        { status: 400 },
      );
    }

    // Create Convex client lazily inside handler
    const convex = new ConvexHttpClient(convexUrl);

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
