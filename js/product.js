// ===================================================
// HOAI — product.js
// Sidebar navigation & search for product.html
// ===================================================

(function () {

    var sidebarBtns = document.querySelectorAll('.sidebar-btn');
    var panels = document.querySelectorAll('.prod-panel');
    var searchInput = document.getElementById('sidebarSearch');

    if (!sidebarBtns.length) return; // Only on product.html

    // ─── PANEL SWITCHER ──────────────────────────────
    function showPanel(targetId) {
        panels.forEach(function (p) { p.classList.remove('active'); });
        sidebarBtns.forEach(function (b) { b.classList.remove('active'); });
        var panel = document.getElementById(targetId);
        if (panel) panel.classList.add('active');
        var btn = document.querySelector('.sidebar-btn[data-target="' + targetId + '"]');
        if (btn) {
            btn.classList.add('active');
            // Scroll button into view on mobile
            btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        // Scroll main panel to top
        var main = document.getElementById('prodMain');
        if (main) main.scrollTop = 0;
    }

    sidebarBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            showPanel(this.getAttribute('data-target'));
        });
    });

    // ─── SIDEBAR SEARCH ──────────────────────────────
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            var q = this.value.trim().toLowerCase();
            sidebarBtns.forEach(function (btn) {
                var text = btn.textContent.toLowerCase();
                var li = btn.closest('li');
                if (li) li.style.display = (!q || text.includes(q)) ? '' : 'none';
            });
        });
    }

    // ─── FAQ ACCORDION (product page) ────────────────
    document.querySelectorAll('.faq-q').forEach(function (q) {
        q.addEventListener('click', function () {
            var item = this.closest('.faq-item');
            var isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(function (el) { el.classList.remove('open'); });
            if (!isOpen) item.classList.add('open');
        });
    });

    // Show the first panel by default
    if (panels.length && !document.querySelector('.prod-panel.active')) {
        panels[0].classList.add('active');
        if (sidebarBtns[0]) sidebarBtns[0].classList.add('active');
    }

})();

  (function () {
            var panels = document.querySelectorAll('.prod-panel');
            var buttons = document.querySelectorAll('.sidebar-btn');

            function showPanel(id) {
                panels.forEach(function (p) { p.classList.remove('active'); });
                buttons.forEach(function (b) { b.classList.remove('active'); });
                var t = document.getElementById(id);
                var b = document.querySelector('[data-target="' + id + '"]');
                if (t) t.classList.add('active');
                if (b) b.classList.add('active');
                window.scrollTo({ top: document.querySelector('.products-page-wrap').offsetTop - 80, behavior: 'smooth' });
            }

            buttons.forEach(function (btn) {
                btn.addEventListener('click', function () { showPanel(this.getAttribute('data-target')); });
            });

            document.getElementById('sidebarSearch').addEventListener('input', function () {
                var q = this.value.toLowerCase();
                document.querySelectorAll('#sidebarNav li').forEach(function (li) {
                    li.style.display = (!q || li.textContent.toLowerCase().includes(q)) ? '' : 'none';
                });
            });

            var st = document.querySelector('.scroll-top');
            if (st) {
                window.addEventListener('scroll', function () { st.classList.toggle('visible', window.scrollY > 300); }, { passive: true });
                st.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
            }
        })();