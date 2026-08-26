import { tool } from "ai";
import { z } from "zod";

const payments = [
  {
    id: "payment-1",
    athlete: "Kira",
    title: "Ontario Rhythmic Challenge Registration",
    amount: 150,
    currency: "CAD",
    dueDate: "2026-09-01",
    status: "Pending" as const,
  },
  {
    id: "payment-2",
    athlete: "Kira",
    title: "September Training Fee",
    amount: 420,
    currency: "CAD",
    dueDate: "2026-09-05",
    status: "Pending" as const,
  },
  {
    id: "payment-3",
    athlete: "Kira",
    title: "Maple Cup Registration",
    amount: 175,
    currency: "CAD",
    dueDate: "2026-09-15",
    status: "Paid" as const,
  },
];

function getDaysUntilDue(dueDate: string) {
  const today = new Date();

  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const due = new Date(`${dueDate}T00:00:00Z`);

  return Math.round(
    (due.getTime() - todayUtc) /
      (1000 * 60 * 60 * 24)
  );
}

function getPriority(
  daysUntilDue: number,
  status: "Pending" | "Paid" | "Overdue"
) {
  if (status === "Paid") {
    return "FYI" as const;
  }

  if (status === "Overdue" || daysUntilDue < 0) {
    return "URGENT" as const;
  }

  if (daysUntilDue <= 2) {
    return "URGENT" as const;
  }

  if (
    daysUntilDue >= 3 &&
    daysUntilDue <= 7
  ) {
    return "SOON" as const;
  }

  return "FYI" as const;
}

export const getPayments = tool({
  description:
    "Find club payments by athlete and/or payment status. The tool calculates daysUntilDue and priority. Use the returned priority as authoritative.",

  inputSchema: z.object({
    athlete: z
      .string()
      .optional()
      .describe("Athlete name to filter payments by"),

    status: z
      .enum(["Pending", "Paid", "Overdue"])
      .optional()
      .describe("Payment status to filter by"),
  }),

  execute: async ({ athlete, status }) => {
    const filtered = payments.filter((payment) => {
      const athleteMatches =
        !athlete ||
        payment.athlete
          .toLowerCase()
          .includes(athlete.toLowerCase());

      const statusMatches =
        !status || payment.status === status;

      return athleteMatches && statusMatches;
    });

    const results = filtered.map((payment) => {
      const daysUntilDue =
        getDaysUntilDue(payment.dueDate);

      return {
        ...payment,
        daysUntilDue,
        priority: getPriority(
          daysUntilDue,
          payment.status
        ),
      };
    });

    return {
      count: results.length,
      payments: results,
    };
  },
});