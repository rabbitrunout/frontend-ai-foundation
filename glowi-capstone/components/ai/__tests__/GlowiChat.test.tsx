import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import GlowiChat from "@/components/ai/GlowiChat";

const sendMessageMock = vi.fn();
const regenerateMock = vi.fn();
const stopMock = vi.fn();

let mockStatus:
  | "ready"
  | "submitted"
  | "streaming"
  | "error" = "ready";

let mockError: Error | undefined;
let mockMessages: Array<Record<string, unknown>> = [];

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockMessages,
    sendMessage: sendMessageMock,
    regenerate: regenerateMock,
    status: mockStatus,
    stop: stopMock,
    error: mockError,
  }),
}));

describe("GlowiChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStatus = "ready";
    mockError = undefined;
    mockMessages = [];
  });

  it("renders the empty first-run state", () => {
    render(<GlowiChat />);

    expect(
      screen.getByRole("heading", {
        name: /how can glowi help/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/message glowi ai/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /send/i })
    ).toBeDisabled();
  });

  it("does not send whitespace-only input", async () => {
    const user = userEvent.setup();

    render(<GlowiChat />);

    const input = screen.getByLabelText(/message glowi ai/i);

    await user.type(input, "   ");

    expect(
      screen.getByRole("button", { name: /send/i })
    ).toBeDisabled();

    expect(sendMessageMock).not.toHaveBeenCalled();
  });

  it("submits a valid message", async () => {
    const user = userEvent.setup();

    render(<GlowiChat />);

    const input = screen.getByLabelText(/message glowi ai/i);

    await user.type(
      input,
      "What needs my attention right now?"
    );

    await user.click(
      screen.getByRole("button", { name: /send/i })
    );

    expect(sendMessageMock).toHaveBeenCalledTimes(1);

    expect(sendMessageMock).toHaveBeenCalledWith({
      text: "What needs my attention right now?",
    });
  });

  it("shows the pending response state", () => {
    mockStatus = "submitted";

    render(<GlowiChat />);

    expect(
      screen.getByText(
        /glowi is preparing a response/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /stop/i })
    ).toBeInTheDocument();
  });

  it("renders streaming assistant content", () => {
    mockStatus = "streaming";

    mockMessages = [
      {
        id: "assistant-1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Checking your current priorities...",
          },
        ],
      },
    ];

    render(<GlowiChat />);

    expect(
      screen.getByText(
        /checking your current priorities/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /stop/i })
    ).toBeInTheDocument();
  });

  it("renders an accessible error state", () => {
    mockStatus = "error";
    mockError = new Error("AI request failed");

    render(<GlowiChat />);

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent(
      /glowi couldn't finish that response/i
    );

    expect(
      screen.getByRole("button", {
        name: /retry last response/i,
      })
    ).toBeInTheDocument();
  });

  it("retries the failed response", async () => {
    const user = userEvent.setup();

    mockStatus = "error";
    mockError = new Error("AI request failed");

    regenerateMock.mockResolvedValue(undefined);

    render(<GlowiChat />);

    await user.click(
      screen.getByRole("button", {
        name: /retry last response/i,
      })
    );

    expect(regenerateMock).toHaveBeenCalledTimes(1);
  });

  it("renders a competition tool result inside a chat message", () => {
    mockMessages = [
      {
        id: "assistant-tool-1",
        role: "assistant",
        parts: [
          {
            type: "tool-getCompetitions",
            state: "output-available",
            input: {},
            output: {
              count: 1,
              competitions: [
                {
                  id: "competition-1",
                  name: "Ontario Rhythmic Challenge",
                  date: "2026-09-15",
                  location: "Toronto",
                  athlete: "Kira",
                  status: "Upcoming",
                },
              ],
            },
          },
        ],
      },
    ];

    render(<GlowiChat />);

    expect(
      screen.getByRole("heading", {
        name: /ontario rhythmic challenge/i,
      })
    ).toBeInTheDocument();
  });

  it("renders a payment tool result inside a chat message", () => {
    mockMessages = [
      {
        id: "assistant-tool-2",
        role: "assistant",
        parts: [
          {
            type: "tool-getPayments",
            state: "output-available",
            input: {},
            output: {
              count: 1,
              payments: [
                {
                  id: "payment-1",
                  athlete: "Kira",
                  title: "Training Fee",
                  amount: 200,
                  currency: "CAD",
                  dueDate: "2026-09-10",
                  status: "Pending",
                  daysUntilDue: 10,
                  priority: "FYI",
                },
              ],
            },
          },
        ],
      },
    ];

    render(<GlowiChat />);

    expect(
      screen.getByRole("heading", {
        name: /training fee/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText("FYI")).toBeInTheDocument();
  });
});