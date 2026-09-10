/* ==========================================================================
   Nishan Pokharel — Portfolio Scripts
   ========================================================================== */

/* --- Scroll fade-in --- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


/* --- Circuit board background --- */
(function () {
  const canvas = document.getElementById('circuit-bg');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }

  function drawCircuit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width;
    const H = canvas.height;
    const GRID = 48;
    const cols = Math.ceil(W / GRID) + 1;
    const rows = Math.ceil(H / GRID) + 1;

    ctx.strokeStyle = '#b8c8e8';
    ctx.lineWidth   = 1;
    ctx.fillStyle   = '#1a6ef0';

    /* seed a simple pseudo-random from position */
    function rand(x, y, offset) {
      const n = Math.sin(x * 127.1 + y * 311.7 + offset * 74.3) * 43758.5453;
      return n - Math.floor(n);
    }

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const x = col * GRID;
        const y = row * GRID;
        const r = rand(col, row, 0);

        /* horizontal trace */
        if (rand(col, row, 1) > 0.5 && col < cols - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + GRID, y);
          ctx.stroke();
        }
        /* vertical trace */
        if (rand(col, row, 2) > 0.5 && row < rows - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + GRID);
          ctx.stroke();
        }

        /* node dot */
        if (r > 0.72) {
          const radius = r > 0.9 ? 4 : 2.5;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        /* small IC chip rectangle (rare) */
        if (rand(col, row, 3) > 0.94) {
          ctx.strokeRect(x - 10, y - 6, 20, 12);
          /* chip pins */
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

  /* redraw after page fully loads so scrollHeight is correct */
  function init() {
    resize();
    drawCircuit();
  }

  window.addEventListener('resize', init);
  window.addEventListener('load', init);
  init();
})();
