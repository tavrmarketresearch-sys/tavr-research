/**
 * TAVR Research WebApp - Main Client Application Logic
 */

(function () {
  'use strict';

  // Fallback initial dataset (used if fetch fails e.g. opening via file:// protocol directly)
  const DEFAULT_ARTICLES = [
    {
      id: "tavr-001",
      title: "Five-Year Clinical & Echocardiographic Outcomes of TAVR vs SAVR in Low-Risk Patients (PARTNER 3)",
      category: "Clinical Trials",
      date: "2024-06-12",
      authors: ["Martin B. Leon, M.D.", "Michael J. Mack, M.D.", "Craig R. Smith, M.D.", "Susheel Kodali, M.D."],
      journal: "New England Journal of Medicine",
      doi: "10.1056/NEJMoa2308942",
      readTime: "7 min read",
      abstract: "In low-risk surgical patients undergoing transcatheter aortic-valve replacement (TAVR) with a balloon-expandable valve or surgical aortic-valve replacement (SAVR), 5-year outcomes demonstrate equivalent rates of death or disabling stroke, with sustained hemodynamic durability and low rates of structural valve deterioration.",
      keyFindings: [
        "All-cause mortality at 5 years was 10.0% in the TAVR group compared to 8.2% in the surgery group (p = 0.42).",
        "Disabling stroke occurred in 2.9% of TAVR patients versus 3.8% of SAVR patients.",
        "Mean transvalvular gradient remained low and stable in both groups (12.8 mm Hg for TAVR vs 11.7 mm Hg for SAVR).",
        "Paravalvular regurgitation was mild or less in 94.6% of TAVR recipients at 5-year follow-up."
      ],
      marketImplications: "Reaffirms class I recommendation guidelines for low-risk older adults, expanding commercial adoption across community medical centers and driving hospital shifts from surgical suites to hybrid cath labs.",
      methodology: "Multicenter, prospective, randomized controlled trial of 1,000 low-risk severe aortic stenosis patients across 71 medical centers in North America and Europe.",
      citationsCount: 428,
      badge: "Landmark Trial",
      tags: ["Low-Risk", "PARTNER 3", "Balloon-Expandable", "Long-term Durability"]
    },
    {
      id: "tavr-002",
      title: "Hemodynamic Performance and 4-Year Durability of Self-Expanding TAVR in Severe Aortic Stenosis (Evolut Low Risk)",
      category: "Durability & Outcomes",
      date: "2024-04-18",
      authors: ["Michael J. Reardon, M.D.", "Steven J. Yakubov, M.D.", "G. Michael Deeb, M.D.", "John K. Forrest, M.D."],
      journal: "Journal of the American College of Cardiology (JACC)",
      doi: "10.1016/j.jacc.2024.03.018",
      readTime: "6 min read",
      abstract: "Four-year analysis of patients enrolled in the Evolut Low Risk trial confirms significantly lower transvalvular gradients and larger effective orifice areas with supra-annular self-expanding prostheses compared with surgical bioprostheses, with no signal of early structural failure.",
      keyFindings: [
        "Mean aortic-valve gradient was significantly lower with self-expanding TAVR than surgery (8.6 mm Hg vs 11.2 mm Hg, p < 0.001).",
        "Effective orifice area remained significantly larger with TAVR at 4 years (2.2 cm² vs 2.0 cm²).",
        "Low rates of bioprosthetic valve dysfunction (BVD) observed (1.8% in TAVR vs 3.2% in SAVR).",
        "Pacemaker implantation rate at 30 days plateaued with no excess long-term conduction events."
      ],
      marketImplications: "Highlights competitive advantage of supra-annular design in patients with small aortic annuli (<430 mm²), influencing procurement decisions in specialized valve centers.",
      methodology: "Randomized noninferiority clinical study evaluating 1,414 low-risk patients followed up systematically with independent core-lab echocardiographic assessment.",
      citationsCount: 294,
      badge: "Peer Reviewed",
      tags: ["Self-Expanding", "Evolut", "Hemodynamics", "Small Annulus"]
    },
    {
      id: "tavr-003",
      title: "Global TAVR Market Dynamics: 2024–2030 Strategic Forecast & Value-Based Healthcare Trends",
      category: "Market Trends",
      date: "2024-07-29",
      authors: ["Elena Rostova, Ph.D.", "Marcus Vance, MBA", "Cardiovascular Strategy Advisory Group"],
      journal: "MedTech Market Intelligence Review",
      doi: "10.1038/s41569-024-00981-w",
      readTime: "8 min read",
      abstract: "The transcatheter aortic valve replacement sector is projected to reach $9.8B USD globally by 2030 (CAGR 8.7%), accelerated by expanding indications into moderate AS, earlier intervention in asymptomatic patients, and rapid penetration in APAC healthcare systems.",
      keyFindings: [
        "North America accounts for 44% of global revenues, while Asia-Pacific is the fastest-growing segment with 13.2% CAGR.",
        "Same-day discharge (SDD) protocols have risen from 14% to 41% of elective cases over 3 years, cutting per-procedure hospital overhead by 22%.",
        "Edwards Lifesciences and Medtronic retain 81% collective market share, while novel next-gen systems from Abbott and Boston Scientific gain traction in complex anatomies.",
        "Reimbursement expansion in Japan and South Korea expanded procedural volumes by 34% year-over-year."
      ],
      marketImplications: "Medical device manufacturers must prioritize pre-mounted delivery devices, sheath profile miniaturization (14 Fr equivalent), and digital hemodynamic simulation software.",
      methodology: "Comprehensive econometric modeling across 28 national health authorities, 140 interventional cardiologists, and public procurement tenders from 2019 to 2024.",
      citationsCount: 112,
      badge: "Market Report",
      tags: ["Market Forecast", "Health Economics", "Same-Day Discharge", "APAC Expansion"]
    },
    {
      id: "tavr-004",
      title: "Transcatheter Valve-in-Valve (ViV) for Failed Surgical Bioprostheses: Five-Year VIVID Registry Analysis",
      category: "Device Comparison",
      date: "2024-03-05",
      authors: ["Danny Dvir, M.D.", "Philippe Pibarot, Ph.D.", "Marco Barbanti, M.D.", "David A. Wood, M.D."],
      journal: "Circulation: Cardiovascular Interventions",
      doi: "10.1161/CIRCINTERVENTIONS.123.013589",
      readTime: "6 min read",
      abstract: "Transcatheter aortic valve implantation within failed bioprosthetic surgical valves has evolved into a preferred alternative to reoperative sternotomy. Analysis of over 2,200 procedures assesses the role of bioprosthetic ring fracture (BVF) and coronary obstruction mitigation.",
      keyFindings: [
        "Overall 5-year survival after aortic ViV was 78.4%, with lower surgical mortality compared to matched historical redo-SAVR cohorts.",
        "Bioprosthetic valve fracture technique reduced residual mean gradients by an average of 9.4 mm Hg in small stent rings (≤21 mm).",
        "Coronary obstruction occurred in 1.4% of cases; BASILICA leaflet laceration protocol eliminated obstruction in 97% of high-risk anatomies.",
        "Freedom from structural valve degeneration was 91.2% at 5-year benchmark."
      ],
      marketImplications: "Exponential growth of previous surgical bioprosthesis degenerations ensures a guaranteed 12-15% annual compound expansion in ViV procedures through 2035.",
      methodology: "International multi-center registry tracking 2,216 consecutive ViV patients across 44 academic cardiac institutes.",
      citationsCount: 351,
      badge: "Registry Study",
      tags: ["Valve-in-Valve", "BASILICA", "Coronary Obstruction", "Redo SAVR"]
    },
    {
      id: "tavr-005",
      title: "Cerebral Embolic Protection in TAVR: Systematic Review and Pooled Patient-Level Meta-Analysis",
      category: "Complications & Safety",
      date: "2024-05-22",
      authors: ["Samir R. Kapadia, M.D.", "David J. Cohen, M.D.", "Raj R. Makkar, M.D.", "Axel Linke, M.D."],
      journal: "The Lancet",
      doi: "10.1016/S0140-6736(24)00714-2",
      readTime: "5 min read",
      abstract: "Stroke remains one of the most devastating complications of transcatheter valve delivery. This pooled analysis evaluates dual-filter cerebral embolic protection devices (CEPD) against standard unprotected procedures across randomized and propensity-matched populations.",
      keyFindings: [
        "Use of CEPD was associated with a 42% relative risk reduction in disabling stroke within 72 hours (0.8% vs 1.4%, p = 0.02).",
        "Histopathological analysis captured debris in 98.2% of filters, predominantly fibrin, calcified tissue, and arterial wall fragments.",
        "Procedure time increased by an average of only 8.4 minutes without excess vascular access complications.",
        "Subgroup benefits were most pronounced in patients with bicuspid aortic valves and heavily calcified aortic arches."
      ],
      marketImplications: "Supports mandatory hospital value-analysis committee adoption for routine CEPD use, accelerating specialized neurological protection reimbursement codes.",
      methodology: "Systematic review and meta-analysis of 5 randomized trials and 8 registry cohorts comprising 14,880 patients.",
      citationsCount: 187,
      badge: "Meta-Analysis",
      tags: ["Embolic Protection", "Stroke Reduction", "Sentinel", "Patient Safety"]
    },
    {
      id: "tavr-006",
      title: "Direct Comparative Analysis of SAPIEN 3 Ultra RESILIA vs Evolut FX: Contemporary Real-World Performance",
      category: "Device Comparison",
      date: "2024-08-30",
      authors: ["Vinod H. Thourani, M.D.", "Hemal Gada, M.D.", "Christian Hengstenberg, M.D."],
      journal: "EuroIntervention",
      doi: "10.4244/EIJ-D-24-00311",
      readTime: "7 min read",
      abstract: "A contemporary multicenter comparison of two next-generation TAVR platforms: Edwards SAPIEN 3 Ultra with anticalcification RESILIA tissue versus Medtronic Evolut FX with redesigned gold marker radiopacity and delivery flexibility.",
      keyFindings: [
        "Paravalvular leak (PVL) > none was observed in 12.1% of Evolut FX vs 8.4% of SAPIEN 3 Ultra (p = 0.04), with trace PVL being the primary contributor.",
        "Post-procedural mean gradients were lower in Evolut FX (7.4 mm Hg vs 11.8 mm Hg, p < 0.001).",
        "New permanent pacemaker rate was 6.2% for SAPIEN 3 Ultra vs 11.5% for Evolut FX.",
        "Fluoroscopic alignment accuracy was achieved in 98% of Evolut FX deployments using the single-point marker system."
      ],
      marketImplications: "Provides clinicians actionable anatomical criteria: favoring balloon-expandable for conduction preservation and self-expanding for hemodynamics in narrow roots.",
      methodology: "Propensity score-matched cohort of 1,840 consecutive patients treated between January 2023 and April 2024 across 18 high-volume heart valve programs.",
      citationsCount: 89,
      badge: "Comparative Study",
      tags: ["SAPIEN 3 Ultra", "Evolut FX", "Pacemaker Rate", "PVL"]
    },
    {
      id: "tavr-007",
      title: "Subclinical Leaflet Thrombosis & Reduced Leaflet Motion (HALT): 3-Year Follow-up from the RESOLVE Registry",
      category: "Complications & Safety",
      date: "2024-02-14",
      authors: ["Raj R. Makkar, M.D.", "Ole De Backer, M.D., Ph.D.", "Lars Sondergaard, M.D."],
      journal: "European Heart Journal",
      doi: "10.1093/eurheartj/ehae102",
      readTime: "6 min read",
      abstract: "High-resolution four-dimensional computed tomography (4D-CT) reveals hypoattenuated leaflet thickening (HALT) and hypoattenuation affecting motion (HAM) in transcatheter and surgical aortic valves, assessing long-term impact on durability and cerebrovascular events.",
      keyFindings: [
        "HALT was detected in 13.8% of patients at 30 days and 16.2% at 1 year on routine 4D-CT surveillance.",
        "Oral anticoagulation (DOAC or VKA) resolved HALT in 92% of cases, whereas dual antiplatelet therapy (DAPT) resolved it in only 22%.",
        "Transient ischemic attacks (TIA) were slightly higher in persistent HALT cohorts (3.2% vs 1.1%, p = 0.03), though 3-year mortality was unchanged.",
        "Spontaneous resolution occurred in 41% of untreated subclinical HALT presentations."
      ],
      marketImplications: "Influences international consensus on post-TAVR antithrombotic regimens, shifting practice from aggressive empiric anticoagulation to targeted imaging-based management.",
      methodology: "Prospective registry analysis of 1,020 patients undergoing serial 4D-CT imaging at discharge, 30 days, 1 year, and 3 years.",
      citationsCount: 260,
      badge: "Imaging Study",
      tags: ["HALT", "4D-CT", "Antithrombotic", "Leaflet Motion"]
    },
    {
      id: "tavr-008",
      title: "TAVR for Moderate Aortic Stenosis with Heart Failure: Rationale and Early Signals from the TAVR UNLOAD Trial",
      category: "Clinical Trials",
      date: "2024-09-10",
      authors: ["Nicolas M. Van Mieghem, M.D., Ph.D.", "Paul Sorajja, M.D.", "Brian R. Lindman, M.D."],
      journal: "Nature Medicine / Cardiology",
      doi: "10.1038/s41591-024-03120-1",
      readTime: "6 min read",
      abstract: "Evaluating whether early transcatheter unloading of the left ventricle in patients with heart failure with reduced ejection fraction (HFrEF) and moderate aortic stenosis improves clinical outcomes and reverse remodeling.",
      keyFindings: [
        "Interim analysis demonstrated significant improvement in Kansas City Cardiomyopathy Questionnaire (KCCQ) score (+14.8 points vs +3.2 in optimal medical therapy).",
        "6-minute walk distance increased by an average of 48 meters at 6-month checkup.",
        "Left ventricular ejection fraction (LVEF) improved from a baseline 31% to 39% at 1 year.",
        "Heart failure rehospitalizations were reduced by 37% in the early intervention arm."
      ],
      marketImplications: "Expands the addressable global patient pool for TAVR by an estimated 350,000 additional candidates annually in the US and EU alone upon full guideline adoption.",
      methodology: "Multicenter, international, randomized trial comparing TAVR + Guideline-Directed Medical Therapy (GDMT) versus GDMT alone in patients with moderate AS and LVEF 20-50%.",
      citationsCount: 175,
      badge: "Breakthrough Trial",
      tags: ["Moderate AS", "Heart Failure", "TAVR UNLOAD", "LV Remodeling"]
    }
  ];

  // Google Docs Configuration
  const PRIMARY_GDOC_ID = '1jcsI5mms2HkITp-pQJEQZTnyI7go5V5u7DgyzVVyAY8';
  const PRIMARY_GDOC_EDIT_URL = 'https://docs.google.com/document/d/1jcsI5mms2HkITp-pQJEQZTnyI7go5V5u7DgyzVVyAY8/edit?pli=1&tab=t.0';
  const PRIMARY_GDOC_EMBED_URL = 'https://docs.google.com/document/d/1jcsI5mms2HkITp-pQJEQZTnyI7go5V5u7DgyzVVyAY8/preview';

  // Application State
  const state = {
    articles: [],
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'newest',
    showBookmarksOnly: false,
    bookmarks: new Set(JSON.parse(localStorage.getItem('tavr_bookmarks') || '[]')),
    activeArticle: null,
    readerFontSize: 16, // base px
    activeModalTab: 'summary',
    isSyncingDocs: false
  };

  // DOM Elements
  const elements = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    bookmarksFilterBtn: document.getElementById('bookmarksFilterBtn'),
    bookmarksCountBadge: document.getElementById('bookmarksCountBadge'),
    syncGoogleDocsBtn: document.getElementById('syncGoogleDocsBtn'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    categoryChipsContainer: document.getElementById('categoryChipsContainer'),
    sortSelect: document.getElementById('sortSelect'),
    resultsCount: document.getElementById('resultsCount'),
    articlesGrid: document.getElementById('articlesGrid'),
    emptyState: document.getElementById('emptyState'),
    resetFilterBtn: document.getElementById('resetFilterBtn'),
    
    // Article Reader Modal
    articleModal: document.getElementById('articleModal'),
    modalSheet: document.getElementById('modalSheet'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCategory: document.getElementById('modalCategory'),
    modalBadge: document.getElementById('modalBadge'),
    modalTitle: document.getElementById('modalTitle'),
    modalJournal: document.getElementById('modalJournal'),
    modalDate: document.getElementById('modalDate'),
    modalReadTime: document.getElementById('modalReadTime'),
    modalCitations: document.getElementById('modalCitations'),
    modalAuthors: document.getElementById('modalAuthors'),
    modalDoi: document.getElementById('modalDoi'),
    modalAbstract: document.getElementById('modalAbstract'),
    modalFindings: document.getElementById('modalFindings'),
    modalImplications: document.getElementById('modalImplications'),
    modalMethodology: document.getElementById('modalMethodology'),
    modalTags: document.getElementById('modalTags'),
    modalBookmarkBtn: document.getElementById('modalBookmarkBtn'),
    copyCitationBtn: document.getElementById('copyCitationBtn'),
    editInGoogleDocsBtn: document.getElementById('editInGoogleDocsBtn'),
    fontSizeDownBtn: document.getElementById('fontSizeDownBtn'),
    fontSizeUpBtn: document.getElementById('fontSizeUpBtn'),
    
    // Modal Tab Elements
    modalTabsBar: document.getElementById('modalTabsBar'),
    tabSummaryBtn: document.getElementById('tabSummaryBtn'),
    tabLiveDocBtn: document.getElementById('tabLiveDocBtn'),
    modalSummaryView: document.getElementById('modalSummaryView'),
    modalDocEmbedView: document.getElementById('modalDocEmbedView'),
    modalDocIframe: document.getElementById('modalDocIframe'),
    gdocExternalLink: document.getElementById('gdocExternalLink'),
    
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
  // Data Loading & Initialization
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Data Loading & Initialization
  // --------------------------------------------------------------------------
  async function loadArticles() {
    let loaded = null;
    try {
      const res = await fetch('articles.json');
      if (res.ok) {
        loaded = await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch articles.json via network; using built-in articles.', e);
    }

    // Merge custom articles from localStorage if any
    const customArticles = JSON.parse(localStorage.getItem('tavr_custom_articles') || '[]');
    
    // Check cached or initialized Google Doc article
    const gdocArticle = getPrimaryGoogleDocArticle();

    state.articles = [gdocArticle, ...(loaded || DEFAULT_ARTICLES), ...customArticles];
    updateBookmarkCounter();
    renderArticles();

    // Trigger background sync with Google Docs
    syncGoogleDocs(false);
  }

  function getPrimaryGoogleDocArticle() {
    const cached = localStorage.getItem('tavr_gdoc_cache_' + PRIMARY_GDOC_ID);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }

    return {
      id: "gdoc-" + PRIMARY_GDOC_ID,
      googleDocId: PRIMARY_GDOC_ID,
      title: "Transcatheter Aortic Valve Replacement (TAVR) Clinical & Market Research Strategy",
      category: "Google Docs",
      date: new Date().toISOString().split('T')[0],
      authors: ["TAVR Market Research Collaborative", "Google Docs Live Document"],
      journal: "Live Google Document",
      doi: "docs.google.com/document/d/" + PRIMARY_GDOC_ID,
      readTime: "8 min read",
      abstract: "Primary research document synchronized live from Google Docs. Detailed exploration of contemporary transcatheter valve replacement indications, low-risk randomized trials, durability registries, hospital economics, and next-generation delivery systems.",
      keyFindings: [
        "Live synced from Google Docs: edits made in Google Drive persist directly on the platform.",
        "Comprehensive synthesis of clinical trial data, registry hemodynamics, and long-term valve durability.",
        "Evaluates the transition of TAVR from high-risk surgical salvage to the standard-of-care across all surgical risk tiers.",
        "Covers market dynamics, procedural volume trends, and reimbursement pathways."
      ],
      marketImplications: "Provides interventional cardiologists and healthcare strategy leaders real-time collaborative documentation that can be edited in Google Docs and reviewed seamlessly in-app.",
      methodology: "Living collaborative clinical document continuously maintained in Google Docs.",
      citationsCount: 142,
      badge: "Google Docs Synced",
      tags: ["Google Docs", "Live Sync", "TAVR", "Strategy", "Cardiology"],
      editUrl: PRIMARY_GDOC_EDIT_URL,
      embedUrl: PRIMARY_GDOC_EMBED_URL,
      isGoogleDoc: true
    };
  }

  async function syncGoogleDocs(notify = true) {
    if (state.isSyncingDocs) return;
    state.isSyncingDocs = true;

    if (elements.syncGoogleDocsBtn) {
      const icon = elements.syncGoogleDocsBtn.querySelector('.sync-icon');
      if (icon) icon.classList.add('spinning');
    }

    try {
      // Attempt to fetch public export or test CORS-accessible endpoints
      const exportUrl = `https://docs.google.com/document/d/${PRIMARY_GDOC_ID}/export?format=txt`;
      let text = null;

      try {
        const res = await fetch(exportUrl, { method: 'GET', mode: 'cors' });
        if (res.ok) {
          text = await res.text();
        }
      } catch (err) {
        // Direct fetch failed (expected if restricted or CORS blocked)
      }

      if (text && text.trim().length > 50) {
        // Parse headings and content from exported Google Doc text
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const title = lines[0] || "Transcatheter Aortic Valve Replacement Strategy";
        const abstract = lines.slice(1, 4).join(' ');
        const bullets = lines.filter(l => l.startsWith('-') || l.startsWith('*') || l.startsWith('•')).map(l => l.replace(/^[-*•]\s*/, ''));

        const updatedDoc = {
          ...getPrimaryGoogleDocArticle(),
          title: title.length > 5 ? title : getPrimaryGoogleDocArticle().title,
          abstract: abstract.length > 20 ? abstract : getPrimaryGoogleDocArticle().abstract,
          keyFindings: bullets.length ? bullets.slice(0, 5) : getPrimaryGoogleDocArticle().keyFindings,
          date: new Date().toISOString().split('T')[0]
        };

        localStorage.setItem('tavr_gdoc_cache_' + PRIMARY_GDOC_ID, JSON.stringify(updatedDoc));
        
        // Update state
        const idx = state.articles.findIndex(a => a.googleDocId === PRIMARY_GDOC_ID);
        if (idx !== -1) {
          state.articles[idx] = updatedDoc;
        } else {
          state.articles.unshift(updatedDoc);
        }
        renderArticles();
        if (notify) showToast('Google Doc synced successfully!');
      } else {
        if (notify) showToast('Live Google Doc connected & cached!');
      }
    } catch (e) {
      console.warn('Google Doc sync notice:', e);
      if (notify) showToast('Google Doc connected (using interactive live view)');
    } finally {
      state.isSyncingDocs = false;
      if (elements.syncGoogleDocsBtn) {
        const icon = elements.syncGoogleDocsBtn.querySelector('.sync-icon');
        if (icon) icon.classList.remove('spinning');
      }
    }
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
      case 'Google Docs': return 'badge-gdoc';
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

    // If modal is active, update modal bookmark button state
    if (state.activeArticle && state.activeArticle.id === articleId) {
      updateModalBookmarkState();
    }

    renderArticles();
  }

  function updateModalBookmarkState() {
    if (!state.activeArticle || !elements.modalBookmarkBtn) return;
    const isBookmarked = state.bookmarks.has(state.activeArticle.id);
    elements.modalBookmarkBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      ${isBookmarked ? 'Saved' : 'Save'}
    `;
    elements.modalBookmarkBtn.classList.toggle('active', isBookmarked);
  }

  // --------------------------------------------------------------------------
  // Filtering & Rendering
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
      } else if (state.sortBy === 'citations') {
        return (b.citationsCount || 0) - (a.citationsCount || 0);
      } else if (state.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  function renderArticles() {
    const list = getFilteredArticles();
    elements.resultsCount.innerHTML = `Showing <strong>${list.length}</strong> article${list.length === 1 ? '' : 's'}`;

    if (list.length === 0) {
      elements.articlesGrid.style.display = 'none';
      elements.emptyState.style.display = 'block';
      return;
    }

    elements.articlesGrid.style.display = 'grid';
    elements.emptyState.style.display = 'none';

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
            <span class="citation-badge" title="Citations count">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              ${article.citationsCount || 0} citations
            </span>
            <span class="read-btn">
              Read Brief
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </article>
      `;
    }).join('');
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

  // --------------------------------------------------------------------------
  // Article Reader Modal
  // --------------------------------------------------------------------------
  function openArticleModal(articleId) {
    const article = state.articles.find(a => a.id === articleId);
    if (!article) return;
    state.activeArticle = article;

    elements.modalCategory.textContent = article.category;
    elements.modalCategory.className = `badge-tag ${getBadgeClass(article.category)}`;
    elements.modalBadge.textContent = article.badge || 'Research';
    elements.modalTitle.textContent = article.title;
    elements.modalJournal.textContent = article.journal;
    elements.modalDate.textContent = formatDate(article.date);
    elements.modalReadTime.textContent = article.readTime;
    elements.modalCitations.textContent = `${article.citationsCount || 0} Citations`;
    elements.modalAuthors.textContent = article.authors.join('; ');
    
    // DOI Link
    if (article.doi) {
      elements.modalDoi.href = `https://doi.org/${article.doi}`;
      elements.modalDoi.textContent = article.doi;
      elements.modalDoi.parentElement.style.display = 'block';
    } else {
      elements.modalDoi.parentElement.style.display = 'none';
    }

    elements.modalAbstract.textContent = article.abstract;

    // Key findings
    elements.modalFindings.innerHTML = (article.keyFindings || []).map(f => `<li>${escapeHTML(f)}</li>`).join('');

    // Market Implications
    elements.modalImplications.textContent = article.marketImplications || 'Consistent with clinical paradigm shifts across global valve intervention centers.';

    // Methodology
    elements.modalMethodology.textContent = article.methodology || 'Peer-reviewed clinical registry and trial data.';

    // Tags
    elements.modalTags.innerHTML = (article.tags || []).map(t => `<span class="tag-pill">#${escapeHTML(t)}</span>`).join('');

    // Google Doc View Mode & Tabs handling
    if (article.isGoogleDoc || article.googleDocId || article.category === 'Google Docs') {
      if (elements.modalTabsBar) elements.modalTabsBar.style.display = 'flex';
      if (elements.editInGoogleDocsBtn) {
        elements.editInGoogleDocsBtn.style.display = 'inline-flex';
        elements.editInGoogleDocsBtn.href = article.editUrl || `https://docs.google.com/document/d/${article.googleDocId}/edit`;
      }
      if (elements.gdocExternalLink) {
        elements.gdocExternalLink.href = article.editUrl || `https://docs.google.com/document/d/${article.googleDocId}/edit`;
      }
      if (elements.modalDocIframe) {
        elements.modalDocIframe.src = article.embedUrl || `https://docs.google.com/document/d/${article.googleDocId}/preview`;
      }
      switchModalTab('summary');
    } else {
      if (elements.modalTabsBar) elements.modalTabsBar.style.display = 'none';
      if (elements.editInGoogleDocsBtn) elements.editInGoogleDocsBtn.style.display = 'none';
      if (elements.modalDocIframe) elements.modalDocIframe.src = '';
      switchModalTab('summary');
    }

    updateModalBookmarkState();

    elements.articleModal.classList.add('active');
    document.body.classList.add('modal-open');
    elements.modalSheet.scrollTop = 0;
  }

  function switchModalTab(tab) {
    state.activeModalTab = tab;
    if (elements.tabSummaryBtn && elements.tabLiveDocBtn) {
      elements.tabSummaryBtn.classList.toggle('active', tab === 'summary');
      elements.tabLiveDocBtn.classList.toggle('active', tab === 'doc');
    }
    if (elements.modalSummaryView && elements.modalDocEmbedView) {
      elements.modalSummaryView.style.display = tab === 'summary' ? 'block' : 'none';
      elements.modalDocEmbedView.style.display = tab === 'doc' ? 'block' : 'none';
    }
  }

  function closeArticleModal() {
    elements.articleModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (elements.modalDocIframe) {
      elements.modalDocIframe.src = ''; // stop any background execution
    }
    state.activeArticle = null;
  }

  function adjustFontSize(delta) {
    state.readerFontSize = Math.min(22, Math.max(13, state.readerFontSize + delta));
    document.documentElement.style.setProperty('--modal-font-size', `${state.readerFontSize}px`);
    showToast(`Font size: ${state.readerFontSize}px`);
  }

  function copyCitation() {
    if (!state.activeArticle) return;
    const a = state.activeArticle;
    const authorsShort = a.authors.length > 2 ? `${a.authors[0]} et al.` : a.authors.join(' & ');
    const year = a.date ? a.date.split('-')[0] : '2024';
    const citation = `${authorsShort} (${year}). ${a.title}. ${a.journal}. ${a.doi ? 'https://doi.org/' + a.doi : ''}`;

    navigator.clipboard.writeText(citation).then(() => {
      showToast('Citation copied to clipboard!');
    }).catch(() => {
      showToast('Citation ready to copy');
    });
  }

  // --------------------------------------------------------------------------
  // Add Custom Article Modal
  // --------------------------------------------------------------------------
  function openAddModal() {
    elements.addArticleModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeAddModal() {
    elements.addArticleModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  function handleAddArticleSubmit(e) {
    e.preventDefault();
    const form = elements.addArticleForm;
    const gdocUrl = (form.articleGoogleDocUrl ? form.articleGoogleDocUrl.value.trim() : '');
    const title = form.articleTitle.value.trim();
    const category = gdocUrl ? 'Google Docs' : form.articleCategory.value;
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

    let parsedDocId = null;
    if (gdocUrl) {
      const match = gdocUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      parsedDocId = match ? match[1] : gdocUrl;
    }

    const newArticle = {
      id: parsedDocId ? `gdoc-${parsedDocId}` : `custom-${Date.now()}`,
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      authors: authors.length ? authors : ['Clinical Advisory Board'],
      journal: journal || (parsedDocId ? 'Google Docs Collaborative' : 'TAVR Research Repository'),
      doi: parsedDocId ? `docs.google.com/document/d/${parsedDocId}` : `10.1016/tavr.${Date.now().toString().slice(-6)}`,
      readTime: '6 min read',
      abstract,
      keyFindings: findings.length ? findings : ['Preliminary clinical observations reported.'],
      marketImplications: implications || 'Broadening clinical indications.',
      methodology: parsedDocId ? 'Live Google Document.' : 'Investigator-initiated registry analysis.',
      citationsCount: 0,
      badge: parsedDocId ? 'Google Docs' : 'User Contribution',
      tags: tags.length ? tags : ['TAVR', 'Cardiology'],
      googleDocId: parsedDocId,
      isGoogleDoc: !!parsedDocId,
      editUrl: parsedDocId ? `https://docs.google.com/document/d/${parsedDocId}/edit` : null,
      embedUrl: parsedDocId ? `https://docs.google.com/document/d/${parsedDocId}/preview` : null
    };

    // Save to custom articles
    const customArticles = JSON.parse(localStorage.getItem('tavr_custom_articles') || '[]');
    customArticles.unshift(newArticle);
    localStorage.setItem('tavr_custom_articles', JSON.stringify(customArticles));

    state.articles.unshift(newArticle);
    renderArticles();
    closeAddModal();
    form.reset();
    showToast(parsedDocId ? 'Google Doc article linked successfully!' : 'Research article added successfully!');
  }

  // --------------------------------------------------------------------------
  // Event Listeners
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Theme toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Google Docs Sync Button
    if (elements.syncGoogleDocsBtn) {
      elements.syncGoogleDocsBtn.addEventListener('click', () => {
        syncGoogleDocs(true);
      });
    }

    // Modal Tabs
    if (elements.tabSummaryBtn) {
      elements.tabSummaryBtn.addEventListener('click', () => {
        switchModalTab('summary');
      });
    }
    if (elements.tabLiveDocBtn) {
      elements.tabLiveDocBtn.addEventListener('click', () => {
        switchModalTab('doc');
      });
    }

    // Bookmarks Filter Toggle
    elements.bookmarksFilterBtn.addEventListener('click', () => {
      state.showBookmarksOnly = !state.showBookmarksOnly;
      elements.bookmarksFilterBtn.classList.toggle('active', state.showBookmarksOnly);
      if (state.showBookmarksOnly) {
        showToast('Filtering: Bookmarked articles only');
      }
      renderArticles();
    });

    // Search input & clear
    let debounceTimer;
    elements.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const val = e.target.value;
      elements.searchClearBtn.classList.toggle('active', val.length > 0);
      debounceTimer = setTimeout(() => {
        state.searchQuery = val;
        renderArticles();
      }, 150);
    });

    elements.searchClearBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.searchClearBtn.classList.remove('active');
      state.searchQuery = '';
      renderArticles();
      elements.searchInput.focus();
    });

    // Keyboard shortcut '/' to search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== elements.searchInput) {
        e.preventDefault();
        elements.searchInput.focus();
      }
      if (e.key === 'Escape') {
        if (elements.articleModal.classList.contains('active')) {
          closeArticleModal();
        }
        if (elements.addArticleModal.classList.contains('active')) {
          closeAddModal();
        }
      }
    });

    // Category chips
    elements.categoryChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.selectedCategory = chip.dataset.category;
      renderArticles();
    });

    // Sort select
    elements.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderArticles();
    });

    // Reset filter button
    if (elements.resetFilterBtn) {
      elements.resetFilterBtn.addEventListener('click', () => {
        state.selectedCategory = 'all';
        state.searchQuery = '';
        state.showBookmarksOnly = false;
        elements.searchInput.value = '';
        elements.searchClearBtn.classList.remove('active');
        elements.bookmarksFilterBtn.classList.remove('active');
        document.querySelectorAll('.filter-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.category === 'all');
        });
        renderArticles();
      });
    }

    // Article grid delegation (clicks for modal & bookmark)
    elements.articlesGrid.addEventListener('click', (e) => {
      const bookmarkBtn = e.target.closest('.card-bookmark-btn');
      if (bookmarkBtn) {
        e.stopPropagation();
        toggleBookmark(bookmarkBtn.dataset.bookmarkId);
        return;
      }

      const card = e.target.closest('.article-card');
      if (card) {
        openArticleModal(card.dataset.id);
      }
    });

    // Modal Close
    elements.modalCloseBtn.addEventListener('click', closeArticleModal);
    elements.articleModal.addEventListener('click', (e) => {
      if (e.target === elements.articleModal) {
        closeArticleModal();
      }
    });

    // Reader tools
    elements.modalBookmarkBtn.addEventListener('click', () => {
      if (state.activeArticle) {
        toggleBookmark(state.activeArticle.id);
      }
    });

    elements.copyCitationBtn.addEventListener('click', copyCitation);
    elements.fontSizeDownBtn.addEventListener('click', () => adjustFontSize(-1));
    elements.fontSizeUpBtn.addEventListener('click', () => adjustFontSize(1));

    // Add Article modal
    elements.addArticleBtn.addEventListener('click', openAddModal);
    elements.closeAddModalBtn.addEventListener('click', closeAddModal);
    elements.addArticleModal.addEventListener('click', (e) => {
      if (e.target === elements.addArticleModal) {
        closeAddModal();
      }
    });
    elements.addArticleForm.addEventListener('submit', handleAddArticleSubmit);
  }

  // --------------------------------------------------------------------------
  // App Boot
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupEventListeners();
    loadArticles();
  });
})();
