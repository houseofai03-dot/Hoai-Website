// ===================================================
// HOAI — nav.js
// Header, mobile menu, dropdown, active link
// ===================================================

(function () {

    // ─── STICKY HEADER ───────────────────────────────
    var header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // ─── MOBILE MENU ─────────────────────────────────
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');

    function closeMenu() {
        if (menuToggle) menuToggle.classList.remove('open');
        if (navLinks) navLinks.classList.remove('open');
        document.body.style.overflow = '';
    }
    function openMenu() {
        if (menuToggle) menuToggle.classList.add('open');
        if (navLinks) navLinks.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navLinks.classList.contains('open') ? closeMenu() : openMenu();
        });
    }

    // Mobile dropdown accordion
    document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                var parent = this.closest('.has-dropdown');
                var wasOpen = parent.classList.contains('open');
                document.querySelectorAll('.has-dropdown').forEach(function (el) { el.classList.remove('open'); });
                if (!wasOpen) parent.classList.add('open');
            }
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
        if (navLinks && navLinks.classList.contains('open')) {
            if (!navLinks.contains(e.target) && e.target !== menuToggle) closeMenu();
        }
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
            document.querySelectorAll('.has-dropdown').forEach(function (el) { el.classList.remove('open'); });
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 991) {
            closeMenu();
            document.querySelectorAll('.has-dropdown').forEach(function (el) { el.classList.remove('open'); });
        }
    });

    // ─── ACTIVE NAV LINK (auto-detect) ───────────────
    var currentFile = window.location.pathname.split('/').pop() || 'index.html';
    if (currentFile === '') currentFile = 'index.html';

    document.querySelectorAll('.nav-links a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').split('/').pop();
        if (href && href !== '#' && href === currentFile) {
            a.classList.add('active');
            var dropdown = a.closest('.dropdown');
            if (dropdown) {
                var parentLink = dropdown.closest('.has-dropdown').querySelector(':scope > a');
                if (parentLink) parentLink.classList.add('active');
            }
        }
    });

})();
