(function () {
  'use strict';

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

  // Back to Top Button for All Pages
  let backBtn = document.getElementById('backToTop');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'backToTop';
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Back to Top');
    backBtn.innerHTML = '↑ Top';
    document.body.appendChild(backBtn);
  }

  if (backBtn) {
    const handleScroll = () => {
      if (window.scrollY > 100 || document.documentElement.scrollTop > 100) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    backBtn.onclick = (e) => {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  // Demo Form Submissions
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.onsubmit = e => {
      e.preventDefault();
      const note = form.querySelector('.note');
      if (note) note.textContent = 'Thanks — this prototype form is ready for backend/email integration.';
      else alert('Action saved successfully!');
    };
  });

  // Gallery Page Pagination (15 items per page)
  const photoGrid = document.querySelector('.photoGrid');
  if (photoGrid) {
    const cards = Array.from(photoGrid.querySelectorAll('.photoCard'));
    const itemsPerPage = 15;
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    if (totalPages > 1) {
      let paginationContainer = document.getElementById('gallery-pagination');
      if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'gallery-pagination';
        paginationContainer.className = 'pagination';
        photoGrid.parentNode.appendChild(paginationContainer);
      }

      const showPage = (page) => {
        cards.forEach((card, index) => {
          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          if (index >= start && index < end) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

        if (paginationContainer) {
          paginationContainer.querySelectorAll('.page-btn[data-page]').forEach(btn => {
            if (parseInt(btn.dataset.page, 10) === page) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
        }
      };

      paginationContainer.innerHTML = '';

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn page-nav';
      prevBtn.innerHTML = '← Prev';
      prevBtn.setAttribute('aria-label', 'Previous Page');
      prevBtn.onclick = () => {
        const activeBtn = paginationContainer.querySelector('.page-btn.active[data-page]');
        const currPage = activeBtn ? parseInt(activeBtn.dataset.page, 10) : 1;
        if (currPage > 1) {
          showPage(currPage - 1);
          const gridTop = photoGrid.getBoundingClientRect().top + window.scrollY - 100;
          if (window.scrollY > gridTop) window.scrollTo({ top: gridTop, behavior: 'smooth' });
        }
      };
      paginationContainer.appendChild(prevBtn);

      // Page Numbers
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === 1 ? 'active' : ''}`;
        btn.dataset.page = i;
        btn.textContent = i;
        btn.setAttribute('aria-label', `Page ${i}`);
        btn.onclick = () => {
          showPage(i);
          const gridTop = photoGrid.getBoundingClientRect().top + window.scrollY - 100;
          if (window.scrollY > gridTop) window.scrollTo({ top: gridTop, behavior: 'smooth' });
        };
        paginationContainer.appendChild(btn);
      }

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn page-nav';
      nextBtn.innerHTML = 'Next →';
      nextBtn.setAttribute('aria-label', 'Next Page');
      nextBtn.onclick = () => {
        const activeBtn = paginationContainer.querySelector('.page-btn.active[data-page]');
        const currPage = activeBtn ? parseInt(activeBtn.dataset.page, 10) : 1;
        if (currPage < totalPages) {
          showPage(currPage + 1);
          const gridTop = photoGrid.getBoundingClientRect().top + window.scrollY - 100;
          if (window.scrollY > gridTop) window.scrollTo({ top: gridTop, behavior: 'smooth' });
        }
      };
      paginationContainer.appendChild(nextBtn);

      // Show initial page 1
      showPage(1);
    }
  }

  // Welcome Modal Controls for Dashboard Page
  window.openWelcomeModal = function() {
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.classList.add('is-active');
  };

  window.closeWelcomeModal = function() {
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.classList.remove('is-active');
  };

  if (pageName === 'dashboard.html') {
    setTimeout(() => {
      window.openWelcomeModal();
    }, 350);
  }

  // Password Visibility Toggle Function
  window.togglePasswordVisibility = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    if (btn) {
      btn.innerHTML = isPassword
        ? `<svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
  };
})();

