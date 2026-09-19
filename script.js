// Clean reset stored theme & rtl in browser storage
try {
  localStorage.removeItem('lo-rtl');
  localStorage.setItem('lo-theme', 'light');
} catch (e) { }

document.documentElement.dataset.theme = 'light';
document.documentElement.setAttribute('dir', 'ltr');

function updateThemeBtns() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.innerHTML = isDark ? '<span>☀️</span> <span>Light</span>' : '<span>🌙</span> <span>Dark</span>';
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.classList.toggle('active', isDark);
  });
}

document.querySelectorAll('[data-theme]').forEach(btn => {
  btn.onclick = (e) => {
    if (e) e.preventDefault();
    const isDark = document.documentElement.dataset.theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('lo-theme', nextTheme);
    } catch (err) { }
    updateThemeBtns();
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: nextTheme } }));
  };
});
updateThemeBtns();

// RTL Direction toggle - Temporarily Blocked as requested
document.querySelectorAll('[data-rtl]').forEach(btn => {
  btn.style.display = 'none'; // Hide RTL button
  btn.onclick = (e) => {
    if (e) e.preventDefault();
    document.documentElement.setAttribute('dir', 'ltr');
  };
});

// Mobile Hamburger Toggle & Portal Sidebar Drawer
document.querySelectorAll('[data-menu], .portalMenu').forEach(btn => {
  btn.onclick = (e) => {
    e.stopPropagation();
    const targetSelector = btn.dataset.menu || (btn.classList.contains('portalMenu') ? '.side' : '#nav');
    const targetNav = document.querySelector(targetSelector) || document.querySelector('.links');
    if (targetNav) {
      targetNav.classList.toggle('is-open');
    }
  };
});

// Close mobile nav & portal sidebar when clicking outside
document.addEventListener('click', (e) => {
  document.querySelectorAll('.links.is-open, .side.is-open').forEach(nav => {
    if (!nav.contains(e.target) && !e.target.closest('[data-menu], .portalMenu')) {
      nav.classList.remove('is-open');
    }
  });
});

// Dynamic Active Menu Highlight for Main Nav and Portal Sidebar
const path = window.location.pathname;
let pageName = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
if (!pageName) pageName = 'index.html';

document.querySelectorAll('.links a, .side a').forEach(link => {
  const href = (link.getAttribute('href') || '').toLowerCase();
  if (href === pageName || (pageName === 'index.html' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// Portal Filter Tabs
document.querySelectorAll('.portal-tab[data-category]').forEach(tab => {
  tab.onclick = () => {
    const cat = tab.dataset.category;
    const container = tab.closest('.pCard') || document;
    container.querySelectorAll('.portal-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    container.querySelectorAll('[data-item-category]').forEach(item => {
      if (cat === 'all' || item.dataset.itemCategory === cat) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  };
});

// Portal Chat Send Simulation
document.querySelectorAll('form[data-chat-form]').forEach(form => {
  form.onsubmit = e => {
    e.preventDefault();
    const input = form.querySelector('input[type="text"]');
    const msgText = input ? input.value.trim() : '';
    if (!msgText) return;

    const chatList = document.querySelector('.chat-messages');
    if (chatList) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-bubble sent';
      userMsg.innerHTML = `${msgText}<span class="chat-time">${timeStr}</span>`;
      chatList.appendChild(userMsg);
      input.value = '';
      chatList.scrollTop = chatList.scrollHeight;

      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'chat-bubble received';
        reply.innerHTML = `Thank you for your message! Our team will review this and reply shortly.<span class="chat-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
        chatList.appendChild(reply);
        chatList.scrollTop = chatList.scrollHeight;
      }, 1000);
    }
  };
});

// Back to Top Button
let backBtn = document.getElementById('backToTop');
if (!backBtn && !document.body.classList.contains('portal')) {
  backBtn = document.createElement('button');
  backBtn.id = 'backToTop';
  backBtn.className = 'back-to-top';
  backBtn.setAttribute('aria-label', 'Back to Top');
  backBtn.innerHTML = '↑ Top';
  document.body.appendChild(backBtn);
}

if (backBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

// Floating WhatsApp Widget - Temporarily Blocked as requested

// Demo Form Submissions
document.querySelectorAll('form[data-demo]').forEach(form => {
  form.onsubmit = e => {
    e.preventDefault();
    const note = form.querySelector('.note');
    if (note) note.textContent = 'Thanks — this prototype form is ready for backend/email integration.';
    else alert('Action saved successfully!');
  };
});
}) ();
