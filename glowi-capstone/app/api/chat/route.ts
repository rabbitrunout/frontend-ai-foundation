import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

import {
  GLOWI_SYSTEM_PROMPT,
  glowiModel,
} from "@/lib/ai/config";

import { getCompetitions } from "@/lib/ai/tools/getCompetitions";
import { getPayments } from "@/lib/ai/tools/getPayments";

export const maxDuration = 30;

type ChatRequestBody = {
  messages: UIMessage[];
  retry?: boolean;
};

function getLatestUserText(messages: UIMessage[]) {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage) {
    return "";
  }

  return latestUserMessage.parts
    .filter(
      (
        part
      ): part is Extract<
        (typeof latestUserMessage.parts)[number],
        { type: "text" }
      > => part.type === "text"
    )
    .map((part) => part.text)
    .join(" ")
    .trim();
}

export async function POST(req: Request) {
  const {
    messages,
    retry = false,
  }: ChatRequestBody = await req.json();

  const latestUserText =
    getLatestUserText(messages).toLowerCase();

  // FE-08 sabotage:
  // API failure before streaming.
  if (
    latestUserText.includes("test api failure") &&
    !retry
  ) {
    return Response.json(
      {
        error:
          "Intentional FE-08 API failure for retry testing.",
      },
      {
        status: 500,
      }
    );
  }

  // FE-08 sabotage:
  // Simulated rate limit.
  if (
    latestUserText.includes("test rate limit") &&
    !retry
  ) {
    return Response.json(
      {
        error:
          "Intentional FE-08 rate limit for testing.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": "2",
        },
      }
    );
  }

  // FE-08 sabotage:
  // Start a response and fail during the stream.
  if (
    latestUserText.includes("test mid stream failure") &&
    !retry
  ) {
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        writer.write({
          type: "text-start",
          id: "mid-stream-test",
        });

        writer.write({
          type: "text-delta",
          id: "mid-stream-test",
          delta:
            "Glowi started the response, but the connection was interrupted...",
        });

        await new Promise((resolve) =>
          setTimeout(resolve, 800)
        );

        throw new Error(
          "Intentional FE-08 mid-stream failure."
        );
      },
    });

    return createUIMessageStreamResponse({
      stream,
    });
  }

  const result = streamText({
    model: glowiModel,
    system: GLOWI_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    

    tools: {
      getCompetitions,
      getPayments,
    },

    stopWhen: stepCountIs(5),

    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse();
}