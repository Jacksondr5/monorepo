"use client";

import { Preloaded, usePreloadedQuery } from "#lib/convex";
import { api } from "../../convex/_generated/api";
import { projectStatusMessages } from "~/utils/messages";
import { processError } from "~/lib/errors";
import { Doc } from "../../convex/_generated/dataModel";

export interface HackathonInfoViewProps {
  hackathonEvent?: Doc<"hackathonEvents">;
  error?: {
    type: string;
    message: string;
  };
}

export function HackathonInfoView({
  hackathonEvent,
  error,
}: HackathonInfoViewProps) {
  let hackathonName = "";
  let hackathonCurrentPhase: keyof typeof projectStatusMessages | undefined;

  if (hackathonEvent) {
    hackathonName = hackathonEvent.name;
    hackathonCurrentPhase = hackathonEvent.currentPhase;
  } else if (error) {
    if (error.type === "HACKATHON_EVENT_NOT_FOUND") {
      hackathonName = "No hackathon event";
    } else {
      hackathonName = "Error loading hackathon event";
      processError(error, "Error loading hackathon event");
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

export interface HackathonInfoProps {
  preloadedLatestHackathon: Preloaded<
    typeof api.hackathonEvents.getLatestHackathonEvent
  >;
}

export function HackathonInfo({
  preloadedLatestHackathon,
}: HackathonInfoProps) {
  const latestHackathon = usePreloadedQuery(preloadedLatestHackathon);

  if (latestHackathon.ok) {
    return <HackathonInfoView hackathonEvent={latestHackathon.value} />;
  } else {
    return <HackathonInfoView error={latestHackathon.error} />;
  }
}
