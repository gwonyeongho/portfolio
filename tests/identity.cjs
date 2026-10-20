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
    const intro = await p.locator(".intro-text").innerText();
    for (const x of ["SW와 HW", "AI 활용에 강점"])
      assert.ok(intro.includes(x), x);
    for (const x of ["노래방", "유물저장소", "하수도", "특징점 예측", "MATLAB"])
      assert.ok(!intro.includes(x), x + " not activity list");
    await p.goto(base + "#project/pipecheckkk");
    const implementation = await p.locator("#detail-contribution").innerText();
    for (const x of [
      "GPT",
      "Hermes",
      "image_path",
      "edge_status",
      "leftSpeed",
      "rightSpeed",
      "sequence",
      "expiresAt",
      "START",
      "STOP",
      "IMU",
    ])
      assert.ok(implementation.includes(x), x);
    assert.equal(
      await p
        .locator('#detail-screens img[src="assets/pipecheck-exploration.webp"]')
        .count(),
      1,
    );
    const caption = await p.locator("#detail-screens").innerText();
    assert.ok(caption.includes("탐사 중"));
    assert.ok(caption.includes("팀"));
    await p.goto(base + "#project/karaoke-agent/performance");
    assert.equal(
      await p
        .locator("#detail-performance table")
        .first()
        .locator("tbody tr")
        .count(),
      1,
      "latency improvement front and center, no100/100 comparison",
    );
    assert.ok(
      !(
        await p.locator("#detail-performance table").first().innerText()
      ).includes("100%"),
    );
    const text = await p.locator("#detail-performance").innerText();
    assert.ok(text.includes("8.30초"));
    assert.ok(text.includes("5건"));
    console.log(
      "PASS developer identity SW/HW and AI strengths, detailed GPT/Hermes/HTTP driving ownership, team exploration dashboard and change-focused improvements",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
