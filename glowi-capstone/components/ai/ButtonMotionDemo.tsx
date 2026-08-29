"use client";

import { useRef, useState } from "react";

type DemoState = "idle" | "loading" | "success" | "error";

export default function ButtonMotionDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const runDemo = (result: "success" | "error") => {
    if (state === "loading") return;

    clearTimer();
    setState("loading");

    timerRef.current = setTimeout(() => {
      setState(result);

      timerRef.current = setTimeout(() => {
        setState("idle");
      }, 1600);
    }, 900);
  };

  const isLoading = state === "loading";

  return (
    <section className="motion-demo">
      <p className="motion-demo-eyebrow">
        Week 6 · FE-AA1
      </p>

      <h2 className="motion-demo-title">
        Buttons with a Brain
      </h2>

      <p className="motion-demo-description">
        A state-aware button system used in Glowi. Use the controls
        below to trigger success and error states intentionally.
      </p>

      <div className="motion-demo-preview">
        <button
          type="button"
          disabled={isLoading || state === "success"}
          className={[
            "smart-send-button",
            state === "loading"
              ? "smart-send-button--loading"
              : "",
            state === "success"
              ? "smart-send-button--success"
              : "",
            state === "error"
              ? "smart-send-button--error"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-live="polite"
        >
          {state === "idle" && (
            <>
              <span className="smart-send-label">Send</span>
              <span
                className="smart-send-arrow"
                aria-hidden="true"
              >
                →
              </span>
            </>
          )}

          {state === "loading" && (
            <>
              <span
                className="smart-send-spinner"
                aria-hidden="true"
              />
              <span className="smart-send-label">
                Sending...
              </span>
            </>
          )}

          {state === "success" && (
            <>
              <span
                className="smart-send-check"
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="smart-send-label">
                Sent
              </span>
            </>
          )}

          {state === "error" && (
            <>
              <span
                className="smart-send-error-icon"
                aria-hidden="true"
              >
                !
              </span>
              <span className="smart-send-label">
                Try again
              </span>
            </>
          )}
        </button>
      </div>

      <div className="motion-demo-controls">
        <button
          type="button"
          onClick={() => runDemo("success")}
          disabled={isLoading}
          className="motion-demo-control"
        >
          Test success
        </button>

        <button
          type="button"
          onClick={() => runDemo("error")}
          disabled={isLoading}
          className="motion-demo-control"
        >
          Test error
        </button>
      </div>

      <div className="motion-demo-notes">
        <h3>Motion notes</h3>

        <p>
          Hover and press interactions use 180ms transitions so
          feedback feels immediate. Loading, success, and error
          feedback use 220–320ms motion so state changes remain
          noticeable without slowing the workflow.
        </p>

        <p>
          Motion relies primarily on transform and opacity.
          Reduced-motion preferences remove non-essential motion
          while preserving text, color, and state feedback.
        </p>
      </div>
    </section>
  );
}