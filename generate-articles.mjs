
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
  <main class="static-article">
    <p><a href="/">← TAVR Research Hub</a></p>
    <article>
      <header>
        <h1>${title}</h1>
        <p class="article-meta">
          ${authors}
          ${article.date ? ` · ${escapeHTML(article.date)}` : ""}
          ${article.journal ? ` · ${escapeHTML(article.journal)}` : ""}
        </p>
        <p>${description}</p>
      </header>

      <section>
        <h2>Abstract</h2>
        <p>${escapeHTML(structured.background || article.abstract || "")}</p>
        ${structured.methods
          ? `<h3>Methods</h3><p>${escapeHTML(structured.methods)}</p>`
          : ""}
        ${structured.results
          ? `<h3>Results</h3><p>${escapeHTML(structured.results)}</p>`
          : ""}
        ${structured.conclusions
          ? `<h3>Conclusions</h3><p>${escapeHTML(structured.conclusions)}</p>`
          : ""}
      </section>

      ${findings ? `
      <section>
        <h2>Key Findings</h2>
        <ul>${findings}</ul>
      </section>` : ""}

      <section class="article-body">
        <h2>Full Article</h2>
        ${prose || `<p>${description}</p>`}
      </section>

      ${article.doi ? `
      <p>DOI:
        <a href="https://doi.org/${encodeURIComponent(article.doi)}">
          ${escapeHTML(article.doi)}
        </a>
      </p>` : ""}
    </article>
  </main>
</body>
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
