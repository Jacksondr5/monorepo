"use client";

import {
  ClerkLoading,
  OrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  CreateOrganization,
  useOrganization,
} from "@clerk/nextjs";

export default function DiscoverPage() {
  const organization = useOrganization();
  return (
    <div
      className={
        "col-span-2 flex h-full w-full items-center justify-center space-y-6 pt-6"
      }
    >
      <div className={"flex flex-col"}>
        <p>{organization.organization?.id}</p>
        <h1 className="mb-4 mt-20">Pre-built OrganizationList</h1>
        <ClerkLoading>Loading ...</ClerkLoading>
        <OrganizationList
          hidePersonal={true}
          //   afterSelectPersonalUrl="/"
          //   afterCreateOrganizationUrl="/:id"
          //   afterSelectOrganizationUrl="/:id"
          //   skipInvitationScreen={true}
        />

        <h1 className="mb-4 mt-20">Pre-built OrganizationSwitcher</h1>
        <ClerkLoading>Loading ...</ClerkLoading>
        <OrganizationSwitcher hidePersonal={true} />
        <h1 className="mb-4 mt-20">List my memberships</h1>
        <OrganizationProfile />
        <h1 className="mb-4 mt-20">Create Organization</h1>
        <CreateOrganization />
      </div>
    </div>
  );
}
