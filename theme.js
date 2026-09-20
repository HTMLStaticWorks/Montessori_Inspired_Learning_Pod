/**
 * Dark Mode, Bright Mode & RTL Direction Controller for Little Oak Montessori
 * Separate logic file handling theme and layout direction toggles, persistence, and UI controls across all pages.
 */
(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'montessori_theme_preference';
  const DIR_STORAGE_KEY = 'montessori_dir_preference';

  // --- 1. THEME LOGIC ---
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (document.body) {
      document.body.classList.toggle('dark-theme', isDark);
    }
    updateThemeButtons(isDark);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  function updateThemeButtons(isDark) {
    const buttons = document.querySelectorAll('.theme-toggle-btn, [data-theme-toggle]');
    buttons.forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode');
      
      const iconSvg = isDark
        ? `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

      btn.innerHTML = iconSvg;
    });
  }

  // --- 2. RTL DIRECTION LOGIC ---
  function getPreferredDirection() {
    return localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
  }

  function applyDirection(dir) {
    const isRTL = dir === 'rtl';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    if (document.body) {
      document.body.classList.toggle('rtl-mode', isRTL);
    }
    updateRTLButtons(isRTL);
  }

  function toggleDirection() {
    const current = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
    const nextDir = current === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem(DIR_STORAGE_KEY, nextDir);
    applyDirection(nextDir);
  }

  function updateRTLButtons(isRTL) {
    const buttons = document.querySelectorAll('.rtl-toggle-btn, [data-rtl-toggle]');
    buttons.forEach(btn => {
      btn.setAttribute('aria-label', isRTL ? 'Switch to Left to Right' : 'Switch to Right to Left');
      btn.setAttribute('title', isRTL ? 'Switch to LTR' : 'Switch to RTL');
      btn.textContent = isRTL ? 'LTR' : 'RTL';
    });
  }

  // Immediately apply theme and direction on script execution to prevent FOUC
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  const initialDir = getPreferredDirection();
  applyDirection(initialDir);

  // --- 3. AUTO INJECT TOGGLE BUTTONS ---
  function injectToggleButtons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

    // A. Main Site Header (.nav-actions)
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
      if (!document.getElementById('theme-toggle-header')) {
        const themeBtn = document.createElement('button');
        themeBtn.id = 'theme-toggle-header';
        themeBtn.className = 'theme-toggle-btn';
        themeBtn.type = 'button';
        themeBtn.onclick = toggleTheme;
        const hamb = navActions.querySelector('.hamb');
        if (hamb) navActions.insertBefore(themeBtn, hamb);
        else navActions.appendChild(themeBtn);
      }

      if (!document.getElementById('rtl-toggle-header')) {
        const rtlBtn = document.createElement('button');
        rtlBtn.id = 'rtl-toggle-header';
        rtlBtn.className = 'rtl-toggle-btn';
        rtlBtn.type = 'button';
        rtlBtn.onclick = toggleDirection;
        const themeBtn = document.getElementById('theme-toggle-header');
        if (themeBtn && themeBtn.nextSibling) {
          navActions.insertBefore(rtlBtn, themeBtn.nextSibling);
        } else {
          navActions.appendChild(rtlBtn);
        }
      }
    }

    // B. Portal Top Bar (.portalTop)
    const portalTop = document.querySelector('.portalTop');
    if (portalTop) {
      if (!document.getElementById('theme-toggle-portal')) {
        const themeBtn = document.createElement('button');
        themeBtn.id = 'theme-toggle-portal';
        themeBtn.className = 'theme-toggle-btn portal-theme-btn';
        themeBtn.type = 'button';
        themeBtn.onclick = toggleTheme;
        const avatar = portalTop.querySelector('.avatar') || portalTop.querySelector('.spacer');
        if (avatar) portalTop.insertBefore(themeBtn, avatar);
        else portalTop.appendChild(themeBtn);
      }

      if (!document.getElementById('rtl-toggle-portal')) {
        const rtlBtn = document.createElement('button');
        rtlBtn.id = 'rtl-toggle-portal';
        rtlBtn.className = 'rtl-toggle-btn portal-rtl-btn';
        rtlBtn.type = 'button';
        rtlBtn.onclick = toggleDirection;
        const themeBtn = document.getElementById('theme-toggle-portal');
        if (themeBtn && themeBtn.nextSibling) {
          portalTop.insertBefore(rtlBtn, themeBtn.nextSibling);
        } else {
          portalTop.appendChild(rtlBtn);
        }
      }
    }

    // C. Fallback Floating Buttons if no header container is present
    if (!navActions && !portalTop) {
      if (!document.querySelector('.theme-toggle-btn')) {
        const themeBtn = document.createElement('button');
        themeBtn.id = 'theme-toggle-float';
        themeBtn.className = 'theme-toggle-btn floating-theme-btn';
        themeBtn.type = 'button';
        themeBtn.onclick = toggleTheme;
        document.body.appendChild(themeBtn);
      }
      if (!document.querySelector('.rtl-toggle-btn')) {
        const rtlBtn = document.createElement('button');
        rtlBtn.id = 'rtl-toggle-float';
        rtlBtn.className = 'rtl-toggle-btn floating-rtl-btn';
        rtlBtn.type = 'button';
        rtlBtn.onclick = toggleDirection;
        document.body.appendChild(rtlBtn);
      }
    }

    // Bind click events to manual controls if any exist
    document.querySelectorAll('.theme-toggle-btn, [data-theme-toggle]').forEach(btn => btn.onclick = toggleTheme);
    document.querySelectorAll('.rtl-toggle-btn, [data-rtl-toggle]').forEach(btn => btn.onclick = toggleDirection);

    updateThemeButtons(isDark);
    updateRTLButtons(isRTL);
  }

  // DOM ready check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggleButtons);
  } else {
    injectToggleButtons();
  }

  // Global exposure
  window.toggleMontessoriTheme = toggleTheme;
  window.toggleMontessoriRTL = toggleDirection;
})();
