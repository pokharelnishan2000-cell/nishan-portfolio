/* ==========================================================================
   Nishan Pokharel — Portfolio Scripts
   ========================================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- Scroll fade-in with staggered delay per group --- */
const staggerGroups = document.querySelectorAll('.skills-grid, .projects-grid, .edu-grid, .contact-grid');
staggerGroups.forEach(group => {
  Array.from(group.children).forEach((child, i) => {
    child.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * 70}ms`;
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));


/* --- Scroll progress bar --- */
const progressBar = document.getElementById('scroll-progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();


/* --- Scroll-to-top button --- */
const scrollTopBtn = document.getElementById('scroll-top-btn');
function updateScrollTopBtn() {
  if (!scrollTopBtn) return;
  if (window.scrollY > 500) scrollTopBtn.classList.add('visible');
  else scrollTopBtn.classList.remove('visible');
}
window.addEventListener('scroll', updateScrollTopBtn, { passive: true });
updateScrollTopBtn();
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}


/* --- Nav scrollspy --- */
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = navLinks.find(l => l.getAttribute('href') === id);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => spyObserver.observe(sec));


/* --- Magnetic buttons --- */
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}


/* --- Cursor spotlight on cards --- */
document.querySelectorAll('.glow-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});


/* --- Typewriter hero tagline --- */
(function typewriter() {
  const el = document.getElementById('hero-typewriter');
  if (!el) return;

  const phrases = [
    'software_engineer.js',
    'embedded_systems.c',
    'flinders_university · adelaide',
    'always_shipping.py'
  ];

  if (prefersReducedMotion) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      setTimeout(tick, 55);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 30);
    }
  }
  tick();
})();


/* --- Interactive circuit board background --- */
(function () {
  const canvas = document.getElementById('circuit-bg');
  const ctx = canvas.getContext('2d');

  let mouseX = -9999;
  let mouseY = -9999;
  let targetMouseX = -9999;
  let targetMouseY = -9999;

  window.addEventListener('mousemove', e => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY + window.scrollY;
  });

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }

  const GRID = 48;
  const RADIUS = 220;

  function rand(x, y, offset) {
    const n = Math.sin(x * 127.1 + y * 311.7 + offset * 74.3) * 43758.5453;
    return n - Math.floor(n);
  }

  function drawCircuit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width;
    const H = canvas.height;
    const cols = Math.ceil(W / GRID) + 1;
    const rows = Math.ceil(H / GRID) + 1;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const x = col * GRID;
        const y = row * GRID;
        const r = rand(col, row, 0);

        const dist = Math.hypot(x - mouseX, y - mouseY);
        const proximity = Math.max(0, 1 - dist / RADIUS);

        const baseColor = [184, 200, 232];
        const hotColor = [26, 110, 240];
        const mix = baseColor.map((c, i) => Math.round(c + (hotColor[i] - c) * proximity));
        ctx.strokeStyle = `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
        ctx.lineWidth = 1 + proximity * 1.2;
        ctx.fillStyle = `rgba(26, 110, 240, ${0.6 + proximity * 0.4})`;

        if (rand(col, row, 1) > 0.5 && col < cols - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + GRID, y);
          ctx.stroke();
        }
        if (rand(col, row, 2) > 0.5 && row < rows - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + GRID);
          ctx.stroke();
        }

        if (r > 0.72) {
          const baseRadius = r > 0.9 ? 4 : 2.5;
          const radius = baseRadius + proximity * 2.5;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        if (rand(col, row, 3) > 0.94) {
          ctx.strokeRect(x - 10, y - 6, 20, 12);
          for (let p = 0; p < 3; p++) {
            ctx.beginPath();
            ctx.moveTo(x - 10, y - 4 + p * 4);
            ctx.lineTo(x - 16, y - 4 + p * 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 10, y - 4 + p * 4);
            ctx.lineTo(x + 16, y - 4 + p * 4);
            ctx.stroke();
          }
        }
      }
    }
  }

  function loop() {
    mouseX += (targetMouseX - mouseX) * 0.15;
    mouseY += (targetMouseY - mouseY) * 0.15;
    drawCircuit();
    requestAnimationFrame(loop);
  }

  function init() {
    resize();
    if (prefersReducedMotion) {
      drawCircuit();
    } else {
      loop();
    }
  }

  window.addEventListener('resize', () => { resize(); if (prefersReducedMotion) drawCircuit(); });
  window.addEventListener('load', init);
  init();
})();