/* ============================================================
   MICAH AGADA PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* ── 1. NAV: scroll shadow + mobile toggle ── */
(function initNav() {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu   = document.querySelector('.nav__mobile');

  if (!nav) return;

  // Scroll shadow
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden',     String(!open));
    });

    // Close on link click
    menu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }
})();


/* ── 2. ACTIVE NAV LINK on scroll ── */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link, .nav__mobile-link');
  if (!sections.length || !links.length) return;

  const setActive = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('nav__link--active', href === `#${current}`);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ── 3. SCROLL REVEAL ── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-right');
  if (!targets.length) return;

  // Respect reduced-motion preference
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (noMotion) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ── 4. SMOOTH SCROLL for anchor links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 76; // nav height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 5. ANIMATED NUMBER COUNTERS ── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat__number');
  if (!stats.length) return;

  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCount = (el, target, duration = 1200) => {
    if (noMotion) { el.textContent = target + (el.dataset.suffix || ''); return; }
    const start    = performance.now();
    const suffix   = el.dataset.suffix || '';
    const startVal = 0;

    const step = now => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(startVal + (target - startVal) * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const raw    = el.textContent.replace(/[^0-9]/g, '');
        const target = parseInt(raw, 10);
        if (!isNaN(target)) animateCount(el, target);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(el => observer.observe(el));
})();


/* ── 6. CONTACT FORM ── */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const notice = document.getElementById('form-notice');
  if (!form) return;

  const setNotice = (msg, type) => {
    notice.textContent = msg;
    notice.className   = `form-notice form-notice--${type}`;
    if (type === 'success') {
      setTimeout(() => { notice.textContent = ''; notice.className = 'form-notice'; }, 5000);
    }
  };

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  form.addEventListener('submit', e => {
    e.preventDefault();
    notice.textContent = '';
    notice.className   = 'form-notice';

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name)                     { setNotice('Please enter your name.',            'error'); form.name.focus();    return; }
    if (!email)                    { setNotice('Please enter your email address.',   'error'); form.email.focus();   return; }
    if (!validateEmail(email))     { setNotice('Please enter a valid email address.','error'); form.email.focus();   return; }
    if (!message)                  { setNotice('Please enter a message.',            'error'); form.message.focus(); return; }

    // Simulate send (replace with your backend / EmailJS / Formspree endpoint)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled    = false;
      btn.innerHTML   = `Send Message
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      setNotice('Message sent! Micah will get back to you soon.', 'success');
    }, 1400);
  });
})();


/* ── 7. FOOTER YEAR ── */
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── 8. HERO PARALLAX (subtle) ── */
(function initParallax() {
  const image = document.querySelector('.hero__image-wrap');
  if (!image) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024) return; // desktop only

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      image.style.transform = `translateY(${y * 0.08}px)`;
      ticking = false;
    });
  }, { passive: true });
})();


/* ── 9. CURSOR GLOW (desktop only) ── */
(function initCursorGlow() {
  if (window.innerWidth < 1024) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:400px; height:400px; border-radius:50%;
    background:radial-gradient(circle, rgba(10,168,158,.06) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition: opacity .3s ease;
    top:0; left:0;
  `;
  document.body.appendChild(glow);

  let cx = 0, cy = 0, ax = 0, ay = 0;

  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

  const animate = () => {
    ax += (cx - ax) * 0.1;
    ay += (cy - ay) * 0.1;
    glow.style.left = ax + 'px';
    glow.style.top  = ay + 'px';
    requestAnimationFrame(animate);
  };
  animate();

  // Fade glow on interactive elements
  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => glow.style.opacity = '0');
    el.addEventListener('mouseleave', () => glow.style.opacity = '1');
  });
})();


/* ── 10. SERVICE CARD tilt effect ── */
(function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024) return;

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -6;
      const rotY   = ((x - cx) / cx) *  6;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
