/**
 * ============================================================
 * LASH BY ISABELLE — script.js
 * Funcionalidades: Navbar, Scroll Reveal, Form Validation,
 *                  Gallery Tabs, WhatsApp Float Mask
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAVBAR: scroll-aware + mobile hamburger ──────────────
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navMobile   = document.getElementById('navMobile');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  /** Toggle scrolled class */
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /** Open / close mobile menu */
  const toggleMenu = (open) => {
    hamburger.classList.toggle('open', open);
    navMobile.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMobile.classList.contains('open');
    toggleMenu(!isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close mobile menu on outside click
  navMobile.addEventListener('click', (e) => {
    if (e.target === navMobile) toggleMenu(false);
  });


  // ── 2. SCROLL REVEAL (IntersectionObserver) ─────────────────
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));


  // ── 3. WHATSAPP FLOATING BUTTON ──────────────────────────────
  const waFloat = document.getElementById('whatsappFloat');

  const waObs = new IntersectionObserver((entries) => {
    // Show after hero section is passed
    entries.forEach(entry => {
      waFloat.classList.toggle('show', !entry.isIntersecting);
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero');
  if (heroSection) waObs.observe(heroSection);


  // ── 4. GALLERY TABS ─────────────────────────────────────────
  const tabs        = document.querySelectorAll('.gallery-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // In a real project, filter gallery items by data attribute.
      // Here we just animate a "refresh" for demo purposes.
      galleryItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(16px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 60 + i * 60);
      });
    });
  });


  // ── 6. SET MINIMUM DATE (no past dates) ─────────────────────
  const dateInput = document.getElementById('date');

  if (dateInput) {
    const today = new Date();
    // Minimum: tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];

    // Maximum: 3 months ahead
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];
  }


  // ── 7. FORM VALIDATION & SUBMISSION ─────────────────────────
  const bookingForm = document.getElementById('bookingForm');
  const formContent = document.querySelector('.form-content');
  const formSuccess = document.getElementById('formSuccess');
  const resetBtn    = document.getElementById('resetForm');

  /** Show/hide field error */
  const setError = (fieldId, errorId, show) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (!field || !error) return;
    field.classList.toggle('error', show);
    error.classList.toggle('show', show);
  };

  /** Validate a single field, returns true if valid */
  const validateField = (id) => {
    const el = document.getElementById(id);
    if (!el) return true;
    const val = el.value.trim();

    if (id === 'name') {
      const ok = val.length >= 3;
      setError('name', 'name-error', !ok);
      return ok;
    }

    if (id === 'service') {
      const ok = val !== '';
      setError('service', 'service-error', !ok);
      return ok;
    }

    if (id === 'date') {
      const ok = val !== '' && new Date(val) >= new Date(dateInput.min);
      setError('date', 'date-error', !ok);
      return ok;
    }

    if (id === 'time') {
      const ok = val !== '';
      setError('time', 'time-error', !ok);
      return ok;
    }

    return true;
  };

  // Live validation on blur
  ['name', 'service', 'date', 'time'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateField(id));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(id);
      });
    }
  });

  /** Handle form submit */
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = ['name', 'service', 'date', 'time'];
      const valid = fields.every(id => validateField(id));

      if (!valid) {
        // Scroll to first error
        const firstError = bookingForm.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Collect data
      const data = {
        name:    document.getElementById('name').value.trim(),
        service: document.getElementById('service').value,
        date:    document.getElementById('date').value,
        time:    document.getElementById('time').value,
        notes:   document.getElementById('notes').value.trim(),
      };

      console.log('[Agendamento] Dados coletados:', data);
      // In production: send to backend via fetch()

      // Show success state
      formContent.classList.add('hide');
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      const mensagem =
        "Olá Juliana!\n" +
        `Meu nome é ${data.name}.\n` +
        `Serviço: ${data.service}\n` +
        `Data: ${data.date}\n` +
        `Hora: ${data.time}` +
        `\nObservação: ${data.notes ? data.notes : 'Nenhuma'}\n`;

      const url = `https://wa.me/5521999731008?text=${encodeURIComponent(mensagem)}`;

      window.open(url, '_blank');
    });
  }

  /** Reset form */
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      bookingForm.reset();
      formContent.classList.remove('hide');
      formSuccess.classList.remove('show');
      // Clear all errors
      document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      document.querySelectorAll('.field-error.show').forEach(el => el.classList.remove('show'));
    });
  }


  // ── 8. SMOOTH SCROLL for all anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ── 9. ACTIVE NAV LINK on scroll ────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const activeSectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.style.opacity = href === `#${entry.target.id}` ? '1' : '';
          link.style.color   = href === `#${entry.target.id}` ? 'var(--rose)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeSectionObs.observe(s));

}); // END DOMContentLoaded
