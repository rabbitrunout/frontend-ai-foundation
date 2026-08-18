"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function GlowiChat() {
  const [input, setInput] = useState("");
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isStreaming) return;

    setInput("");
    setIsPinnedToBottom(true);

    await sendMessage({
      text: trimmedInput,
    });
  };

  return (
    <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto p-4 sm:p-6"
      >
        {messages.length === 0 && (
          <div className="mx-auto max-w-xl py-16 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              How can Glowi help?
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Ask about schedules, competitions, payments,
              athlete progress, or coach requests.
            </p>
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
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-teal-700 px-4 py-3 text-white"
                    : "max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-slate-900"
                }
              >
                <p className="mb-1 text-xs font-semibold opacity-70">
                  {message.role === "user"
                    ? "You"
                    : "Glowi AI"}
                </p>

                <div className="whitespace-pre-wrap text-sm leading-6">
                  {message.parts.map((part, index) => {
                    if (part.type !== "text") {
                      return null;
                    }

                    return (
                      <span key={`${message.id}-${index}`}>
                        {part.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">
                <span className="animate-pulse">
                  Glowi is thinking...
                </span>
              </div>
            </div>
          )}
        </div>

        {!isPinnedToBottom && messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              const container = scrollRef.current;

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
          className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          Something went wrong. Please try again.
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
            disabled={isStreaming}
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
              disabled={!input.trim()}
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