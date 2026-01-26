"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import {
  Button,
  Card,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useAppForm,
} from "@j5/component-library";
import { api } from "../../../../convex/_generated/api";

const tradeSchema = z.object({
  assetType: z.enum(["stock", "crypto"]),
  date: z.string().min(1, "Date is required"),
  direction: z.enum(["long", "short"]),
  notes: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  quantity: z.string().min(1, "Quantity is required"),
  side: z.enum(["buy", "sell"]),
  ticker: z.string().min(1, "Ticker is required"),
});

type TradeFormData = z.infer<typeof tradeSchema>;

function getDefaultDateTime(): string {
  const now = new Date();
  // Format: YYYY-MM-DDTHH:mm for datetime-local input
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function NewTradePage() {
  const router = useRouter();
  const createTrade = useMutation(api.trades.createTrade);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      assetType: "stock" as const,
      date: getDefaultDateTime(),
      direction: "long" as const,
      notes: "",
      price: "",
      quantity: "",
      side: "buy" as const,
      ticker: "",
    } satisfies TradeFormData,
    validators: {
      onChange: ({ value }) => {
        const results = tradeSchema.safeParse(value);
        if (!results.success) {
          return results.error.flatten().fieldErrors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const parsed = tradeSchema.parse(value);
        await createTrade({
          assetType: parsed.assetType,
          date: new Date(parsed.date).getTime(),
          direction: parsed.direction,
          notes: parsed.notes || undefined,
          price: parseFloat(parsed.price),
          quantity: parseFloat(parsed.quantity),
          side: parsed.side,
          ticker: parsed.ticker.toUpperCase(),
        });
        setSuccessMessage("Trade created successfully!");
        setTimeout(() => {
          router.push("/trades");
        }, 1000);
      } catch (error) {
        console.error("Failed to create trade:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-slate-12 mb-6 text-2xl font-bold">New Trade</h1>

      {successMessage && (
        <div className="text-slate-12 mb-4 rounded-md bg-green-900/50 p-4">
          {successMessage}
        </div>
      )}

      <Card className="bg-slate-800 p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-6">
            <form.AppField name="date">
              {(field) => (
                <div className="grid w-full items-center gap-1.5">
                  <label
                    htmlFor={field.name}
                    className="text-slate-12 text-sm font-medium"
                  >
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id={field.name}
                    data-testid={`${field.name}-input`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="text-slate-12 h-9 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              )}
            </form.AppField>

            <form.AppField name="ticker">
              {(field) => (
                <field.FieldInput label="Ticker" placeholder="e.g. AAPL" />
              )}
            </form.AppField>

            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="assetType">
                {(field) => (
                  <field.FieldSelect label="Asset Type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                    </SelectContent>
                  </field.FieldSelect>
                )}
              </form.AppField>

              <form.AppField name="side">
                {(field) => (
                  <field.FieldSelect label="Side">
                    <SelectTrigger>
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </field.FieldSelect>
                )}
              </form.AppField>
            </div>

            <form.AppField name="direction">
              {(field) => (
                <field.FieldSelect label="Direction">
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </field.FieldSelect>
              )}
            </form.AppField>

            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="price">
                {(field) => (
                  <field.FieldInput
                    label="Price"
                    type="number"
                    placeholder="0.00"
                  />
                )}
              </form.AppField>

              <form.AppField name="quantity">
                {(field) => (
                  <field.FieldInput
                    label="Quantity"
                    type="number"
                    placeholder="0"
                  />
                )}
              </form.AppField>
            </div>

            <form.AppField name="notes">
              {(field) => (
                <field.FieldTextarea
                  label="Notes (optional)"
                  placeholder="Add any notes about this trade..."
                  rows={3}
                />
              )}
            </form.AppField>

            <div className="flex justify-end gap-3 pt-4">
              <form.AppForm>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => router.push("/trades")}
                  dataTestId="cancel-button"
                >
                  Cancel
                </Button>
                <form.SubmitButton
                  label={isSubmitting ? "Saving..." : "Save Trade"}
                />
              </form.AppForm>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
