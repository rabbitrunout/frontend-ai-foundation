# AI-Assisted Development Workflow — Competition Planner

## Project

Competition Planner is a React + TypeScript application for viewing rhythmic gymnastics competitions.

The app allows users to:

- view competition cards
- search by competition name or location
- filter by status
- see athlete, date, location, and registration status
- view an empty state when no competitions match the filters

## How AI Assisted

AI was used as a development assistant throughout the implementation.

It helped with:

- proposing the initial React + TypeScript component structure
- generating reusable components
- defining TypeScript types
- creating local competition data
- implementing search and status filtering
- suggesting accessible labels and ARIA attributes
- reviewing UI structure
- assisting with debugging and refactoring

I did not accept the generated code without review. I added the code incrementally and ran build and lint checks after each stage.

## Prompt Used

### Prompt 1 — Initial Feature

Build the first version of a React + TypeScript Competition Planner.

Requirements:

- Show a list of rhythmic gymnastics competitions.
- Each competition card should display:
  - competition name
  - date
  - location
  - athlete name
  - status: Upcoming, Registered, or Completed
- Add a search field that filters by competition name or location.
- Add a status filter with All / Upcoming / Registered / Completed.
- Use reusable React components.
- Use React hooks only; no external state-management library.
- Keep the data local in the frontend for now.
- Use accessible labels and buttons.
- Keep the styling simple and clean.
- Do not add a backend or authentication yet.
- After implementing it, explain which files you changed and why.

## AI-Generated Structure

The first version used the following structure:

src/
- components/
  - CompetitionCard.tsx
  - CompetitionList.tsx
  - SearchBar.tsx
  - StatusFilter.tsx
- data/
  - competitions.ts
- App.tsx
- App.css
- main.tsx
- types.ts

This structure separated data, types, reusable UI components, and application state.

## Verification

I verified the implementation throughout development instead of waiting until the end.

Commands used:

```bash
npm run build
npm run lint
npm run dev