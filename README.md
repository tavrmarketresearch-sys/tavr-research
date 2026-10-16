# TAVR Research Hub

A mobile-friendly, responsive, and modern web application engineered to display clinical trials, device comparisons, durability registries, and market research for Transcatheter Aortic Valve Replacement (TAVR).

Designed with zero external runtime dependencies, providing high performance, accessibility, and instant deployment across desktop, tablet, and mobile devices.

---

## ✨ Features

- **📱 Mobile-First Responsive Design**: Fluid layout adapting seamlessly from smartphone screens to ultra-wide desktop monitors, featuring touch-optimized cards, safe-area inset handling, and mobile slide-over drawers.
- **⚡ Instant Real-Time Search**: Search articles dynamically across titles, abstracts, author rosters, trial names, journals, and keywords with keyboard shortcut support (`/`).
- **🏷️ Topic & Category Filtering**: Filter by specialized clinical categories including *Clinical Trials*, *Durability & Outcomes*, *Market Trends*, *Device Comparison*, and *Complications & Safety*.
- **📖 Comprehensive Article Reader**:
  - Full structured study view (Abstract, Key Findings, Market Implications, Study Methodology, Tags, DOI link).
  - Reader typography scaling (`A-` / `A+` controls) for optimal legibility.
  - One-click APA citation copy to clipboard.
- **🔖 Saved Bookmarks**: Save favorite articles locally with single-tap bookmarking stored in `localStorage`.
- **🌓 Dark & Light Modes**: Native theme switching with system preference detection and saved settings.
- **✍️ Interactive Article Submission**: Add custom research briefs directly through a built-in modal form.
- **🚀 Zero Build Dependencies**: No Node.js build step or package installations required; runs directly in any modern web browser or via GitHub Pages.

---

## 🚀 Quick Start

### 1. View Directly in Browser
Double-click `index.html` in any browser or open via your terminal:
```bash
start index.html
```

### 2. Run with Python's Built-in Server (Optional)
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

---

## 🌐 GitHub Pages Deployment

To host this web application for free on GitHub Pages:
1. Navigate to your repository on GitHub: `https://github.com/tavrmarketresearch-sys/tavr-research`.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
4. Click **Save**. The webapp will be live at `https://tavrmarketresearch-sys.github.io/tavr-research/`.

---

## 📁 Project Structure

```
├── index.html        # Main HTML5 application shell and modal templates
├── styles.css        # Responsive CSS3 design system with light/dark theme variables
├── app.js            # Client application logic, search, filters, modals, and storage
├── articles.json     # Curated initial database of TAVR clinical and market studies
├── .gitignore        # Git ignore rules
└── README.md         # Documentation
```

---

## 📄 License
MIT License. Open for clinical research and academic health economics analysis.
