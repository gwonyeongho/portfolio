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
        await p.goto(base + "#project/" + id);
        for (const section of ["role", "contribution"]) {
          const table = p.locator("#detail-" + section + " table");
          assert.equal(
            await table.count(),
            1,
            id + " " + section + " has a single two-column table",
          );
          assert.deepEqual(await table.locator("thead th").allTextContents(), [
            "항목",
            "설명",
          ]);
          const rows = await p.evaluate(
            ({ id, section }) => {
              const project = window.PORTFOLIO.projects.find(
                  (x) => x.id === id,
                ),
                data =
                  section === "role"
                    ? project.responsibilities
                    : project.contributions;
              return data;
            },
            { id, section },
          );
          assert.equal(
            await table.locator(".implementation-rows tr").count(),
            rows.length,
          );
          for (let i = 0; i < rows.length; i++) {
            const cells = table
              .locator(".implementation-rows tr")
              .nth(i)
              .locator("th,td");
            assert.equal(await cells.count(), 2);
            assert.equal(await cells.first().innerText(), rows[i][0]);
            assert.equal(
              (await cells.nth(1).innerText()).replace(/\s+/g, " ").trim(),
              rows[i][1].replace(/\s+/g, " ").trim(),
            );
          }
        }
        assert.ok(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          id + " " + width + " overflow",
        );
        if (id === "vr-museum") {
          await p
            .locator("#detail-role")
            .evaluate((e) =>
              window.scrollTo({
                top: e.getBoundingClientRect().top + scrollY - 90,
                behavior: "instant",
              }),
            );
          await p.screenshot({
            path: `C:/c/Users/SSAFY/portfolio/.artifacts/role-table-${width}.png`,
          });
          await p
            .locator("#detail-contribution")
            .evaluate((e) =>
              window.scrollTo({
                top: e.getBoundingClientRect().top + scrollY - 90,
                behavior: "instant",
              }),
            );
          await p.screenshot({
            path: `C:/c/Users/SSAFY/portfolio/.artifacts/contribution-table-${width}.png`,
          });
        }
      }
    }
    await p.goto(base + "#project/karaoke-agent/performance");
    assert.equal(
      await p.locator("#detail-performance .benchmark-notes").count(),
      0,
    );
    const text = await p.locator("#detail-performance").innerText();
    for (const s of ["측정 조건", "평가 범위"]) assert.ok(!text.includes(s));
    for (const s of ["13.13초", "4.83초", "81.5%", "27/27", "개선 결과"])
      assert.ok(text.includes(s));
    console.log(
      "PASS all six responsibility/contribution two-column tables preserve text and fit3widths; karaoke has no conditions/scope sections and retains comparison/results",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
