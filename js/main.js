// ================================================
// PIETRA SILVEIRA — PORTFOLIO JS
// Canvas partículas · Cursor · Navegação · Hover preview
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursor();
  initNav();
  initMobileMenu();
  initProjectPreview();
  initContactForm();
  navigateTo('home');
});

// ── NAVEGAÇÃO ──
function navigateTo(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('[data-page]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-page') === id);
  });
  if (id === 'sobre') setTimeout(animateSkills, 500);
}

function initNav() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(el.getAttribute('data-page'));
      // fecha menu mobile
      document.querySelector('.mobile-menu')?.classList.remove('open');
    });
  });
}

// ── MENU MOBILE ──
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
}

// ── SKILL BARS ──
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.dataset.w + '%';
  });
}

// ── FORMULÁRIO ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-send');
    const ok  = document.getElementById('form-ok');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.innerHTML = 'Enviar Mensagem →';
      btn.disabled = false;
      if (ok) { ok.style.display = 'block'; setTimeout(() => ok.style.display = 'none', 4000); }
    }, 1600);
  });
}

// ── CURSOR PERSONALIZADO ──
function initCursor() {
  const isMobile = window.matchMedia('(hover: none)').matches;
  if (isMobile) { document.body.style.cursor = 'auto'; return; }

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Ring com lag
  ;(function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Expand em links
  document.querySelectorAll('a, button, .project-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '60px';
      ring.style.height = '60px';
      ring.style.opacity = '0.6';
      dot.style.transform = 'translate(-50%,-50%) scale(0)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.opacity = '0.4';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

// ── PREVIEW DE PROJETO AO HOVER ──
function initProjectPreview() {
  const preview = document.getElementById('proj-preview');
  if (!preview) return;

  document.querySelectorAll('.project-row').forEach(row => {
    const emoji = row.dataset.emoji || '💻';
    const color = row.dataset.color || '#1a1520';

    row.addEventListener('mouseenter', () => {
      preview.style.background = color;
      preview.textContent = emoji;
      preview.classList.add('show');
    });
    row.addEventListener('mousemove', e => {
      preview.style.left = (e.clientX + 20) + 'px';
      preview.style.top  = (e.clientY - 80) + 'px';
    });
    row.addEventListener('mouseleave', () => {
      preview.classList.remove('show');
    });
  });
}

// ── PARTÍCULAS (Canvas) ──
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Cria partículas
  const GOLD = 'rgba(201,168,108,';
  const LILAC = 'rgba(155,126,200,';

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.25,
    dy: (Math.random() - 0.5) * 0.25,
    color: Math.random() > 0.5 ? GOLD : LILAC,
    alpha: Math.random() * 0.4 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Conecta partículas próximas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = GOLD + (0.04 * (1 - dist/120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Desenha partículas
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      // Rebate nas bordas
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ── EFEITO DIGITANDO (Home) ──
;(function typeWriter() {
  const el = document.getElementById('typed');
  if (!el) return;
  const words = ['Desenvolvedora Web', 'Estudante de TI', 'Criativa & Curiosa'];
  let wi = 0, ci = 0, del = false;

  function tick() {
    const w = words[wi];
    el.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
    if (!del && ci === w.length) { del = true; setTimeout(tick, 2000); return; }
    if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
    setTimeout(tick, del ? 55 : 95);
  }
  setTimeout(tick, 600);
})();
