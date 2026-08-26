type PaymentPriority = "URGENT" | "SOON" | "FYI";

type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Overdue";

type Payment = {
  id: string;
  athlete: string;
  title: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: PaymentStatus;
  daysUntilDue: number;
  priority: PaymentPriority;
};

type PaymentToolCardProps = {
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";

  input?: {
    athlete?: string;
    status?: PaymentStatus;
  };

  output?: {
    count: number;
    payments: Payment[];
  };

  errorText?: string;
};

export default function PaymentToolCard({
  state,
  input,
  output,
  errorText,
}: PaymentToolCardProps) {
  if (state === "input-streaming") {
    return (
      <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-4">
        <p className="text-sm font-semibold text-sky-900">
          Preparing payment check...
        </p>

        <p className="mt-1 animate-pulse text-sm text-sky-700">
          Glowi is deciding which payment records to review.
        </p>
      </div>
    );
  }

  if (state === "input-available") {
    return (
      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">
          Payment check ready
        </p>

        <dl className="mt-2 space-y-1 text-sm text-amber-800">
          <div>
            <dt className="inline font-medium">
              Athlete:{" "}
            </dt>
            <dd className="inline">
              {input?.athlete ?? "Any athlete"}
            </dd>
          </div>

          <div>
            <dt className="inline font-medium">
              Status:{" "}
            </dt>
            <dd className="inline">
              {input?.status ?? "Any status"}
            </dd>
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
          Payment check failed
        </p>

        <p className="mt-1 text-sm text-red-700">
          {errorText ??
            "Payment data could not be loaded."}
        </p>

        <p className="mt-2 text-xs text-red-600">
          Try again or review the payment records manually.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
      <div>
        <p className="text-sm font-semibold text-violet-950">
          Payment results
        </p>

        <p className="text-xs text-violet-700">
          {output?.count ?? 0} payment
          {(output?.count ?? 0) === 1 ? "" : "s"} found
        </p>
      </div>

      {output?.payments.length ? (
        <div className="mt-3 space-y-3">
          {output.payments.map((payment) => (
            <article
              key={payment.id}
              className="rounded-lg border border-violet-100 bg-white p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {payment.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {payment.athlete}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {payment.priority}
                </span>
              </div>

              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-500">
                    Amount
                  </dt>
                  <dd className="text-slate-900">
                    {payment.currency}{" "}
                    {payment.amount.toFixed(2)}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium text-slate-500">
                    Status
                  </dt>
                  <dd className="text-slate-900">
                    {payment.status}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium text-slate-500">
                    Due date
                  </dt>
                  <dd className="text-slate-900">
                    {payment.dueDate}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium text-slate-500">
                    Timing
                  </dt>
                  <dd className="text-slate-900">
                    {payment.daysUntilDue < 0
                      ? `${Math.abs(
                          payment.daysUntilDue
                        )} day(s) overdue`
                      : `${payment.daysUntilDue} day(s) remaining`}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">
            No payments found
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Try another athlete or payment status.
          </p>
        </div>
      )}
    </div>
  );
}