"use client";

import { useUser } from "@clerk/nextjs";
import { LoaderCircle, User } from "lucide-react";
import { z } from "zod";
import { Card, useAppForm, toast } from "@j5/component-library";
import { CreateUserSchema, ZodCreateUser } from "../../server/zod/user";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { processError } from "~/lib/errors";
import { captureException } from "@sentry/nextjs";
import posthog from "posthog-js";
import { env } from "~/env";

// Define the form schema - same as CreateUserSchema but with some optional fields
const SignUpFormSchema = CreateUserSchema.pick({
  firstName: true,
  lastName: true,
  avatarUrl: true,
  role: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export default function SignUp() {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const upsertUser = useMutation(api.users.upsertUser);
  const router = useRouter();

  // Create the form hook - must be called unconditionally
  const form = useAppForm({
    defaultValues: {
      firstName: clerkUser?.firstName ?? "",
      lastName: clerkUser?.lastName ?? "",
      avatarUrl: clerkUser?.imageUrl ?? "",
      role: "USER" as const,
    },
    validators: {
      onChange: ({ value }) => {
        const results = SignUpFormSchema.safeParse(value);
        if (!results.success) {
          return results.error.flatten().fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      if (!clerkUser) return false;

      setIsSubmitting(true);
      try {
        const userData: ZodCreateUser = {
          clerkUserId: clerkUser.id,
          firstName: value.firstName,
          lastName: value.lastName,
          avatarUrl: value.avatarUrl,
          role: value.role,
        };

        const result = await upsertUser({ user: userData });

        if (!result.ok) {
          processError(result.error, "Failed to create your account");
          return false;
        }

        // Set up PostHog identification
        posthog.identify(result.value, {
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatarUrl: userData.avatarUrl,
          role: userData.role,
          env: env.NEXT_PUBLIC_ENV,
        });

        toast({
          title: "Account created successfully!",
          description: "Welcome to the hackathon platform.",
          variant: "success",
        });

        // Redirect to the main app
        router.push("/");
        return true;
      } catch (error) {
        captureException(error, { level: "error" });
        toast({
          title: "Failed to create account",
          description:
            "Please try again or contact support if the problem persists.",
          variant: "error",
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle loading state
  if (!isLoaded) {
    return (
      <div className="text-slate-12 flex flex-col items-center justify-center gap-8 p-4 md:p-8">
        <div
          className="flex items-center gap-2 text-3xl"
          role="status"
          aria-live="polite"
        >
          Loading your account information
          <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle not signed in state
  if (!isSignedIn || !clerkUser) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-slate-3 rounded-full p-3">
              <User className="text-slate-11 h-8 w-8" />
            </div>
          </div>
          <h1 className="text-slate-12 mb-2 text-3xl font-bold">
            Complete Your Profile
          </h1>
          <p className="text-slate-11">
            We need a few more details to set up your account
          </p>
        </div>

        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <form.AppField name="firstName">
                {(field) => (
                  <field.FieldInput
                    label="First Name"
                    placeholder="Enter your first name"
                    disabled={isSubmitting}
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="lastName">
                {(field) => (
                  <field.FieldInput
                    label="Last Name"
                    placeholder="Enter your last name"
                    disabled={isSubmitting}
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="avatarUrl">
                {(field) => (
                  <field.FieldInput
                    label="Profile Picture URL"
                    placeholder="URL to your profile picture"
                    disabled={isSubmitting}
                    type="url"
                  />
                )}
              </form.AppField>

              <form.AppForm>
                <form.SubmitButton
                  label={
                    isSubmitting ? "Creating Account..." : "Create Account"
                  }
                />
              </form.AppForm>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
