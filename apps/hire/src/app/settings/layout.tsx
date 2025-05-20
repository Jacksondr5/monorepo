"use client";

import { useOrganization } from "@clerk/nextjs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}
