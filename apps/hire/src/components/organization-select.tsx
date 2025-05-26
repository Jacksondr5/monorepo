"use client";

import React from "react";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@j5/component-library";
import Image from "next/image";

const defaultOrganization = {
  id: "__default__",
  name: "Select Organization",
  hasImage: false,
  imageUrl: "",
};

export function OrganizationSelect() {
  const { organization: clerkOrganization, isLoaded: orgIsLoaded } =
    useOrganization();
  const {
    userMemberships,
    setActive,
    isLoaded: orgListIsLoaded,
  } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const handleValueChange = async (newOrgId: string) => {
    if (setActive) {
      try {
        await setActive({ organization: newOrgId });
      } catch (error) {
        console.error("Failed to switch organization:", error);
        // TODO: Show toast notification
      }
    }
  };

  if (!orgIsLoaded || !orgListIsLoaded) {
    return <Skeleton className="h-10 w-full" />;
  }

  const organization = clerkOrganization ?? defaultOrganization;
  const organizations = userMemberships.data;

  return (
    <Select
      value={organization.id ?? undefined}
      onValueChange={handleValueChange}
      disabled={!organizations || organizations.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Organization">
          {organization.hasImage && (
            <Image
              src={organization.imageUrl}
              alt={organization.name}
              width={24}
              height={24}
            />
          )}
          {organization.name ?? "Select Organization"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {organizations && organizations.length > 0 ? (
          organizations.map(({ organization }) => (
            <SelectItem key={organization.id} value={organization.id}>
              <div className="flex items-center gap-2">
                {organization.hasImage && (
                  <Image
                    src={organization.imageUrl}
                    alt={organization.name}
                    width={24}
                    height={24}
                  />
                )}
                {organization.name}
              </div>
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-orgs" disabled>
            No organizations found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
