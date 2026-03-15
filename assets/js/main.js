/* ============================================================
   EDB - Encontro de Batuqueiros | JavaScript Principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── PRELOADER ──────────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1600);
  });
  document.body.style.overflow = 'hidden';

  // ── PARTICLES ─────────────────────────────────────────────
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      createParticle(particlesContainer);
    }
  }

  function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: 0;
    `;
    container.appendChild(particle);
  }

  // ── NAVBAR ────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    handleBackToTop();
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });

  // ── ACTIVE NAV ON SCROLL ──────────────────────────────────
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  // ── COUNTER ANIMATION ─────────────────────────────────────
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = formatNumber(Math.floor(current));
        }, 16);
      });
    }
  }

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  // ── INTERSECTION OBSERVER (ANIMATIONS) ───────────────────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.membro-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(card);
  });

  // ── GALERIA FILTERS ───────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galeriaItems = document.querySelectorAll('.galeria-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galeriaItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ── LIGHTBOX ──────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentLightboxIndex = 0;
  let lightboxImages = [];

  function openLightbox(index) {
    const visibleItems = Array.from(galeriaItems).filter(item => !item.classList.contains('hidden'));
    lightboxImages = visibleItems.map(item => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt,
      caption: item.querySelector('.galeria-overlay span')?.textContent || ''
    }));

    currentLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const img = lightboxImages[currentLightboxIndex];
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.caption;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galeriaItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const visibleItems = Array.from(galeriaItems).filter(i => !i.classList.contains('hidden'));
      const visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  });

  lightboxNext.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // ── BACK TO TOP ───────────────────────────────────────────
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── FORM SUBMISSION ───────────────────────────────────────
  const contatoForm = document.getElementById('contatoForm');
  if (contatoForm) {
    contatoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contatoForm.querySelector('.btn-submit');
      const originalText = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
      btn.style.background = 'var(--spotify-green)';
      btn.disabled = true;

      // Build WhatsApp message
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
      const tipo = document.getElementById('tipo').value;
      const mensagem = document.getElementById('mensagem').value;

      const waMsg = encodeURIComponent(
        `*Solicitação de Show - EDB*\n\n` +
        `*Nome:* ${nome}\n` +
        `*E-mail:* ${email}\n` +
        `*Telefone:* ${telefone}\n` +
        `*Tipo de Evento:* ${tipo}\n` +
        `*Mensagem:* ${mensagem}`
      );

      setTimeout(() => {
        window.open(`https://wa.me/5519971298950?text=${waMsg}`, '_blank');
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contatoForm.reset();
      }, 1500);
    });
  }

  // ── SMOOTH SCROLL ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── VIDEO EMBED FIX ───────────────────────────────────────
  // Replace the placeholder iframe with a real EDB video
  const videoEmbed = document.querySelector('.video-embed iframe');
  if (videoEmbed) {
    videoEmbed.src = 'https://www.youtube.com/embed/CmsBKrDsHaE?rel=0&modestbranding=1';
  }

  // ── PARALLAX HERO ─────────────────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (heroBg && window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  });

  // ── SHOW CARDS HOVER EFFECT ───────────────────────────────
  document.querySelectorAll('.show-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── TYPING EFFECT FOR HERO SUBTITLE ──────────────────────
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 30);
  }

  // ── SCROLL REVEAL FOR SECTIONS ────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.show-card, .video-card, .contato-card, .track-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });

  console.log('🥁 EDB - Encontro de Batuqueiros | Site carregado com sucesso!');
});
