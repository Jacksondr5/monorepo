import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@j5/component-library";

export default function OnboardingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Onboarding Overview
        </h1>
        <p className="text-muted-foreground">
          Track onboarding progress across all candidates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Placeholder content - this will show onboarding step completion for
            candidates based on configured kanban stages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
