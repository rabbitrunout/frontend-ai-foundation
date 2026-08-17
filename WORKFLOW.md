# AI Workflow Comparison

For this exercise, I built the same settings form twice using two different AI-assisted development workflows.

## Round One: Vague Prompt

In the first round, I used a short, vague prompt asking the AI to create a settings form with validation. The result was functional and visually acceptable, but the implementation depended heavily on assumptions made by the AI. Because the requirements were not clearly defined, I had less control over validation behavior, accessibility, edge cases, and verification.

The first version demonstrated how quickly AI can generate a usable interface, but it also showed the risk of accepting generated code without a detailed specification. I had to manually inspect the behavior to understand what had actually been implemented.

## Round Two: Precise Prompt and Verification

For the second round, I followed a more structured workflow. I first reviewed the existing React/Vite project files and defined concrete requirements before implementing the form.

The form requires a name and valid email address. Password changes are optional, but when a new password is entered it must contain at least eight characters and match the confirmation field. The implementation also handles empty and whitespace-only values and displays a success message after valid submission.

Accessibility was more intentional in the second version. Inputs use associated labels, `aria-invalid`, `aria-describedby`, alert roles for validation errors, and an `aria-live` status message for successful submission. Focus states are also visible for keyboard users.

The biggest improvement was verification. I added Vitest, React Testing Library, user-event, and jsdom. Six automated tests cover required fields, invalid email input, short passwords, mismatched passwords, successful submission, and the valid case where password fields remain empty. I also ran the project linter and production build. All tests passed, lint reported zero warnings and errors, and the Vite production build completed successfully.

## Review Effort and Lessons Learned

The vague workflow was faster initially, but required more trust in the generated result and provided less evidence of correctness. The precise workflow required more setup and review, including fixing the test environment and test cleanup, but produced a result that was easier to verify and maintain.

The main lesson is that AI works better as an engineering collaborator when it receives explicit requirements, project context, edge cases, and a verification step rather than only a high-level request.