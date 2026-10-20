const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch();
  try {
    const p = await b.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    const base = process.env.PORTFOLIO_URL || "http://127.0.0.1:5508/";
    await p.goto(base + "#project/karaoke-agent/problems");
    assert.equal(
      await p.locator("#detail-performance table").count(),
      2,
      "two actual benchmark comparison tables",
    );
    const text = await p.locator("#detail-performance").innerText();
    for (const s of ["13.13초", "4.83초", "4.55초", "81.5%", "22/27", "27/27"])
      assert.ok(text.includes(s), s);
    assert.equal(
      await p.locator("#detail-performance .benchmark-notes").count(),
      0,
    );
    for (const label of ["측정 조건", "평가 범위"])
      assert.ok(!text.includes(label));
    for (const id of [
      "vr-museum",
      "pipecheckkk",
      "smart-factory",
      "body-measurement",
      "travel-community",
    ]) {
      await p.goto(base + "#project/" + id + "/problems");
      assert.ok(
        await p.locator("#detail-problems .problem-card").count(),
        id + " short problem cards",
      );
      const cards = p.locator("#detail-problems .problem-card");
      for (let i = 0; i < (await cards.count()); i++) {
        const c = cards.nth(i);
        assert.deepEqual(await c.locator("dt").allTextContents(), [
          "문제",
          "적용한 해결",
          "확인한 결과",
        ]);
        assert.ok((await c.locator("li").count()) >= 3);
        assert.equal(await c.locator("p").count(), 0);
      }
    }
    await p.goto(base + "#project/vr-museum/problems");
    assert.match(
      await p.locator(".problem-card").first().innerText(),
      /팀 내부.*웹/,
    );
    for (const width of [1440, 390, 320]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base + "#project/karaoke-agent/problems");
      const overflow = await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      assert.equal(overflow, false, width + " viewport overflow");
      const table = p.locator("#detail-performance table").first();
      await table.scrollIntoViewIfNeeded();
      await p.screenshot({
        path: `C:/c/Users/SSAFY/portfolio/.artifacts/performance-table-${width}.png`,
      });
    }
    console.log(
      "PASS two scoped performance tables, all problem sections use labeled bullets, internal BONDI web explicit, no desktop/mobile overflow",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
