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
    await p.goto(base + "#about");
    await p.evaluate(() => document.fonts.ready);
    assert.equal(
      await p
        .locator(".intro-text p")
        .nth(1)
        .locator("br.sentence-break")
        .count(),
      1,
      "explicit sentence break, not CSS-only layout",
    );
    assert.equal(
      await p.locator(".intro-text .keep-together").innerText(),
      "사용 환경에 맞게 활용하는 데 집중합니다.",
    );
    assert.ok(
      (
        await p.locator('link[href^="styles.css"]').getAttribute("href")
      ).includes("?v="),
    );
    assert.equal(await p.locator(".intro-text mark").count(), 2);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base + "#about");
      const phrase = p.locator(".intro-text .keep-together");
      assert.equal(
        await phrase.evaluate((e) => getComputedStyle(e).whiteSpace),
        "nowrap",
      );
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await p.screenshot({
        path: `C:/c/Users/SSAFY/portfolio/.artifacts/sentence-final-${width}.png`,
      });
    }
    for (const id of [
      "vr-museum",
      "pipecheckkk",
      "smart-factory",
      "karaoke-agent",
      "body-measurement",
      "travel-community",
    ]) {
      await p.goto(base + "#project/" + id);
      const checked = await p.evaluate(() => {
        const project = window.PORTFOLIO.projects.find((x) =>
          location.hash.includes(x.id),
        );
        const groups = [
          ["#detail-overview > p", project.overview],
          [
            "#detail-role .contribution-list > li > p",
            project.responsibilities.map((x) => x[1]),
          ],
          [
            "#detail-contribution .contribution-list > li > p",
            project.contributions.map((x) => x[1]),
          ],
          [
            "#detail-ai .contribution-list > li > p",
            project.aiUsage.map((x) => x[1]),
          ],
          [
            "#detail-screens figcaption",
            (project.screens || []).map((x) => x[1]),
          ],
        ];
        return groups.flatMap(([selector, values]) =>
          [...document.querySelectorAll(selector)].map((e, i) => ({
            expected: values[i].trim().split(/(?<=\.)\s+(?=\S)/u).length - 1,
            actual: e.querySelectorAll("br.sentence-break").length,
          })),
        );
      });
      for (const row of checked)
        assert.equal(
          row.actual,
          row.expected,
          id + " detailed contribution sentence breaks",
        );
    }
    await p.goto(base + "#project/karaoke-agent/performance");
    const text = await p.locator("#detail-performance").innerText();
    for (const s of ["13.13초", "4.83초", "Qwen3 1.7B", "8.30초"])
      assert.ok(text.includes(s));
    console.log(
      "PASS explicit line breaks across all six project details, unbroken profile closing phrase at five widths, versioned assets and preserved numbers",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
