/* =====================================================
   شركة النخبة لنقل وتخزين الأثاث بالرياض
   Main JavaScript v4.0 — design-system edition
   Dialog semantics · focus management · inline validation
   Reduced-motion aware · no counters · single scroll system
===================================================== */

'use strict';

/* ======================== CONFIG ======================== */
const CONFIG = {
  phone: '+966567798346',
  whatsapp: '966567798346',
  social: {
    tiktok: 'https://tiktok.com/@user505792731677',
    instagram: 'https://www.instagram.com/shrkhalnkhbhllnql?igsh=MWYzeHZjcHZ3bG5hcw=='
  },
  whatsappMessage:
    'مرحباً شركة النخبة لنقل الأثاث بالرياض،\nأود الاستفسار وحجز خدمة نقل عفش.\nهل يمكن تزويدي بالتفاصيل وعرض السعر؟ شكراً لكم.'
};

/* ======================== UTILITIES ======================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(container, event) {
  const focusables = $$(FOCUSABLE, container).filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ======================== BOOT ======================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderState();
  initSmoothScrolling();
  initActiveNavHighlight();
  initDrawer();
  initEntranceAnimations();
  initGalleryLightbox();
  initContactForm();
  initFloatingButtonsBehavior();
  initBackToTop();
  updateContactLinks();
  updateSocialLinks();
  updateYear();
});

/* ==================== HEADER SCROLL STATE ==================== */
function initHeaderState() {
  const header = $('#header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
  }, { passive: true });
}

/* ==================== SMOOTH SCROLLING ==================== */
function initSmoothScrolling() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('href') === '#') return;

    const target = $(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    const headerH = $('#header')?.getBoundingClientRect().height || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  });
}

/* ==================== ACTIVE NAV HIGHLIGHT ==================== */
function initActiveNavHighlight() {
  const links = $$('.nav-link, .drawer-nav a');
  const sections = $$('main section[id]');
  if (!links.length || !sections.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const headerH = ($('#header')?.getBoundingClientRect().height || 72) + 90;
      let current = '';
      sections.forEach(section => {
        if (section.offsetTop <= window.scrollY + headerH) current = section.id;
      });
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
      ticking = false;
    });
  }, { passive: true });
}

/* ==================== MOBILE DRAWER (dialog) ==================== */
function initDrawer() {
  const drawer = $('#drawer');
  const overlay = $('#drawerOverlay');
  const hamburger = $('#hamburger');
  const closeBtn = $('#drawerClose');
  if (!drawer || !overlay || !hamburger) return;

  let lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('open');
      overlay.classList.add('active');
    });
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const done = () => { drawer.hidden = true; };
    if (prefersReducedMotion()) done();
    else drawer.addEventListener('transitionend', done, { once: true });
    if (restoreFocus && lastFocused) lastFocused.focus();
  }

  hamburger.addEventListener('click', () => {
    drawer.hidden ? openDrawer() : closeDrawer({ restoreFocus: false });
  });

  closeBtn?.addEventListener('click', () => closeDrawer());
  overlay.addEventListener('click', () => closeDrawer());

  $$('.drawer-nav a', drawer).forEach(link => {
    link.addEventListener('click', () => closeDrawer({ restoreFocus: false }));
  });

  document.addEventListener('keydown', e => {
    if (drawer.hidden) return;
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') trapFocus(drawer, e);
  });
}

/* ==================== ENTRANCE ANIMATIONS ==================== */
function initEntranceAnimations() {
  const elements = $$('[data-animate]');
  if (!elements.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.animateDelay || 0, 10);
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ==================== GALLERY LIGHTBOX (dialog) ==================== */
function initGalleryLightbox() {
  const lightbox = $('#lightbox');
  const img = $('#lightboxImg');
  const caption = $('#lightboxCaption');
  const tiles = $$('.gallery-item');
  if (!lightbox || !img || !tiles.length) return;

  const slides = tiles.map(tile => ({
    src: $('img', tile)?.src || '',
    alt: $('img', tile)?.alt || '',
    text: $('.gallery-caption', tile)?.textContent.trim() || ''
  }));

  let current = 0;
  let lastFocused = null;

  function render() {
    img.src = slides[current].src;
    img.alt = slides[current].alt;
    caption.textContent = slides[current].text;
  }

  function openLightbox(index) {
    current = index;
    render();
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.body.style.overflow = 'hidden';
    $('#lightboxClose')?.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    const done = () => {
      lightbox.hidden = true;
      img.src = '';
    };
    if (prefersReducedMotion()) done();
    else lightbox.addEventListener('transitionend', done, { once: true });
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    current = (current + delta + slides.length) % slides.length;
    render();
  }

  tiles.forEach((tile, i) => tile.addEventListener('click', () => openLightbox(i)));
  $('#lightboxClose')?.addEventListener('click', closeLightbox);
  $('#lightboxBackdrop')?.addEventListener('click', closeLightbox);
  $('#lightboxNext')?.addEventListener('click', () => step(1));
  $('#lightboxPrev')?.addEventListener('click', () => step(-1));

  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(1);   /* RTL: left = forward */
    else if (e.key === 'ArrowRight') step(-1);
    else if (e.key === 'Tab') trapFocus(lightbox, e);
  });
}

