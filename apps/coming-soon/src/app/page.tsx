export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#03260D] to-[#111111] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Coming Soon
        </h1>
        <p className="text-center text-lg">
          This site is still under construction. Check back later for updates.
        </p>
      </div>
    </main>
  );
}
