import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";

import { api } from "../../../../convex/_generated/api";

export async function GET() {
  try {
    // Validate CONVEX_URL at runtime to avoid import-time failures
    const convexUrl = process.env.CONVEX_URL;
    if (!convexUrl) {
      console.error("CONVEX_URL environment variable is not configured");
      return NextResponse.json(
        {
          error: "Server configuration error",
          status: "unhealthy",
        },
        { status: 503 },
      );
    }

    // Create Convex client lazily inside handler
    const convex = new ConvexHttpClient(convexUrl);

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
