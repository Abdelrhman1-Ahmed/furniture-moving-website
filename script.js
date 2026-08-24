/* =====================================================
   شركة النخبة لنقل وتخزين الأثاث بالرياض
   Main JavaScript - Clean, Fast & Production Ready
   Version: 3.0 (Vercel & SEO Optimized Edition)
===================================================== */

'use strict';

/* ========================
   GLOBAL CONFIGURATION
======================== */
const CONFIG = {
  phone: '+966567798346',
  phoneDisplay: '0567798346',
  whatsapp: '966567798346',
  email: 'alnkhbhlnqlalathathbalryadshrk@gmail.com',
  companyName: 'شركة النخبة لنقل وتخزين الأثاث بالرياض',
  
  // 🌐 حسابات التواصل الاجتماعي الرسمية حصراً (TikTok & Instagram)
  social: {
    tiktok: 'https://tiktok.com/@user505792731677',
    instagram: 'https://www.instagram.com/shrkhalnkhbhllnql?igsh=MWYzeHZjcHZ3bG5hcw=='
  },

  // رسالة الواتساب الترحيبية الافتراضية
  whatsappMessage: `مرحباً شركة النخبة لنقل الأثاث بالرياض،
أود الاستفسار وحجز خدمة نقل عفش.
هل يمكن تزويدي بالتفاصيل وعرض السعر؟ شكراً لكم.`
};

/* ========================
   DOM UTILITIES
======================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ========================
   DOM READY INITIALIZATION
======================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScrolling();
  initScrollAnimations();
  initStatCounters();
  initGalleryLightbox();
  initContactForm();
  initBackToTop();
  updateContactLinks();
  updateSocialLinks();
  updateYear();
});

/* ========================
   UPDATE CONTACT & SOCIAL LINKS
======================== */
function updateContactLinks() {
  const phoneHref = `tel:${CONFIG.phone}`;
  const waHref = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  // Phone links
  const phoneSelectors = [
    '#navCall', '#heroCall', '#contactPhone', '#floatCall', '#galleryCta'
  ];
  phoneSelectors.forEach(sel => {
    const el = $(sel);
    if (el && el.tagName === 'A') {
      el.href = phoneHref;
    }
  });

  // WhatsApp links
  const waSelectors = [
    '#navWhatsapp', '#heroWhatsapp', '#floatWhatsapp', '#contactWhatsapp', '#socialWhatsapp', '#topWhatsapp'
  ];
  waSelectors.forEach(sel => {
    const el = $(sel);
    if (el && el.tagName === 'A') {
      el.href = waHref;
    }
  });
}

function updateSocialLinks() {
  // TikTok
  const ttElements = ['#topTiktok', '#cardTiktok', '#socialTiktok'];
  ttElements.forEach(sel => {
    const el = $(sel);
    if (el && CONFIG.social.tiktok) el.href = CONFIG.social.tiktok;
  });

  // Instagram
  const igElements = ['#topInstagram', '#cardInstagram', '#socialInstagram'];
  igElements.forEach(sel => {
    const el = $(sel);
    if (el && CONFIG.social.instagram) el.href = CONFIG.social.instagram;
  });
}

/* ========================
   NAVBAR SCROLL EFFECT
======================== */
function initNavbar() {
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll(navbar);
        highlightActiveNav(navLinks, sections);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  handleNavbarScroll(navbar);
}

function handleNavbarScroll(navbar) {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function highlightActiveNav(navLinks, sections) {
  const scrollPos = window.scrollY + 140;
  let currentSection = '';

  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

/* ========================
   MOBILE MENU DRAWER
======================== */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  const overlay = $('#mobileOverlay');

  if (!hamburger || !navLinks || !overlay) return;

  function openMenu() {
    navLinks.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  $$('.nav-link', navLinks).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ========================
   SMOOTH SCROLLING
======================== */
function initSmoothScrolling() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = $(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = 85;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
}

/* ========================
   SCROLL ANIMATIONS (AOS STABLE)
======================== */
function initScrollAnimations() {
  const elements = $$('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0, 10);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ========================
   STAT COUNTERS
======================== */
function initStatCounters() {
  const statNumbers = $$('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('ar-SA');
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString('ar-SA');
    }
  }

  requestAnimationFrame(update);
}

/* ========================
   GALLERY LIGHTBOX
======================== */
function initGalleryLightbox() {
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxClose = $('#lightboxClose');
  const lightboxOverlay = $('#lightboxOverlay');

  if (!lightbox || !lightboxImg) return;

  const galleryItems = $$('.gallery-item:not(.gallery-item-large)');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = $('img', item);
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'معرض أعمال شركة النخبة لنقل الأثاث';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxOverlay?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ========================
   CONTACT FORM & WHATSAPP SUBMIT
======================== */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = $('#clientName')?.value.trim();
    const phone = $('#clientPhone')?.value.trim();
    const service = $('#clientService')?.value;
    const fromArea = $('#fromArea')?.value.trim();
    const toArea = $('#toArea')?.value.trim();
    const message = $('#clientMessage')?.value.trim();

    if (!name || !phone || !service || !fromArea || !toArea) {
      alert('يرجى تعبئة كافة الحقول المطلوبة لتأكيد حجزك.');
      return;
    }

    let waText = `*طلب نقل أثاث جديد - شركة النخبة بالرياض*\n\n`;
    waText += `👤 *الاسم الكريم:* ${name}\n`;
    waText += `📱 *رقم الجوال:* ${phone}\n`;
    waText += `🛠️ *الخدمة المطلوبة:* ${service}\n`;
    waText += `📍 *من حي:* ${fromArea}\n`;
    waText += `📍 *إلى حي:* ${toArea}\n`;
    if (message) waText += `📝 *ملاحظات إضافية:* ${message}\n`;

    const successMsg = $('#formSuccess');
    if (successMsg) successMsg.style.display = 'block';

    setTimeout(() => {
      const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');
    }, 800);
  });
}

/* ========================
   BACK TO TOP BUTTON
======================== */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================
   FOOTER YEAR UPDATE
======================== */
function updateYear() {
  const yearEl = $('#currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
