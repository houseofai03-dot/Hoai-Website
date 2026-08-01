// ===================================================
// HOAI — forms.js
// Contact form submission → Google Sheets
// ===================================================

(function () {

    // ⚠️ Replace with your own Google Apps Script deployment URL
    var GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyUTdMJ-b-qPw9T5FDzMp2is3WIzNJd_Kf1Tk3teb6ZI5fxVWzxEwBfBKGKPAnRrdHkCQ/exec";

    document.querySelectorAll('form[id="contactForm"]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var btn = form.querySelector('.btn-submit');
            var originalText = btn.textContent;

            // Collect all labelled form fields
            var payload = {};
            form.querySelectorAll('.form-group').forEach(function (group) {
                var label = group.querySelector('label');
                var input = group.querySelector('input, textarea, select');
                if (!label || !input) return;
                var lbl = label.textContent.trim().toLowerCase();
                if (lbl.includes('name')) payload.name = input.value.trim();
                else if (lbl.includes('phone')) payload.phone = input.value.trim();
                else if (lbl.includes('email')) payload.email = input.value.trim();
                else if (lbl.includes('service')) payload.service = input.value.trim();
                else if (lbl.includes('city')) payload.city = input.value.trim();
                else if (lbl.includes('project')) payload.project = input.value.trim();
                else if (lbl.includes('message') || input.tagName === 'TEXTAREA')
                    payload.message = input.value.trim();
            });

            // Loading state
            btn.textContent = 'Sending…';
            btn.disabled = true;
            btn.style.opacity = '0.75';

            fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data.status === 'success') {
                        btn.textContent = '✓ Message Sent!';
                        btn.style.background = '#22c55e';
                        btn.style.color = '#fff';
                        form.reset();
                    } else {
                        throw new Error(data.message || 'Something went wrong');
                    }
                })
                .catch(function (err) {
                    console.error('Form submission error:', err);
                    btn.textContent = '✗ Error — Try Again';
                    btn.style.background = '#ef4444';
                    btn.style.color = '#fff';
                })
                .finally(function () {
                    btn.disabled = false;
                    btn.style.opacity = '';
                    setTimeout(function () {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 3500);
                });
        });
    });

})();
