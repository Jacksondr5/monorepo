"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { Button } from "@j5/component-library";
import { api } from "../../../convex/_generated/api";

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

export default function TradesPage() {
  const trades = useQuery(api.trades.listTrades);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Trades</h1>
        <Link href="/trades/new">
          <Button dataTestId="new-trade-button">New Trade</Button>
        </Link>
      </div>

      {trades === undefined ? (
        <div className="text-slate-400">Loading trades...</div>
      ) : trades.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center">
          <p className="text-slate-400">No trades yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Click &quot;New Trade&quot; to record your first trade.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full table-auto">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Ticker
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Side
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">
                  Direction
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-900">
              {trades.map((trade) => (
                <tr
                  key={trade._id}
                  className="hover:bg-slate-800/50"
                  data-testid={`trade-row-${trade._id}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-100">
                    {formatDate(trade.date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-100">
                    {trade.ticker}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={
                        trade.side === "buy" ? "text-green-400" : "text-red-400"
                      }
                    >
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">
                    {trade.direction}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-100">
                    {formatCurrency(trade.price)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-100">
                    {trade.quantity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-slate-100">
                    {formatCurrency(trade.price * trade.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
