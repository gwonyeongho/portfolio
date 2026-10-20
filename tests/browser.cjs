const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = process.env.PORTFOLIO_URL || "http://127.0.0.1:5508/";
const output = path.resolve(__dirname, "../.artifacts");
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [],
    badResponses = [],
    checks = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().startsWith(base.split("#")[0]) && r.status() >= 400)
      badResponses.push({ url: r.url(), status: r.status() });
  });
  async function images() {
    const broken = await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      imgs.forEach((i) => (i.loading = "eager"));
      return (
        await Promise.all(
          imgs.map(async (i) => {
            try {
              await i.decode();
              return null;
            } catch {
              return i.getAttribute("src");
            }
          }),
        )
      ).filter(Boolean);
    });
    assert.deepEqual(broken, [], "all page images load");
  }
  async function noOverflow(label) {
    const size = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      innerWidth,
    ]);
    assert.ok(size[0] <= size[1], `${label}: overflow ${size}`);
    checks.push(label);
  }
  await page.goto(base);
  await page.getByRole("button", { name: "포트폴리오로 들어가기" }).waitFor();
  await page.screenshot({ path: path.join(output, "entry-desktop.png") });
  await page.getByRole("button", { name: "포트폴리오로 들어가기" }).click();
  await page.waitForSelector("#intro[hidden]", { state: "attached" });
  await images();
  assert.equal(await page.locator(".project-summary").count(), 4);
  assert.equal(await page.locator(".other-project").count(), 2);
  await page.screenshot({ path: path.join(output, "about-desktop.png") });
  const ids = await page.evaluate(() =>
    window.PORTFOLIO.projects.map((p) => p.id),
  );
  assert.equal(ids.length, 6);
  await page.goto(base + "#project/karaoke-agent");
  await page.locator(".detail-page h1").waitFor();
  const projectHeading = await page.locator(".detail-page h1").innerText();
  const projectHash = await page.evaluate(() => location.hash);
  await page.locator(".skip-link").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  assert.equal(
    await page.evaluate(() => location.hash),
    projectHash,
    "keyboard skip activation preserves the project route",
  );
  assert.equal(
    await page.locator(".detail-page h1").innerText(),
    projectHeading,
    "keyboard skip activation preserves the project heading",
  );
  assert.ok(
    await page.evaluate(
      () => document.activeElement === document.querySelector("main"),
    ),
    "keyboard skip activation focuses main",
  );
  await page.goto(base + "#project/vr-museum/technology");
  await images();
  await page.waitForFunction(() => {
    const top = document
      .getElementById("detail-contribution")
      ?.getBoundingClientRect().top;
    return top >= 50 && top <= 170;
  });
  for (const w of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const section of ["about", "skills", "projects"]) {
      await page.goto(base + "#" + section);
      await page.locator("#" + section).waitFor();
      await images();
      await noOverflow(`${w}/${section}`);
      if (w === 1440 || w === 390)
        await page.screenshot({
          path: path.join(output, `${section}-${w}.png`),
        });
    }
    for (const id of ids) {
      await page.goto(base + "#project/" + id);
      await page.locator(".detail-page h1").waitFor();
      await images();
      await noOverflow(`${w}/${id}`);
      const text = await page.locator("main").innerText();
      for (const label of [
        "프로젝트 개요",
        "담당 역할",
        "기여 및 기술",
        "해결 문제",
        "AI 활용",
        "주요 화면",
      ])
        assert.ok(text.includes(label), `${id}: ${label}`);
      if (w === 1440 || w === 390)
        await page.screenshot({ path: path.join(output, `${id}-${w}.png`) });
      if (w === 1440) {
        await page
          .getByRole("link", { name: "기여 및 기술", exact: true })
          .click();
        await page.waitForFunction(() => {
          const top = document
            .getElementById("detail-contribution")
            ?.getBoundingClientRect().top;
          return (
            location.hash.endsWith("/contribution") && top >= 50 && top <= 170
          );
        });
        await page.screenshot({
          path: path.join(output, `${id}-technology.png`),
        });
      }
    }
  }
  await page.goto(base + "#project/karaoke-agent");
  await page.reload();
  await page.locator(".detail-page h1").waitFor();
  assert.ok(
    (await page.locator(".detail-page h1").innerText()).includes("Karaoke"),
  );
  await page
    .getByRole("link", { name: "← 프로젝트 목록으로 돌아가기" })
    .click();
  await page.locator("#projects").waitFor();
  await page.goBack();
  await page.locator(".detail-page h1").waitFor();
  assert.equal(errors.length, 0, errors.join("\n"));
  assert.deepEqual(badResponses, [], "no missing local assets");
  const result = {
    base,
    projectCount: ids.length,
    mainProjects: 4,
    otherProjects: 2,
    responsiveChecks: checks.length,
    checks,
    jsErrors: errors,
    missingAssets: badResponses,
    detailReload: true,
    backNavigation: true,
    keyboardSkipPreservesProjectRouteAndFocus: true,
  };
  fs.writeFileSync(
    path.join(output, "browser-results.json"),
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
