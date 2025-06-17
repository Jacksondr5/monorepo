import type { HackathonEvent } from "~/server/zod";
import { EventInProgressClientPage } from "./event-in-progress-client-page";

interface EventInProgressServerPageProps {
  hackathon: HackathonEvent;
}

export function EventInProgressServerPage({
  hackathon,
}: EventInProgressServerPageProps) {
  return <EventInProgressClientPage hackathon={hackathon} />;
}
