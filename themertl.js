/**
 * Theme & RTL Accessibility Manager
 * Handles Dark/Light theme toggling and RTL (Right-to-Left) layout toggling across all pages.
 */
(function () {
  'use strict';

  // Safe localStorage getters/setters
  function getStorage(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) { }
  }

  // State
  let currentTheme = getStorage('lo-theme', 'light');
  let currentDir = getStorage('lo-rtl', 'ltr');

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    setStorage('lo-theme', theme);
    updateThemeUI();
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function applyDir(dir) {
    currentDir = dir;
    document.documentElement.setAttribute('dir', dir);
    setStorage('lo-rtl', dir);
    updateRtlUI();
    window.dispatchEvent(new CustomEvent('dirchange', { detail: { dir: dir } }));
  }

  function updateThemeUI() {
    const isDark = currentTheme === 'dark';
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.innerHTML = isDark ? '<span>☀️</span> <span>Light</span>' : '<span>🌙</span> <span>Dark</span>';
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.classList.toggle('active', isDark);
    });
  }

  function updateRtlUI() {
    const isRtl = currentDir === 'rtl';
    document.querySelectorAll('[data-rtl]').forEach(btn => {
      btn.style.display = 'inline-flex';
      btn.innerHTML = isRtl ? '<span>🌐</span> <span>LTR</span>' : '<span>🌐</span> <span>RTL</span>';
      btn.setAttribute('title', isRtl ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
      btn.setAttribute('aria-label', isRtl ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
      btn.setAttribute('aria-pressed', isRtl ? 'true' : 'false');
      btn.classList.toggle('active', isRtl);
    });
  }

  function bindControls() {
    // Setup Theme Toggle Buttons
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.onclick = function (e) {
        if (e) e.preventDefault();
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      };
    });

    // Setup RTL Toggle Buttons (Ensuring visibility and functionality)
    document.querySelectorAll('[data-rtl]').forEach(btn => {
      btn.style.display = 'inline-flex';
      btn.onclick = function (e) {
        if (e) e.preventDefault();
        const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDir(nextDir);
      };
    });

    updateThemeUI();
    updateRtlUI();
  }

  // Apply immediately to prevent layout shift or flicker
  document.documentElement.dataset.theme = currentTheme;
  document.documentElement.setAttribute('dir', currentDir);

  // Bind controls on DOM ready and window load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindControls);
  } else {
    bindControls();
  }

  window.addEventListener('load', bindControls);
})();
