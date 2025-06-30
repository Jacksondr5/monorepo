import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { HackathonInfoView } from "./HackathonInfo";
import { Id } from "../../convex/_generated/dataModel";
import { anchorTimestamp } from "../utils/anchor-date";

// Mock hackathon data
const mockSuccessfulHackathon = {
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

const mockHackathonBuilding = {
  ...mockSuccessfulHackathon,
  name: "Summer 2024 Web3 Hackathon",
  currentPhase: "EVENT_IN_PROGRESS" as const,
};

const mockHackathonVoting = {
  ...mockSuccessfulHackathon,
  name: "Fall 2024 Mobile Hackathon",
  currentPhase: "PROJECT_VOTING" as const,
};

const mockHackathonFinalized = {
  ...mockSuccessfulHackathon,
  name: "Winter 2024 IoT Hackathon",
  currentPhase: "EVENT_ENDED" as const,
};

const meta: Meta<typeof HackathonInfoView> = {
  title: "Hackathon/Components/HackathonInfo",
  component: HackathonInfoView,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Stories
export const VisualMatrix: Story = {
  name: "Visual Matrix: All Hackathon States",
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          Different Hackathon Phases
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Submission Phase
            </h3>
            <HackathonInfoView hackathonEvent={mockSuccessfulHackathon} />
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Building Phase
            </h3>
            <HackathonInfoView hackathonEvent={mockHackathonBuilding} />
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Voting Phase
            </h3>
            <HackathonInfoView hackathonEvent={mockHackathonVoting} />
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Finalized Phase
            </h3>
            <HackathonInfoView hackathonEvent={mockHackathonFinalized} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          Error States
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              No Hackathon Found
            </h3>
            <HackathonInfoView
              error={{
                type: "HACKATHON_EVENT_NOT_FOUND",
                message: "No hackathon found",
              }}
            />
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Generic Error
            </h3>
            <HackathonInfoView
              error={{
                type: "UNEXPECTED_ERROR",
                message: "Database connection failed",
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-slate-11 mb-4 border-b pb-2 text-lg font-semibold">
          Different Name Lengths
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Short Name
            </h3>
            <HackathonInfoView
              hackathonEvent={{
                ...mockSuccessfulHackathon,
                name: "Quick Hack",
              }}
            />
          </div>
          <div>
            <h3 className="text-slate-11 mb-2 text-sm font-medium">
              Long Name
            </h3>
            <HackathonInfoView
              hackathonEvent={{
                ...mockSuccessfulHackathon,
                name: "Annual International Artificial Intelligence and Machine Learning Innovation Hackathon 2024",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
