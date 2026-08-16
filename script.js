(() => {
  const STORAGE_KEY = 'loveBucketListState';
  const checkboxes = Array.from(document.querySelectorAll('.bucket-list input[type="checkbox"]'));
  const sections = Array.from(document.querySelectorAll('[data-section]'));

  const loadState = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  };

  const saveState = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const state = loadState();

  checkboxes.forEach((cb) => {
    if (state[cb.id]) cb.checked = true;
  });

  const overallFill = document.getElementById('overall-fill');
  const overallCount = document.getElementById('overall-count');
  const overallPercent = document.getElementById('overall-percent');
  const overallTotal = document.getElementById('overall-total');

  function updateProgress() {
    const total = checkboxes.length;
    const done = checkboxes.filter((cb) => cb.checked).length;
    const percent = total ? Math.round((done / total) * 100) : 0;

    overallFill.style.width = percent + '%';
    overallCount.textContent = done;
    overallPercent.textContent = percent;
    overallTotal.textContent = total;

    sections.forEach((section) => {
      const sectionBoxes = Array.from(section.querySelectorAll('input[type="checkbox"]'));
      const sectionDone = sectionBoxes.filter((cb) => cb.checked).length;
      const doneEl = section.querySelector('.cat-progress .done');
      if (doneEl) doneEl.textContent = sectionDone;
    });
  }

  function spawnBurst(labelEl) {
    const hearts = ['💗', '💕', '✨', '💖'];
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('span');
      el.className = 'burst-heart';
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      const bx = (Math.random() - 0.5) * 80;
      const by = -(30 + Math.random() * 50);
      el.style.setProperty('--bx', bx + 'px');
      el.style.setProperty('--by', by + 'px');
      el.style.left = (20 + Math.random() * 30) + 'px';
      el.style.animationDelay = (i * 0.04) + 's';
      labelEl.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      state[cb.id] = cb.checked;
      saveState(state);
      updateProgress();

      const item = cb.closest('.bucket-item');
      item.classList.remove('pop');
      void item.offsetWidth;
      item.classList.add('pop');

      if (cb.checked) {
        spawnBurst(cb.nextElementSibling);
      }
    });
  });

  updateProgress();

  // ---------- floating hearts background ----------
  const field = document.getElementById('heart-field');
  const heartGlyphs = ['♥', '♡'];

  function spawnFloatingHeart() {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = heartGlyphs[Math.floor(Math.random() * heartGlyphs.length)];
    const size = 12 + Math.random() * 20;
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 8;
    const drift = (Math.random() - 0.5) * 120;

    el.style.left = left + 'vw';
    el.style.fontSize = size + 'px';
    el.style.animationDuration = duration + 's';
    el.style.setProperty('--drift', drift + 'px');

    field.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  setInterval(spawnFloatingHeart, 900);
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnFloatingHeart, i * 300);
  }

  // ---------- nav active state ----------
  const navLinks = Array.from(document.querySelectorAll('.quick-nav a'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle('active', a.dataset.target === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
})();
