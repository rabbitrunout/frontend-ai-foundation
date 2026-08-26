"use client";

import { useChat } from "@ai-sdk/react";
import type { ToolUIPart } from "ai";
import { useEffect, useRef, useState } from "react";

import CompetitionToolCard from "./CompetitionToolCard";

type CompetitionStatus =
  | "Upcoming"
  | "Registered"
  | "Completed";

type CompetitionToolInput = {
  athlete?: string;
  status?: CompetitionStatus;
};

type CompetitionToolOutput = {
  count: number;
  competitions: {
    id: string;
    name: string;
    date: string;
    location: string;
    athlete: string;
    status: CompetitionStatus;
  }[];
};

type CompetitionToolPart = ToolUIPart<{
  getCompetitions: {
    input: CompetitionToolInput;
    output: CompetitionToolOutput;
  };
}>;

const examplePrompts = [
  "Show me Kira's upcoming competitions.",
  "What competitions are registered?",
  "Help me prepare for the next competition.",
];

export default function GlowiChat() {
  const [input, setInput] = useState("");
  const [isPinnedToBottom, setIsPinnedToBottom] =
    useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
  } = useChat();

  const isStreaming =
    status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!isPinnedToBottom) return;

    const container = scrollRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, status, isPinnedToBottom]);

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsPinnedToBottom(distanceFromBottom < 80);
  };

  const submitText = async (text: string) => {
    const trimmedInput = text.trim();

    if (!trimmedInput || isStreaming) return;

    setInput("");
    setIsPinnedToBottom(true);

    await sendMessage({
      text: trimmedInput,
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await submitText(input);
  };

  const handleRetry = async () => {
    if (isRetrying || isStreaming) return;

    setIsRetrying(true);
    setIsPinnedToBottom(true);

    try {
      await regenerate();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto p-4 sm:p-6"
      >
        {messages.length === 0 && (
          <div className="mx-auto max-w-xl py-10 text-center sm:py-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-xl">
              ✨
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              How can Glowi help?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ask about schedules, competitions, payments,
              athlete progress, or coach requests.
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-1">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    void submitText(prompt);
                  }}
                  disabled={isStreaming}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-[90%] rounded-2xl rounded-br-md bg-teal-700 px-4 py-3 text-white sm:max-w-[85%]"
                    : "max-w-[90%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-slate-900 sm:max-w-[85%]"
                }
              >
                <p className="mb-1 text-xs font-semibold opacity-70">
                  {message.role === "user"
                    ? "You"
                    : "Glowi AI"}
                </p>

                <div className="whitespace-pre-wrap text-sm leading-6">
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <span
                          key={`${message.id}-${index}`}
                        >
                          {part.text}
                        </span>
                      );
                    }

                    if (
                      part.type ===
                      "tool-getCompetitions"
                    ) {
                      const toolPart =
                        part as CompetitionToolPart;

                      if (
                        toolPart.state ===
                          "approval-requested" ||
                        toolPart.state ===
                          "approval-responded" ||
                        toolPart.state ===
                          "output-denied"
                      ) {
                        return null;
                      }

                      return (
                        <CompetitionToolCard
                          key={`${message.id}-${index}`}
                          state={toolPart.state}
                          input={
                            toolPart.state ===
                              "input-available" ||
                            toolPart.state ===
                              "output-available" ||
                            toolPart.state ===
                              "output-error"
                              ? toolPart.input
                              : undefined
                          }
                          output={
                            toolPart.state ===
                            "output-available"
                              ? toolPart.output
                              : undefined
                          }
                          errorText={
                            toolPart.state ===
                            "output-error"
                              ? toolPart.errorText
                              : undefined
                          }
                        />
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="w-full max-w-[90%] rounded-2xl rounded-bl-md bg-slate-100 p-4 sm:max-w-[85%]">
                <div className="animate-pulse space-y-3">
                  <div className="h-3 w-20 rounded bg-slate-300" />
                  <div className="h-3 w-full rounded bg-slate-200" />
                  <div className="h-3 w-4/5 rounded bg-slate-200" />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Glowi is preparing a response...
                </p>
              </div>
            </div>
          )}
        </div>

        {!isPinnedToBottom &&
          messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const container =
                  scrollRef.current;

                if (container) {
                  container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "smooth",
                  });
                }

                setIsPinnedToBottom(true);
              }}
              className="sticky bottom-3 left-1/2 mt-4 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow"
            >
              Jump to latest
            </button>
          )}
      </div>

      {error && (
        <div
          role="alert"
          className="border-t border-red-200 bg-red-50 px-4 py-4"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-red-900">
                Glowi couldn&apos;t finish that response.
              </p>

              <p className="mt-1 text-sm text-red-700">
                Your conversation is still here. You can
                retry the failed response.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void handleRetry();
              }}
              disabled={isRetrying || isStreaming}
              className="min-h-10 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRetrying
                ? "Retrying..."
                : "Retry last response"}
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 bg-white p-3 sm:p-4"
      >
        <div className="flex items-end gap-2">
          <label
            htmlFor="glowi-chat-input"
            className="sr-only"
          >
            Message Glowi AI
          </label>

          <textarea
            id="glowi-chat-input"
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Ask Glowi..."
            rows={1}
            disabled={isStreaming || isRetrying}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-100"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              className="min-h-11 rounded-xl bg-slate-900 px-4 py-2 font-medium text-white"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || isRetrying}
              className="min-h-11 rounded-xl bg-teal-700 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          )}
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  );
}