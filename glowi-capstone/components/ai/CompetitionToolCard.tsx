type CompetitionStatus = "Upcoming" | "Registered" | "Completed";

type Competition = {
  id: string;
  name: string;
  date: string;
  location: string;
  athlete: string;
  status: CompetitionStatus;
};

type CompetitionToolCardProps = {
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  input?: {
    athlete?: string;
    status?: CompetitionStatus;
  };
  output?: {
    count: number;
    competitions: Competition[];
  };
  errorText?: string;
};

export default function CompetitionToolCard({
  state,
  input,
  output,
  errorText,
}: CompetitionToolCardProps) {
  if (state === "input-streaming") {
    return (
      <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-4">
        <p className="text-sm font-semibold text-sky-900">
          Preparing competition search...
        </p>
        <p className="mt-1 animate-pulse text-sm text-sky-700">
          Glowi is deciding what competition data to request.
        </p>
      </div>
    );
  }

  if (state === "input-available") {
    return (
      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">
          Competition search ready
        </p>

        <dl className="mt-2 space-y-1 text-sm text-amber-800">
          <div>
            <dt className="inline font-medium">Athlete: </dt>
            <dd className="inline">{input?.athlete ?? "Any athlete"}</dd>
          </div>

          <div>
            <dt className="inline font-medium">Status: </dt>
            <dd className="inline">{input?.status ?? "Any status"}</dd>
          </div>
        </dl>
      </div>
    );
  }

  if (state === "output-error") {
    return (
      <div
        role="alert"
        className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4"
      >
        <p className="text-sm font-semibold text-red-900">
          Competition search failed
        </p>

        <p className="mt-1 text-sm text-red-700">
          {errorText ?? "Competition data could not be loaded."}
        </p>

        <p className="mt-2 text-xs text-red-600">
          Try changing the athlete or status and run the search again.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-950">
            Competition results
          </p>
          <p className="text-xs text-emerald-700">
            {output?.count ?? 0} competition
            {(output?.count ?? 0) === 1 ? "" : "s"} found
          </p>
        </div>
      </div>

      {output?.competitions.length ? (
        <div className="mt-3 space-y-3">
          {output.competitions.map((competition) => (
            <article
              key={competition.id}
              className="rounded-lg border border-emerald-100 bg-white p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {competition.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {competition.location}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {competition.status}
                </span>
              </div>

              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-500">Date</dt>
                  <dd className="text-slate-900">{competition.date}</dd>
                </div>

                <div>
                  <dt className="font-medium text-slate-500">Athlete</dt>
                  <dd className="text-slate-900">{competition.athlete}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
    <p className="text-sm font-semibold text-slate-900">
      No competitions found
    </p>

    <p className="mt-1 text-sm text-slate-600">
      Try another athlete name or remove the status filter.
    </p>
  </div>
)}
    </div>
  );
}