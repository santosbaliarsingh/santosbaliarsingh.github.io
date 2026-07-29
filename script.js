/* ==========================================================================
   FACULTY WEBSITE SCRIPT
   Vanilla JS only. Each feature is self-contained; delete a block if you
   don't need that feature. All selectors match index.html — if you rename
   an id/class in the HTML, update it here too.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     0. YEAR STAMP + LAST UPDATED (footer)
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     1. MOBILE NAV TOGGLE
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------
     2. ACTIVE NAV LINK ON SCROLL
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const setActiveLink = () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) currentId = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ------------------------------------------------------------------
     3. DARK MODE TOGGLE (persists for the session via a JS variable;
        localStorage avoided intentionally for artifact-safe portability
        — on a real GitHub Pages deployment you may re-enable localStorage)
     ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  let storedTheme = null;
  try { storedTheme = localStorage.getItem('faculty-site-theme'); } catch (e) { /* storage unavailable */ }
  if (storedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        try { localStorage.setItem('faculty-site-theme', 'light'); } catch (e) {}
      } else {
        root.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        try { localStorage.setItem('faculty-site-theme', 'dark'); } catch (e) {}
      }
    });
  }

  /* ------------------------------------------------------------------
     4. TYPING EFFECT (hero)
     ------------------------------------------------------------------ */
  const typingEl = document.getElementById('typing-text');
  const typingWords = [
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Generative AI'
  ];
  if (typingEl) {
    let wordIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const word = typingWords[wordIndex];
      if (!deleting) {
        charIndex++;
        typingEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(type, 1400);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % typingWords.length;
        }
      }
      setTimeout(type, deleting ? 45 : 85);
    };
    type();
  }

  /* ------------------------------------------------------------------
     5. SCROLL REVEAL (IntersectionObserver)
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal, .timeline-item');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------
     6. ANIMATED COUNTERS (stats section)
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  /* ------------------------------------------------------------------
     7. BACK TO TOP BUTTON
     ------------------------------------------------------------------ */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 480);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     8. PUBLICATIONS: SEARCH + FILTER
     ------------------------------------------------------------------ */
  const pubSearch = document.getElementById('pub-search');
  const pubChips = document.querySelectorAll('.filter-chip[data-pub-filter]');
  const pubCards = document.querySelectorAll('.pub-card');
  const pubEmpty = document.getElementById('pub-empty');
  let activePubFilter = 'all';

  const applyPubFilters = () => {
    const query = (pubSearch ? pubSearch.value : '').trim().toLowerCase();
    let visibleCount = 0;
    pubCards.forEach(card => {
      const type = card.getAttribute('data-type');
      const text = card.textContent.toLowerCase();
      const matchesFilter = activePubFilter === 'all' || type === activePubFilter;
      const matchesSearch = !query || text.includes(query);
      const show = matchesFilter && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    if (pubEmpty) pubEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
  };

  pubChips.forEach(chip => {
    chip.addEventListener('click', () => {
      pubChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activePubFilter = chip.getAttribute('data-pub-filter');
      applyPubFilters();
    });
  });
  if (pubSearch) pubSearch.addEventListener('input', applyPubFilters);

  /* Copy BibTeX to clipboard */
  document.querySelectorAll('.copy-bibtex').forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtex = btn.getAttribute('data-bibtex') || '';
      navigator.clipboard?.writeText(bibtex).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = original; }, 1500);
      }).catch(() => { alert('Copy this BibTeX:\n\n' + bibtex); });
    });
  });

  /* ------------------------------------------------------------------
     9. TEACHING TABS (Current / Previous)
     ------------------------------------------------------------------ */
  const teachingTabs = document.querySelectorAll('.teaching-tab');
  const teachingPanels = document.querySelectorAll('.teaching-panel');
  teachingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      teachingTabs.forEach(t => t.classList.remove('active'));
      teachingPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-panel')).classList.add('active');
    });
  });

  /* ------------------------------------------------------------------
     10. STUDENT TABS (PhD / MTech / BTech)
     ------------------------------------------------------------------ */
  const studentTabs = document.querySelectorAll('.student-tab');
  const studentGrids = document.querySelectorAll('.student-grid');
  studentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      studentTabs.forEach(t => t.classList.remove('active'));
      studentGrids.forEach(g => g.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-panel')).classList.add('active');
    });
  });

  /* ------------------------------------------------------------------
     11. GALLERY FILTER + LIGHTBOX
     ------------------------------------------------------------------ */
  const galleryChips = document.querySelectorAll('.filter-chip[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      galleryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-gallery-filter');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!lightbox || !img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt || '';
      lightbox.classList.add('open');
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });
  }

  /* ------------------------------------------------------------------
     12. CONTACT FORM (frontend only — no backend)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#cf-name').value.trim();
      const email = contactForm.querySelector('#cf-email').value.trim();
      const message = contactForm.querySelector('#cf-message').value.trim();
      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in every field before sending.';
        formStatus.classList.remove('success');
        return;
      }
      /* NOTE: This form has no backend. To make it functional, connect it
         to a service such as Formspree, Getform, or EmailJS, and replace
         this block with the corresponding submit call. */
      formStatus.textContent = `Thanks, ${name}! This is a demo form — connect it to Formspree/EmailJS to receive messages.`;
      formStatus.classList.add('success');
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     13. VISITOR COUNTER PLACEHOLDER
     ------------------------------------------------------------------ */
  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    /* Replace with a real counter service (e.g. goatcounter.com,
       visitor-badge.laobi.icu) for a live count on GitHub Pages. */
    let count = 0;
    try {
      count = parseInt(localStorage.getItem('faculty-site-visits') || '0', 10) + 1;
      localStorage.setItem('faculty-site-visits', String(count));
    } catch (e) { count = '—'; }
    visitorCountEl.textContent = count;
  }

});
