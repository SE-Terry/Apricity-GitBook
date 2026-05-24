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
    const languageToggle = document.getElementById('languageToggle');
    const mobileTitle = document.querySelector('.mobile-title');

    const DOC_I18N = {
        en: {
            htmlLang: 'en',
            searchPlaceholder: 'Search docs…',
            mobileTitle: 'Apricity Docs',
            themeTitle: 'Toggle theme',
            copied: 'Copied!',
            groups: ['Getting Started', 'Backend', 'Frontend', 'Deployment'],
            pages: {
                introduction: 'Introduction',
                architecture: 'Architecture',
                quickstart: 'Quick Start',
                'shop-operator-guide': 'Store Guide',
                'backend-overview': 'Overview',
                'api-products': 'Products API',
                'api-orders': 'Orders API',
                'api-payments': 'Payments API',
                'api-address': 'Address API',
                'backend-services': 'Services & Jobs',
                'backend-env': 'Environment Vars',
                'frontend-overview': 'Overview',
                'frontend-routes': 'Routing',
                'frontend-checkout-flow': 'Checkout & Shipment',
                'frontend-components': 'Components',
                'frontend-state': 'State & Logic',
                'frontend-i18n': 'Internationalization',
                'deployment-docker': 'Docker & Compose',
                'deployment-cloudflare': 'Cloudflare Tunnel'
            }
        },
        vi: {
            htmlLang: 'vi',
            searchPlaceholder: 'Tìm trong tài liệu…',
            mobileTitle: 'Tài liệu Apricity',
            themeTitle: 'Đổi giao diện',
            copied: 'Đã sao chép!',
            groups: ['Bắt đầu', 'Backend', 'Frontend', 'Deployment'],
            pages: {
                introduction: 'Giới thiệu',
                architecture: 'Kiến trúc',
                quickstart: 'Bắt đầu nhanh',
                'shop-operator-guide': 'Store Guide',
                'backend-overview': 'Tổng quan',
                'api-products': 'Products API',
                'api-orders': 'Orders API',
                'api-payments': 'Payments API',
                'api-address': 'Address API',
                'backend-services': 'Services & Jobs',
                'backend-env': 'Biến môi trường',
                'frontend-overview': 'Tổng quan',
                'frontend-routes': 'Routing',
                'frontend-checkout-flow': 'Checkout & vận chuyển',
                'frontend-components': 'Components',
                'frontend-state': 'State & Logic',
                'frontend-i18n': 'Đa ngôn ngữ',
                'deployment-docker': 'Docker & Compose',
                'deployment-cloudflare': 'Cloudflare Tunnel'
            }
        }
    };

    // ---- Page order (for prev/next) ----
    const PAGE_ORDER = [
        'introduction',
        'architecture',
        'quickstart',
        'shop-operator-guide',
        'backend-overview',
        'api-products',
        'api-orders',
        'api-payments',
        'api-address',
        'backend-services',
        'backend-env',
        'frontend-overview',
        'frontend-routes',
        'frontend-checkout-flow',
        'frontend-components',
        'frontend-state',
        'frontend-i18n',
        'deployment-docker',
        'deployment-cloudflare'
    ];

    // ---- State ----
    let currentPage = 'introduction';
    let currentLanguage = getStoredLanguage();

    // ---- Helpers ----
    function getStoredLanguage() {
        const queryLang = new URLSearchParams(window.location.search).get('lang');
        if (queryLang === 'vi' || queryLang === 'en') return queryLang;

        const stored = localStorage.getItem('apricity-docs-language');
        return stored === 'vi' ? 'vi' : 'en';
    }

    function getPages() {
        if (typeof PAGES_BY_LANG !== 'undefined' && PAGES_BY_LANG[currentLanguage]) {
            return PAGES_BY_LANG[currentLanguage];
        }
        return PAGES;
    }

    function getPageNameFromHash() {
        const hash = window.location.hash.replace('#', '');
        const pages = getPages();
        return (hash && pages[hash]) ? hash : 'introduction';
    }

    function setTrailingText(el, text) {
        const textNode = Array.from(el.childNodes)
            .reverse()
            .find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

        if (textNode) {
            textNode.textContent = '\n                    ' + text + '\n                ';
        } else {
            el.appendChild(document.createTextNode(text));
        }
    }

    function applyLanguageChrome() {
        const copy = DOC_I18N[currentLanguage];
        document.documentElement.setAttribute('lang', copy.htmlLang);
        searchInput.placeholder = copy.searchPlaceholder;
        themeToggle.title = copy.themeTitle;
        if (mobileTitle) mobileTitle.textContent = copy.mobileTitle;

        sidebarNav.querySelectorAll('.nav-group-title').forEach((title, index) => {
            title.textContent = copy.groups[index] || title.textContent;
        });

        sidebarNav.querySelectorAll('.nav-link').forEach(link => {
            const label = copy.pages[link.dataset.page];
            if (label) setTrailingText(link, label);
        });

        if (languageToggle) {
            languageToggle.querySelectorAll('[data-lang-option]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.langOption === currentLanguage);
            });
        }
    }

    function setLanguage(lang) {
        if (!DOC_I18N[lang]) return;
        currentLanguage = lang;
        localStorage.setItem('apricity-docs-language', lang);
        applyLanguageChrome();
        renderPage(currentPage);
    }

    // ---- Render page ----
    function renderPage(pageName) {
        const pages = getPages();
        if (!pages[pageName]) pageName = 'introduction';
        currentPage = pageName;

        contentEl.innerHTML = pages[pageName];
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

    if (languageToggle) {
        languageToggle.addEventListener('click', e => {
            const btn = e.target.closest('[data-lang-option]');
            if (!btn) return;
            setLanguage(btn.dataset.langOption);
        });
    }

    // ---- Copy code ----
    window.copyCode = function (btn) {
        const pre = btn.closest('.code-block').querySelector('pre');
        navigator.clipboard.writeText(pre.textContent).then(() => {
            const original = btn.textContent;
            btn.textContent = DOC_I18N[currentLanguage].copied;
            setTimeout(() => { btn.textContent = original; }, 1500);
        });
    };

    // ---- Hash navigation ----
    window.addEventListener('hashchange', () => {
        renderPage(getPageNameFromHash());
    });

    // ---- Boot ----
    applyLanguageChrome();
    renderPage(getPageNameFromHash());
})();
