"use client";

import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
      <Loader2 className="mb-4 animate-spin text-blue-600" size={36} />
      <p className="font-semibold text-gray-800">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
      <Inbox className="mb-4 text-gray-400" size={36} />
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-8 text-center shadow-sm">
      <AlertCircle className="mb-4 text-red-500" size={36} />
      <h2 className="text-lg font-bold text-red-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-red-700">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
