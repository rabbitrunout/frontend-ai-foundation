"use client";

import { useEffect, useRef, useState } from "react";

type SmartSendButtonProps = {
  isStreaming: boolean;
  isDisabled: boolean;
  hasError: boolean;
  onStop: () => void;
};

type FeedbackState = "idle" | "success" | "error";

export default function SmartSendButton({
  isStreaming,
  isDisabled,
  hasError,
  onStop,
}: SmartSendButtonProps) {
  const [feedbackState, setFeedbackState] =
    useState<FeedbackState>("idle");

  const wasStreaming = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }

    if (isStreaming) {
      wasStreaming.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFeedbackState("idle");
      return;
    }

    if (wasStreaming.current) {
      wasStreaming.current = false;

      if (hasError) {
        setFeedbackState("error");
        return;
      }

      setFeedbackState("success");

      resetTimer.current = setTimeout(() => {
        setFeedbackState("idle");
      }, 1200);

      return;
    }

    if (hasError) {
      setFeedbackState("error");
    } else if (feedbackState === "error") {
      setFeedbackState("idle");
    }

    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, [isStreaming, hasError, feedbackState]);

  if (isStreaming) {
    return (
      <button
        type="button"
        onClick={onStop}
        className="smart-send-button smart-send-button--loading"
        aria-label="Stop generating response"
      >
        <span
          className="smart-send-spinner"
          aria-hidden="true"
        />
        <span className="smart-send-label">Stop</span>
      </button>
    );
  }

  if (feedbackState === "success") {
    return (
      <button
        type="button"
        disabled
        className="smart-send-button smart-send-button--success"
        aria-label="Message sent successfully"
      >
        <span
          className="smart-send-check"
          aria-hidden="true"
        >
          ✓
        </span>
        <span className="smart-send-label">Sent</span>
      </button>
    );
  }

  if (feedbackState === "error") {
    return (
      <button
        type="submit"
        disabled={isDisabled}
        className="smart-send-button smart-send-button--error"
      >
        <span
          className="smart-send-error-icon"
          aria-hidden="true"
        >
          !
        </span>
        <span className="smart-send-label">Try again</span>
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="smart-send-button"
    >
      <span className="smart-send-label">Send</span>

      <span
        className="smart-send-arrow"
        aria-hidden="true"
      >
        →
      </span>
    </button>
  );
}