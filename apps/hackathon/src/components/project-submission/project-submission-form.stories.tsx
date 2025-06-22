import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ProjectSubmissionForm } from "./project-submission-form";

const meta: Meta<typeof ProjectSubmissionForm> = {
  title: "Hackathon/ProjectSubmissionForm",
  component: ProjectSubmissionForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onSubmit: fn().mockResolvedValue(true),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProjectSubmissionForm>;

export const Default: Story = {
  args: {
    submitButtonLabel: "Submit Project",
    isSubmitting: false,
  },
};

export const WithDefaultData: Story = {
  args: {
    defaultData: {
      title: "My Awesome Project",
      description:
        "This is a sample project description that shows how the form looks when pre-filled with data. It demonstrates the textarea expanding to accommodate longer content.",
    },
    submitButtonLabel: "Update Project",
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    defaultData: {
      title: "My Awesome Project",
      description: "This project is currently being submitted...",
    },
    isSubmitting: true,
  },
};

export const WithCancelButton: Story = {
  args: {
    defaultData: {
      title: "Draft Project",
      description: "This is a draft project that can be canceled.",
    },
    onCancel: fn(),
    submitButtonLabel: "Save Draft",
    isSubmitting: false,
  },
};
