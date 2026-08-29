"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export default function ButtonMotionDemo() {
  const [state, setState] = useState<State>("idle");

  const handleClick = async () => {
    if (state === "loading") return;

    setState("loading");

    await new Promise((r) => setTimeout(r, 1400));

    const ok = Math.random() > 0.2;

    if (ok) {
      setState("success");
      setTimeout(() => setState("idle"), 1800);
    } else {
      setState("error");
      setTimeout(() => setState("idle"), 2200);
    }
  };

  const label = {
    idle: "Send message",
    loading: "Sending...",
    success: "Sent!",
    error: "Try again",
  }[state];

  return (
    <section className="button-demo">
      <p className="eyebrow">Week 6 · Motion Demo</p>
      <h2>Buttons with a Brain</h2>

      <button
        onClick={handleClick}
        disabled={state === "loading"}
        className={`smart-btn ${state}`}
      >
        <span className="btn-icon">
          {state === "loading" && <span className="spinner" />}
          {state === "success" && "✓"}
          {state === "error" && "!"}
          {state === "idle" && "→"}
        </span>

        <span>{label}</span>
      </button>

      <p className="motion-note">
        180ms hover • 420ms loading transition • Success holds for 1.8s • Error
        uses color + shake (disabled under reduced motion).
      </p>
    </section>
  );
}