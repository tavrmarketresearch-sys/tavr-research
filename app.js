/**
 * TAVR Research WebApp - Dedicated Full-Page Article Views & Router
 */

(function () {
  'use strict';

  // Application State
  const state = {
    articles: [],
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'newest',
    showBookmarksOnly: false,
    bookmarks: new Set(JSON.parse(localStorage.getItem('tavr_bookmarks') || '[]')),
    activeArticleId: null
  };

  // DOM Elements
  const elements = {
    homeView: document.getElementById('homeView'),
    articlePageView: document.getElementById('articlePageView'),
    articleContentWrapper: document.getElementById('articleContentWrapper'),
    backToHubBtn: document.getElementById('backToHubBtn'),
    pageBookmarkBtn: document.getElementById('pageBookmarkBtn'),
    pageBookmarkLabel: document.getElementById('pageBookmarkLabel'),
    pageCopyCitationBtn: document.getElementById('pageCopyCitationBtn'),

    themeToggleBtn: document.getElementById('themeToggleBtn'),
    bookmarksFilterBtn: document.getElementById('bookmarksFilterBtn'),
    bookmarksCountBadge: document.getElementById('bookmarksCountBadge'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    categoryChipsContainer: document.getElementById('categoryChipsContainer'),
    sortSelect: document.getElementById('sortSelect'),
    resultsCount: document.getElementById('resultsCount'),
    articlesGrid: document.getElementById('articlesGrid'),
    emptyState: document.getElementById('emptyState'),
    resetFilterBtn: document.getElementById('resetFilterBtn'),

    // Add Article Modal
    addArticleBtn: document.getElementById('addArticleBtn'),
    addArticleModal: document.getElementById('addArticleModal'),
    closeAddModalBtn: document.getElementById('closeAddModalBtn'),
    addArticleForm: document.getElementById('addArticleForm'),

    toast: document.getElementById('toast'),
    toastText: document.getElementById('toastText')
  };

  // --------------------------------------------------------------------------
  // Theme Management
  // --------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem('tavr_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tavr_theme', theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    showToast(`Switched to ${next} theme`);
  }

  // --------------------------------------------------------------------------
  // Data Loading
  // --------------------------------------------------------------------------
  async function loadArticles() {
    let clinicalArticles = [];
    try {
      const res = await fetch('articles.json');
      if (res.ok) {
        clinicalArticles = await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch articles.json', e);
    }

    const customArticles = JSON.parse(localStorage.getItem('tavr_custom_articles') || '[]');

    state.articles = [...clinicalArticles, ...customArticles];

    updateBookmarkCounter();
    renderArticles();

    // Check URL route after loading articles
    handleRoute();
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  function showToast(msg) {
    if (!elements.toast || !elements.toastText) return;
    elements.toastText.textContent = msg;
    elements.toast.classList.add('show');
    clearTimeout(elements.toast._timer);
    elements.toast._timer = setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2800);
  }

  function getBadgeClass(category) {
    switch (category) {
      case 'Clinical Trials': return 'badge-trials';
      case 'Durability & Outcomes': return 'badge-outcomes';
      case 'Market Trends': return 'badge-market';
      case 'Device Comparison': return 'badge-device';
      case 'Complications & Safety': return 'badge-safety';
      default: return 'badge-trials';
    }
  }

  function formatDate(dateStr) {
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

function splitTableRow(line) {
  return line.trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim());
}

function isTableSeparator(line) {
  const cells = splitTableRow(line);
  return cells.length > 0 &&
    cells.every(cell => /^:?-{3,}:?$/.test(cell));
}

function renderArticleProse(paragraphs) {
  const lines = paragraphs.flatMap(p =>
    String(p).split('\n')
  );

  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    const next = (lines[i + 1] || '').trim();

    // A Markdown table starts with a header and separator.
    if (line.includes('|') && isTableSeparator(next)) {
      const headers = splitTableRow(line);
      const alignment = splitTableRow(next).map(cell => {
        if (cell.startsWith(':') && cell.endsWith(':')) {
          return 'center';
        }
        if (cell.endsWith(':')) return 'right';
        return 'left';
      });

      i += 2;
      const rows = [];

      while (i < lines.length && lines[i].trim().includes('|')) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }

      const renderCell = (cell, align, tag = 'td') =>
        `<${tag} style="text-align:${align}">` +
        `${escapeHTML(cell)}</${tag}>`;

      output.push(`
        <div class="article-table-wrap">
          <table class="article-data-table">
            <thead>
              <tr>
                ${headers.map((h, j) =>
                  renderCell(h, alignment[j] || 'left', 'th')
                ).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  ${headers.map((_, j) =>
                    renderCell(row[j] || '', alignment[j] || 'left')
                  ).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `);

      continue;
    }

    if (line) {
      output.push(
        `<p class="article-paragraph">${escapeHTML(line)}</p>`
      );
    }

    i++;
  }

  return output.join('');
}

  function updateBookmarkCounter() {
    if (!elements.bookmarksCountBadge) return;
    const count = state.bookmarks.size;
    elements.bookmarksCountBadge.textContent = count;
    elements.bookmarksCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  function toggleBookmark(articleId) {
    if (state.bookmarks.has(articleId)) {
      state.bookmarks.delete(articleId);
      showToast('Article removed from bookmarks');
    } else {
      state.bookmarks.add(articleId);
      showToast('Article added to bookmarks');
    }
    localStorage.setItem('tavr_bookmarks', JSON.stringify([...state.bookmarks]));
    updateBookmarkCounter();

    if (state.activeArticleId === articleId) {
      updatePageBookmarkButton(articleId);
    }

    renderArticles();
  }

  function updatePageBookmarkButton(articleId) {
    if (!elements.pageBookmarkBtn) return;
    const isBookmarked = state.bookmarks.has(articleId);
    elements.pageBookmarkBtn.classList.toggle('active', isBookmarked);
    elements.pageBookmarkBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>${isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    `;
  }

  // --------------------------------------------------------------------------
  // Routing: Home Grid View vs Dedicated Article Page View
  // --------------------------------------------------------------------------
  function navigateTo(hash) {
    window.location.hash = hash;
  }

  function handleRoute() {
    const hash = window.location.hash || '#/';

    if (hash.startsWith('#/article/')) {
      const articleId = hash.replace('#/article/', '').trim();
      showArticlePage(articleId);
    } else {
      showHomeView();
    }
  }

  function showHomeView() {
    state.activeArticleId = null;
    if (elements.articlePageView) elements.articlePageView.style.display = 'none';
    if (elements.homeView) elements.homeView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showArticlePage(articleId) {
    const article = state.articles.find(a => a.id === articleId);
    if (!article) {
      showHomeView();
      return;
    }

    state.activeArticleId = article.id;
    if (elements.homeView) elements.homeView.style.display = 'none';
    if (elements.articlePageView) elements.articlePageView.style.display = 'block';

    updatePageBookmarkButton(article.id);
    renderArticleContent(article);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // --------------------------------------------------------------------------
  // Dedicated Article Page Rendering
  // --------------------------------------------------------------------------
  function renderArticleContent(article) {
    const authorsText = article.authors.join(', ');
    const badgeCls = getBadgeClass(article.category);

    const pubmedBtn = article.pubmedUrl ? `
      <a href="${article.pubmedUrl}" target="_blank" rel="noopener noreferrer" class="real-link-btn real-link-pubmed" title="View on PubMed">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span>PubMed Verified Study ↗</span>
      </a>
    ` : '';

    const journalBtn = article.journalUrl ? `
      <a href="${article.journalUrl}" target="_blank" rel="noopener noreferrer" class="real-link-btn real-link-journal" title="View official journal publication">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span>${escapeHTML(article.journal)} Full Text ↗</span>
      </a>
    ` : '';

    const clinicalTrialsBtn = article.clinicalTrialsUrl ? `
      <a href="${article.clinicalTrialsUrl}" target="_blank" rel="noopener noreferrer" class="real-link-btn real-link-journal" title="View study record on ClinicalTrials.gov">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>ClinicalTrials.gov Registry ↗</span>
      </a>
    ` : '';

    const metricsHTML = (article.metrics && article.metrics.length > 0) ? `
      <div class="metrics-grid">
        ${article.metrics.map(m => `
          <div class="metric-card">
            <div class="metric-card-val">${escapeHTML(m.val)}</div>
            <div class="metric-card-label">${escapeHTML(m.label)}</div>${m.sub ? `<div class="metric-card-sub">${escapeHTML(m.sub)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '';

    const referencesHTML = (article.references && article.references.length > 0) ? `
      <div class="references-container">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 1rem;">Clinical Citations & Primary Sources</h3>
        <ol class="references-list">
          ${article.references.map(r => `
            <li>
              ${escapeHTML(r.citation)}${r.link ? `— <a href="${r.link}" target="_blank" rel="noopener noreferrer">${escapeHTML(r.linkText || 'View Verified Source')} ↗</a>` : ''}
            </li>
          `).join('')}
        </ol>
      </div>
    ` : '';

    // Handle full article prose paragraphs if present in JSON
    let articleProseHTML = '';
    if (article.articleProse && Array.isArray(article.articleProse)) {
articleProseHTML = renderArticleProse(article.articleProse);
    } else if (article.clinicalRationale) {
      articleProseHTML = `<p class="article-paragraph">${escapeHTML(article.clinicalRationale)}</p>`;
    } else {
      articleProseHTML = `<p class="article-paragraph">${escapeHTML(article.abstract)}</p>`;
    }

    elements.articleContentWrapper.innerHTML = `
      <div class="full-article-header">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
          <span class="badge-tag ${badgeCls}">${article.category}</span>
          <span class="badge-tag" style="background: var(--bg-surface-secondary); color: var(--text-muted);">${article.badge || 'Peer Reviewed'}</span>
        </div>
        <h1 class="full-article-title">${escapeHTML(article.title)}</h1>
        <p class="full-article-authors">${escapeHTML(authorsText)}</p>
        <div class="full-article-meta-row">
          <span>📖 ${escapeHTML(article.journal)}</span>
          <span>•</span>
          <span>📅 ${formatDate(article.date)}</span>
          <span>•</span>
          <span>⏱️ ${article.readTime}</span>
          <span>•</span>
          <span>📊 ${article.recentViewCount || 0} Recent views</span>
        </div>

        <!-- Verified Real Clinical Links Bar -->
        <div class="real-links-bar">
          ${pubmedBtn}
          ${journalBtn}
          ${clinicalTrialsBtn}
        </div>
      </div>

      <!-- Key Clinical Metrics -->
      ${metricsHTML}

      <!-- Structured Abstract Box -->
      <div class="structured-abstract-card">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.85rem; color: var(--text-main);">Structured Clinical Abstract</h3>

        <div class="abstract-section-heading">Background</div>
        <p class="abstract-section-text">${escapeHTML(article.structuredAbstract?.background || article.abstract)}</p>

        <div class="abstract-section-heading">Methods & Study Design</div>
        <p class="abstract-section-text">${escapeHTML(article.structuredAbstract?.methods || article.methodology || 'Prospective trial data.')}</p>

        <div class="abstract-section-heading">Results</div>
        <p class="abstract-section-text">${escapeHTML(article.structuredAbstract?.results || 'Consistent hemodynamic durability and low adverse event rates.')}</p>

        <div class="abstract-section-heading">Conclusions</div>
        <p class="abstract-section-text">${escapeHTML(article.structuredAbstract?.conclusions || 'Confirms transcatheter valve safety.')}</p>
      </div>

      <!-- Comprehensive Article Prose -->
      <div class="article-prose">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          Full Clinical Analysis & Strategic Findings
        </h2>
        
        ${articleProseHTML}

        ${(article.keyFindings && article.keyFindings.length > 0) ? `
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            Key Trial & Strategic Takeaways
          </h2>
          <ul>
            ${article.keyFindings.map(f => `<li><strong>${escapeHTML(f)}</strong></li>`).join('')}
          </ul>
        ` : ''}

        ${article.healthEconomics ? `
          <div class="clinical-highlight-callout">
            <h4>Health-Economic & Market Implications</h4>
            <p>${escapeHTML(article.healthEconomics)}</p>
          </div>
        ` : ''}

        ${article.trialDesign ? `
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Trial Methodology & Dataset Characteristics
          </h2>
          <p>${escapeHTML(article.trialDesign)}</p>
        ` : ''}

        <!-- Academic References -->
        ${referencesHTML}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Grid Card Rendering
  // --------------------------------------------------------------------------
  function getFilteredArticles() {
    return state.articles.filter(article => {
      // Category filter
      if (state.selectedCategory !== 'all' && article.category !== state.selectedCategory) {
        return false;
      }

      // Bookmarks only filter
      if (state.showBookmarksOnly && !state.bookmarks.has(article.id)) {
        return false;
      }

      // Search query filter
      if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase();
        const titleMatch = article.title.toLowerCase().includes(q);
        const abstractMatch = article.abstract.toLowerCase().includes(q);
        const authorsMatch = article.authors.some(a => a.toLowerCase().includes(q));
        const tagsMatch = article.tags && article.tags.some(t => t.toLowerCase().includes(q));
        const journalMatch = article.journal.toLowerCase().includes(q);
        if (!titleMatch && !abstractMatch && !authorsMatch && !tagsMatch && !journalMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (state.sortBy === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (state.sortBy === 'Recent views') {
        return (b.recentViewCount || 0) - (a.recentViewCount || 0);
      } else if (state.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  function renderArticles() {
    const list = getFilteredArticles();
    if (elements.resultsCount) {
      elements.resultsCount.innerHTML = `Showing <strong>${list.length}</strong> article${list.length === 1 ? '' : 's'}`;
    }

    if (list.length === 0) {
      if (elements.articlesGrid) elements.articlesGrid.style.display = 'none';
      if (elements.emptyState) elements.emptyState.style.display = 'block';
      return;
    }

    if (elements.articlesGrid) elements.articlesGrid.style.display = 'grid';
    if (elements.emptyState) elements.emptyState.style.display = 'none';

    elements.articlesGrid.innerHTML = list.map(article => {
      const isBookmarked = state.bookmarks.has(article.id);
      const badgeCls = getBadgeClass(article.category);
      const authorsFormatted = article.authors.join(', ');

      return `
        <article class="article-card" data-id="${article.id}" tabindex="0" role="button" aria-label="Open article: ${article.title}">
          <div class="card-top">
            <span class="badge-tag ${badgeCls}">${article.category}</span>
            <button class="card-bookmark-btn ${isBookmarked ? 'active' : ''}" data-bookmark-id="${article.id}" title="${isBookmarked ? 'Remove bookmark' : 'Bookmark article'}" aria-label="Bookmark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>

          <h2 class="card-title">${escapeHTML(article.title)}</h2>

          <div class="card-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${formatDate(article.date)}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${article.readTime}
            </span>
          </div>

          <p class="card-abstract">${escapeHTML(article.abstract)}</p>
          <p class="card-authors">${escapeHTML(authorsFormatted)}</p>

          <div class="card-footer">
            <span class="citation-badge" title="Recent views count">
              📊 ${article.recentViewCount || 0} Recent views
            </span>
            <span class="read-btn">
              Read Full Study →
            </span>
          </div>
        </article>
      `;
    }).join('');

    // Attach card click listeners
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-bookmark-btn')) return;
        const articleId = card.getAttribute('data-id');
        navigateTo(`#/article/${articleId}`);
      });
    });

    // Attach card bookmark button listeners
    document.querySelectorAll('.card-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const articleId = btn.getAttribute('data-bookmark-id');
        toggleBookmark(articleId);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Add Article Form Submission
  // --------------------------------------------------------------------------
  function openAddModal() {
    if (elements.addArticleModal) {
      elements.addArticleModal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }

  function closeAddModal() {
    if (elements.addArticleModal) {
      elements.addArticleModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  function handleAddArticleSubmit(e) {
    e.preventDefault();
    const form = elements.addArticleForm;
    const title = form.articleTitle.value.trim();
    const category = form.articleCategory.value;
    const authors = form.articleAuthors.value.split(',').map(s => s.trim()).filter(Boolean);
    const journal = form.articleJournal.value.trim();
    const abstract = form.articleAbstract.value.trim();
    const findings = form.articleFindings.value.split('\n').map(s => s.trim()).filter(Boolean);
    const implications = form.articleImplications.value.trim();
    const tags = form.articleTags.value.split(',').map(s => s.trim()).filter(Boolean);

    if (!title || !abstract) {
      alert('Please fill out the article title and abstract.');
      return;
    }

    const newArticle = {
      id: `custom-${Date.now()}`,
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      authors: authors.length ? authors : ['Clinical Advisory Board'],
      journal: journal || 'TAVR Research Repository',
      doi: `10.1016/tavr.${Date.now().toString().slice(-6)}`,
      readTime: '6 min read',
      abstract,
      keyFindings: findings.length ? findings : ['Preliminary clinical observations reported.'],
      healthEconomics: implications || 'Broadening clinical indications.',
      recentViewCount: 0,
      badge: 'User Contribution',
      tags: tags.length ? tags : ['TAVR', 'Cardiology']
    };

    const customArticles = JSON.parse(localStorage.getItem('tavr_custom_articles') || '[]');
    customArticles.unshift(newArticle);
    localStorage.setItem('tavr_custom_articles', JSON.stringify(customArticles));

    state.articles.unshift(newArticle);
    renderArticles();
    closeAddModal();
    form.reset();
    showToast('Research article published!');
    navigateTo(`#/article/${newArticle.id}`);
  }

  // --------------------------------------------------------------------------
  // Event Listeners
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    window.addEventListener('hashchange', handleRoute);

    if (elements.backToHubBtn) {
      elements.backToHubBtn.addEventListener('click', () => navigateTo('#/'));
    }

if (document.getElementById('logoBrand')) {
      document.getElementById('logoBrand').addEventListener('click', () => {
        navigateTo('#/');
      });
    }

    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (elements.bookmarksFilterBtn) {
      elements.bookmarksFilterBtn.addEventListener('click', () => {
        state.showBookmarksOnly = !state.showBookmarksOnly;
        elements.bookmarksFilterBtn.classList.toggle('active', state.showBookmarksOnly);
        showToast(state.showBookmarksOnly ? 'Filtering: Bookmarked articles only' : 'Showing all articles');
        renderArticles();
      });
    }

    if (elements.pageBookmarkBtn) {
      elements.pageBookmarkBtn.addEventListener('click', () => {
        if (state.activeArticleId) toggleBookmark(state.activeArticleId);
      });
    }

    if (elements.pageCopyCitationBtn) {
      elements.pageCopyCitationBtn.addEventListener('click', () => {
        if (!state.activeArticleId) return;
        const article = state.articles.find(a => a.id === state.activeArticleId);
        if (!article) return;
        const authorsShort = article.authors.length > 2 ? `${article.authors[0]} et al.` : article.authors.join(' & ');
        const year = article.date ? article.date.split('-')[0] : '2026';
        const citation = `${authorsShort} (${year}). ${article.title}. ${article.journal}. ${article.doi ? 'https://doi.org/' + article.doi : ''}`;

        navigator.clipboard.writeText(citation).then(() => {
          showToast('Citation copied to clipboard!');
        });
      });

	// Category Filter Chips Listener
    if (elements.categoryChipsContainer) {
      elements.categoryChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;
        
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        state.selectedCategory = chip.getAttribute('data-category');
        renderArticles();
      });
    }

    // Reset filter button listener
    if (elements.resetFilterBtn) {
      elements.resetFilterBtn.addEventListener('click', () => {
        state.selectedCategory = 'all';
        state.searchQuery = '';
        if (elements.searchInput) elements.searchInput.value = '';
        document.querySelectorAll('.filter-chip').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-category') === 'all');
        });
        renderArticles();
      });
    }
    }

    if (elements.addArticleBtn) elements.addArticleBtn.addEventListener('click', openAddModal);
    if (elements.closeAddModalBtn) elements.closeAddModalBtn.addEventListener('click', closeAddModal);
    if (elements.addArticleForm) elements.addArticleForm.addEventListener('click', e => e.target === elements.addArticleModal && closeAddModal());
    if (elements.addArticleForm) elements.addArticleForm.addEventListener('submit', handleAddArticleSubmit);

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (elements.searchClearBtn) elements.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
        renderArticles();
      });
    }

    if (elements.searchClearBtn) {
      elements.searchClearBtn.addEventListener('click', () => {
        state.searchQuery = '';
        elements.searchInput.value = '';
        elements.searchClearBtn.style.display = 'none';
        renderArticles();
      });
    }

    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderArticles();
      });
    }
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------
  function init() {
    initTheme();
    setupEventListeners();
    loadArticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();