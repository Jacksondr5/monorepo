import type { HackathonEvent } from "~/server/zod";

interface EventInProgressServerPageProps {
  hackathon: HackathonEvent;
  token: string;
}

export async function EventInProgressServerPage({
  hackathon,
}: EventInProgressServerPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-slate-11 text-4xl font-bold">{hackathon.name}</h1>
        <p className="text-slate-11 text-lg">Hackathon in Progress</p>
      </div>
      <div className="max-w-2xl text-center">
        <h2 className="text-slate-12 mb-4 text-2xl font-semibold">
          The hackathon is currently underway!
        </h2>
        <p className="text-slate-10 text-lg">
          Teams are working on their projects. Check back later for results and
          updates.
        </p>
      </div>
    </main>
  );
}
