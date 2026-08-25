# Glowi Capstone

Glowi is a club-management application designed to help parents manage important information for young athletes in one place.

The application includes schedules, competitions, payments, athlete results, coach requests, profiles, and an AI assistant.

This repository is also used for my Frontend AI Engineering work, where I am adding AI-powered features with structured tool calling and generative UI.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Anthropic / Groq
- Zod
- Git / GitHub

## Main Features

Glowi currently includes:

- Parent dashboard
- Athlete schedule
- Competition information
- Payments
- Athlete results
- Coach requests
- Athlete profile
- Glowi AI assistant
- Server-side AI tools
- Structured AI tool results rendered as UI components

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The Glowi AI assistant is available at:

```text
http://localhost:3000/ai-assistant
```

## Production Build

To verify the production build:

```bash
npm run build
```

---

# FE-07 — Tool Results and Structured Output in the UI

## Overview

For FE-07, I extended the Glowi AI assistant with a server-side tool that retrieves structured competition information.

Instead of returning tool data as raw JSON or plain chat text, Glowi renders the result as a dedicated UI component.

The implementation also handles the full tool lifecycle, including loading, available input, successful output, and tool errors.

## Tool: `getCompetitions`

`getCompetitions` is a server-side AI tool used by Glowi AI to retrieve rhythmic gymnastics competition data.

The tool definition is located at:

```text
lib/ai/tools/getCompetitions.ts
```

The tool is registered with the AI route in:

```text
app/api/chat/route.ts
```

The tool can be selected by the AI model when a user asks Glowi about competitions.

## Input Schema

The tool uses a Zod schema to define and validate its input.

```ts
{
  athlete?: string;
  status?: "Upcoming" | "Registered" | "Completed";
}
```

### Input fields

- `athlete` — filters competition results by athlete name.
- `status` — filters competitions by competition status.
- Both fields are optional.

Keeping the schema small limits unnecessary or hallucinated tool arguments and makes the tool easier to render safely in the UI.

## Return Shape

The tool returns structured competition data.

```ts
{
  count: number;
  competitions: {
    id: string;
    name: string;
    date: string;
    location: string;
    athlete: string;
    status: "Upcoming" | "Registered" | "Completed";
  }[];
}
```

The `count` field describes the number of matching competitions.

The `competitions` array contains the structured results that are rendered by the frontend.

## Structured Result Component

Tool results are rendered by:

```text
components/ai/CompetitionToolCard.tsx
```

The component converts the structured tool output into a readable competition card rather than displaying a JSON dump.

A successful result can display information such as:

- Competition name
- Location
- Date
- Athlete
- Competition status

For example, a user can ask:

```text
Show me Kira's upcoming competitions.
```

Glowi can call `getCompetitions` and display the matching competition as a structured result card.

## Tool Lifecycle

The frontend handles the tool lifecycle through typed tool parts.

The four required states have distinct visual treatments.

### `input-streaming`

Shown while the tool arguments are still being generated.

The UI uses a loading treatment so the user understands that Glowi is preparing a search.

### `input-available`

Shown once the tool input has been generated and is ready.

The UI can display the search criteria before the result is returned.

### `output-available`

Shown after the tool executes successfully.

The structured competition output is rendered as a real competition results component rather than plain text or JSON.

### `output-error`

Shown when tool execution fails.

The UI displays a designed error card with a recovery message instead of allowing the application to crash.

## Error Handling

The tool contains a reproducible error case so the failure state can be tested intentionally.

When the athlete name is exactly:

```text
error
```

the tool throws an error.

This allows the `output-error` lifecycle state to be demonstrated reliably.

Example test prompt:

```text
Use the competition search tool. Search for an athlete whose name is exactly "error".
```

Instead of crashing, Glowi displays a designed error state such as:

```text
Competition search failed

An error occurred.

Try changing the athlete or status and run the search again.
```

The AI can also continue the conversation after the failed tool execution and explain that the competition information could not be retrieved.

## FE-07 Files

The main files used for this implementation are:

```text
app/api/chat/route.ts
components/ai/GlowiChat.tsx
components/ai/CompetitionToolCard.tsx
lib/ai/tools/getCompetitions.ts
```

### `getCompetitions.ts`

Defines the server-side tool, Zod input schema, tool description, execution logic, structured return data, and reproducible error case.

### `route.ts`

Registers the competition tool with the AI model and streams the AI response back to the client.

### `GlowiChat.tsx`

Handles AI messages and typed tool parts and decides which UI should be rendered for each tool lifecycle state.

### `CompetitionToolCard.tsx`

Provides the visual treatments for tool input, successful structured results, and tool errors.

## FE-07 Requirements Demonstrated

This implementation demonstrates:

- Server-side AI tool
- Typed Zod input schema
- Tool `execute` function
- Structured tool output
- Typed tool parts
- `input-streaming` state
- `input-available` state
- `output-available` state
- `output-error` state
- Structured result rendered as a UI component
- Designed tool failure state
- Graceful error handling without an application crash
- Documented tool contract

## Example Prompts

Successful tool call:

```text
Show me Kira's upcoming competitions.
```

Error-state test:

```text
Use the competition search tool. Search for an athlete whose name is exactly "error".
```

These prompts demonstrate both the successful structured result flow and the designed failure flow.

---

## Development

Run the development environment:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Project Status

Glowi is an active capstone project being developed as part of my Frontend AI Engineering work.

The project is being expanded incrementally with AI-assisted interfaces, structured tool use, error handling, and user-focused application features.