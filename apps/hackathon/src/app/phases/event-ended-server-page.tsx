import type { HackathonEvent } from "~/server/zod";

interface EventEndedServerPageProps {
  hackathon: HackathonEvent;
}

export async function EventEndedServerPage({
  hackathon,
}: EventEndedServerPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-slate-11 text-4xl font-bold">{hackathon.name}</h1>
        <p className="text-slate-11 text-lg">Hackathon Ended</p>
      </div>
      <div className="max-w-2xl text-center">
        <h2 className="text-slate-12 mb-4 text-2xl font-semibold">
          The hackathon has concluded!
        </h2>
        <p className="text-slate-10 mb-4 text-lg">
          Thank you to all participants for your amazing work and creativity.
        </p>
      </div>
    </main>
  );
}
