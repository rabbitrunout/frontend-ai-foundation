import { readFile } from "node:fs/promises";
import path from "node:path";

import { tool } from "ai";
import { z } from "zod";

const competitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  location: z.string(),
  athlete: z.string(),
  status: z.enum([
    "Upcoming",
    "Registered",
    "Completed",
  ]),
  registrationDeadline: z.string(),
  actionRequired: z.boolean(),
});

const competitionsSchema = z.array(competitionSchema);

async function loadCompetitions() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "glowi",
    "competitions.json"
  );

  const file = await readFile(filePath, "utf8");
  const parsed = JSON.parse(file);

  return competitionsSchema.parse(parsed);
}

function getDaysUntilDeadline(deadline: string) {
  const today = new Date();

  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const due = new Date(`${deadline}T00:00:00Z`);

  return Math.round(
    (due.getTime() - todayUtc) /
      (1000 * 60 * 60 * 24)
  );
}

function getCompetitionPriority(
  daysUntilDeadline: number,
  actionRequired: boolean
) {
  if (!actionRequired) {
    return "FYI" as const;
  }

  if (daysUntilDeadline < 0) {
    return "URGENT" as const;
  }

  if (daysUntilDeadline <= 2) {
    return "URGENT" as const;
  }

  if (
    daysUntilDeadline >= 3 &&
    daysUntilDeadline <= 7
  ) {
    return "SOON" as const;
  }

  return "FYI" as const;
}

export const getCompetitions = tool({
  description:
    "Read Glowi competition records and find rhythmic gymnastics competitions by athlete and/or status. The tool calculates daysUntilRegistrationDeadline and priority. Treat the returned priority as authoritative.",

  inputSchema: z.object({
    athlete: z
      .string()
      .optional()
      .describe(
        "Athlete name to filter competitions by"
      ),

    status: z
      .enum([
        "Upcoming",
        "Registered",
        "Completed",
      ])
      .optional()
      .describe(
        "Competition status to filter by"
      ),
  }),

  execute: async ({ athlete, status }) => {
    const competitions = await loadCompetitions();

    const filtered = competitions.filter(
      (competition) => {
        const athleteMatches =
          !athlete ||
          competition.athlete
            .toLowerCase()
            .includes(athlete.toLowerCase());

        const statusMatches =
          !status ||
          competition.status === status;

        return athleteMatches && statusMatches;
      }
    );

    const results = filtered.map((competition) => {
      const daysUntilRegistrationDeadline =
        getDaysUntilDeadline(
          competition.registrationDeadline
        );

      return {
        ...competition,
        daysUntilRegistrationDeadline,
        priority: getCompetitionPriority(
          daysUntilRegistrationDeadline,
          competition.actionRequired
        ),
      };
    });

    return {
      count: results.length,
      competitions: results,
    };
  },
});