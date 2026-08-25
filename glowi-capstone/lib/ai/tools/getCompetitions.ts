import { tool } from "ai";
import { z } from "zod";

const competitions = [
  {
    id: "1",
    name: "Ontario Rhythmic Challenge",
    date: "2026-09-12",
    location: "Toronto, ON",
    athlete: "Kira",
    status: "Upcoming" as const,
  },
  {
    id: "2",
    name: "Maple Cup",
    date: "2026-10-03",
    location: "Markham, ON",
    athlete: "Kira",
    status: "Registered" as const,
  },
  {
    id: "3",
    name: "Spring Invitational",
    date: "2026-05-18",
    location: "Mississauga, ON",
    athlete: "Kira",
    status: "Completed" as const,
  },
];

export const getCompetitions = tool({
  description:
    "Find rhythmic gymnastics competitions by athlete and/or competition status.",

  inputSchema: z.object({
    athlete: z
      .string()
      .optional()
      .describe("Athlete name to filter competitions by"),

    status: z
      .enum(["Upcoming", "Registered", "Completed"])
      .optional()
      .describe("Competition status to filter by"),
  }),

  execute: async ({ athlete, status }) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Special test input so we can demonstrate the designed error state.
    if (athlete?.toLowerCase() === "error") {
      throw new Error("Competition data could not be loaded.");
    }

    const filtered = competitions.filter((competition) => {
      const athleteMatches =
        !athlete ||
        competition.athlete
          .toLowerCase()
          .includes(athlete.toLowerCase());

      const statusMatches =
        !status || competition.status === status;

      return athleteMatches && statusMatches;
    });

    return {
      count: filtered.length,
      competitions: filtered,
    };
  },
});