
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASE_URL = "https://tavr-research.org";
const OUTPUT_DIR = path.join(ROOT, "article");

const articles = JSON.parse(
  fs.readFileSync(path.join(ROOT, "articles.json"), "utf8")
);

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function slug(value) {
  return encodeURIComponent(String(value));
}

function renderParagraphs(paragraphs = []) {
  return paragraphs.map((paragraph) => {
    const lines = String(paragraph).split("\n");
    return lines
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) =>
        `<p>${escapeHTML(line)}</p>`
      )
      .join("\n");
  }).join("\n");
}

function renderArticle(article) {
  const title = escapeHTML(article.title || "Research Article");
  const description = escapeHTML(
    article.abstract || article.title || "TAVR research article."
  );
const canonical =
  `${BASE_URL}/article/${slug(article.id)}/`;

  const authors = (article.authors || [])
    .map(escapeHTML)
    .join(", ");

  const structured = article.structuredAbstract || {};
  const findings = (article.keyFindings || [])
    .map((finding) => `<li>${escapeHTML(finding)}</li>`)
    .join("\n");

  const prose = renderParagraphs(article.articleProse || []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: article.title,
    description: article.abstract || article.title,
    url: canonical,
    datePublished: article.date || undefined,
    author: (article.authors || []).map((name) => ({
      "@type": "Organization",
      name
    })),
    ...(article.doi
      ? { identifier: `https://doi.org/${article.doi}` }
      : {})
  };

  const jsonLD = JSON.stringify(schema)
    .replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

<title>${title} | TAVR Research</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow">

<meta property="og:type" content="article">
<meta property="og:site_name" content="TAVR Research">
<meta property="og:title" content="${title} | TAVR Research">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">

<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title} | TAVR Research">
<meta name="twitter:description" content="${description}">

<link rel="stylesheet" href="/styles.css">

  <script type="application/ld+json">${jsonLD}</script>
  <style>
    .static-article {
      max-width: 900px;
      margin: 2rem auto;
      padding: 1.5rem;
      line-height: 1.75;
      overflow-wrap: anywhere;
    }
    .static-article h1 { line-height: 1.25; }
    .static-article h2 { margin-top: 2rem; }
    .static-article li { margin-bottom: .5rem; }
    .static-article .article-meta { color: #64748b; }
    .static-article .article-body p { margin: 1rem 0; }
  </style>
</head>

<body>
  <header class="app-header">
    <div class="header-container">
      <a class="logo-brand" href="/" style="text-decoration:none">
        <div class="logo-icon-wrapper" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div class="logo-text-group">
          <span class="brand-title">TAVR Research</span>
          <span class="brand-subtitle">Clinical &amp; Market Hub</span>
        </div>
      </a>
    </div>
  </header>

  <article class="article-page-view">
    <div class="article-nav-bar">
      <div class="article-nav-container">
        <a class="back-btn" href="/" style="text-decoration:none">
          ← Back to Articles
        </a>
      </div>
    </div>

    <main class="article-content-wrapper">
      <div class="full-article-header">
        <h1 class="full-article-title">${title}</h1>

        <p class="full-article-authors">${authors}</p>

        <div class="full-article-meta-row">
          ${article.journal
            ? `<span>📖 ${escapeHTML(article.journal)}</span>`
            : ""}
          ${article.date
            ? `<span>📅 ${escapeHTML(article.date)}</span>`
            : ""}
        </div>
      </div>

      <section class="structured-abstract-card">
        <h2>Structured Clinical Abstract</h2>

        <div class="abstract-section-heading">Background</div>
        <p class="abstract-section-text">
          ${escapeHTML(structured.background || article.abstract || "")}
        </p>

        ${structured.methods ? `
          <div class="abstract-section-heading">Methods &amp; Study Design</div>
          <p class="abstract-section-text">
            ${escapeHTML(structured.methods)}
          </p>
        ` : ""}

        ${structured.results ? `
          <div class="abstract-section-heading">Results</div>
          <p class="abstract-section-text">
            ${escapeHTML(structured.results)}
          </p>
        ` : ""}

        ${structured.conclusions ? `
          <div class="abstract-section-heading">Conclusions</div>
          <p class="abstract-section-text">
            ${escapeHTML(structured.conclusions)}
          </p>
        ` : ""}
      </section>

      <section class="article-prose">
        <h2>Full Clinical Analysis &amp; Strategic Findings</h2>

        ${prose}

        ${findings ? `
          <h2>Key Trial &amp; Strategic Takeaways</h2>
          <ul>${findings}</ul>
        ` : ""}
      </section>
    </main>
  </article>

  <footer class="app-footer">
    <div class="footer-container">
      <div>
        <strong>TAVR Research Hub</strong>
        &copy; 2026. TAVR clinical &amp; market research portal.
      </div>
      <div class="footer-links">
        <a href="/">Back to Research Hub</a>
      </div>
    </div>
  </footer>
</body>
</html>`;

</html>`;
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const article of articles) {
  if (!article.id || !article.title) {
    console.warn("Skipping article missing id or title.");
    continue;
  }

  const targetDir = path.join(OUTPUT_DIR, article.id);
  fs.mkdirSync(targetDir, { recursive: true });

  fs.writeFileSync(
    path.join(targetDir, "index.html"),
    renderArticle(article),
    "utf8"
  );

  console.log(`Generated: /article/${article.id}/`);
}

console.log(`Finished generating ${articles.length} article records.`);
