/* ============================================================
   ולנטינה נחשונוב · לוגיקת האתר
   חנות · השכרה · בלוג · תיק עבודות · טופס וואטסאפ · אנימציות
   ============================================================ */

const WA_NUMBER = "972546761672"; // 054-676-1672 בפורמט בינלאומי

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initNav();
  initReveal();
  initHeroSideVideo();
  renderStore();
  renderRentals();
  renderBlog();
  initPortfolio();
  initContactForm();
  initModal();
  initA11y();
  initPages();
});

/* ---------- מסך טעינה ---------- */
function initPreloader() {
  const pre = document.getElementById("preloader");
  window.addEventListener("load", () => setTimeout(() => pre.classList.add("hide"), 600));
  setTimeout(() => pre.classList.add("hide"), 2600); // גיבוי
}

/* ---------- ניווט ---------- */
function initNav() {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      links.classList.remove("open");
    })
  );
}

/* ---------- חשיפה בגלילה ---------- */
function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}
function observeReveal(el) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  io.observe(el);
}

/* ---------- וידאו צף בצד ---------- */
function initHeroSideVideo() {
  const box = document.getElementById("heroSideVideo");
  const close = document.getElementById("heroSideClose");
  close?.addEventListener("click", () => box.classList.add("closed"));
}

/* ---------- עזרי עיצוב ---------- */
function swatchStyle(palette) {
  return `background: linear-gradient(150deg, ${palette[0]} 0%, ${palette[1]} 55%, ${palette[2]} 100%);`;
}
function mono(name) { return name.replace(/[^א-תA-Za-z]/g, "").slice(0, 2) || "VN"; }

