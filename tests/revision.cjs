const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const base = process.env.PORTFOLIO_URL || "http://127.0.0.1:5508/";
  await p.goto(base + "#project/karaoke-agent");
  await p
    .getByRole("link", { name: "AI 활용", exact: true })
    .waitFor({ timeout: 3000 });
  await p.getByRole("link", { name: "AI 활용", exact: true }).click();
  await p.locator("#detail-ai").waitFor();
  assert.ok((await p.locator("#detail-ai").innerText()).includes("Qwen"));
  await p.getByRole("link", { name: "성능 개선", exact: true }).click();
  await p.locator("#detail-performance").waitFor();
  assert.equal(await p.locator("#detail-troubleshooting").count(), 0);
  assert.ok(
    (await p.locator("#detail-performance").innerText()).includes("4.83"),
  );
  for (const id of [
    "vr-museum",
    "pipecheckkk",
    "smart-factory",
    "body-measurement",
    "travel-community",
  ]) {
    await p.goto(base + "#project/" + id);
    await p.getByRole("link", { name: "AI 활용", exact: true }).waitFor();
    assert.ok((await p.locator("#detail-ai").innerText()).length > 30);
  }
  await p.goto(base + "#skills");
  await p.locator("#skills").waitFor();
  assert.match(await p.locator(".skill-name").first().innerText(), /^C\+\+/);
  assert.equal(await p.locator(".skill-notes").count(), 0);
  const skills = await p.locator("#skills").innerText();
  for (const term of ["Framework", "IMU", "Dobot", "두봇", "Raspberry Pi"])
    assert.ok(!skills.includes(term), term);
  await p.goto(base + "#about");
  const intro = await p.locator(".intro-text").innerText();
  for (const term of ["AI", "프론트엔드", "로봇 제어"])
    assert.ok(intro.includes(term), term);
  assert.ok(!(await p.title()).includes("Robotics"));
  await p.goto(base + "#project/pipecheckkk");
  const pipe = await p.locator("main").innerText();
  for (const term of ["모터값", "하네스", "전복", "경로 이탈"])
    assert.ok(pipe.includes(term), term);
  console.log(
    "PASS revised introduction, C++ first, compact software-only stacks, all 6 AI sections, karaoke performance, source-grounded PipeCheckkk roles",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
