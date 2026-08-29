import { expect, test } from "@playwright/test";

test("user can submit a Glowi chat message", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body:
        'data: {"type":"text-start","id":"text-1"}\n\n' +
        'data: {"type":"text-delta","id":"text-1","delta":"URGENT\\nNo urgent items right now.\\n\\nNext step\\nReview upcoming deadlines."}\n\n' +
        'data: {"type":"text-end","id":"text-1"}\n\n' +
        "data: [DONE]\n\n",
    });
  });

  await page.goto("/ai-assistant");

  const input = page.getByLabel("Message Glowi AI");

  await expect(input).toBeVisible();

  await input.fill("What needs my attention right now?");

  const chatForm = input.locator("xpath=ancestor::form");

  await chatForm
    .getByRole("button", { name: /^send/i })
    .click();

  await expect(
    page.getByText("What needs my attention right now?")
  ).toBeVisible();

  await expect(
    page.getByText(/no urgent items right now/i)
  ).toBeVisible();

  await expect(
    page.getByText(/review upcoming deadlines/i)
  ).toBeVisible();
});