/* ---------- חנות ---------- */
let storeSizeSel = {};
function renderStore() {
  const grid = document.getElementById("storeGrid");
  const filters = document.getElementById("storeFilters");
  const cats = ["הכל", ...new Set(PRODUCTS.map((p) => p.category))];

  filters.innerHTML = cats
    .map((c, i) => `<button class="filter-btn ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");

  const paint = (cat) => {
    const list = cat === "הכל" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
    grid.innerHTML = list.map(productCard).join("");
    bindProductCards();
  };
  paint("הכל");

  filters.querySelectorAll(".filter-btn").forEach((b) =>
    b.addEventListener("click", () => {
      filters.querySelector(".active")?.classList.remove("active");
      b.classList.add("active");
      paint(b.dataset.cat);
    })
  );
}

function productCard(p) {
  return `
  <article class="card" data-id="${p.id}">
    <div class="card__media">
      <div class="card__swatch" style="${swatchStyle(p.palette)}"></div>
      <div class="card__mono">${mono(p.name)}</div>
      ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
      <span class="card__price">החל מ־ <b>₪${p.price}</b></span>
    </div>
    <div class="card__body">
      <span class="card__cat">${p.category}</span>
      <h3 class="card__name">${p.name}</h3>
      <p class="card__desc">${p.desc}</p>
      <span class="card__cat" style="display:block;margin-bottom:8px">בחירת מידה</span>
      <div class="card__sizes">
        ${p.sizes.map((s) => `<button class="size-chip" data-size="${s}">${s}</button>`).join("")}
      </div>
      <div class="card__actions">
        <button class="card__btn card__btn--primary" data-add="${p.id}">הוספה לעגלה</button>
        <button class="card__btn card__btn--ghost" data-open="${p.id}">פרטים</button>
      </div>
    </div>
  </article>`;
}

function bindProductCards() {
  document.querySelectorAll("#storeGrid .card").forEach((card) => {
    const id = card.dataset.id;
    card.querySelectorAll(".size-chip").forEach((chip) =>
      chip.addEventListener("click", () => {
        card.querySelectorAll(".size-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        storeSizeSel[id] = chip.dataset.size;
      })
    );
    card.querySelector("[data-add]").addEventListener("click", () => {
      const p = PRODUCTS.find((x) => x.id === id);
      const size = storeSizeSel[id];
      if (!size) { toast("בחרו מידה תחילה ✦"); return; }
      toast(`<b>${p.name}</b> (מידה ${size}) נוסף לעגלה`);
      sendWa(`היי ולנטינה, אשמח לרכוש: ${p.name} | מידה: ${size} | מחיר: ₪${p.price}`);
    });
    card.querySelector("[data-open]").addEventListener("click", () => openProductModal(id));
  });
}

/* ---------- השכרת שמלות ---------- */
function renderRentals() {
  const grid = document.getElementById("rentalGrid");
  grid.innerHTML = RENTALS.map(rentalCard).join("");
  document.querySelectorAll("#rentalGrid .card").forEach((card) => {
    card.querySelector("[data-rent]").addEventListener("click", () => openRentalModal(card.dataset.id));
    card.querySelector("[data-open]").addEventListener("click", () => openRentalModal(card.dataset.id));
  });
}

function rentalCard(r) {
  return `
  <article class="card" data-id="${r.id}">
    <div class="card__media">
      <div class="card__swatch" style="${swatchStyle(r.palette)}"></div>
      <div class="card__mono">${mono(r.name)}</div>
      <span class="card__badge">להשכרה</span>
      <span class="card__price">₪<b>${r.pricePerDay}</b> / יום</span>
    </div>
    <div class="card__body">
      <span class="card__cat">${r.color} · ${r.length}</span>
      <h3 class="card__name">${r.name}</h3>
      <p class="card__desc">${r.desc}</p>
      <div class="card__meta">
        <span>מידות: <b>${r.sizes.join(", ")}</b></span>
        <span>פיקדון: <b>₪${r.deposit}</b></span>
      </div>
      <div class="card__actions">
        <button class="card__btn card__btn--primary" data-rent="${r.id}">הזמנת השכרה</button>
        <button class="card__btn card__btn--ghost" data-open="${r.id}">לכרטיסייה</button>
      </div>
    </div>
  </article>`;
}

/* ---------- מודאל ---------- */
let modalSize = null;
function initModal() {
  const modal = document.getElementById("modal");
  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close") || e.target.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
}
function openModal(html) {
  const modal = document.getElementById("modal");
  document.getElementById("modalCard").innerHTML =
    `<button class="modal__close" data-close>×</button>${html}`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalSize = null;
}

function openProductModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  modalSize = null;
  openModal(`
    <div class="mprod">
      <div class="mprod__media">
        <div class="card__swatch" style="${swatchStyle(p.palette)}"></div>
        <div class="mprod__mono">${mono(p.name)}</div>
        ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
      </div>
      <div class="mprod__body">
        <span class="mprod__cat">${p.category}</span>
        <h3 class="mprod__name">${p.name}</h3>
        <p class="mprod__desc">${p.desc}</p>
        <div class="mprod__price"><span>₪${p.price}</span> <small>כולל מע״מ</small></div>
        <p class="mprod__label">בחירת מידה</p>
        <div class="mprod__sizes">
          ${p.sizes.map((s) => `<button class="size-chip" data-size="${s}">${s}</button>`).join("")}
        </div>
        <button class="btn btn--gold btn--full" id="mAdd"><span class="btn__wa">✆</span> הזמנה בוואטסאפ</button>
      </div>
    </div>`);
  bindModalSizes();
  document.getElementById("mAdd").addEventListener("click", () => {
    if (!modalSize) { toast("בחרו מידה תחילה ✦"); return; }
    sendWa(`היי ולנטינה, מעוניינת ב: ${p.name} | מידה: ${modalSize} | מחיר: ₪${p.price}`);
  });
}

function openRentalModal(id) {
  const r = RENTALS.find((x) => x.id === id);
  modalSize = null;
  openModal(`
    <div class="mprod">
      <div class="mprod__media">
        <div class="card__swatch" style="${swatchStyle(r.palette)}"></div>
        <div class="mprod__mono">${mono(r.name)}</div>
        <span class="card__badge">להשכרה</span>
      </div>
      <div class="mprod__body">
        <span class="mprod__cat">שמלת ערב · ${r.color}</span>
        <h3 class="mprod__name">${r.name}</h3>
        <p class="mprod__desc">${r.desc}</p>
        <div class="mprod__info">
          <div><b>₪${r.pricePerDay}</b><span>ליום השכרה</span></div>
          <div><b>₪${r.deposit}</b><span>פיקדון</span></div>
          <div><b>${r.length}</b><span>אורך</span></div>
        </div>
        <p class="mprod__label">בחירת מידה</p>
        <div class="mprod__sizes">
          ${r.sizes.map((s) => `<button class="size-chip" data-size="${s}">${s}</button>`).join("")}
        </div>
        <button class="btn btn--gold btn--full" id="mRent"><span class="btn__wa">✆</span> בדיקת זמינות בוואטסאפ</button>
      </div>
    </div>`);
  bindModalSizes();
  document.getElementById("mRent").addEventListener("click", () => {
    if (!modalSize) { toast("בחרו מידה תחילה ✦"); return; }
    sendWa(`היי ולנטינה, מעוניינת בהשכרת השמלה: ${r.name} | מידה: ${modalSize} | מחיר: ₪${r.pricePerDay} ליום. מה הזמינות?`);
  });
}

function bindModalSizes() {
  document.querySelectorAll("#modalCard .size-chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      document.querySelectorAll("#modalCard .size-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      modalSize = chip.dataset.size;
    })
  );
}

function openArticleModal(id) {
  const a = ARTICLES.find((x) => x.id === id);
  const paras = a.body.split("\n\n").map((p) => `<p>${p.trim()}</p>`).join("");
  openModal(`
    <div class="mart">
      <span class="mart__cat">${a.category}</span>
      <h3 class="mart__title">${a.title}</h3>
      <div class="mart__meta"><span>${a.date}</span><span>·</span><span>${a.read}</span></div>
      <div class="mart__body">${paras}</div>
    </div>`);
  document.getElementById("modalCard").scrollTop = 0;
}

/* ---------- בלוג ---------- */
let blogPage = 0;
const BLOG_PER = 3;
function renderBlog() {
  const grid = document.getElementById("blogGrid");
  const dots = document.getElementById("blogDots");
  const pages = Math.ceil(ARTICLES.length / BLOG_PER);

  const paint = () => {
    const start = blogPage * BLOG_PER;
    const slice = ARTICLES.slice(start, start + BLOG_PER);
    grid.innerHTML = slice.map(blogCard).join("");
    grid.querySelectorAll(".blog-card").forEach((c) =>
      c.addEventListener("click", () => openArticleModal(c.dataset.id))
    );
    dots.querySelectorAll(".blog__dot").forEach((d, i) => d.classList.toggle("active", i === blogPage));
  };

  dots.innerHTML = Array.from({ length: pages }, (_, i) =>
    `<button class="blog__dot ${i === 0 ? "active" : ""}" data-p="${i}"></button>`).join("");
  dots.querySelectorAll(".blog__dot").forEach((d) =>
    d.addEventListener("click", () => { blogPage = +d.dataset.p; paint(); }));

  document.getElementById("blogPrev").addEventListener("click", () => {
    blogPage = (blogPage - 1 + pages) % pages; paint();
  });
  document.getElementById("blogNext").addEventListener("click", () => {
    blogPage = (blogPage + 1) % pages; paint();
  });

  // רשימת כל המאמרים
  const list = document.getElementById("blogList");
  list.innerHTML = ARTICLES.map((a) =>
    `<button class="blog__list-item" data-id="${a.id}"><b>${a.title}</b><span>${a.category} · ${a.read}</span></button>`).join("");
  list.querySelectorAll(".blog__list-item").forEach((b) =>
    b.addEventListener("click", () => openArticleModal(b.dataset.id)));

  paint();

  // החלפה אוטומטית
  setInterval(() => {
    blogPage = (blogPage + 1) % pages; paint();
  }, 7000);
}

function blogCard(a) {
  return `
  <article class="blog-card" data-id="${a.id}">
    <div class="blog-card__media" style="${swatchStyle(a.palette)}">
      <span class="blog-card__cat">${a.category}</span>
    </div>
    <div class="blog-card__body">
      <div class="blog-card__meta"><span>${a.date}</span><span>${a.read}</span></div>
      <h3 class="blog-card__title">${a.title}</h3>
      <p class="blog-card__excerpt">${a.excerpt}</p>
      <span class="blog-card__more">קריאת המאמר</span>
    </div>
  </article>`;
}

/* ---------- תיק עבודות ---------- */
const SEED_PF = [
  ["#0a1f44", "#16315f", "#c9a14a"],
  ["#faf6ed", "#e9dec3", "#c9a14a"],
  ["#c9a14a", "#e6c87a", "#0a1f44"],
  ["#0d2350", "#1c3a6b", "#faf6ed"],
];
function initPortfolio() {
  const grid = document.getElementById("portfolioGrid");
  const input = document.getElementById("portfolioInput");
  const btn = document.getElementById("portfolioUploadBtn");

  SEED_PF.forEach((pal) => {
    const d = document.createElement("div");
    d.className = "pf-item pf-item--ph";
    d.style.cssText = swatchStyle(pal);
    d.innerHTML = "✦";
    grid.appendChild(d);
  });

  btn.addEventListener("click", () => input.click());
  input.addEventListener("change", (e) => addFiles(e.target.files));

  ["dragenter", "dragover"].forEach((ev) =>
    btn.addEventListener(ev, (e) => { e.preventDefault(); btn.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((ev) =>
    btn.addEventListener(ev, (e) => { e.preventDefault(); btn.classList.remove("drag"); }));
  btn.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  function addFiles(files) {
    [...files].filter((f) => f.type.startsWith("image/")).forEach((f) => {
      const url = URL.createObjectURL(f);
      const item = document.createElement("div");
      item.className = "pf-item";
      item.innerHTML = `<img src="${url}" alt="עבודה" /><button class="pf-item__del" aria-label="מחיקה">×</button>`;
      item.querySelector(".pf-item__del").addEventListener("click", () => {
        URL.revokeObjectURL(url); item.remove();
      });
      grid.prepend(item);
    });
    if (files.length) toast(`<b>${[...files].length}</b> תמונות נוספו לתיק העבודות`);
  }
}

/* ---------- טופס וואטסאפ ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cName").value.trim();
    const phone = document.getElementById("cPhone").value.trim();
    const subject = document.getElementById("cSubject").value;
    const msg = document.getElementById("cMsg").value.trim();
    if (!name || !phone) { toast("נא למלא שם וטלפון"); return; }
    const text =
      `היי ולנטינה! 👋\nשם: ${name}\nטלפון: ${phone}\nנושא: ${subject}` +
      (msg ? `\nהודעה: ${msg}` : "");
    sendWa(text);
    toast("מעבירה אותך לוואטסאפ ✦");
    form.reset();
  });
}

/* ---------- שליחה לוואטסאפ ---------- */
function sendWa(text) {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
}

/* ---------- נגישות ---------- */
const A11Y_KEY = "vn-a11y";
const A11Y_CLASS = {
  contrast: "a11y-contrast",
  gray: "a11y-gray",
  links: "a11y-links",
  readable: "a11y-readable",
  "no-anim": "a11y-no-anim",
  "big-cursor": "a11y-big-cursor",
};
let a11yFont = 0; // -2..+4

function initA11y() {
  const toggle = document.getElementById("a11yToggle");
  const panel = document.getElementById("a11yPanel");
  const close = document.getElementById("a11yClose");
  const reset = document.getElementById("a11yReset");

  const openPanel = (open) => {
    panel.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };
  toggle.addEventListener("click", () => openPanel(!panel.classList.contains("open")));
  close.addEventListener("click", () => openPanel(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") openPanel(false); });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#a11y")) openPanel(false);
  });

  panel.querySelectorAll(".a11y__btn").forEach((btn) =>
    btn.addEventListener("click", () => handleA11y(btn.dataset.a11y, btn))
  );
  reset.addEventListener("click", resetA11y);

  loadA11y();
}

function handleA11y(action, btn) {
  const html = document.documentElement;
  if (action === "font-up") { a11yFont = Math.min(a11yFont + 1, 4); applyFont(); }
  else if (action === "font-down") { a11yFont = Math.max(a11yFont - 1, -2); applyFont(); }
  else {
    const cls = A11Y_CLASS[action];
    const on = html.classList.toggle(cls);
    btn.classList.toggle("active", on);
  }
  saveA11y();
}

function applyFont() {
  const html = document.documentElement;
  html.classList.toggle("a11y-font-scale", a11yFont !== 0);
  html.style.setProperty("--a11y-font", (1 + a11yFont * 0.12).toFixed(2));
  document.querySelectorAll('[data-a11y="font-up"],[data-a11y="font-down"]').forEach((b) =>
    b.classList.toggle("active", a11yFont !== 0));
}

function saveA11y() {
  const html = document.documentElement;
  const active = Object.values(A11Y_CLASS).filter((c) => html.classList.contains(c));
  localStorage.setItem(A11Y_KEY, JSON.stringify({ classes: active, font: a11yFont }));
}

function loadA11y() {
  let data;
  try { data = JSON.parse(localStorage.getItem(A11Y_KEY)); } catch { data = null; }
  if (!data) return;
  const html = document.documentElement;
  (data.classes || []).forEach((c) => {
    html.classList.add(c);
    const action = Object.keys(A11Y_CLASS).find((k) => A11Y_CLASS[k] === c);
    const btn = document.querySelector(`[data-a11y="${action}"]`);
    if (btn) btn.classList.add("active");
  });
  a11yFont = data.font || 0;
  if (a11yFont) applyFont();
}

function resetA11y() {
  const html = document.documentElement;
  Object.values(A11Y_CLASS).forEach((c) => html.classList.remove(c));
  html.classList.remove("a11y-font-scale");
  html.style.removeProperty("--a11y-font");
  a11yFont = 0;
  document.querySelectorAll(".a11y__btn").forEach((b) => b.classList.remove("active"));
  localStorage.removeItem(A11Y_KEY);
  toast("הגדרות הנגישות אופסו");
}

/* ---------- עמודי מידע (נגישות / מדיניות / פרטיות) ---------- */
function initPages() {
  document.querySelectorAll("[data-page]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openPageModal(el.dataset.page);
    })
  );
}

function openPageModal(key) {
  const page = PAGES[key];
  if (!page) return;
  openModal(`
    <div class="mart">
      <span class="mart__cat">מידע ותקנון</span>
      <h3 class="mart__title">${page.title}</h3>
      <div class="mart__body mart__body--legal">${page.html}</div>
    </div>`);
  document.getElementById("modalCard").scrollTop = 0;
}

/* ---------- טוסט ---------- */
let toastTimer;
function toast(html) {
  const t = document.getElementById("toast");
  t.innerHTML = html;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}
