// ===================================================
// HOAI — forms.js
// Custom Multiselect Dropdown & Contact Form Submission
// ===================================================

window.toggleCheckboxDropdown = function () {
    var checkboxes = document.getElementById("checkboxes");
    if (checkboxes) {
        checkboxes.classList.toggle("show");
    }
};

document.addEventListener("DOMContentLoaded", function () {
    var GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx_kdSCddiwWqT0kukNUL9kV4NZBi2VpsqMAu4ODP9mb4AUBcGgepmKr6ECa5aUGA_psg/exec";

    // ---------------------------------------------------
    // 1. Custom Multiselect Dropdown Controls
    // ---------------------------------------------------
    var customSelects = document.querySelectorAll(".custom-multiselect");

    customSelects.forEach(function (container) {
        var selectBox = container.querySelector(".select-box");
        var checkboxesContainer = container.querySelector(".checkboxes-container") || container.querySelector("#checkboxes");

        if (selectBox && checkboxesContainer) {
            selectBox.addEventListener("click", function (e) {
                e.stopPropagation();

                document.querySelectorAll(".checkboxes-container.show").forEach(function (openDropdown) {
                    if (openDropdown !== checkboxesContainer) {
                        openDropdown.classList.remove("show");
                    }
                });

                checkboxesContainer.classList.toggle("show");
            });

            checkboxesContainer.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }
    });

    document.addEventListener("click", function () {
        document.querySelectorAll(".checkboxes-container.show").forEach(function (openDropdown) {
            openDropdown.classList.remove("show");
        });
    });

    // ---------------------------------------------------
    // 2. Select All & Individual Checkbox Toggle Logic
    // ---------------------------------------------------
    document.addEventListener("change", function (e) {
        if (e.target.matches('.checkboxes-container input[type="checkbox"]')) {
            var container = e.target.closest('.custom-multiselect');
            if (!container) return;

            var selectAllCb = container.querySelector('.select-all-checkbox');
            var itemCbs = Array.from(container.querySelectorAll('input[type="checkbox"]:not(.select-all-checkbox)'));

            if (e.target === selectAllCb) {
                var isChecked = selectAllCb.checked;
                itemCbs.forEach(function (cb) {
                    cb.checked = isChecked;
                });
            } else {
                var checkedCount = itemCbs.filter(function (cb) { return cb.checked; }).length;
                if (selectAllCb) {
                    selectAllCb.checked = (itemCbs.length > 0 && checkedCount === itemCbs.length);
                }
            }

            var labelSpan = container.querySelector('#selected-text');
            if (labelSpan) {
                var checkedItems = itemCbs.filter(function (cb) { return cb.checked; });
                var allChecked = itemCbs.length > 0 && checkedItems.length === itemCbs.length;

                if (allChecked) {
                    labelSpan.textContent = 'All/Full Automation';
                } else if (checkedItems.length > 0) {
                    labelSpan.textContent = checkedItems.map(function (cb) { return cb.value; }).join(', ');
                } else {
                    labelSpan.textContent = 'Select services...';
                }
            }
        }
    });

    // Helper function for field validation warning messages
    function triggerValidationError(btn, originalText, message, focusElement) {
        if (btn) {
            btn.textContent = message;
            btn.style.background = '#f59e0b';
            btn.style.color = '#fff';
            setTimeout(function () {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 3000);
        }
        if (focusElement) focusElement.focus();
    }

    // ---------------------------------------------------
    // 3. Form Submission & Validation Handler
    // ---------------------------------------------------
    var forms = document.querySelectorAll('form[id="contactForm"]');

    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var btn = form.querySelector('.btn-submit');
            var originalText = btn ? btn.textContent : 'Submit';

            var payload = {};

            form.querySelectorAll('.form-group').forEach(function (group) {
                var label = group.querySelector('label');
                if (!label) return;

                var lbl = label.textContent.trim().toLowerCase();

                if (lbl.includes('service')) {
                    var checkedServices = Array.from(group.querySelectorAll('input[name="service"]:checked'))
                                               .map(function (cb) { return cb.value; });
                    payload.service = checkedServices.join(', ');
                    return;
                }

                var input = group.querySelector('input, textarea, select');
                if (!input) return;

                if (lbl.includes('name')) payload.name = input.value.trim();
                else if (lbl.includes('phone')) payload.phone = input.value.trim();
                else if (lbl.includes('email')) payload.email = input.value.trim();
                else if (lbl.includes('city')) payload.city = input.value.trim();
                else if (lbl.includes('project') || lbl.includes('message') || input.tagName === 'TEXTAREA') {
                    payload.message = input.value.trim();
                }
            });

            // --- MANDATORY FIELDS VALIDATION ---
            if (!payload.name) {
                triggerValidationError(btn, originalText, '⚠️ Please enter your name', form.querySelector('input[name="name"]'));
                return;
            }

            if (!payload.phone) {
                triggerValidationError(btn, originalText, '⚠️ Please enter your phone number', form.querySelector('input[name="phone"]'));
                return;
            }

            if (!payload.service) {
                triggerValidationError(btn, originalText, '⚠️ Please select a service', form.querySelector('.select-box'));
                return;
            }

            if (!payload.city || payload.city.toLowerCase().includes('select your city')) {
                triggerValidationError(btn, originalText, '⚠️ Please select your city', form.querySelector('select[name="city"]'));
                return;
            }

            // --- SUBMISSION LOGIC ---
            if (btn) {
                btn.textContent = 'Sending…';
                btn.disabled = true;
                btn.style.opacity = '0.75';
            }

            fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data.status === 'success') {
                        if (btn) {
                            btn.textContent = '✓ Message Sent!';
                            btn.style.background = '#22c55e';
                            btn.style.color = '#fff';
                        }
                        form.reset();

                        var selectedText = form.querySelector('#selected-text');
                        if (selectedText) selectedText.textContent = 'Select services...';
                    } else {
                        throw new Error(data.message || 'Something went wrong');
                    }
                })
                .catch(function (err) {
                    console.error('Form submission error:', err);
                    if (btn) {
                        btn.textContent = '✗ Error — Try Again';
                        btn.style.background = '#ef4444';
                        btn.style.color = '#fff';
                    }
                })
                .finally(function () {
                    if (btn) {
                        btn.disabled = false;
                        btn.style.opacity = '';
                        setTimeout(function () {
                            btn.textContent = originalText;
                            btn.style.background = '';
                            btn.style.color = '';
                        }, 3500);
                    }
                });
        });
    });
});