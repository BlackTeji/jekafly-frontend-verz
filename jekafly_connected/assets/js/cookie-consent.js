(function () {
    'use strict';

    var KEY = 'jkf_cookie_consent';
    var VERSION = 1;
    var _el = null;

    function read() {
        try {
            var v = JSON.parse(localStorage.getItem(KEY) || 'null');
            return v && v.v === VERSION ? v : null;
        } catch (e) { return null; }
    }

    function save(analytics, marketing) {
        var v = { v: VERSION, essential: true, analytics: !!analytics, marketing: !!marketing, ts: new Date().toISOString() };
        try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { }
        close();
        window.dispatchEvent(new CustomEvent('jkf:consent', { detail: v }));
    }

    function close() {
        if (!_el) return;
        _el.classList.remove('ck-open');
        var el = _el;
        _el = null;
        setTimeout(function () { el.remove(); }, 250);
    }

    function open(showSettings) {
        if (_el) { if (showSettings) _el.classList.add('ck-manage'); return; }
        var cur = read() || { analytics: false, marketing: false };
        _el = document.createElement('div');
        _el.className = 'ck-banner' + (showSettings ? ' ck-manage' : '');
        _el.setAttribute('role', 'dialog');
        _el.setAttribute('aria-label', 'Cookie preferences');
        _el.innerHTML =
            '<div class="ck-body">' +
            '<div class="ck-title">We value your privacy</div>' +
            '<p class="ck-text">We use essential cookies to keep you signed in and your payments secure. With your permission, we\'d also like to use analytics and marketing cookies to improve Jekafly. See our <a href="/privacy#s7-cookies-and-tracking-technologies">Privacy Policy</a>.</p>' +
            '<div class="ck-options">' +
            '<label class="ck-opt"><span><strong>Essential</strong><small>Sign-in, security and payments. Always on.</small></span><input type="checkbox" checked disabled /><i class="ck-switch"></i></label>' +
            '<label class="ck-opt"><span><strong>Analytics</strong><small>Helps us understand how the site is used.</small></span><input type="checkbox" id="ck-analytics"' + (cur.analytics ? ' checked' : '') + ' /><i class="ck-switch"></i></label>' +
            '<label class="ck-opt"><span><strong>Marketing</strong><small>Personalised offers and ads.</small></span><input type="checkbox" id="ck-marketing"' + (cur.marketing ? ' checked' : '') + ' /><i class="ck-switch"></i></label>' +
            '</div>' +
            '</div>' +
            '<div class="ck-actions">' +
            '<button type="button" class="ck-btn ck-btn-link" data-ck="manage">Manage</button>' +
            '<button type="button" class="ck-btn ck-btn-ghost" data-ck="essential">Essential only</button>' +
            '<button type="button" class="ck-btn ck-btn-ghost ck-save" data-ck="save">Save choices</button>' +
            '<button type="button" class="ck-btn ck-btn-primary" data-ck="all">Accept all</button>' +
            '</div>';
        _el.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-ck]');
            if (!btn) return;
            var act = btn.getAttribute('data-ck');
            if (act === 'manage') _el.classList.add('ck-manage');
            else if (act === 'essential') save(false, false);
            else if (act === 'all') save(true, true);
            else if (act === 'save') save(document.getElementById('ck-analytics').checked, document.getElementById('ck-marketing').checked);
        });
        document.body.appendChild(_el);
        requestAnimationFrame(function () { requestAnimationFrame(function () { if (_el) _el.classList.add('ck-open'); }); });
    }

    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href="#cookie-settings"]');
        if (!a) return;
        e.preventDefault();
        open(true);
    });

    window.JKF_Consent = {
        get: read,
        has: function (cat) { var v = read(); return cat === 'essential' || !!(v && v[cat]); },
        open: function () { open(true); },
    };

    function init() {
        if (!read()) open(false);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
