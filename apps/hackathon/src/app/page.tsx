"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HomePage() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.tailwind file.
   */
  const latestHackathon = useQuery(
    api.hackathonEvents.getLatestHackathonEvent,
    {},
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-bold">
        {latestHackathon === undefined && "Loading..."}
        {latestHackathon === null && "No hackathon event found"}
        {latestHackathon && latestHackathon.name}
      </h1>
    </main>
  );
}
