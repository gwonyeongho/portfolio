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
      for (const id of [
        "vr-museum",
        "pipecheckkk",
        "smart-factory",
        "karaoke-agent",
        "body-measurement",
        "travel-community",
      ]) {
        await p.goto(base + "#project/" + id + "/contribution");
        assert.equal(
          await p.locator("#detail-contribution .technology-rows").count(),
          0,
        );
        assert.equal(
          await p.locator("#detail-contribution .detail-table").count(),
          1,
        );
        const expected = await p.evaluate(
          (id) => window.PORTFOLIO.projects.find((x) => x.id === id).tech,
          id,
        );
        assert.equal(
          await p.locator("#detail-contribution .tech-summary > div").count(),
          expected.length,
        );
        const chips = p.locator("#detail-contribution .tech-chip");
        assert.ok((await chips.count()) > 0);
        for (const [area, tech] of expected) {
          assert.ok(
            (await p.locator(".tech-summary").innerText()).includes(area),
          );
          for (const value of tech.split(/\s+\/\s+/))
            assert.ok((await chips.allTextContents()).includes(value), value);
        }
        assert.ok(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        if (id === "karaoke-agent") {
          await p
            .locator(".tech-panel")
            .evaluate((e) =>
              window.scrollTo({
                top: e.getBoundingClientRect().top + scrollY - 140,
                behavior: "instant",
              }),
            );
          await p.screenshot({
            path: `C:/c/Users/SSAFY/portfolio/.artifacts/compact-tech-${width}.png`,
          });
        }
      }
    }
    await p.goto(base + "#about");
    await p.evaluate(() => document.fonts.ready);
    assert.equal(await p.locator(".brand").innerText(), "Yeongho Gwon");
    assert.equal(await p.locator(".badge-en").innerText(), "Yeongho Gwon");
    assert.equal(
      await p
        .locator("mark")
        .first()
        .evaluate((e) => getComputedStyle(e).backgroundImage),
      "none",
    );
    assert.equal(
      await p
        .locator("mark")
        .first()
        .evaluate((e) => getComputedStyle(e).backgroundColor),
      "rgb(255, 240, 201)",
    );
    await p.screenshot({
      path: "C:/c/Users/SSAFY/portfolio/.artifacts/highlight-gwon-320.png",
    });
    console.log(
      "PASS tech chips outside tables with every existing value, Gwon spelling, full-height highlight and no overflow at3widths",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
