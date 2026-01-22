import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";

import { api } from "../../../../convex/_generated/api";

// Initialize Convex client for server-side queries
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    // Call the Convex health check query to verify database connectivity
    await convex.query(api.queries.healthCheck, {});

    return NextResponse.json({
      status: "healthy",
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        status: "unhealthy",
      },
      { status: 503 },
    );
  }
}
