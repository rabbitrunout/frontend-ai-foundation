import GlowiChat from "@/components/ai/GlowiChat";

export default function AIAssistantPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Glowi AI
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Ask Glowi
        </h1>

        <p className="mt-3 mb-6 text-slate-600">
          Ask about schedules, competitions, payments,
          athlete progress, and coach requests.
        </p>

        <GlowiChat />
      </div>
    </main>
  );
}