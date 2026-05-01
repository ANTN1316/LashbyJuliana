/**
 * ============================================================
 * LASH BY ISABELLE — script.js
 * Funcionalidades: Navbar, Scroll Reveal, Form Validation,
 *                  Gallery Tabs, WhatsApp Float, Phone Mask
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
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

  revealEls.forEach(el => {
    // Se o elemento já está visível na viewport ao carregar, revela imediatamente
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      el.classList.add('visible');
    } else {
      revealObs.observe(el);
    }
  });


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


  // ── 4. BEFORE/AFTER SLIDER + FILTRO ────────────────────────
  const tabs         = document.querySelectorAll('.gallery-tab');
  const compareItems = document.querySelectorAll('.compare-item');

  /** Inicializa o slider de um card */
  const initSlider = (item) => {
    const beforeWrap = item.querySelector('.compare-before-wrap');
    const handle     = item.querySelector('.compare-handle');
    if (!beforeWrap || !handle) return;

    let dragging     = false;
    let startX       = 0;
    let startY       = 0;
    let isHorizontal = null; // null = ainda não decidido

    const setPosition = (x) => {
      const rect = item.getBoundingClientRect();
      let   pct  = ((x - rect.left) / rect.width) * 100;
      pct = Math.min(Math.max(pct, 2), 98);

      // clip-path revela a imagem "antes" até a posição pct
      beforeWrap.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left         = pct + '%';
    };

    /* ── Mouse ── */
    item.addEventListener('mousedown', (e) => {
      dragging = true;
      item.classList.add('interacted');
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => { dragging = false; });

    /* ── Touch: detecta direção antes de interceptar ── */
    item.addEventListener('touchstart', (e) => {
      startX       = e.touches[0].clientX;
      startY       = e.touches[0].clientY;
      isHorizontal = null;
      dragging     = false;
    }, { passive: true });

    // Listener no ITEM (não no window) — só intercepta toques que começaram aqui
    item.addEventListener('touchmove', (e) => {
      if (!e.touches.length) return;

      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);

      // Decide direção com threshold maior (10px) para evitar falsos positivos
      if (isHorizontal === null) {
        if (dx < 10 && dy < 10) return; // ainda não decidiu — não faz nada
        isHorizontal = dx > dy * 1.5;   // horizontal precisa ser 50% maior que vertical
        if (isHorizontal) {
          dragging = true;
          item.classList.add('interacted');
        }
      }

      if (!isHorizontal) return; // scroll vertical: não intercepta

      e.preventDefault(); // só chega aqui se for gesto horizontal confirmado
      setPosition(e.touches[0].clientX);
    }, { passive: false }); // passive: false só neste item, não no window

    item.addEventListener('touchend', () => {
      dragging     = false;
      isHorizontal = null;
    }, { passive: true });
  };

  compareItems.forEach(initSlider);

  /** Filtro por categoria */
  const filterGallery = (filter) => {
    compareItems.forEach((item, i) => {
      const match = filter === 'todos' || item.dataset.category === filter;

      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      item.style.opacity    = '0';
      item.style.transform  = 'translateY(10px)';

      setTimeout(() => {
        item.style.display = match ? 'block' : 'none';
        if (match) {
          setTimeout(() => {
            item.style.opacity   = '1';
            item.style.transform = 'translateY(0)';
          }, i * 60);
        }
      }, 300);
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      filterGallery(tab.dataset.filter);
    });
  });


  // ── 5. PHONE MASK ───────────────────────────────────────────
  const phoneInput = document.getElementById('phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length >= 7) {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length >= 3) {
        v = v.replace(/^(\d{2})(\d+)/, '($1) $2');
      } else if (v.length >= 1) {
        v = v.replace(/^(\d+)/, '($1');
      }
      e.target.value = v;
    });
  }


  // ── 6. SET MINIMUM DATE (no past dates, weekdays only) ─────
  const dateInput = document.getElementById('date');

  if (dateInput) {
    // Mínimo: próximo dia útil a partir de amanhã
    const getNextWeekday = (date) => {
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      while (d.getDay() === 0 || d.getDay() === 6) { // 0 = dom, 6 = sáb
        d.setDate(d.getDate() + 1);
      }
      return d;
    };

    const nextWeekday = getNextWeekday(new Date());
    dateInput.min = nextWeekday.toISOString().split('T')[0];

    // Máximo: 3 meses à frente
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];

    // Bloqueia fins de semana ao digitar/selecionar manualmente
    dateInput.addEventListener('change', () => {
      const chosen = new Date(dateInput.value + 'T00:00:00');
      const day = chosen.getDay();
      if (day === 0 || day === 6) {
        dateInput.value = '';
        dateInput.classList.add('error');
        const err = document.getElementById('date-error');
        if (err) {
          err.textContent = 'Atendemos apenas de segunda a sexta.';
          err.classList.add('show');
        }
      }
    });
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

    if (id === 'phone') {
      const digits = val.replace(/\D/g, '');
      const ok = digits.length >= 10;
      setError('phone', 'phone-error', !ok);
      return ok;
    }

    if (id === 'service') {
      const ok = val !== '';
      setError('service', 'service-error', !ok);
      return ok;
    }

if (id === 'date') {
      if (!val) {
        setError('date', 'date-error', true);
        return false;
      }
      // Create date with explicit time to avoid timezone issues
      const selected = new Date(val + 'T00:00:00');
      const min = new Date(dateInput.min + 'T00:00:00');
      const ok = selected >= min;
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
  ['name', 'phone', 'service', 'date', 'time'].forEach(id => {
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

      const fields = ['name', 'phone', 'service', 'date', 'time'];
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
        phone:   document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        date:    document.getElementById('date').value,
        time:    document.getElementById('time').value,
        notes:   document.getElementById('notes').value.trim(),
      };

      const serviceLabel = document.getElementById('service').selectedOptions[0]?.textContent || data.service;
      const message = `Olá Juliana! Gostaria de agendar um horário.

Nome: ${data.name}
Telefone: ${data.phone}
Procedimento: ${serviceLabel}
Data: ${data.date}
Horário: ${data.time}
Observações: ${data.notes || 'Nenhuma'}`;
      const waUrl = `https://wa.me/5521998317983?text=${encodeURIComponent(message)}`;

      window.open(waUrl, '_blank');
      console.log('[Agendamento] Dados coletados:', data);
      // In production: send to backend via fetch()

      // Show success state
      formContent.classList.add('hide');
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
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