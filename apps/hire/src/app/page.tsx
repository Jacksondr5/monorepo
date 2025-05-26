"use client";

import { useAuth } from "@clerk/nextjs";

export default function Home() {
  // const { getToken } = useAuth();
  // const token = getToken();

  // console.log(token);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-lg">
      Nothing here yet. Click one of the items on the sidebar.
    </main>
  );
}
