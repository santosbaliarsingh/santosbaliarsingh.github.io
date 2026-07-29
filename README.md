# Faculty Website — Santos Panda

A modern, single-page academic faculty website built with **plain HTML, CSS and
vanilla JavaScript only** — no frameworks, no build step, no backend. Ready to
deploy directly to GitHub Pages.

## 📁 Project Structure

```
faculty-site/
├── index.html          # The entire site (all sections, single page)
├── style.css            # All styling (CSS variables at the top)
├── script.js             # All interactivity (typing effect, filters, dark mode, etc.)
├── 404.html              # Custom "page not found" page
├── robots.txt            # Search-engine crawl rules
├── sitemap.xml            # Sitemap for SEO
├── favicon.ico
├── README.md
├── images/               # Photos: profile, research, gallery, projects
├── cv/                   # CV and statement PDFs
└── publications/         # Publication PDFs, slides, datasets
```

Everything placeholder is marked in the HTML with an `<!-- REPLACE -->`
comment or a small orange "Placeholder" note under the relevant section —
search the file for `REPLACE` to find every spot that needs your real
information.

## ✏️ How to Edit Content

Open `index.html` in any text editor. It is one long file split into clearly
commented sections (`<!-- ===== SECTION NAME ===== -->` style comments are
inside `style.css`; in the HTML each `<section id="...">` is labelled).

- **Name / title / department** — edit the `<title>` tag, the hero section
  (`id="home"`), and the `<meta>` tags near the top of `<head>`.
- **Biography, education, experience, skills** — edit the `#about` section.
- **Research areas** — each card in `#research` is a `<div class="card research-card">`.
  Copy a card to add a new research area.
- **Contact details** — edit the `#contact` section (address, email, phone,
  map embed URL, social links).

## ➕ How to Add a Publication

Find the `#publications` section and copy one `<article class="pub-card">`
block, then edit:

```html
<article class="card pub-card reveal" data-type="journal">
  <div class="pub-top">
    <h3 class="pub-title">Your Paper Title</h3>
    <div class="pub-badges"><span class="badge">SCI</span><span class="badge badge-alt">2026</span></div>
  </div>
  <p class="pub-meta">Author list — <em>Venue</em>, Year</p>
  <div class="pub-actions">
    <a href="publications/your-file.pdf">PDF</a>
    <a href="https://doi.org/...">DOI</a>
    <a href="#">Code</a>
    <button class="copy-bibtex" data-bibtex="@article{...}">BibTeX</button>
  </div>
</article>
```

`data-type` must be one of: `journal`, `conference`, `book-chapter`, `patent` —
this is what the filter buttons and search box match against. No JavaScript
changes are needed; the search/filter logic already scans every `.pub-card`
on the page.

## ➕ How to Add a Project

Copy a `<div class="card project-card">` block inside `#projects` and edit
the funding agency, budget, duration, role, collaborators and gallery images.

## 🖼️ How to Upload / Replace Images

1. Add your image file to the `images/` folder (JPG or PNG, ideally under
   500 KB each so the site stays fast).
2. Update the matching `src="images/your-file.jpg"` attribute in `index.html`
   — or simply overwrite an existing placeholder file with the **same
   filename** and skip editing the HTML entirely.
3. Always keep a descriptive `alt="..."` attribute for accessibility and SEO.

Placeholder images currently in `images/` are simple generated graphics —
replace every one of them with real photos before publishing.

## 🚀 How to Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `faculty-website`).
2. Push all these files to the repository root (or to a `docs/` folder — see
   step 4).
3. On GitHub, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch",
   pick the `main` branch and the `/ (root)` folder, then **Save**.
5. Wait 1–2 minutes; your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.
6. Update the placeholder URLs in `index.html` (`og:url`, `canonical`,
   the JSON-LD `url`), `robots.txt`, and `sitemap.xml` to match your real
   GitHub Pages URL.

## 🎨 How to Customize Colors

All colors are defined once, at the top of `style.css`, as CSS variables:

```css
:root {
  --color-primary: #003366;   /* headings, primary accents */
  --color-secondary: #0056b3; /* gradient / secondary accents */
  --color-accent: #1976d2;    /* links, buttons, highlights */
  --color-bg: #ffffff;
  --color-bg-alt: #f6f7fb;    /* alternating section background */
  --color-text: #222222;
}
```

Change a value once here and it updates everywhere on the site. Dark mode
colors live just below, under `[data-theme="dark"]`.

## 📊 How to Add Google Analytics

Paste this snippet right before the closing `</head>` tag in `index.html`
(replace `G-XXXXXXXXXX` with your GA4 Measurement ID):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🧩 Features Included

- Sticky, responsive navigation with active-section highlighting
- Animated typing effect in the hero (AI / ML / DL / NLP / Generative AI)
- Dark mode toggle (remembers choice using `localStorage`)
- Scroll-reveal animations and animated stat counters
- Publications search + type filters + one-click BibTeX copy
- Teaching tabs (current/previous) and student tabs (PhD/MTech/BTech)
- Filterable masonry photo gallery with a lightbox
- Frontend-only contact form (see note below)
- Back-to-top button, print-friendly styling, custom 404 page
- SEO: meta description/keywords, Open Graph, Twitter Card, JSON-LD,
  `sitemap.xml`, `robots.txt`

### Making the contact form actually send email

The form in `#contact` has no backend by design (this is a static site).
To receive submissions, sign up for a free plan on a form service such as
[Formspree](https://formspree.io), [Getform](https://getform.io), or
[EmailJS](https://www.emailjs.com), then either:

- point the `<form>`'s `action` attribute at the service's endpoint (simplest,
  works without touching `script.js`), or
- replace the `fetch`/API call inside the `contact-form` submit handler in
  `script.js` with the service's JS SDK call.

## ♿ Accessibility Notes

- All interactive elements are keyboard-reachable with a visible focus ring.
- A "Skip to main content" link is included for screen-reader/keyboard users.
- Images require real `alt` text — update every placeholder `alt` attribute.
- Respects `prefers-reduced-motion` (animations are disabled automatically).

## ⚡ Performance Notes

- No external JS/CSS frameworks — only two Google Fonts requests.
- Images use `loading="lazy"` (except the above-the-fold hero photo).
- Replace the generated placeholder JPGs with compressed, appropriately
  sized real photos to keep Lighthouse scores high.

## 🖨️ Print-Friendly CV

Printing `index.html` (Ctrl/Cmd+P) automatically hides the navigation,
footer, gallery filters, and floating buttons via the `@media print` rules
in `style.css`, leaving a cleaner printed page. For a true one-page CV,
use the file in `cv/cv-placeholder.pdf` instead.

---

Replace this README's project name and any remaining placeholder text
before publishing. Good luck with the site!
