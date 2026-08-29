import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CompetitionToolCard from "@/components/ai/CompetitionToolCard";

describe("CompetitionToolCard", () => {
  it("shows the pending competition search state", () => {
    render(
      <CompetitionToolCard state="input-streaming" />
    );

    expect(
      screen.getByText(/preparing competition search/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /glowi is deciding what competition data to request/i
      )
    ).toBeInTheDocument();
  });

  it("shows the selected competition search filters", () => {
    render(
      <CompetitionToolCard
        state="input-available"
        input={{
          athlete: "Kira",
          status: "Upcoming",
        }}
      />
    );

    expect(
      screen.getByText(/competition search ready/i)
    ).toBeInTheDocument();

    expect(screen.getByText("Kira")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });

  it("renders structured competition results", () => {
    render(
      <CompetitionToolCard
        state="output-available"
        output={{
          count: 1,
          competitions: [
            {
              id: "competition-1",
              name: "Ontario Rhythmic Challenge",
              date: "2026-09-15",
              location: "Toronto",
              athlete: "Kira",
              status: "Upcoming",
            },
          ],
        }}
      />
    );

    expect(
      screen.getByText(/competition results/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /ontario rhythmic challenge/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Toronto")).toBeInTheDocument();
    expect(screen.getByText("Kira")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });

  it("renders an accessible error state", () => {
    render(
      <CompetitionToolCard
        state="output-error"
        errorText="Competition service unavailable"
      />
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent(
      /competition search failed/i
    );

    expect(alert).toHaveTextContent(
      /competition service unavailable/i
    );
  });

  it("renders a useful empty result state", () => {
    render(
      <CompetitionToolCard
        state="output-available"
        output={{
          count: 0,
          competitions: [],
        }}
      />
    );

    expect(
      screen.getByText(/no competitions found/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /try another athlete name or remove the status filter/i
      )
    ).toBeInTheDocument();
  });
});