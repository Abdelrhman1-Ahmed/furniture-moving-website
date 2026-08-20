/* =====================================================
   شركة النخبة لنقل وتخزين الأثاث بالرياض
   Main JavaScript - Fast, Modern & Interactive
   Version: 2.0 (Official Production Edition)
===================================================== */

'use strict'

/* ========================
   GLOBAL CONFIGURATION
   ✏️ قم بتعديل هذه القيم لتحديث أرقام وبيانات الموقع والسوشيال ميديا دفعة واحدة
======================== */
const CONFIG = {
  phone: '+966567798346',
  phoneDisplay: '0567798346',
  whatsapp: '966567798346',
  email: 'nokhba0567798346@gmail.com',
  companyName: 'شركة النخبة لنقل وتخزين الأثاث',
  
  // 🌐 روابط حسابات التواصل الاجتماعي الرسمية باسم النخبة
  social: {
    facebook: 'https://facebook.com',      // رابط حساب الفيسبوك
    twitter: 'https://x.com',              // رابط حساب تويتر / إكس
    tiktok: 'https://www.tiktok.com/@user411445480426?_r=1&_t=ZS-98zXzM9nm11',
    instagram: 'https://www.instagram.com/alnkhbhshrkh24?igsh=dzAyMDZxZ3pyNnRu&utm_source=qr'
  },

  // رسالة الواتساب الترحيبية الافتراضية
  whatsappMessage: `مرحباً شركة النخبة لنقل الأثاث بالرياض،
أود الاستفسار وحجز خدمة نقل أثاث.
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
  initReviewsSlider();
  initGalleryLightbox();
  initContactForm();
  initBackToTop();
  initFloatingButtons();
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
  // Facebook
  const fbElements = ['#topFacebook', '#cardFacebook', '#socialFacebook'];
  fbElements.forEach(sel => {
    const el = $(sel);
    if (el && CONFIG.social.facebook) el.href = CONFIG.social.facebook;
  });

  // Twitter / X
  const twElements = ['#topTwitter', '#cardTwitter', '#socialTwitter'];
  twElements.forEach(sel => {
    const el = $(sel);
    if (el && CONFIG.social.twitter) el.href = CONFIG.social.twitter;
  });

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

  // Close menu when clicking on any nav link
  $$('.nav-link', navLinks).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close with Escape key
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
   SCROLL ANIMATIONS (AOS)
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
    rootMargin: '0px 0px -40px 0px'
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
   REVIEWS SLIDER
======================== */
function initReviewsSlider() {
  const track = $('#reviewsTrack');
  const dotsContainer = $('#sliderDots');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');

  if (!track || !dotsContainer) return;

  const cards = $$('.review-card', track);
  const totalCards = cards.length;
  let currentIndex = 0;
  let autoplayTimer = null;

  function getCardsPerView() {
    if (window.innerWidth <= 680) return 1;
    if (window.innerWidth <= 1080) return 2;
    return 3;
  }

  let cardsPerView = getCardsPerView();
  let totalSlides = Math.ceil(totalCards / cardsPerView);

  function buildDots() {
    dotsContainer.innerHTML = '';
    totalSlides = Math.ceil(totalCards / cardsPerView);
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `عرض شريحة ${i + 1}`);
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const cardWidth = cards[0].offsetWidth + 24; // gap width
    const offset = currentIndex * cardsPerView * cardWidth;
    track.style.transform = `translateX(${offset}px)`;

    $$('.dot', dotsContainer).forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    const next = (currentIndex + 1) % totalSlides;
    goToSlide(next);
  }

  function prevSlide() {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  nextBtn?.addEventListener('click', () => { nextSlide(); startAutoplay(); });
  prevBtn?.addEventListener('click', () => { prevSlide(); startAutoplay(); });

  // Touch & Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    startAutoplay();
  }, { passive: true });

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Responsive Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newCPV = getCardsPerView();
      if (newCPV !== cardsPerView) {
        cardsPerView = newCPV;
        currentIndex = 0;
        buildDots();
        goToSlide(0);
      }
    }, 200);
  });

  buildDots();
  goToSlide(0);
  startAutoplay();
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
      lightboxImg.alt = img.alt || 'معرض أعمال النخبة للنقل';
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
   CONTACT BOOKING FORM
======================== */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const submitBtn = $('#submitBtn');
  const formSuccess = $('#formSuccess');

  function validateField(input, errorEl, message) {
    if (!input || !input.value.trim()) {
      input?.classList.add('error');
      if (errorEl) errorEl.textContent = message || 'هذا الحقل مطلوب';
      return false;
    }
    input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  function validatePhone(input) {
    if (!input) return false;
    const val = input.value.trim().replace(/\s|-/g, '');
    const saudiPhone = /^(05|5)[0-9]{8}$|^\+9665[0-9]{8}$/;
    
    if (!val) {
      input.classList.add('error');
      $('#phoneError').textContent = 'رقم الجوال مطلوب لتأكيد الحجز';
      return false;
    }
    if (!saudiPhone.test(val)) {
      input.classList.add('error');
      $('#phoneError').textContent = 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0567798346)';
      return false;
    }
    input.classList.remove('error');
    $('#phoneError').textContent = '';
    return true;
  }

  // Live input cleanup
  $$('input, select, textarea', form).forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        const errorEl = input.closest('.form-group')?.querySelector('.field-error');
        if (errorEl) errorEl.textContent = '';
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameInput = $('#clientName');
    const phoneInput = $('#clientPhone');
    const serviceInput = $('#clientService');
    const fromAreaInput = $('#fromArea');
    const toAreaInput = $('#toArea');
    const messageInput = $('#clientMessage');

    let isValid = true;

    isValid = validateField(nameInput, $('#nameError'), 'يرجى إدخال الاسم الكريم (3 أحرف على الأقل)') && isValid;
    if (nameInput && nameInput.value.trim().length < 3 && nameInput.value.trim()) {
      nameInput.classList.add('error');
      $('#nameError').textContent = 'الاسم يجب ألا يقل عن 3 أحرف';
      isValid = false;
    }

    isValid = validatePhone(phoneInput) && isValid;
    isValid = validateField(serviceInput, $('#serviceError'), 'يرجى اختيار الخدمة المطلوبة') && isValid;

    if (!isValid) return;

    // Build custom WhatsApp booking message
    const name     = nameInput?.value.trim() || '';
    const phone    = phoneInput?.value.trim() || '';
    const service  = serviceInput?.value.trim() || '';
    const fromArea = fromAreaInput?.value.trim() || 'غير محدد';
    const toArea   = toAreaInput?.value.trim() || 'غير محدد';
    const notes    = messageInput?.value.trim() || 'لا توجد ملاحظات إضافية';

    let waText = `🚚 *طلب حجز خدمة نقل أثاث - شركة النخبة*\n`;
    waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
    waText += `👤 *الاسم:* ${name}\n`;
    waText += `📱 *الجوال:* ${phone}\n`;
    waText += `🛠️ *الخدمة المطلوبة:* ${service}\n`;
    waText += `📍 *من حي:* ${fromArea}\n`;
    waText += `🏁 *إلى حي:* ${toArea}\n`;
    waText += `📝 *ملاحظات وتفاصيل:* ${notes}\n`;
    waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
    waText += `يرجى تزويدي بعرض السعر وأقرب موعد متاح. شكراً لكم!`;

    const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waText)}`;

    // Feedback UI
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تجهيز الطلب...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> إرسال الطلب عبر واتساب فوراً';
      formSuccess.classList.add('show');
      form.reset();

      // Scroll to confirmation message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Automatically open WhatsApp with the formulated order
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);

    }, 900);
  });
}

/* ========================
   BACK TO TOP BUTTON
======================== */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
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
   FLOATING BUTTONS
======================== */
function initFloatingButtons() {
  const floatingBtns = $('#floatingButtons');
  if (!floatingBtns) return;

  const hero = $('#home');
  if (!hero) {
    floatingBtns.style.opacity = '1';
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        floatingBtns.style.opacity = '1';
        floatingBtns.style.visibility = 'visible';
        floatingBtns.style.transform = 'translateY(0)';
      } else {
        floatingBtns.style.opacity = '0';
        floatingBtns.style.visibility = 'hidden';
        floatingBtns.style.transform = 'translateY(20px)';
      }
    });
  }, { threshold: 0.25 });

  observer.observe(hero);

  floatingBtns.style.transition = 'opacity 0.4s ease, visibility 0.4s ease, transform 0.4s ease';
  floatingBtns.style.opacity = '0';
  floatingBtns.style.visibility = 'hidden';
}

/* ========================
   AUTO UPDATE YEAR
======================== */
function updateYear() {
  const el = $('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
}
