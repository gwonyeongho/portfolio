const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch();
  try {
    const p = await b.newPage({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: "reduce",
      }),
      base = process.env.PORTFOLIO_URL || "http://127.0.0.1:5508/";
    for (const width of [1440, 390, 320]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base + "#project/pipecheckkk/contribution");
      const panel = p.locator(".tech-panel");
      assert.equal(
        await panel
          .locator(".tech-summary")
          .evaluate((e) => getComputedStyle(e).display),
        "flex",
        "PipeCheckkk uses one continuous wrapping tag flow",
      );
      assert.equal(await p.locator(".tech-panel--inline").count(), 1);
      const expected = await p.evaluate(() =>
        window.PORTFOLIO.projects
          .find((x) => x.id === "pipecheckkk")
          .tech.flatMap(([, s]) => s.split(/\s+\/\s+/)),
      );
      assert.deepEqual(
        await panel.locator(".tech-chip").allTextContents(),
        expected,
      );
      for (const dt of await panel.locator("dt").all()) {
        assert.equal(
          await dt.evaluate((e) => getComputedStyle(e).position),
          "absolute",
        );
        assert.equal(
          await dt.evaluate((e) => getComputedStyle(e).width),
          "1px",
        );
      }
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await panel.evaluate((e) =>
        window.scrollTo({
          top: e.getBoundingClientRect().top + scrollY - 140,
          behavior: "instant",
        }),
      );
      await p.screenshot({
        path: `C:/c/Users/SSAFY/portfolio/.artifacts/pipe-inline-tech-${width}.png`,
      });
    }
    for (const id of [
      "vr-museum",
      "smart-factory",
      "karaoke-agent",
      "body-measurement",
      "travel-community",
    ]) {
      await p.goto(base + "#project/" + id + "/contribution");
      assert.equal(
        await p.locator(".tech-panel--inline").count(),
        0,
        id + " unchanged",
      );
      assert.equal(
        await p
          .locator(".tech-summary")
          .evaluate((e) => getComputedStyle(e).display),
        "grid",
      );
    }
    console.log(
      "PASS only PipeCheckkk has flat continuous tech tags with labels visually hidden; values, responsive fit and all other projects preserved",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
