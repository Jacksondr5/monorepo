"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { projectStatusMessages } from "~/utils/messages";
import { processError } from "~/lib/errors";

export interface HackathonInfoProps {
  preloadedLatestHackathon: Preloaded<
    typeof api.hackathonEvents.getLatestHackathonEvent
  >;
}

export function HackathonInfo({
  preloadedLatestHackathon,
}: HackathonInfoProps) {
  const latestHackathon = usePreloadedQuery(preloadedLatestHackathon);

  let hackathonName = "";
  let hackathonCurrentPhase: keyof typeof projectStatusMessages | undefined;

  if (latestHackathon.ok) {
    hackathonName = latestHackathon.value.name;
    hackathonCurrentPhase = latestHackathon.value.currentPhase;
  } else {
    if (latestHackathon.error.type === "HACKATHON_EVENT_NOT_FOUND") {
      hackathonName = "No hackathon event";
    } else {
      hackathonName = "Error loading hackathon event";
      processError(latestHackathon.error, "Error loading hackathon event");
    }
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-slate-12 text-lg font-semibold">
        {hackathonName}
      </span>
      {hackathonCurrentPhase && (
        <span className="text-slate-11 text-lg">|</span>
      )}
      {hackathonCurrentPhase && (
        <p className="text-slate-11 text-sm">
          {projectStatusMessages[hackathonCurrentPhase]}
        </p>
      )}
    </div>
  );
}
