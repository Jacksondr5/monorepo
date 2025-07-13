// TODO: Re-enable this story after we make our own UserButton (JAC-75)
// because it is impossible to put the ClerkProvider in the preview config
// it needs a clerk token in the environment variables

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { HeaderView } from "./Header";
import { Id } from "../../convex/_generated/dataModel";
import { anchorTimestamp } from "~/utils/anchor-date";

// Mock hackathon data
const mockHackathonEvent = {
  _id: "hackathon123" as Id<"hackathonEvents">,
  _creationTime: anchorTimestamp,
  name: "Spring 2024 AI Hackathon",
  description: "Build amazing AI-powered applications",
  currentPhase: "PROJECT_SUBMISSION" as const,
  startDate: anchorTimestamp - 86400000, // 1 day ago
  endDate: anchorTimestamp + 86400000, // 1 day from now
  submissionDeadline: anchorTimestamp + 43200000, // 12 hours from now
  votingDeadline: anchorTimestamp + 129600000, // 36 hours from now
};

// Mock different hackathon phases
const mockHackathonVoting = {
  ...mockHackathonEvent,
  name: "Fall 2024 Mobile Hackathon",
  currentPhase: "PROJECT_VOTING" as const,
};

const mockHackathonEnded = {
  ...mockHackathonEvent,
  name: "Winter 2024 IoT Hackathon",
  currentPhase: "EVENT_ENDED" as const,
};

const meta: Meta<typeof HeaderView> = {
  title: "Hackathon/Components/Header",
  component: HeaderView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-1 min-h-screen">
        <Story />
        <div className="p-8">
          <p className="text-slate-11">Content below header...</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Stories
export const VisualMatrix: Story = {
  name: "Visual Matrix: All Header States",
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: () => (
    <div className="bg-slate-1 flex min-h-screen flex-col gap-8 p-8">
      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          Authentication States (No Hackathon)
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Loading State
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView isAuthLoading={true} isAuthenticated={false} />
            </div>
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Unauthenticated
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView isAuthLoading={false} isAuthenticated={false} />
            </div>
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Authenticated
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView isAuthLoading={false} isAuthenticated={true} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          With Hackathon Information
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Submission Phase - Authenticated
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView
                hackathonEvent={mockHackathonEvent}
                isAuthLoading={false}
                isAuthenticated={true}
              />
            </div>
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Voting Phase - Unauthenticated
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView
                hackathonEvent={mockHackathonVoting}
                isAuthLoading={false}
                isAuthenticated={false}
              />
            </div>
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Event Ended - Loading Auth
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView
                hackathonEvent={mockHackathonEnded}
                isAuthLoading={true}
                isAuthenticated={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          Error States
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              No Hackathon Found
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView
                hackathonError={{
                  type: "HACKATHON_EVENT_NOT_FOUND",
                  message: "No hackathon found",
                }}
                isAuthLoading={false}
                isAuthenticated={true}
              />
            </div>
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Generic Error
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView
                hackathonError={{
                  type: "UNEXPECTED_ERROR",
                  message: "Database connection failed",
                }}
                isAuthLoading={false}
                isAuthenticated={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          Long Hackathon Names
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Very Long Name
            </h3>
            <div className="border-slate-6 overflow-hidden rounded-lg border">
              <HeaderView
                hackathonEvent={{
                  ...mockHackathonEvent,
                  name: "Annual International Artificial Intelligence and Machine Learning Innovation Hackathon 2024",
                }}
                isAuthLoading={false}
                isAuthenticated={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
