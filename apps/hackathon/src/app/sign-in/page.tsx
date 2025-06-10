"use client";

import { LogIn } from "lucide-react";
import { Card } from "@j5/component-library";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-slate-3 rounded-full p-3">
              <LogIn className="text-slate-11 h-8 w-8" />
            </div>
          </div>
          <h1 className="text-slate-12 mb-2 text-3xl font-bold">
            Sign In Required
          </h1>
          <p className="text-slate-11">You must sign in to use this app</p>
        </div>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-slate-11 mb-4">
              Please use the sign-in button in the header to access your
              account.
            </p>
            <div className="text-slate-10 text-sm">
              <p>
                Don't have an account? You'll be redirected to create one after
                signing in.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
