// ============================================================
// app.js  — SPA router, search, theme toggle, and navigation
// ============================================================

(function () {
    'use strict';

    // ---- Elements ----
    const sidebar     = document.getElementById('sidebar');
    const sidebarNav  = document.getElementById('sidebarNav');
    const overlay     = document.getElementById('sidebarOverlay');
    const hamburger   = document.getElementById('hamburgerBtn');
    const contentEl   = document.getElementById('content');
    const searchInput = document.getElementById('searchInput');
    const themeToggle = document.getElementById('themeToggle');

    // ---- Page order (for prev/next) ----
    const PAGE_ORDER = [
        'introduction',
        'architecture',
        'quickstart',
        'backend-overview',
        'api-products',
        'api-orders',
        'api-payments',
        'api-address',
        'backend-services',
        'backend-env',
        'frontend-overview',
        'frontend-routes',
        'frontend-components',
        'frontend-state',
        'frontend-i18n',
        'deployment-docker',
        'deployment-cloudflare'
    ];

    // ---- State ----
    let currentPage = 'introduction';

    // ---- Helpers ----
    function getPageNameFromHash() {
        const hash = window.location.hash.replace('#', '');
        return (hash && PAGES[hash]) ? hash : 'introduction';
    }

    // ---- Render page ----
    function renderPage(pageName) {
        if (!PAGES[pageName]) pageName = 'introduction';
        currentPage = pageName;

        contentEl.innerHTML = PAGES[pageName];
        contentEl.scrollTop = 0;
        window.scrollTo(0, 0);

        // Update active nav link
        sidebarNav.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageName);
        });

        // Update hash silently
        history.replaceState(null, '', '#' + pageName);

        // Wire up in-page links
        contentEl.querySelectorAll('[data-page]').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                navigateTo(el.dataset.page);
            });
        });

        // Close mobile sidebar
        closeSidebar();
    }

    function navigateTo(pageName) {
        renderPage(pageName);
    }

    // ---- Sidebar navigation clicks ----
    sidebarNav.addEventListener('click', e => {
        const link = e.target.closest('.nav-link');
        if (!link) return;
        e.preventDefault();
        navigateTo(link.dataset.page);
    });

    // ---- Mobile sidebar ----
    function openSidebar()  { sidebar.classList.add('open'); overlay.classList.add('open'); }
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }

    hamburger.addEventListener('click', () => {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    overlay.addEventListener('click', closeSidebar);

    // ---- Search ----
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();

        sidebarNav.querySelectorAll('.nav-link').forEach(link => {
            const text = link.textContent.toLowerCase();
            link.classList.toggle('hidden', q.length > 0 && !text.includes(q));
        });

        // Show all group titles, hide those with no visible children
        sidebarNav.querySelectorAll('.nav-group').forEach(group => {
            const hasVisible = group.querySelectorAll('.nav-link:not(.hidden)').length > 0;
            group.style.display = hasVisible ? '' : 'none';
        });
    });

    // ---- Theme toggle ----
    function getStoredTheme() {
        return localStorage.getItem('apricity-docs-theme') || 'dark';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('apricity-docs-theme', theme);
    }

    setTheme(getStoredTheme());

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // ---- Copy code ----
    window.copyCode = function (btn) {
        const pre = btn.closest('.code-block').querySelector('pre');
        navigator.clipboard.writeText(pre.textContent).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 1500);
        });
    };

    // ---- Hash navigation ----
    window.addEventListener('hashchange', () => {
        renderPage(getPageNameFromHash());
    });

    // ---- Boot ----
    renderPage(getPageNameFromHash());
})();
