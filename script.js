// ====== EDIT THESE ======
const CONFIG = {
  github:   "https://github.com/harishmodi129",
  linkedin: "https://www.linkedin.com/in/your-profile",
  email:    "you@example.com",
  resume:   "resume.pdf" // put your PDF next to index.html, or set "" to hide the button
};
// ========================
(function () {
  const $ = (q, r = document) => r.querySelector(q), $$ = (q, r = document) => [...r.querySelectorAll(q)];

  // contact links
  $$("[data-github]").forEach(a => a.href = CONFIG.github);
  $$("[data-linkedin]").forEach(a => a.href = CONFIG.linkedin);
  $$("[data-mailto]").forEach(a => a.href = "mailto:" + CONFIG.email);
  $$("[data-email]").forEach(e => e.textContent = CONFIG.email);
  $$("[data-resume]").forEach(a => CONFIG.resume ? a.href = CONFIG.resume : a.remove());
  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  // copy email
  const copyBtn = $("#copyBtn"), copied = $("#copied");
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(CONFIG.email); copied.textContent = "Email copied to clipboard"; }
    catch { copied.textContent = CONFIG.email; }
    setTimeout(() => copied.textContent = "", 2500);
  });

  // reveal on scroll
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add("in"));

  // animated counters
  const countObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    countObs.unobserve(e.target);
    const end = +e.target.dataset.count; if (reduce) return;
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 900, 1);
      e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach(el => countObs.observe(el));

  // active nav link
  const links = $$(".nav-links a");
  const secs = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => spy.observe(s));

  // project filters
  $$(".filter").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.setAttribute("aria-pressed", b === btn));
    const f = btn.dataset.f;
    $$("[data-cat]").forEach(c => c.hidden = !(f === "all" || c.dataset.cat === f));
  }));

  // project details dialog
  const modal = $("#modal");
  if (!modal) return;
  $(".m-tabs", modal).hidden = true;
  const fill = (id, nodes) => { const ul = $(id); ul.innerHTML = ""; nodes.forEach(n => ul.appendChild(n)); };
  function open(key) {
    const card = key === "payflow" ? $("#featured") : $(`[data-open="${key}"]`);
    if (!card) return;
    const org = $(".proj-org, .label", card), title = $("h3, h2", card);
    const sum = $("p", card), chips = $$(".chip, .stack span", card);
    $("#mOrg").textContent = org ? org.textContent.trim() : "";
    $("#mTitle").textContent = title.textContent.trim();
    $("#mSummary").textContent = "";
    $("#mWhy").textContent = sum.textContent.trim();
    const feats = $$(".feat-list li", card).map(li => li.cloneNode(true));
    fill("#mList", feats);
    const stack = chips.map(c => { const li = document.createElement("li"); li.textContent = c.textContent; return li; });
    fill("#mRole", stack);
    const [h1, h2, h3] = $$(".m-panel h4", modal);
    h1.textContent = "Overview"; h2.textContent = "Stack"; h3.textContent = "Highlights";
    h2.hidden = $("#mRole").hidden = !stack.length;
    h3.hidden = $("#mList").hidden = !feats.length;
    $$(".m-panel", modal).forEach(p => p.hidden = p.dataset.panel !== "overview");
    document.body.classList.add("modal-open");
    modal.showModal();
  }
  $$("[data-open]").forEach(b => b.addEventListener("click", () => open(b.dataset.open)));
  const close = () => modal.open && modal.close();
  $("#mClose").addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
  modal.addEventListener("close", () => document.body.classList.remove("modal-open"));
})();
