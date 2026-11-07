(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const CONTENT_PATH = "content.json";
  const API = "https://api.github.com";

  const state = { token: "", repo: "", branch: "main", user: "", content: null, editing: null, newImages: [] };

  /* ---------- GitHub API ---------- */
  async function gh(path, opts = {}) {
    const res = await fetch(API + path, {
      ...opts,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${state.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...opts.headers
      }
    });
    if (!res.ok) {
      let msg = res.statusText;
      try { msg = (await res.json()).message || msg; } catch (_) {}
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }
  const contentsUrl = (p) => `/repos/${state.repo}/contents/${p.split("/").map(encodeURIComponent).join("/")}`;

  const fromB64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));
  const toB64 = (str) => {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };

  async function fetchContent() {
    const f = await gh(`${contentsUrl(CONTENT_PATH)}?ref=${encodeURIComponent(state.branch)}`);
    return { data: JSON.parse(fromB64(f.content)), sha: f.sha };
  }

  async function putFile(path, b64, message, sha) {
    return gh(contentsUrl(path), {
      method: "PUT",
      body: JSON.stringify({ message, content: b64, branch: state.branch, ...(sha ? { sha } : {}) })
    });
  }

  // Re-reads the latest content.json, applies the change, commits. Retries once if someone else committed in between.
  async function mutate(fn, message) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, sha } = await fetchContent();
      fn(data);
      try {
        await putFile(CONTENT_PATH, toB64(JSON.stringify(data, null, 2) + "\n"), message, sha);
        state.content = data;
        return;
      } catch (e) {
        if (attempt === 0 && (e.status === 409 || e.status === 422)) continue;
        throw e;
      }
    }
  }

  /* ---------- Auth ---------- */
  const store = () => (localStorage.getItem("adm_token") ? localStorage : sessionStorage);

  async function signIn(token, repo, remember) {
    state.token = token.trim();
    state.repo = repo.trim();
    if (!/^[\w.-]+\/[\w.-]+$/.test(state.repo)) throw new Error("Repository must look like owner/name.");
    const [r, u] = await Promise.all([gh(`/repos/${state.repo}`), gh("/user")]);
    if (!r.permissions || !r.permissions.push) throw new Error("This token cannot write to the repository (needs Contents: Read and write).");
    state.branch = r.default_branch;
    state.user = u.login;
    ({ data: state.content } = await fetchContent().catch((e) => {
      if (e.status === 404) throw new Error("content.json was not found in the repository. Push the new site files first.");
      throw e;
    }));
    localStorage.removeItem("adm_token"); sessionStorage.removeItem("adm_token");
    (remember ? localStorage : sessionStorage).setItem("adm_token", state.token);
    localStorage.setItem("adm_repo", state.repo);
  }

  function showApp() {
    $("#loginView").hidden = true;
    $("#appView").hidden = false;
    $("#whoami").textContent = `${state.user} · ${state.repo}@${state.branch}`;
    renderList();
    renderNow();
  }

  function signOut() {
    localStorage.removeItem("adm_token"); sessionStorage.removeItem("adm_token");
    state.token = ""; state.content = null;
    $("#token").value = "";
    $("#appView").hidden = true;
    $("#loginView").hidden = false;
  }

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#loginBtn"), st = $("#loginStatus");
    btn.disabled = true; btn.textContent = "Checking…"; st.textContent = ""; st.className = "form-status";
    try {
      await signIn($("#token").value, $("#repo").value, $("#remember").checked);
      $("#token").value = "";
      showApp();
    } catch (err) {
      st.className = "form-status err";
      st.textContent = err.status === 401 ? "Invalid or expired token." : err.status === 404 ? "Repository not found, or the token has no access to it." : err.message;
    } finally {
      btn.disabled = false; btn.textContent = "Sign in";
    }
  });
  $("#logout").addEventListener("click", signOut);
  $("#repo").value = localStorage.getItem("adm_repo") || $("#repo").value;

  /* ---------- UI helpers ---------- */
  let toastTimer;
  function toast(msg, isErr = false) {
    const t = $("#toast");
    t.textContent = msg; t.className = "toast" + (isErr ? " err" : ""); t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), isErr ? 9000 : 7000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const errText = (e) => (e.status === 401 ? "Your token expired — sign out and sign in again." : e.status === 403 ? "GitHub refused the request (permissions or rate limit): " + e.message : e.message);

  $$(".tab").forEach((t) =>
    t.addEventListener("click", () => {
      $$(".tab").forEach((x) => x.classList.toggle("active", x === t));
      $("#tab-projects").hidden = t.dataset.tab !== "projects";
      $("#tab-now").hidden = t.dataset.tab !== "now";
    })
  );

  /* ---------- Project list ---------- */
  const sortedProjects = () => [...(state.content.projects || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));

  function renderList() {
    const list = sortedProjects();
    $("#projectCount").textContent = `(${list.length})`;
    $("#projectList").innerHTML = list.length
      ? list.map((p) => `
        <div class="card prow">
          ${p.images && p.images[0] ? `<img class="prow-thumb" src="${esc(p.images[0].src)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'prow-thumb',textContent:'img'}))">` : '<div class="prow-thumb">—</div>'}
          <div>
            <h3>${esc(p.title)}</h3>
            <div class="prow-meta"><span>${esc(p.category)}</span><span>·</span><span>${esc(p.status)}</span><span>·</span><span>${esc(p.date)}</span></div>
          </div>
          <div class="prow-actions">
            <button class="btn btn-sm btn-ghost" data-edit="${esc(p.id)}" type="button">Edit</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-del="${esc(p.id)}" type="button">Delete</button>
          </div>
        </div>`).join("")
      : '<p class="muted">No projects yet — add your first one.</p>';
  }
  $("#projectList").addEventListener("click", async (e) => {
    const ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
    if (ed) openEditor(ed.dataset.edit);
    if (del) {
      const p = state.content.projects.find((x) => x.id === del.dataset.del);
      if (!p || !confirm(`Delete "${p.title}" from your portfolio? This publishes immediately.`)) return;
      del.disabled = true;
      try {
        await mutate((d) => { d.projects = d.projects.filter((x) => x.id !== p.id); }, `Remove project: ${p.title}`);
        renderList();
        toast("Project deleted. The live site updates in about a minute.");
      } catch (err) { toast(errText(err), true); del.disabled = false; }
    }
  });
  $("#newProject").addEventListener("click", () => openEditor(null));

  /* ---------- Editor ---------- */
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "project";

  const detailsToText = (d = []) => d.map((s) => `${s.heading}\n${s.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n");
  function textToDetails(t) {
    return t.split(/\n\s*\n/).map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return null;
      const heading = lines[0].replace(/^[-•]\s*/, "");
      const items = lines.slice(1).map((l) => l.replace(/^[-•]\s*/, "")).filter(Boolean);
      return items.length ? { heading, items } : null;
    }).filter(Boolean);
  }
  const metricsToText = (m = []) => m.map((x) => `${x.value} | ${x.label}`).join("\n");
  const textToMetrics = (t) => t.split("\n").map((l) => l.split("|").map((s) => s.trim())).filter((p) => p[0] && p[1]).map(([value, label]) => ({ value, label }));
  const linksToText = (l = []) => l.map((x) => `${x.label} | ${x.url} | ${x.type || "link"}`).join("\n");
  function textToLinks(t) {
    return t.split("\n").map((l) => l.split("|").map((s) => s.trim())).filter((p) => p[0] && p[1]).map(([label, url, type]) => {
      if (!/^(https?:\/\/|[\w./-]+$)/i.test(url)) throw new Error(`Invalid link URL: ${url}`);
      return { label, url, type: ["github", "demo", "pdf", "link"].includes(type) ? type : /github\.com/i.test(url) ? "github" : /\.pdf$/i.test(url) ? "pdf" : "link" };
    });
  }

  function openEditor(id) {
    const p = id ? state.content.projects.find((x) => x.id === id) : null;
    state.editing = p ? JSON.parse(JSON.stringify(p)) : { id: "", images: [] };
    state.newImages = [];
    $("#editorTitle").textContent = p ? `Edit: ${p.title}` : "New project";
    $("#f-title").value = p ? p.title : "";
    $("#f-tagline").value = p ? p.tagline || "" : "";
    $("#f-category").value = p ? p.category : "personal";
    $("#f-status").value = p ? p.status : "in-progress";
    $("#f-date").value = p ? p.date : new Date().toISOString().slice(0, 7);
    $("#f-summary").value = p ? p.summary || "" : "";
    $("#f-tags").value = p ? (p.tags || []).join(", ") : "";
    $("#f-metrics").value = p ? metricsToText(p.metrics) : "";
    $("#f-links").value = p ? linksToText(p.links) : "";
    $("#f-details").value = p ? detailsToText(p.details) : "";
    $("#f-featured").checked = !!(p && p.featured);
    $("#editStatus").textContent = "";
    renderImages();
    $("#listView").hidden = true;
    $("#editView").hidden = false;
    window.scrollTo({ top: 0 });
    $("#f-title").focus();
  }
  function closeEditor() {
    $("#editView").hidden = true;
    $("#listView").hidden = false;
    state.editing = null; state.newImages = [];
  }
  $("#cancelEdit").addEventListener("click", closeEditor);
  $("#cancelEdit2").addEventListener("click", closeEditor);

  /* ---- images ---- */
  function renderImages() {
    const rows = [
      ...state.editing.images.map((im, i) => ({ kind: "old", i, src: im.src, alt: im.alt })),
      ...state.newImages.map((im, i) => ({ kind: "new", i, src: im.previewUrl, alt: im.alt }))
    ];
    $("#imageList").innerHTML = rows.map((r, n) => `
      <div class="imgrow" data-kind="${r.kind}" data-i="${r.i}">
        <img src="${esc(r.src)}" alt="">
        <input value="${esc(r.alt)}" placeholder="Describe the image" aria-label="Image description">
        <span class="badge-new">${r.kind === "new" ? "NEW" : n === 0 ? "COVER" : ""}</span>
        <button type="button" class="btn btn-sm btn-ghost btn-danger" data-rm>Remove</button>
      </div>`).join("");
  }
  $("#imageList").addEventListener("input", (e) => {
    const row = e.target.closest(".imgrow");
    if (!row) return;
    const list = row.dataset.kind === "old" ? state.editing.images : state.newImages;
    list[+row.dataset.i].alt = e.target.value;
  });
  $("#imageList").addEventListener("click", (e) => {
    if (!e.target.closest("[data-rm]")) return;
    const row = e.target.closest(".imgrow");
    const list = row.dataset.kind === "old" ? state.editing.images : state.newImages;
    list.splice(+row.dataset.i, 1);
    renderImages();
  });
  $("#addImages").addEventListener("click", () => $("#f-files").click());
  let pendingImages = Promise.resolve();
  $("#f-files").addEventListener("change", (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    pendingImages = pendingImages.then(async () => {
      for (const file of files) {
        try {
          const { blob, previewUrl } = await shrink(file);
          if (!state.editing) return;
          state.newImages.push({ blob, previewUrl, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") });
        } catch (_) { toast(`Couldn't read ${file.name}`, true); }
      }
      if (state.editing) renderImages();
    });
  });

  function shrink(file, max = 1600) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((blob) => (blob ? resolve({ blob, previewUrl: URL.createObjectURL(blob) }) : reject()), "image/jpeg", 0.86);
      };
      img.onerror = reject;
      img.src = url;
    });
  }
  const blobToB64 = (blob) => new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result).split(",")[1]);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });

  /* ---- publish ---- */
  $("#editView").addEventListener("submit", async (e) => {
    e.preventDefault();
    const st = $("#editStatus"), btn = $("#publishBtn");
    st.className = "form-status";
    const title = $("#f-title").value.trim(), summary = $("#f-summary").value.trim(), date = $("#f-date").value;
    if (!title || !summary || !/^\d{4}-\d{2}$/.test(date)) {
      st.className = "form-status err"; st.textContent = "Title, summary and month are required."; return;
    }
    let links;
    try { links = textToLinks($("#f-links").value); } catch (err) { st.className = "form-status err"; st.textContent = err.message; return; }

    btn.disabled = true;
    try {
      st.textContent = "Processing images…";
      await pendingImages;
      const existing = state.editing.id;
      const used = new Set(state.content.projects.map((p) => p.id));
      let id = existing;
      if (!id) { id = slug(title); let n = 2; while (used.has(id)) id = `${slug(title)}-${n++}`; }

      const uploaded = [];
      for (let i = 0; i < state.newImages.length; i++) {
        st.textContent = `Uploading image ${i + 1} of ${state.newImages.length}…`;
        const path = `screenshots/${id}-${Date.now().toString(36)}-${i + 1}.jpg`;
        await putFile(path, await blobToB64(state.newImages[i].blob), `Add screenshot for ${title}`);
        uploaded.push({ src: path, alt: state.newImages[i].alt || title });
      }

      const project = {
        id, title,
        tagline: $("#f-tagline").value.trim(),
        category: $("#f-category").value,
        status: $("#f-status").value,
        date,
        featured: $("#f-featured").checked,
        tags: $("#f-tags").value.split(",").map((t) => t.trim()).filter(Boolean),
        summary,
        metrics: textToMetrics($("#f-metrics").value),
        images: [...state.editing.images, ...uploaded].map((im) => ({ src: im.src, alt: im.alt || title })),
        links,
        details: textToDetails($("#f-details").value)
      };

      st.textContent = "Publishing…";
      await mutate((d) => {
        d.projects = d.projects || [];
        const idx = d.projects.findIndex((p) => p.id === id);
        if (idx >= 0) d.projects[idx] = project; else d.projects.push(project);
      }, `${existing ? "Update" : "Add"} project: ${title}`);

      closeEditor();
      renderList();
      toast("Published ✔ — it will be live on your portfolio in about a minute.");
    } catch (err) {
      st.className = "form-status err";
      st.textContent = errText(err);
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- Now tab ---------- */
  function renderNow() {
    $("#nowFields").innerHTML = (state.content.now.items || []).map((n, i) => `
      <div class="now-item" data-i="${i}">
        <h3>${esc(n.title)}</h3>
        <label class="field"><span>Headline</span><input data-k="headline" value="${esc(n.headline)}" maxlength="80"></label>
        <label class="field"><span>Description</span><textarea data-k="text" rows="3">${esc(n.text)}</textarea></label>
        <label class="field"><span>Tags (comma separated)</span><input data-k="tags" value="${esc((n.tags || []).join(", "))}"></label>
      </div>`).join("");
  }
  $("#nowForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const st = $("#nowStatus"), btn = $("#nowBtn");
    st.className = "form-status"; btn.disabled = true; st.textContent = "Publishing…";
    const edits = $$(".now-item").map((el) => ({
      headline: $('[data-k="headline"]', el).value.trim(),
      text: $('[data-k="text"]', el).value.trim(),
      tags: $('[data-k="tags"]', el).value.split(",").map((t) => t.trim()).filter(Boolean)
    }));
    try {
      await mutate((d) => {
        d.now.items.forEach((it, i) => { if (edits[i]) Object.assign(it, edits[i]); });
        d.now.updated = new Date().toISOString().slice(0, 10);
      }, "Update 'Now' status");
      st.textContent = "";
      renderNow();
      toast("Status published ✔ — live in about a minute.");
    } catch (err) {
      st.className = "form-status err"; st.textContent = errText(err);
    } finally { btn.disabled = false; }
  });

  /* ---------- Auto sign-in ---------- */
  (async () => {
    const t = localStorage.getItem("adm_token") || sessionStorage.getItem("adm_token");
    if (!t) return;
    try {
      await signIn(t, localStorage.getItem("adm_repo") || $("#repo").value, !!localStorage.getItem("adm_token"));
      showApp();
    } catch (_) {
      localStorage.removeItem("adm_token"); sessionStorage.removeItem("adm_token");
    }
  })();
})();
