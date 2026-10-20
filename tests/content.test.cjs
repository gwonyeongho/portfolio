const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const context = { window: {} };
for (const file of ["content.js", "media.js"])
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), context);
const D = context.window.PORTFOLIO;
test("four main projects and two additional projects retain personal scope", () => {
  assert.equal(D.projects.length, 6);
  assert.equal(D.projects.filter((p) => !p.other).length, 4);
  assert.equal(D.projects.filter((p) => p.other).length, 2);
  assert.equal(new Set(D.projects.map((p) => p.id)).size, 6);
  for (const p of D.projects) {
    assert.ok(p.role);
    assert.ok(p.overview.length);
    assert.ok(p.contributions.length >= 3);
    assert.ok(p.tech.length);
    assert.ok(p.retrospective);
    assert.ok(p.problems?.length || p.performance?.length);
    assert.ok(p.responsibilities?.length);
    assert.ok(p.aiUsage?.length);
  }
});
test("all published project images exist", () => {
  for (const p of D.projects) {
    if (p.screens) {
      for (const [, , size] of p.screens) {
        assert.ok(
          size &&
            size.length === 2 &&
            size.every((n) => Number.isInteger(n) && n > 0),
          `${p.id}: intrinsic image size`,
        );
      }
    }
    for (const img of [p.cover, ...(p.screens || []).map((s) => s[0])].filter(
      Boolean,
    )) {
      assert.ok(fs.existsSync(path.join(root, img)), `${p.id}: ${img}`);
    }
  }
});
test("private repositories are not exposed as public links", () => {
  const urls = D.projects.flatMap((p) => p.links.map((l) => l[1]));
  for (const url of urls) {
    assert.ok(!url.includes("/PipeCheckkk"));
    assert.ok(!url.includes("/AI-Artifact-Restoration-VR-Museum"));
    assert.match(url, /^https:\/\/github\.com\/gwonyeongho\//);
  }
});
test("no copied reference identity, personal phone, forbidden prose or separators", () => {
  const content = JSON.stringify(D);
  for (const value of ["오명헌", "myeongHeonn", "axm02191", "뿐 아니라", "·"])
    assert.ok(!content.includes(value), value);
  assert.ok(
    !/\b010[-\s]?\d{4}[-\s]?\d{4}\b/.test(content),
    "no personal phone",
  );
});
test("BONDI does not attribute VR implementation to personal contribution", () => {
  const p = D.projects.find((p) => p.id === "vr-museum");
  assert.ok(!p.role.includes("VR"));
  assert.ok(p.role.includes("유물저장소"));
  assert.ok(p.aiUsage.some(([, text]) => text.includes("사람")));
});
