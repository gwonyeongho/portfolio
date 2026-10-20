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
    const intro = p.locator(".intro-text p").nth(1);
    assert.equal(
      await intro.locator(".prose-sentence").count(),
      2,
      "each main-profile sentence starts on its own line",
    );
    assert.equal(
      await intro
        .locator(".prose-sentence")
        .first()
        .evaluate((e) => getComputedStyle(e).display),
      "block",
    );
    assert.equal(
      await intro
        .locator(".prose-sentence")
        .first()
        .evaluate((e) => getComputedStyle(e).textWrap),
      "balance",
    );
    assert.equal(await intro.locator('.prose-sentence').first().evaluate(e=>getComputedStyle(e).overflowWrap),'normal','profile words must not split mid-word');
    assert.equal(
      await p.locator(".intro-text mark").count(),
      2,
      "highlight markup preserved",
    );
    const href = await p
      .locator(".contact-list a")
      .first()
      .getAttribute("href");
    assert.ok(href.startsWith("mailto:"));
    for (const width of [1440, 1024, 768, 390, 320]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base + "#about");
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      const box = await intro.locator(".prose-sentence").first().boundingBox(),
        second = await intro.locator(".prose-sentence").nth(1).boundingBox();
      assert.ok(second.y >= box.y + box.height - 1);
      await p.screenshot({
        path: `C:/c/Users/SSAFY/portfolio/.artifacts/linebreak-profile-${width}.png`,
      });
    }
    await p.goto(base + "#project/pipecheckkk/contribution");
    const sentenceCount = await p
      .locator("#detail-contribution .prose-sentence")
      .count();
    assert.ok(sentenceCount > 6);
    assert.ok(
      (await p.locator("#detail-contribution").innerText()).includes(
        "vl_pilot.py",
      ),
    );
    await p.goto(base + "#project/karaoke-agent/performance");
    const text = await p.locator("#detail-performance").innerText();
    for (const term of ["13.13초", "4.83초", "4.55초", "Qwen3 1.7B", "8.30초"])
      assert.ok(text.includes(term), term + " stays intact");
    console.log(
      "PASS sentence-based prose lines, balanced profile at five viewports, highlights and links preserved, decimal/version/file names intact",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
