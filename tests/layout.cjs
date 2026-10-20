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
    const expected = [
      "프로젝트 개요",
      "담당 역할",
      "기여 및 기술",
      "해결 문제",
      "AI 활용",
      "주요 화면",
    ];
    for (const id of [
      "vr-museum",
      "pipecheckkk",
      "smart-factory",
      "karaoke-agent",
      "body-measurement",
      "travel-community",
    ]) {
      await p.goto(base + "#project/" + id);
      assert.deepEqual(
        await p.locator(".detail-section > h2").allTextContents(),
        expected,
        id + " section order",
      );
      assert.deepEqual(
        await p.locator(".detail-nav a").allTextContents(),
        expected,
        id + " nav order",
      );
      assert.equal(await p.locator(".flow").count(), 0);
      assert.ok(!(await p.locator("main").innerText()).includes("Pydantic"));
      const role = await p.locator("#detail-role").innerText();
      assert.ok(role.length > 40);
      assert.ok(!role.includes("맡은 문제"));
      if (id === "vr-museum") {
        assert.ok(role.includes("인프라"));
        assert.ok(role.includes("방향 점검 Agent"));
        assert.ok(!role.includes("VLM"));
        assert.ok(
          !(await p.locator("main").innerText()).includes("트러블슈팅"),
        );
        assert.equal(
          await p
            .locator('#detail-screens img[src="assets/bondi-comparison.webp"]')
            .count(),
          1,
        );
      }
      if (id === "karaoke-agent") {
        assert.equal(
          await p.locator("#detail-problems #detail-performance").count(),
          1,
        );
        assert.ok(
          (await p.locator("#detail-performance").innerText()).includes(
            "13.13",
          ),
        );
      }
      assert.equal(await p.locator(".detail-cover").count(), 0);
    }
    await p.goto(base + "#about");
    const intro = await p.locator(".intro-text").innerText();
    for (const term of ["AI", "Agent", "SW와 HW", "AI 활용에 강점"])
      assert.ok(intro.includes(term), term);
    for (const term of ["노래방", "유물저장소", "하수도", "프로젝트"])
      assert.ok(!intro.includes(term), term);
    await p.goto(base + "#skills");
    const skills = await p.locator("#skills").innerText();
    assert.ok(skills.includes("RAG"));
    assert.ok(skills.includes("MATLAB / Simulink"));
    assert.ok(!skills.includes("Pydantic"));
    assert.match(await p.locator(".skill-name").first().innerText(), /^C\+\+/);
    console.log(
      "PASS exact six-section order and navigation in all six projects, concrete roles, BONDI comparison and no troubleshooting, nested karaoke performance, discipline-based intro and updated stacks",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
