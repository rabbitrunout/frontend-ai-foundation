import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SmartSendButton from "@/components/ai/SmartSendButton";

describe("SmartSendButton", () => {
  it("renders the idle Send state", () => {
    render(
      <SmartSendButton
        isStreaming={false}
        isDisabled={false}
        hasError={false}
        onStop={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /send/i }),
    ).toBeEnabled();
  });

  it("renders disabled state when input cannot be submitted", () => {
    render(
      <SmartSendButton
        isStreaming={false}
        isDisabled
        hasError={false}
        onStop={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /send/i }),
    ).toBeDisabled();
  });

  it("shows the loading state while streaming", () => {
    render(
      <SmartSendButton
        isStreaming
        isDisabled={false}
        hasError={false}
        onStop={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /stop/i }),
    ).toBeInTheDocument();
  });

  it("calls onStop when the streaming button is pressed", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();

    render(
      <SmartSendButton
        isStreaming
        isDisabled={false}
        hasError={false}
        onStop={onStop}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /stop/i }),
    );

    expect(onStop).toHaveBeenCalledTimes(1);
  });
});