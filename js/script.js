// ===================================================
// HOAI — script.js  (Master Entry Point)
// Initialises all modules on DOMContentLoaded
// Modules: nav.js | slider.js | animations.js
//          forms.js | product.js
// ===================================================

document.addEventListener('DOMContentLoaded', function () {

  // Reset overflow on every page load
  document.body.style.overflow = '';
  document.body.style.overflowX = 'hidden';

  // ─── IMAGE FALLBACK (SVG placeholder) ────────────
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      if (this.dataset.fallbackLoaded) return; // prevent infinite loop
      this.dataset.fallbackLoaded = '1';
      var alt = this.alt || '';
      var w = this.offsetWidth || 400;
      var h = this.offsetHeight || 300;
      this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
        '<rect width="100%" height="100%" fill="#2C363F"/>' +
        '<rect x="0" y="' + (h - 4) + '" width="100%" height="4" fill="#E60000"/>' +
        '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ' +
        'font-family="Poppins,sans-serif" font-size="13" fill="#ffffff" opacity="0.55">' +
        alt + '</text></svg>'
      );
    });
  });

  console.log('✅ HOAI — House of Artificial Intelligence loaded');

});
