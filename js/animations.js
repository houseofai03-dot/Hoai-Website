// ===================================================
// HOAI — animations.js
// Scroll reveal, counter animation, scroll-to-top
// ===================================================

(function () {

    // ─── SCROLL REVEAL ───────────────────────────────
    // Auto-add reveal class to major grid sections
    document.querySelectorAll(
        '.intro-grid,.app-grid,.voice-grid,.footer-grid,' +
        '.hotel-intro-grid,.cctv-intro-grid,.theater-about-grid,.contact-grid'
    ).forEach(function (el) {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
            el.classList.add('reveal');
        }
    });

    function checkReveal() {
        var wh = window.innerHeight;
        document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
            // Wider threshold: reveal anything within 1.5x viewport height
            if (el.getBoundingClientRect().top < wh * 1.5) el.classList.add('visible');
        });
        document.querySelectorAll('.product-card').forEach(function (card, i) {
            if (card.getBoundingClientRect().top < window.innerHeight * 1.5) {
                setTimeout(function () { card.classList.add('visible'); }, i * 40);
            }
        });
    }

    // ─── FALLBACK: Reveal ALL elements on page progressively ─
    // This ensures content is never permanently hidden if scroll
    // events don't fire (e.g. very short pages, screenshot tools)
    function revealAllFallback() {
        var allReveal = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
        // First pass — reveal what's in viewport now
        checkReveal();
        // Staggered fallback — reveal everything else in batches
        var unrevealed = [];
        allReveal.forEach(function (el) {
            if (!el.classList.contains('visible')) unrevealed.push(el);
        });
        unrevealed.forEach(function (el, i) {
            setTimeout(function () {
                el.classList.add('visible');
            }, 300 + i * 60);
        });
        // Also handle product-cards
        var unrevealedCards = [];
        document.querySelectorAll('.product-card').forEach(function (card) {
            if (!card.classList.contains('visible')) unrevealedCards.push(card);
        });
        unrevealedCards.forEach(function (card, i) {
            setTimeout(function () { card.classList.add('visible'); }, 500 + i * 40);
        });
    }

    window.addEventListener('scroll', checkReveal, { passive: true });
    requestAnimationFrame(function () {
        checkReveal();
        setTimeout(checkReveal, 200);
        setTimeout(checkReveal, 600);
        // Full fallback at 1.2s — ensures everything is visible
        setTimeout(revealAllFallback, 1200);
    });

    // ─── COUNTER ANIMATION ───────────────────────────
    var counters = document.querySelectorAll('.counter');
    var countersDone = false;

    function runCounters() {
        if (countersDone || !counters.length) return;
        var statsEl = document.querySelector('.stats-section');
        if (!statsEl) return;
        if (statsEl.getBoundingClientRect().top < window.innerHeight - 50) {
            countersDone = true;
            counters.forEach(function (c) {
                var target = parseInt(c.getAttribute('data-target'));
                var step = Math.max(1, Math.ceil(target / 80));
                var cur = 0;
                var iv = setInterval(function () {
                    cur += step;
                    if (cur >= target) { cur = target; clearInterval(iv); }
                    c.textContent = cur;
                }, 20);
            });
        }
    }

    window.addEventListener('scroll', runCounters, { passive: true });
    runCounters();

    // ─── SCROLL TO TOP ───────────────────────────────
    var scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

})();
