// ===================================================
// HOAI — slider.js
// Hero image slider with touch swipe & auto-play
// ===================================================

(function () {

    var slides = document.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.dot');
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    var currentSlide = 0;
    var autoSlide;

    if (!slides.length) return; // Not on a page with a slider

    function goToSlide(idx) {
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        currentSlide = (idx + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        // Re-trigger animation
        var content = slides[currentSlide].querySelector('.slide-content');
        if (content) { content.style.animation = 'none'; content.offsetHeight; content.style.animation = ''; }
    }

    function startAuto() { autoSlide = setInterval(function () { goToSlide(currentSlide + 1); }, 5000); }
    function resetAuto() { clearInterval(autoSlide); startAuto(); }

    if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); resetAuto(); });

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goToSlide(parseInt(this.getAttribute('data-index')));
            resetAuto();
        });
    });

    // Touch / swipe support
    var touchStartX = 0;
    var sliderEl = document.querySelector('.hero-slider');
    if (sliderEl) {
        sliderEl.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        sliderEl.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 40) { goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1); resetAuto(); }
        }, { passive: true });
    }

    startAuto();

})();
