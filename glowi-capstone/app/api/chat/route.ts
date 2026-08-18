import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

import {
  GLOWI_SYSTEM_PROMPT,
  glowiModel,
} from "@/lib/ai/config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: glowiModel,
    system: GLOWI_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse();
}