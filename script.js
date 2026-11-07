(async () => {
  "use strict";

  const D = window.PORTFOLIO;
  try {
    const res = await fetch("content.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    const content = await res.json();
    D.now = content.now;
    D.projects = content.projects || [];
  } catch (_) {
    D.now = { updated: "", items: [] };
    D.projects = [];
  }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^(https?:|mailto:|tel:|[\w./-]+$)/i.test(u) ? esc(u) : "#");

  const ICONS = {
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4m0 0l-5.5 5.5M12 11.5l5.5 5.5"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
    shield: '<path d="M12 2L4 5.5v6c0 5 3.4 8.8 8 10.5 4.6-1.7 8-5.5 8-10.5v-6L12 2z"/><path d="M9 12l2 2 4-4"/>',
    code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    cloud: '<path d="M7 18a4.5 4.5 0 1 1 .9-8.9A6 6 0 0 1 19.5 11 3.5 3.5 0 0 1 18 18H7z"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    linkedin: '<path d="M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.8v1.6c.7-1.2 2-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20h-4v-5.6c0-1.3 0-2.9-1.8-2.9S14 12.8 14 14.3V20h-4z"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>'
  };
  const icon = (n, s = 20) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  const watch = (root = document) =>
    $$(".reveal:not(.in)", root).forEach((el, i) => {
      if (!io) return el.classList.add("in");
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${Math.min(i % 6, 5) * 70}ms`);
      io.observe(el);
    });
  const wrap = (html, extra = "") => `<div class="reveal ${extra}">${html}</div>`;

  /* ---------- Hero ---------- */
  function renderHero() {
    const p = D.profile;
    $("#heroName").textContent = p.name;
    $("#heroSummary").textContent = p.summary;
    $("#logoMark").textContent = p.initials;
    const av = $("#availability");
    av.classList.toggle("off", !p.available);
    $("#availabilityText").textContent = p.availableText;
    $("#cvEn").href = p.cv.en;
    $("#cvFr").href = p.cv.fr;
    $("#heroSocials").innerHTML = [
      ["github", `https://github.com/${p.github}`, "GitHub"],
      ["linkedin", p.linkedin, "LinkedIn"],
      ["mail", `mailto:${p.email}`, "Email"]
    ].map(([i, u, l]) => `<a class="social" href="${safeUrl(u)}" target="_blank" rel="noopener" aria-label="${l}" title="${l}">${icon(i, 18)}</a>`).join("");
    $("#year").textContent = new Date().getFullYear();
    $("#ghProfileLink").href = `https://github.com/${p.github}?tab=repositories`;

    typeRoles(p.typing);
    runTerminal();
  }

  function typeRoles(list) {
    const el = $("#typing");
    if (reduceMotion) { el.textContent = list[0]; return; }
    let i = 0, j = 0, del = false;
    (function tick() {
      const word = list[i];
      el.textContent = word.slice(0, j);
      let wait = del ? 35 : 70;
      if (!del && j === word.length) { del = true; wait = 1600; }
      else if (del && j === 0) { del = false; i = (i + 1) % list.length; wait = 350; }
      else j += del ? -1 : 1;
      setTimeout(tick, wait);
    })();
  }

  function runTerminal() {
    const p = D.profile;
    const body = $("#terminalBody");
    const kv = (k, v) => `<span class="t-key">${esc(k)}</span>: <span class="t-val">${esc(v)}</span>`;
    const script = [
      { cmd: "whoami", out: [`<span class="t-ok">${esc(p.name)}</span>`] },
      { cmd: "cat profile.yml", out: [kv("role", p.role), kv("location", p.location), kv("status", p.available ? "available ✔" : "busy")] },
      { cmd: "ls ~/skills", out: [D.skills.map((s) => s.group.toLowerCase()).join("  ")] },
      { cmd: "./now.sh", out: D.now.items.map((n) => `<span class="t-dim">[${esc(n.title.toLowerCase())}]</span> ${esc(n.headline)}`) }
    ];
    const prompt = '<span class="t-ps">yassine@portfolio</span>:<span class="t-key">~</span>$ ';
    if (reduceMotion) {
      body.innerHTML = script.map((s) => `${prompt}<span class="t-cmd">${s.cmd}</span>\n${s.out.join("\n")}\n`).join("");
      return;
    }
    let html = "";
    (async function play() {
      for (const s of script) {
        for (let k = 0; k <= s.cmd.length; k++) {
          body.innerHTML = `${html}${prompt}<span class="t-cmd">${s.cmd.slice(0, k)}</span><span class="caret"></span>`;
          await sleep(55);
        }
        await sleep(250);
        html += `${prompt}<span class="t-cmd">${s.cmd}</span>\n${s.out.join("\n")}\n`;
        body.innerHTML = html;
        await sleep(450);
      }
      body.innerHTML = `${html}${prompt}<span class="caret"></span>`;
    })();
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Stats ---------- */
  function renderStats() {
    $("#statsGrid").innerHTML = D.stats
      .map((s) => `<div class="stat reveal"><div class="stat-value" data-to="${s.value}" data-suffix="${esc(s.suffix || "")}">0${esc(s.suffix || "")}</div><div class="stat-label">${esc(s.label)}</div></div>`)
      .join("");
    const counter = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        counter.unobserve(e.target);
        const el = e.target, to = +el.dataset.to, suf = el.dataset.suffix;
        if (reduceMotion) { el.textContent = to + suf; return; }
        const t0 = performance.now(), dur = 1400;
        (function step(t) {
          const k = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf;
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.6 });
    $$(".stat-value").forEach((el) => counter.observe(el));
  }

  /* ---------- Now ---------- */
  function renderNow() {
    const d = new Date(D.now.updated + "T00:00:00");
    $("#nowUpdated").textContent = isNaN(d) ? "" : `Updated ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
    $("#nowGrid").innerHTML = D.now.items
      .map((n) => wrap(`
        <article class="card now-card" data-kind="${esc(n.kind)}">
          <div class="now-label"><span class="pulse"></span>${esc(n.title)}</div>
          <h3>${esc(n.headline)}</h3>
          <p>${esc(n.text)}</p>
          <div class="chips">${(n.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        </article>`))
      .join("");
  }

  /* ---------- About ---------- */
  function renderAbout() {
    const a = D.about, p = D.profile;
    $("#aboutBody").innerHTML =
      a.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("") +
      `<div class="facts">${a.facts.map((f) => `<div class="card fact"><b>${esc(f.label)}</b><span>${esc(f.value)}</span></div>`).join("")}</div>` +
      `<div class="langs">${p.languages.map((l) => `<div class="lang">${esc(l.name)}<span>${esc(l.level)}</span></div>`).join("")}</div>`;
  }

  /* ---------- Experience ---------- */
  function renderTimeline() {
    $("#timeline").innerHTML = D.experience
      .map((x, i) => {
        const badge = x.current ? '<span class="badge current">Current</span>' : x.education ? '<span class="badge edu">Education</span>' : "";
        const areas = x.areas.length
          ? `<div class="areas">${x.areas.map((a) => `<div class="area"><h4>${esc(a.title)}</h4><ul>${a.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}</div>`
          : "";
        return `
        <div class="tl-item reveal ${x.current ? "current open" : ""}">
          <div class="card">
            <button class="tl-toggle" aria-expanded="${x.current}" aria-controls="tl-${i}">
              <div>
                <div class="tl-org">${esc(x.org)}</div>
                <div class="tl-role">${esc(x.role)}</div>
                <div class="tl-meta"><span class="tl-period">${esc(x.period)} · ${esc(x.place)}</span>${badge}</div>
              </div>
              <span class="chev">${icon("chevron", 22)}</span>
            </button>
            <div class="tl-panel" id="tl-${i}"><div><div class="tl-content">
              <p>${esc(x.summary)}</p>${areas}
              <div class="chips">${(x.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
            </div></div></div>
          </div>
        </div>`;
      })
      .join("");
    $$(".tl-toggle").forEach((b) =>
      b.addEventListener("click", () => {
        const item = b.closest(".tl-item");
        b.setAttribute("aria-expanded", String(item.classList.toggle("open")));
      })
    );
  }

  /* ---------- Skills ---------- */
  function renderSkills() {
    $("#skillsGrid").innerHTML = D.skills
      .map((s) => wrap(`
        <article class="card skill-card">
          <div class="skill-head"><span class="skill-ico">${icon(s.icon, 20)}</span><h3>${esc(s.group)}</h3></div>
          <div class="chips">${s.items.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div>
        </article>`))
      .join("");
    const all = [...new Set(D.skills.flatMap((s) => s.items))];
    const row = all.map((t) => `<span>${esc(t)}</span>`).join("");
    $("#marqueeTrack").innerHTML = row + row;
  }

  /* ---------- Projects ---------- */
  const CAT = { work: "Work", study: "Study", personal: "Personal" };
  const STATUS = { completed: "Completed", "in-progress": "In progress", planned: "Planned" };
  const projects = [...D.projects].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  let activeFilter = "all", query = "";

  const FILTERS = [
    ["all", "All", () => true],
    ["work", "Work", (p) => p.category === "work"],
    ["study", "Study", (p) => p.category === "study"],
    ["personal", "Personal", (p) => p.category === "personal"],
    ["ongoing", "In progress", (p) => p.status !== "completed"]
  ];

  function renderFilters() {
    $("#filters").innerHTML = FILTERS
      .filter(([k, , fn]) => k === "all" || projects.some(fn))
      .map(([k, l, fn]) => `<button class="filter ${k === activeFilter ? "active" : ""}" role="tab" aria-selected="${k === activeFilter}" data-f="${k}">${l}<small>${projects.filter(fn).length}</small></button>`)
      .join("");
  }

  function renderProjects() {
    const fn = FILTERS.find((f) => f[0] === activeFilter)[2];
    const q = query.trim().toLowerCase();
    const list = projects.filter((p) => fn(p) && (!q || [p.title, p.tagline, p.summary, ...(p.tags || [])].join(" ").toLowerCase().includes(q)));
    $("#projectsEmpty").hidden = list.length > 0;
    $("#projectsGrid").innerHTML = list
      .map((p) => {
        const cover = p.images && p.images[0]
          ? `<div class="p-cover"><img src="${safeUrl(p.images[0].src)}" alt="${esc(p.images[0].alt)}" loading="lazy">`
          : `<div class="p-cover no-img"><span>${esc(p.title.split(/\s+/).map((w) => w[0]).slice(0, 3).join("").toUpperCase())}</span>`;
        return wrap(`
        <button class="card project-card" data-id="${esc(p.id)}" aria-label="Open ${esc(p.title)}">
          ${cover}<span class="p-status ${esc(p.status)}"><i></i>${esc(STATUS[p.status] || p.status)}</span></div>
          <div class="p-body">
            <span class="p-cat">${esc(CAT[p.category] || p.category)}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.tagline)}</p>
            <div class="chips">${(p.tags || []).slice(0, 5).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
          </div>
        </button>`);
      })
      .join("");
    watch($("#projectsGrid"));
    bindTilt();
  }

  function bindTilt() {
    if (reduceMotion || !matchMedia("(hover: hover)").matches) return;
    $$(".project-card").forEach((c) => {
      c.addEventListener("mousemove", (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      c.addEventListener("mouseleave", () => (c.style.transform = ""));
    });
  }

  function bindProjectControls() {
    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (!b) return;
      activeFilter = b.dataset.f;
      renderFilters();
      renderProjects();
    });
    $("#projectSearch").addEventListener("input", (e) => { query = e.target.value; renderProjects(); });
    $("#projectsGrid").addEventListener("click", (e) => {
      const c = e.target.closest(".project-card");
      if (c) openProject(c.dataset.id);
    });
  }

  /* ---------- Modal ---------- */
  const modal = $("#projectModal");
  const lightbox = $("#lightbox");
  const lockScroll = (on) => document.documentElement.classList.toggle("lock", on);

  function openProject(id, pushHash = true) {
    const p = D.projects.find((x) => x.id === id);
    if (!p) return;
    const linkIcon = { github: "github", pdf: "file", demo: "external", link: "external" };
    $("#modalContent").innerHTML = `
      <div class="m-hero">
        <div class="m-meta"><span class="p-status ${esc(p.status)}"><i></i>${esc(STATUS[p.status] || p.status)}</span><span class="p-cat">${esc(CAT[p.category] || p.category)} · ${esc(p.date)}</span></div>
        <h2 id="modalTitle">${esc(p.title)}</h2>
        <p class="lead">${esc(p.summary)}</p>
      </div>
      ${p.metrics && p.metrics.length ? `<div class="m-metrics">${p.metrics.map((m) => `<div class="m-metric"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join("")}</div>` : ""}
      ${p.images && p.images.length ? `<div class="m-gallery">${p.images.map((im) => `<button type="button" data-src="${safeUrl(im.src)}" data-alt="${esc(im.alt)}" aria-label="Enlarge: ${esc(im.alt)}"><img src="${safeUrl(im.src)}" alt="${esc(im.alt)}" loading="lazy"></button>`).join("")}</div>` : ""}
      <div class="m-section"><h4>Tech</h4><div class="chips">${(p.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>
      ${(p.details || []).map((s) => `<div class="m-section"><h4>${esc(s.heading)}</h4><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}
      ${p.links && p.links.length ? `<div class="m-links">${p.links.map((l) => `<a class="btn btn-ghost" href="${safeUrl(l.url)}" target="_blank" rel="noopener">${icon(linkIcon[l.type] || "external", 16)}${esc(l.label)}</a>`).join("")}</div>` : '<div class="m-links"></div>'}`;
    $(".modal-inner", modal).scrollTop = 0;
    if (!modal.open) modal.showModal();
    lockScroll(true);
    if (pushHash) history.pushState(null, "", `#project/${encodeURIComponent(id)}`);
  }

  function closeModalCleanup() {
    lockScroll(false);
    if (location.hash.startsWith("#project/")) history.replaceState(null, "", "#projects");
  }
  $("#modalClose").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener("close", closeModalCleanup);
  $("#modalContent").addEventListener("click", (e) => {
    const b = e.target.closest(".m-gallery button");
    if (!b) return;
    $("#lightboxImg").src = b.dataset.src;
    $("#lightboxImg").alt = b.dataset.alt;
    lightbox.showModal();
  });
  $("#lightboxClose").addEventListener("click", () => lightbox.close());
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    if (lightbox.open) lightbox.close();
    else if (modal.open) modal.close();
  });
  lightbox.addEventListener("click", (e) => { if (e.target !== $("#lightboxImg")) lightbox.close(); });
  window.addEventListener("popstate", () => {
    if (location.hash.startsWith("#project/")) openProject(decodeURIComponent(location.hash.slice(9)), false);
    else if (modal.open) modal.close();
  });

  /* ---------- GitHub feed ---------- */
  const LANG_COLORS = { Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", PowerShell: "#012456", Java: "#b07219", "C++": "#f34b7d", C: "#888", Go: "#00ADD8", "Jupyter Notebook": "#DA5B0B" };

  async function loadRepos() {
    const grid = $("#ghGrid");
    const user = D.profile.github;
    grid.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    const key = `gh-repos-${user}`;
    try {
      let repos;
      const cached = sessionStorage.getItem(key);
      if (cached) repos = JSON.parse(cached);
      else {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=30`, { headers: { Accept: "application/vnd.github+json" } });
        if (!res.ok) throw new Error(res.status);
        repos = await res.json();
        sessionStorage.setItem(key, JSON.stringify(repos));
      }
      const list = repos.filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== user.toLowerCase()).slice(0, 6);
      if (!list.length) throw new Error("empty");
      grid.innerHTML = list.map((r) => wrap(`
        <a class="card repo" href="${safeUrl(r.html_url)}" target="_blank" rel="noopener">
          <h4>${esc(r.name)}</h4>
          <p>${esc(r.description || "No description yet.")}</p>
          <div class="repo-meta">
            ${r.language ? `<span><i class="lang-dot" style="--l:${LANG_COLORS[r.language] || "var(--accent)"}"></i>${esc(r.language)}</span>` : ""}
            <span>★ ${r.stargazers_count}</span>
            <span>Updated ${new Date(r.pushed_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
          </div>
        </a>`)).join("");
      watch(grid);
    } catch (_) {
      grid.innerHTML = `<p class="gh-note">Couldn't load repositories right now. See everything on <a class="link-arrow" href="https://github.com/${esc(user)}" target="_blank" rel="noopener">github.com/${esc(user)}</a>.</p>`;
    }
  }

  /* ---------- Contact ---------- */
  function renderContact() {
    const p = D.profile;
    const row = (i, l, v, href) => {
      const inner = `<span class="c-ico">${icon(i, 18)}</span><span><small>${l}</small><span class="v">${esc(v)}</span></span>`;
      return `<li>${href ? `<a href="${safeUrl(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${inner}</a>` : `<div>${inner}</div>`}</li>`;
    };
    $("#contactList").innerHTML =
      row("mail", "Email", p.email, `mailto:${p.email}`) +
      row("phone", "Phone", p.phone, `tel:${p.phone.replace(/[^+\d]/g, "")}`) +
      row("linkedin", "LinkedIn", "yassine-aassila", p.linkedin) +
      row("github", "GitHub", `github.com/${p.github}`, `https://github.com/${p.github}`) +
      row("pin", "Location", p.location);

    const form = $("#contactForm"), status = $("#formStatus"), btn = $("#formBtn");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      $$(".field", form).forEach((f) => {
        const i = $("input,select,textarea", f);
        const bad = i.required && (!i.value.trim() || (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value)));
        f.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      status.className = "form-status";
      if (!ok) { status.textContent = "Please fill in all fields correctly."; status.classList.add("err"); return; }
      btn.disabled = true; btn.textContent = "Sending…";
      try {
        const res = await fetch(p.formspree, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error();
        form.reset();
        status.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
        status.classList.add("ok");
      } catch (_) {
        status.textContent = `Something went wrong. Please email me directly at ${p.email}.`;
        status.classList.add("err");
      } finally {
        btn.disabled = false; btn.textContent = "Send message";
      }
    });
  }

  /* ---------- Header, nav, theme ---------- */
  function bindChrome() {
    const header = $("#siteHeader"), bar = $("#scrollProgress"), nav = $("#nav"), menu = $("#menuBtn");
    const onScroll = () => {
      header.classList.toggle("scrolled", scrollY > 12);
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); } });

    const links = $$(".nav-link");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => spy.observe(s));

    $("#themeToggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (_) {}
    });
  }

  /* ---------- Network canvas background ---------- */
  function network() {
    const cv = $("#netCanvas"), ctx = cv.getContext("2d");
    let w, h, nodes = [], dpr = Math.min(devicePixelRatio || 1, 2);
    const mouse = { x: -999, y: -999 };
    const color = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#22d3ee";

    function resize() {
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(Math.floor((w * h) / 17000), 90);
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.8 }));
    }
    function draw(move) {
      ctx.clearRect(0, 0, w, h);
      const c = color(), maxD = 140;
      for (const a of nodes) {
        if (move) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
        }
        ctx.globalAlpha = 0.8; ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
      }
      ctx.strokeStyle = c; ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxD) { ctx.globalAlpha = (1 - d / maxD) * 0.35; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 190) { ctx.globalAlpha = (1 - dm / 190) * 0.7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
    }
    resize();
    addEventListener("resize", resize);
    if (reduceMotion) return draw(false);
    addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    addEventListener("mouseout", () => { mouse.x = mouse.y = -999; });
    let raf;
    const loop = () => { draw(true); raf = requestAnimationFrame(loop); };
    document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden) loop(); });
    loop();
  }

  /* ---------- Init ---------- */
  renderHero();
  renderStats();
  renderNow();
  renderAbout();
  renderTimeline();
  renderSkills();
  renderFilters();
  renderProjects();
  bindProjectControls();
  renderContact();
  bindChrome();
  network();
  watch();
  loadRepos();
  if (location.hash.startsWith("#project/")) openProject(decodeURIComponent(location.hash.slice(9)), false);
})();
