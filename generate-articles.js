/* ============================================================
   מחולל דפי מאמר סטטיים ל-SEO
   קורא את מערך ARTICLES מתוך assets/js/data.js
   ומייצר קובץ HTML סטטי לכל מאמר (article-aX.html)
   עם title / meta / canonical / Open Graph / Article JSON-LD
   מוטמעים בתוך הקובץ — כך שגוגל ורשתות חברתיות רואים הכל מיד.

   הרצה:  node generate-articles.js
   ============================================================ */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const SITE = "https://pavelbk10.github.io/valentina-nachshonov-couture";
const IMG = SITE + "/assets/img/valentina.jpg";

/* ---------- חילוץ מערך ARTICLES מתוך data.js ---------- */
function loadArticles() {
  const src = fs.readFileSync(path.join(ROOT, "assets", "js", "data.js"), "utf8");
  const start = src.indexOf("const ARTICLES");
  if (start === -1) throw new Error("ARTICLES not found in data.js");
  const eq = src.indexOf("[", start);
  // איתור הסוגר התואם של המערך
  let depth = 0, end = -1;
  for (let i = eq; i < src.length; i++) {
    const ch = src[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) throw new Error("ARTICLES array not closed");
  const arrayText = src.slice(eq, end + 1);
  const sandbox = {};
  vm.createContext(sandbox);
  return vm.runInContext("(" + arrayText + ")", sandbox);
}

/* ---------- עזרים ---------- */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function swatch(p) {
  return `background: linear-gradient(150deg, ${p[0]} 0%, ${p[1]} 55%, ${p[2]} 100%);`;
}

function bodyToParagraphs(body) {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `        <p>${esc(p)}</p>`)
    .join("\n");
}

/* ---------- תבנית עמוד מאמר ---------- */
function pageHtml(a) {
  const url = `${SITE}/article-${a.id}.html`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    articleSection: a.category,
    datePublished: a.date,
    image: IMG,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: "ולנטינה נחשונוב", sameAs: "https://www.instagram.com/vala_nahshonov/" },
    publisher: { "@type": "Organization", name: "ולנטינה נחשונוב Couture" },
  };

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(a.title)} | ולנטינה נחשונוב</title>
  <meta name="description" content="${esc(a.excerpt)}" />
  <meta name="author" content="ולנטינה נחשונוב" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#0a1f44" />
  <link rel="canonical" href="${url}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="he_IL" />
  <meta property="og:site_name" content="ולנטינה נחשונוב Couture" />
  <meta property="og:title" content="${esc(a.title)}" />
  <meta property="og:description" content="${esc(a.excerpt)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${IMG}" />
  <meta property="article:section" content="${esc(a.category)}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(a.title)}" />
  <meta name="twitter:description" content="${esc(a.excerpt)}" />
  <meta name="twitter:image" content="${IMG}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Frank+Ruhl+Libre:wght@300;400;500;600;700;900&family=Assistant:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/style.css" />

  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
<body>
  <header class="nav nav--solid" id="nav">
    <div class="nav__inner">
      <a href="index.html" class="nav__logo">
        <span class="nav__logo-mark">VN</span>
        <span class="nav__logo-text">ולנטינה נחשונוב</span>
      </a>
      <nav class="nav__links">
        <a href="index.html" class="nav__link">בית</a>
        <a href="articles.html" class="nav__link">בלוג</a>
        <a href="index.html#store" class="nav__link">חנות</a>
        <a href="index.html#contact" class="nav__link nav__link--cta">צרו קשר</a>
      </nav>
    </div>
  </header>

  <main class="page-wrap">
    <article class="article">
      <div class="article__hero" style="${swatch(a.palette)}">
        <span class="article__cat">${esc(a.category)}</span>
      </div>
      <div class="article__head">
        <h1 class="article__title">${esc(a.title)}</h1>
        <div class="article__meta"><span>${esc(a.date)}</span><span>•</span><span>${esc(a.read)}</span></div>
      </div>
      <div class="article__body">
${bodyToParagraphs(a.body)}
      </div>
      <div class="article__back"><a class="btn btn--gold" href="articles.html">לכל המאמרים ←</a></div>
    </article>
  </main>

  <footer class="page-foot">
    <p>© 2026 ולנטינה נחשונוב · מעצבת בגדים</p>
    <a href="articles.html" class="btn btn--ghost">לכל המאמרים ←</a>
  </footer>
</body>
</html>
`;
}

/* ---------- ריצה ---------- */
function main() {
  const articles = loadArticles();
  articles.forEach((a) => {
    const file = path.join(ROOT, `article-${a.id}.html`);
    fs.writeFileSync(file, pageHtml(a), "utf8");
    console.log("נוצר: article-" + a.id + ".html");
  });
  console.log(`\nסה"כ ${articles.length} דפי מאמר סטטיים נוצרו.`);
}

main();
