"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("AI Assistant route error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-12">
      <div
        role="alert"
        className="w-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
          Glowi AI
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Something went wrong
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          We couldn&apos;t load the AI assistant.
          Your other Glowi pages are still available.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          Try again
        </button>
      </div>
    </main>
  );
}