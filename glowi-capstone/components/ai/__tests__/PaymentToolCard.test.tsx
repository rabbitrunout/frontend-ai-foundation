import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PaymentToolCard from "@/components/ai/PaymentToolCard";

describe("PaymentToolCard", () => {
  it("shows payment loading state", () => {
    render(
      <PaymentToolCard state="input-streaming" />
    );

    expect(
      screen.getByText(/preparing payment check/i)
    ).toBeInTheDocument();
  });

  it("renders structured payment data", () => {
    render(
      <PaymentToolCard
        state="output-available"
        output={{
          count: 1,
          payments: [
            {
              id: "payment-1",
              athlete: "Kira",
              title: "Ontario Challenge Registration",
              amount: 150,
              currency: "CAD",
              dueDate: "2026-09-04",
              status: "Pending",
              daysUntilDue: 6,
              priority: "SOON",
            },
          ],
        }}
      />
    );

    expect(
      screen.getByText(/payment results/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /ontario challenge registration/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText("CAD 150.00")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("SOON")).toBeInTheDocument();

    expect(
      screen.getByText(/6 day\(s\) remaining/i)
    ).toBeInTheDocument();
  });

  it("renders overdue payment timing", () => {
    render(
      <PaymentToolCard
        state="output-available"
        output={{
          count: 1,
          payments: [
            {
              id: "payment-overdue",
              athlete: "Kira",
              title: "Training Fee",
              amount: 200,
              currency: "CAD",
              dueDate: "2026-08-27",
              status: "Overdue",
              daysUntilDue: -2,
              priority: "URGENT",
            },
          ],
        }}
      />
    );

    expect(
      screen.getByText(/2 day\(s\) overdue/i)
    ).toBeInTheDocument();

    expect(screen.getByText("URGENT")).toBeInTheDocument();
  });

  it("renders an accessible payment error", () => {
    render(
      <PaymentToolCard
        state="output-error"
        errorText="Payment service unavailable"
      />
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent(
      /payment check failed/i
    );

    expect(alert).toHaveTextContent(
      /payment service unavailable/i
    );
  });

  it("renders an empty payment state", () => {
    render(
      <PaymentToolCard
        state="output-available"
        output={{
          count: 0,
          payments: [],
        }}
      />
    );

    expect(
      screen.getByText(/no payments found/i)
    ).toBeInTheDocument();
  });
});