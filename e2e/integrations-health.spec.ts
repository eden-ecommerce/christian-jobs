import { expect, test } from "@playwright/test";

type IntegrationCheck = {
  ok: boolean;
  detail?: string;
  status?: number;
  hitCount?: number;
};

type IntegrationsHealthResponse = {
  status: "ok" | "degraded";
  timestamp: string;
  sanityProjectId?: string;
  sanityDataset?: string;
  checks: {
    sanityHeader: IntegrationCheck;
    sanityFooter: IntegrationCheck;
    edenUserBeacon: IntegrationCheck;
    algoliaProducts: IntegrationCheck;
    algoliaOrganisationHub: IntegrationCheck;
  };
};

test.describe("integration health", () => {
  test("GET /api/integrations/health reports all checks passing", async ({ request }) => {
    const response = await request.get("/api/integrations/health");
    expect(response.status()).toBe(200);

    const body = (await response.json()) as IntegrationsHealthResponse;

    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeTruthy();
    const expectedProjectId =
      process.env.EDEN_SANITY_PROJECT_ID ?? "dc9143c3dc8ee44506ba";
    const expectedDataset = process.env.EDEN_SANITY_DATASET ?? "next-eden";
    expect(body.sanityProjectId).toBe(expectedProjectId);
    expect(body.sanityDataset).toBe(expectedDataset);

    for (const [name, check] of Object.entries(body.checks)) {
      expect(check.ok, `${name} failed: ${check.detail ?? "unknown"}`).toBe(true);
    }
  });

  test("/sandbox shows Sanity header and footer loaded", async ({ page }) => {
    await page.goto("/sandbox");

    await expect(
      page.getByRole("heading", { name: "Integration health check" }),
    ).toBeVisible();

    await expect(page.getByTestId("status-row-header-loaded-value")).toHaveText("yes");
    await expect(page.getByTestId("status-row-footer-loaded-value")).toHaveText("yes");
  });
});
