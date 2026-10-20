/* 작은 정적 라우터: GitHub Pages에서도 상세 주소를 직접 열고 새로고침할 수 있습니다. */
(() => {
  "use strict";
  const D = window.PORTFOLIO;
  const main = document.getElementById("main");
  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const detailUrl = (p) => "#project/" + p.id;
  const head = (en, ko) =>
    `<div class="section-head"><p class="eyebrow">${en}</p><h2>${ko}</h2></div>`;
  const tags = (p) =>
    `<div class="tags">${p.tags.map((t) => `<span class="tag">${escape(t)}</span>`).join("")}</div>`;
  const meta = (p) =>
    `<div class="project-meta"><span>${escape(p.period)}${p.duration ? " / " + escape(p.duration) : ""} / ${escape(p.team)}</span><span>담당: ${escape(p.role)}</span></div>`;
  const links = (p) =>
    p.links.length
      ? `<div class="detail-links">${p.links.map(([name, url]) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(name)} ↗</a>`).join("")}</div>`
      : "";
  function meter(level) {
    if (!level) return "";
    return `<span class="skill-meter" role="img" aria-label="활용도 ${level}/5">${Array.from({ length: 5 }, (_, i) => `<i class="${i < level ? "filled" : ""}" aria-hidden="true"></i>`).join("")}</span>`;
  }
  function projectCard(p) {
    return `<article class="project-summary"><a href="${detailUrl(p)}" aria-label="${escape(p.title)} 자세히 보기"><div class="project-thumbnail"><img src="${escape(p.cover)}" alt="${escape(p.title)} 대표 이미지" width="1280" height="720" loading="lazy"></div><div class="project-summary-body"><h3>${escape(p.title)}</h3><p class="project-subtitle">${escape(p.subtitle)}</p>${tags(p)}${meta(p)}<span class="project-arrow">자세히 보기 →</span></div></a></article>`;
  }
  function otherProject(p) {
    return `<article class="other-project"><div class="other-title"><h3><a href="${detailUrl(p)}">${escape(p.title)}</a></h3>${p.links.map(([label, url]) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>`).join("")}</div><p>${escape(p.subtitle)}</p>${meta(p)}<a href="${detailUrl(p)}" class="project-arrow">자세히 보기 →</a></article>`;
  }
  function home() {
    document.title = `${D.name} | ${D.role}`;
    return `<section class="container about" id="about"><div class="hero-layout"><div class="hero-copy"><p class="hero-motto">생각을 동작으로</p><p class="motto-note">모델의 출력에서 실제 사용까지</p><h1>${D.headline.map((s) => `<span>${escape(s)}</span>`).join("")}</h1><div class="intro-text">${D.introduction.map((p) => `<p>${p}</p>`).join("")}</div><dl class="contact-list"><dt>Email</dt><dd><a href="mailto:${escape(D.email)}">${escape(D.email)}</a></dd><dt>GitHub</dt><dd><a href="${D.github}" target="_blank" rel="noopener noreferrer">github.com/gwonyeongho</a></dd></dl></div><img class="hero-photo" src="profile.webp" alt="권영호 프로필 사진" width="176" height="226"></div></section>
    <section class="history-band" aria-label="이력과 자격증 및 수상"><div class="container history-grid"><div>${head("History", "이력")}<ol class="timeline">${D.history.map(([date, title, note]) => `<li><time>${escape(date)}</time><strong>${escape(title)}</strong><p>${escape(note)}</p></li>`).join("")}</ol></div><div>${head("Certificates &amp; Awards", "자격증 &amp; 수상")}${[
      ["자격증", D.certificates],
      ["수상", D.awards],
    ]
      .map(
        ([title, items]) =>
          `<div class="credential-group"><h3>${title}</h3><ul class="credential-list">${items.map(([name, date]) => `<li><span>${escape(name)}</span>${date ? `<time>${escape(date)}</time>` : ""}</li>`).join("")}</ul></div>`,
      )
      .join("")}</div></div></section>
    <section class="container section" id="skills">${head("Tech Stack", "기술 스택")}<div class="skill-table">${D.skills.map((group) => `<div class="skill-group"><h3>${escape(group.category)}</h3><ul class="skill-rows skill-list-compact">${group.items.map((s) => `<li class="skill-row skill-compact"><div class="skill-identity"><span class="skill-name">${escape(s.name)}</span>${meter(s.level)}</div></li>`).join("")}</ul></div>`).join("")}</div></section>
    <section class="projects-section" id="projects"><div class="container section">${head("Projects", "프로젝트")}<div class="project-grid">${D.projects
      .filter((p) => !p.other)
      .map(projectCard)
      .join("")}</div><h3 class="other-heading">그 외 프로젝트</h3>${D.projects
      .filter((p) => p.other)
      .map(otherProject)
      .join("")}</div></section>`;
  }
  function detail(p) {
    document.title = `${p.title} | ${D.name} 포트폴리오`;
    const next = D.projects[(D.projects.indexOf(p) + 1) % D.projects.length];
    const sections = [
      ["overview", "프로젝트 개요"],
      ["role", "담당 역할"],
      ["contribution", "기여 및 기술"],
      ["problems", "해결 문제"],
      ["ai", "AI 활용"],
      ["screens", "주요 화면"],
    ];
    const list = (items) =>
      `<ul class="contribution-list">${items.map(([title, description]) => `<li><h3>${escape(title)}</h3><p>${escape(description)}</p></li>`).join("")}</ul>`;
    return `<article class="container detail-page"><a href="#projects" class="back-link">← 프로젝트 목록으로 돌아가기</a><header class="detail-header"><p class="eyebrow">Project Detail</p><h1>${escape(p.title)}</h1><p class="detail-lead">${escape(p.subtitle)}</p><dl class="detail-meta"><div><dt>개발 기간</dt><dd>${escape(p.period)}${p.duration ? " (" + escape(p.duration) + ")" : ""}</dd></div><div><dt>개발 인원</dt><dd>${escape(p.team)}</dd></div><div><dt>담당 역할</dt><dd>${escape(p.role)}</dd></div></dl>${links(p)}</header>
    <nav class="detail-nav" aria-label="프로젝트 상세 목차">${sections.map(([id, title]) => `<a href="#project/${p.id}/${id}">${title}</a>`).join("")}</nav>
    <section class="detail-section" id="detail-overview"><h2>프로젝트 개요</h2>${p.overview.map((t) => `<p>${escape(t)}</p>`).join("")}${p.award ? `<div class="detail-award">팀 프로젝트 수상<strong>${escape(p.award)}</strong></div>` : ""}</section>
    <section class="detail-section" id="detail-role"><h2>담당 역할</h2>${list(p.responsibilities)}</section>
    <section class="detail-section" id="detail-contribution"><h2>기여 및 기술</h2>${list(p.contributions)}<table class="tech-table"><thead><tr><th scope="col">구현 영역</th><th scope="col">사용 기술</th></tr></thead><tbody>${p.tech.map(([area, tech]) => `<tr><th scope="row">${escape(area)}</th><td>${escape(tech)}</td></tr>`).join("")}</tbody></table></section>
    <section class="detail-section" id="detail-problems"><h2>해결 문제</h2><div class="problem-cards">${p.problems.map((t) => `<article class="problem-card"><h3>${escape(t.title)}</h3><dl>${t.rows.map(([label, bullets]) => `<div class="problem-row"><dt>${escape(label)}</dt><dd><ul>${bullets.map((text) => `<li>${escape(text)}</li>`).join("")}</ul></dd></div>`).join("")}</dl></article>`).join("")}</div>
    ${p.performance?.length ? `<div id="detail-performance"><h3 class="performance-heading">성능 개선</h3>${p.performance.map((t) => `<article class="performance-card"><h3>${escape(t.title)}</h3><dl class="performance-summary">${t.rows.map(([label, text]) => `<div class="problem-row"><dt>${escape(label)}</dt><dd>${escape(text)}</dd></div>`).join("")}</dl><div class="table-scroll" role="region" aria-label="${escape(t.title)} 비교 표" tabindex="0"><table class="benchmark-table"><caption class="visually-hidden">${escape(t.title)}</caption><thead><tr>${t.headers.map((label) => `<th scope="col">${escape(label)}</th>`).join("")}</tr></thead><tbody>${t.tableRows.map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${escape(cell)}</th>` : `<td${i === row.length - 1 ? ' class="selected-method"' : ""}>${escape(cell)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div><div class="benchmark-notes"><h4>측정 조건</h4><ul>${t.conditions.map((text) => `<li>${escape(text)}</li>`).join("")}</ul></div><div class="benchmark-verdict"><strong>개선 결과</strong><span>${escape(t.conclusion)}</span></div><div class="benchmark-notes measurement-limits"><h4>평가 범위</h4><ul>${t.limits.map((text) => `<li>${escape(text)}</li>`).join("")}</ul></div></article>`).join("")}</div>` : ""}</section>
    <section class="detail-section" id="detail-ai"><h2>AI 활용</h2>${list(p.aiUsage)}</section>
    <section class="detail-section" id="detail-screens"><h2>주요 화면</h2>${p.screens?.length ? `<div class="screen-gallery">${p.screens.map(([src, caption, size]) => `<figure><img src="${escape(src)}" alt="${escape(caption)}" width="${size[0]}" height="${size[1]}" loading="lazy"><figcaption>${escape(caption)}</figcaption></figure>`).join("")}</div>` : `<p>별도로 공개된 화면 자료는 없습니다.</p>${links(p)}`}</section>
    <a href="${detailUrl(next)}" class="next-project"><div><small>다음 프로젝트</small><strong>${escape(next.title)}</strong></div><span aria-hidden="true">→</span></a></article>`;
  }
  let currentProject = null;
  function route() {
    const parts = location.hash.slice(1).split("/");
    const p =
      parts[0] === "project" && D.projects.find((p) => p.id === parts[1]);
    if (p) {
      if (currentProject !== p.id) {
        main.innerHTML = detail(p);
        currentProject = p.id;
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      if (parts[2])
        requestAnimationFrame(() =>
          document
            .getElementById(
              "detail-" +
                ({
                  technology: "contribution",
                  troubleshooting: "problems",
                  retrospective: "problems",
                }[parts[2]] || parts[2]),
            )
            ?.scrollIntoView({ behavior: "instant", block: "start" }),
        );
    } else {
      if (currentProject !== "home") {
        main.innerHTML = home();
        currentProject = "home";
      }
      const anchor = document.getElementById(parts[0]);
      if (anchor && ["about", "skills", "projects"].includes(parts[0]))
        requestAnimationFrame(() =>
          anchor.scrollIntoView({ behavior: "instant", block: "start" }),
        );
    }
    document.querySelectorAll(".site-header nav a").forEach((a) => {
      const active = p
        ? a.hash === "#projects"
        : a.hash === (location.hash || "#about");
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  function enter(immediate = false) {
    if (intro.hidden || intro.classList.contains("is-closing")) return;
    site.inert = false;
    document.body.classList.remove("is-entry");
    if (immediate) intro.hidden = true;
    else {
      intro.classList.add("is-closing");
      intro.setAttribute("aria-hidden", "true");
      document.getElementById("main").focus({ preventScroll: true });
      setTimeout(() => (intro.hidden = true), 460);
    }
  }
  document
    .getElementById("intro-enter")
    .addEventListener("click", () => enter());
  document.querySelector(".skip-link").addEventListener("click", (event) => {
    event.preventDefault();
    main.focus();
  });
  window.addEventListener("hashchange", () => {
    enter(true);
    route();
  });
  document.addEventListener("keydown", (event) => {
    if (!intro.hidden && event.key === "Escape") enter();
  });
  route();
  if (location.hash) enter(true);
  else document.body.classList.add("is-entry");
})();
