// ── DOM REFERENCES ──────────────────────────────────────────────────────────
  const heading    = document.getElementById('mainHeading');
  const para       = document.getElementById('mainPara');
  const stage      = document.getElementById('stage');
  const msgInput   = document.getElementById('msgInput');
  const charCtr    = document.getElementById('charCounter');
  const btnHeading = document.getElementById('btnHeading');
  const btnToggle  = document.getElementById('btnToggle');
  const btnReset   = document.getElementById('btnReset');
  const fontSlider = document.getElementById('fontSlider');
  const sliderVal  = document.getElementById('sliderVal');
  const logBox     = document.getElementById('logBox');
  const tickerText = document.getElementById('tickerText');
  const colorGrid  = document.getElementById('colorGrid');

  // badge refs
  const badgeHeading = document.getElementById('badgeHeading');
  const badgeBg      = document.getElementById('badgeBg');
  const badgeFont    = document.getElementById('badgeFont');
  const badgePara    = document.getElementById('badgePara');

  // ── STATE ───────────────────────────────────────────────────────────────────
  let paraVisible = true;

  // ── UTILITY: LOG EVENT ──────────────────────────────────────────────────────
  function logEvent(eventType, detail) {
    const now = new Date();
    const t   = now.toTimeString().slice(0, 8);

    // Update ticker bar
    tickerText.textContent = `[${eventType}] ${detail}`;

    // Append to log box
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML =
      `<span class="log-time">${t}</span>` +
      `<span class="log-event">${eventType}</span>` +
      `<span class="log-detail">${detail}</span>`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;   // auto-scroll
  }

  // ── UTILITY: FLASH BADGE ────────────────────────────────────────────────────
  function flashBadge(el) {
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 2000);
  }

  // ── UTILITY: UPDATE SLIDER GRADIENT ────────────────────────────────────────
  function updateSliderGradient(val) {
    const pct = ((val - 12) / (22 - 12)) * 100;
    fontSlider.style.background =
      `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 1: onchange — character counter on input field
  // ══════════════════════════════════════════════════════════════════════════════
  msgInput.onchange = function () {
    logEvent('onchange', `Input field value settled: "${this.value}"`);
  };

  // Live counter using addEventListener (input event)
  msgInput.addEventListener('input', function () {
    const len = this.value.length;
    charCtr.textContent = `${len} / 40`;
    charCtr.classList.toggle('warn', len > 30);
    logEvent('input', `Typed ${len} char${len !== 1 ? 's' : ''}: "${this.value}"`);
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 2: onclick — Change Heading Text (via addEventListener)
  // ══════════════════════════════════════════════════════════════════════════════
  btnHeading.addEventListener('click', function () {
    const msg = msgInput.value.trim();
    if (!msg) {
      heading.textContent = 'TYPE SOMETHING!';
      heading.style.color = 'var(--accent2)';
      logEvent('onclick', 'Heading click — empty input, prompted user');
      setTimeout(() => {
        heading.style.color = 'var(--text)';
      }, 1500);
    } else {
      heading.textContent = msg.toUpperCase();
      heading.style.color = 'var(--accent)';
      setTimeout(() => heading.style.color = 'var(--text)', 1200);
      logEvent('onclick', `Heading changed to: "${msg.toUpperCase()}"`);
    }
    flashBadge(badgeHeading);
    msgInput.value = '';
    charCtr.textContent = '0 / 40';
    charCtr.classList.remove('warn');
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 3: onclick — Color swatch buttons (event delegation)
  // ══════════════════════════════════════════════════════════════════════════════
  colorGrid.addEventListener('click', function (e) {
    const swatch = e.target.closest('.swatch-btn');
    if (!swatch) return;

    // Remove active from siblings
    document.querySelectorAll('.swatch-btn').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');

    const color = swatch.dataset.color;
    const name  = swatch.dataset.name;

    // DOM manipulation: change CSS variable on stage
    stage.style.background = color;

    logEvent('onclick', `Background → ${name} (${color})`);
    flashBadge(badgeBg);
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 4: oninput on range slider → Change Font Size
  // ══════════════════════════════════════════════════════════════════════════════
  fontSlider.addEventListener('input', function () {
    const size = this.value + 'px';
    // DOM style manipulation
    para.style.fontSize = size;
    sliderVal.textContent = size;
    updateSliderGradient(this.value);
    logEvent('oninput', `Font size → ${size}`);
    flashBadge(badgeFont);
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 5: onclick — Show / Hide paragraph
  // ══════════════════════════════════════════════════════════════════════════════
  btnToggle.onclick = function () {
    paraVisible = !paraVisible;

    // DOM classList manipulation
    if (paraVisible) {
      para.classList.remove('hidden');
      this.querySelector('.btn-label').textContent = 'Hide Paragraph';
      this.querySelector('.btn-icon').textContent  = '👁️';
      logEvent('onclick', 'Paragraph → VISIBLE');
    } else {
      para.classList.add('hidden');
      this.querySelector('.btn-label').textContent = 'Show Paragraph';
      this.querySelector('.btn-icon').textContent  = '🙈';
      logEvent('onclick', 'Paragraph → HIDDEN');
    }
    flashBadge(badgePara);
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 6: onclick — Reset Page
  // ══════════════════════════════════════════════════════════════════════════════
  btnReset.addEventListener('click', function () {
    // Reset all DOM changes
    heading.textContent  = 'CHANGE ME';
    heading.style.color  = 'var(--text)';
    stage.style.background = '#0d0d0d';
    para.style.fontSize  = '15px';
    para.classList.remove('hidden');
    msgInput.value       = '';
    charCtr.textContent  = '0 / 40';
    charCtr.classList.remove('warn');
    fontSlider.value     = 15;
    sliderVal.textContent = '15px';
    updateSliderGradient(15);
    paraVisible          = true;
    btnToggle.querySelector('.btn-label').textContent = 'Hide Paragraph';
    btnToggle.querySelector('.btn-icon').textContent  = '👁️';

    // Reset swatches
    document.querySelectorAll('.swatch-btn').forEach(s => s.classList.remove('active'));
    document.querySelector('.swatch-btn[data-color="#0d0d0d"]').classList.add('active');

    // Reset badges
    [badgeHeading, badgeBg, badgeFont, badgePara].forEach(b => b.classList.remove('active'));

    logEvent('onclick', 'Page RESET to defaults');
    tickerText.textContent = 'Page reset — all values restored.';
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 7: onmouseover — Heading hover
  // ══════════════════════════════════════════════════════════════════════════════
  heading.onmouseover = function () {
    this.style.letterSpacing = '4px';
    this.style.textShadow    = '0 0 40px rgba(232,255,71,0.4)';
    logEvent('onmouseover', 'Cursor entered heading element');
  };

  heading.onmouseout = function () {
    this.style.letterSpacing = '1px';
    this.style.textShadow    = 'none';
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 8: addEventListener — keydown shortcut for heading button
  // ══════════════════════════════════════════════════════════════════════════════
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && document.activeElement === msgInput) {
      btnHeading.click();
      logEvent('keydown', 'Enter key triggered heading change');
    }
    if (e.key === 'Escape') {
      btnReset.click();
      logEvent('keydown', 'Escape key triggered reset');
    }
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // EVENT 9: Stage onmousemove — subtle parallax glow
  // ══════════════════════════════════════════════════════════════════════════════
  stage.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    this.style.backgroundImage =
      `radial-gradient(ellipse at ${x}% ${y}%, rgba(232,255,71,0.05) 0%, transparent 55%)`;
  });

  stage.addEventListener('mouseleave', function () {
    this.style.backgroundImage =
      'radial-gradient(ellipse at 30% 40%, rgba(232,255,71,0.04) 0%, transparent 60%)';
  });

  // ── INIT ────────────────────────────────────────────────────────────────────
  updateSliderGradient(15);
  logEvent('addEventListener', 'All event listeners registered');