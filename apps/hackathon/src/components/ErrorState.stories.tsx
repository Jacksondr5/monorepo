import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ErrorState } from "./ErrorState";
import { Separator } from "@jacksondr5/component-library";

const meta: Meta<typeof ErrorState> = {
  title: "Hackathon/Components/ErrorState",
  component: ErrorState,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Visual Matrix Story
export const VisualMatrix: Story = {
  name: "Visual: All States",
  render: () => (
    <div className="space-y-12 p-6">
      <div>
        <h3 className="text-slate-11 mb-4 text-lg font-semibold">
          Default Error State
        </h3>
        <ErrorState
          title="Project Voting"
          errorTitle="Unable to Load Project Voting Data"
          errorMessage="There was an error loading the project voting data."
          dataTestId="default-error-state"
        />
      </div>
      <Separator orientation="horizontal" className="my-8" />
      <div>
        <h3 className="text-slate-11 mb-4 text-lg font-semibold">
          Without Refresh Instruction
        </h3>
        <ErrorState
          title="Custom Error"
          errorTitle="Network Connection Lost"
          errorMessage="Unable to connect to the server."
          showRefreshInstruction={false}
          dataTestId="no-refresh-error-state"
        />
      </div>

      <div>
        <h3 className="text-slate-11 mb-4 text-lg font-semibold">
          Custom Help Text
        </h3>
        <ErrorState
          title="Service Unavailable"
          errorTitle="Maintenance in Progress"
          errorMessage="The service is temporarily unavailable due to scheduled maintenance."
          helpText="Please try again in a few minutes. Check our status page for updates."
          dataTestId="custom-help-error-state"
        />
      </div>
      <Separator orientation="horizontal" className="my-8" />
      <div>
        <h3 className="text-slate-11 mb-4 text-lg font-semibold">
          No Help Text
        </h3>
        <ErrorState
          title="Authentication Error"
          errorTitle="Session Expired"
          errorMessage="Your session has expired."
          helpText=""
          dataTestId="no-help-error-state"
        />
      </div>
      <Separator orientation="horizontal" className="my-8" />
      <div>
        <h3 className="text-slate-11 mb-4 text-lg font-semibold">
          Custom Container Class
        </h3>
        <ErrorState
          title="Compact Error"
          errorTitle="Unable to Load Data"
          errorMessage="There was an error loading the data."
          containerClassName="w-full max-w-md"
          dataTestId="compact-error-state"
        />
      </div>
    </div>
  ),
};