/* ==================== CONTACT FORM ==================== */
function normalizeDigits(str) {
  return str.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
            .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
}

function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const validators = {
    clientName: v => v.length >= 3 ? '' : 'الرجاء إدخال الاسم (٣ أحرف على الأقل).',
    clientPhone: v => /^(\+?966|0)?5\d{8}$/.test(normalizeDigits(v).replace(/[\s-]/g, ''))
      ? '' : 'الرجاء إدخال رقم جوال سعودي صحيح (05XXXXXXXX).',
    clientService: v => v ? '' : 'الرجاء اختيار الخدمة المطلوبة.',
    fromArea: v => v ? '' : 'الرجاء إدخال اسم الحي الحالي.',
    toArea: v => v ? '' : 'الرجاء إدخال اسم الحي المراد النقل إليه.'
  };

  function setError(inputId, message) {
    const input = $(`#${inputId}`);
    const field = input?.closest('.field');
    const errorEl = field?.querySelector('.field-error');
    if (!input || !field) return;
    field.classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(inputId) {
    const input = $(`#${inputId}`);
    if (!input || !validators[inputId]) return true;
    const message = validators[inputId](input.value.trim());
    setError(inputId, message);
    return !message;
  }

  Object.keys(validators).forEach(id => {
    const input = $(`#${id}`);
    if (!input) return;
    input.addEventListener('blur', () => validateField(id));
    input.addEventListener('input', () => {
      if (input.closest('.field')?.classList.contains('has-error')) validateField(id);
    });
    input.addEventListener('change', () => validateField(id));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const results = Object.keys(validators).map(id => ({ id, valid: validateField(id) }));
    const firstInvalid = results.find(r => !r.valid);

    if (firstInvalid) {
      $(`#${firstInvalid.id}`)?.focus();
      return;
    }

    const name = $('#clientName').value.trim();
    const phone = normalizeDigits($('#clientPhone').value.trim());
    const service = $('#clientService').value;
    const fromArea = $('#fromArea').value.trim();
    const toArea = $('#toArea').value.trim();
    const message = $('#clientMessage').value.trim();

    let waText = '*طلب نقل أثاث جديد - شركة النخبة بالرياض*\n\n';
    waText += `*الاسم:* ${name}\n`;
    waText += `*الجوال:* ${phone}\n`;
    waText += `*الخدمة المطلوبة:* ${service}\n`;
    waText += `*من حي:* ${fromArea}\n`;
    waText += `*إلى حي:* ${toArea}\n`;
    if (message) waText += `*ملاحظات:* ${message}\n`;

    const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waText)}`;
    const fallback = $('#waFallbackLink');
    if (fallback) fallback.href = waUrl;

    /* Open synchronously inside the gesture so popup blockers allow it */
    const win = window.open(waUrl, '_blank');
    if (win) win.opener = null;

    $('#formSuccess')?.classList.add('visible');
  });
}

/* ==================== FLOATING BUTTONS (mobile UX) ==================== */
function initFloatingButtonsBehavior() {
  const floating = $('#floatingButtons');
  const contactSection = $('#contact');
  if (!floating) return;

  const isMobile = () => window.innerWidth <= 768;

  $$('input, select, textarea').forEach(input => {
    input.addEventListener('focus', () => { if (isMobile()) floating.classList.add('hide-mobile'); });
    input.addEventListener('blur', () => { if (isMobile()) floating.classList.remove('hide-mobile'); });
  });

  if (contactSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!isMobile()) { floating.classList.remove('hide-mobile'); return; }
        floating.classList.toggle('hide-mobile', entry.isIntersecting);
      });
    }, { threshold: 0.08 }).observe(contactSection);
  }
}

/* ==================== BACK TO TOP ==================== */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      btn.classList.toggle('visible', window.scrollY > 600);
      ticking = false;
    });
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}

/* ==================== LINK SYNC FROM CONFIG ==================== */
function updateContactLinks() {
  const phoneHref = `tel:${CONFIG.phone}`;
  const waHref = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  ['#headerCall', '#heroCall', '#contactPhone', '#floatCall', '#drawerCall', '#galleryCta']
    .map(sel => $(sel))
    .filter(el => el)
    .forEach(el => { el.href = phoneHref; });

  ['#headerWhatsapp', '#heroWhatsapp', '#floatWhatsapp', '#contactWhatsapp', '#socialWhatsapp', '#drawerWhatsapp']
    .map(sel => $(sel))
    .filter(el => el)
    .forEach(el => { el.href = waHref; });
}

function updateSocialLinks() {
  const tiktokEls = ['#cardTiktok', '#socialTiktok'].map(sel => $(sel)).filter(Boolean);
  tiktokEls.forEach(el => { if (CONFIG.social.tiktok) el.href = CONFIG.social.tiktok; });

  const igEls = ['#cardInstagram', '#socialInstagram'].map(sel => $(sel)).filter(Boolean);
  igEls.forEach(el => { if (CONFIG.social.instagram) el.href = CONFIG.social.instagram; });
}

function updateYear() {
  const yearEl = $('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
