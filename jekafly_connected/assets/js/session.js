(function () {
    'use strict';

    var WARN_MS = 8 * 60 * 1000;
    var LOGOUT_MS = 10 * 60 * 1000;

    var _warnTimer = null;
    var _logoutTimer = null;
    var _warningVisible = false;
    var _lastActivity = Date.now();
    var _hiddenAt = null;

    var ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'touchmove', 'scroll', 'click', 'pointerdown'];

    function isLoggedIn() {
        try { return !!localStorage.getItem('jkf_user'); } catch (e) { return false; }
    }

    function injectModal() {
        if (document.getElementById('jkf-session-modal')) return;
        var modal = document.createElement('div');
        modal.id = 'jkf-session-modal';
        modal.style.cssText = [
            'display:none', 'position:fixed', 'inset:0', 'z-index:99999',
            'background:rgba(10,13,50,0.75)', 'backdrop-filter:blur(6px)',
            '-webkit-backdrop-filter:blur(6px)', 'align-items:center',
            'justify-content:center', 'padding:20px', 'box-sizing:border-box'
        ].join(';');
        modal.innerHTML = [
            '<div style="background:#fff;border-radius:20px;padding:32px 28px;max-width:360px;width:100%;',
            'box-shadow:0 24px 64px rgba(13,21,96,0.22);text-align:center;font-family:\'Poppins\',sans-serif;">',
            '<div style="width:52px;height:52px;border-radius:14px;background:#FEF3C7;display:flex;',
            'align-items:center;justify-content:center;margin:0 auto 18px;">',
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
            '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
            '</svg></div>',
            '<h3 style="font-size:1.1rem;font-weight:800;color:#0D1560;margin:0 0 8px;letter-spacing:-0.02em;">Still there?</h3>',
            '<p style="font-size:0.88rem;color:#6B7280;line-height:1.6;margin:0 0 24px;">',
            'Your session will expire in <strong id="jkf-session-countdown" style="color:#0D1560;">2:00</strong> due to inactivity.</p>',
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">',
            '<button id="jkf-session-logout" style="padding:12px;border-radius:12px;background:transparent;',
            'border:1.5px solid rgba(13,21,96,0.18);color:#0D1560;font-family:\'Poppins\',sans-serif;',
            'font-size:0.88rem;font-weight:700;cursor:pointer;">Sign Out</button>',
            '<button id="jkf-session-stay" style="padding:12px;border-radius:12px;',
            'background:linear-gradient(135deg,#0D1560,#1C2FBF);color:#fff;border:none;',
            'font-family:\'Poppins\',sans-serif;font-size:0.88rem;font-weight:700;',
            'cursor:pointer;box-shadow:0 4px 14px rgba(13,21,96,0.28);">Stay Logged In</button>',
            '</div></div>'
        ].join('');
        document.body.appendChild(modal);

        document.getElementById('jkf-session-stay').addEventListener('click', function () {
            hideWarning(); resetTimers();
        });
        document.getElementById('jkf-session-logout').addEventListener('click', function () {
            hideWarning(); doSessionLogout();
        });
    }

    function showWarning() {
        if (_warningVisible) return;
        _warningVisible = true;
        var modal = document.getElementById('jkf-session-modal');
        if (!modal) return;
        modal.style.display = 'flex';

        var remaining = LOGOUT_MS - WARN_MS;
        var end = Date.now() + remaining;
        var tick = setInterval(function () {
            var left = Math.max(0, end - Date.now());
            var m = Math.floor(left / 60000);
            var s = Math.floor((left % 60000) / 1000);
            var cd = document.getElementById('jkf-session-countdown');
            if (cd) cd.textContent = m + ':' + (s < 10 ? '0' : '') + s;
            if (left <= 0) clearInterval(tick);
        }, 1000);
        modal._tick = tick;
    }

    function hideWarning() {
        _warningVisible = false;
        var modal = document.getElementById('jkf-session-modal');
        if (!modal) return;
        modal.style.display = 'none';
        if (modal._tick) { clearInterval(modal._tick); modal._tick = null; }
    }

    function doSessionLogout() {
        try { localStorage.removeItem('jkf_user'); } catch (e) { }
        try { localStorage.removeItem('jkf_last_active'); } catch (e) { }
        if (typeof Auth !== 'undefined' && Auth.logout) {
            Auth.logout().catch(function () { }).finally(function () {
                window.location.href = '/';
            });
        } else {
            window.location.href = '/';
        }
    }

    function resetTimers() {
        clearTimeout(_warnTimer);
        clearTimeout(_logoutTimer);
        if (!isLoggedIn()) return;
        _lastActivity = Date.now();
        try { localStorage.setItem('jkf_last_active', _lastActivity); } catch (e) { }

        _warnTimer = setTimeout(function () {
            showWarning();
        }, WARN_MS);

        _logoutTimer = setTimeout(function () {
            hideWarning();
            doSessionLogout();
        }, LOGOUT_MS);
    }

    function recordActivity() {
        if (_warningVisible) return;
        resetTimers();
    }

    function onVisibilityChange() {
        if (document.hidden) {
            _hiddenAt = Date.now();
            clearTimeout(_warnTimer);
            clearTimeout(_logoutTimer);
        } else {
            if (!isLoggedIn()) return;
            if (_hiddenAt !== null) {
                var awayMs = Date.now() - _hiddenAt;
                _hiddenAt = null;

                if (awayMs >= LOGOUT_MS) {
                    doSessionLogout();
                    return;
                }
                if (awayMs >= WARN_MS) {
                    showWarning();
                    _logoutTimer = setTimeout(function () {
                        hideWarning();
                        doSessionLogout();
                    }, Math.max(0, LOGOUT_MS - awayMs));
                    return;
                }
                var remainingWarn = Math.max(0, WARN_MS - awayMs);
                var remainingLogout = Math.max(0, LOGOUT_MS - awayMs);
                _warnTimer = setTimeout(showWarning, remainingWarn);
                _logoutTimer = setTimeout(function () { hideWarning(); doSessionLogout(); }, remainingLogout);
            }
        }
    }

    function onStorageChange(e) {
        if (e.key === 'jkf_last_active' && e.newValue) {
            if (!_warningVisible) {
                clearTimeout(_warnTimer);
                clearTimeout(_logoutTimer);
                _lastActivity = parseInt(e.newValue, 10) || Date.now();
                _warnTimer = setTimeout(showWarning, WARN_MS);
                _logoutTimer = setTimeout(function () { hideWarning(); doSessionLogout(); }, LOGOUT_MS);
            }
        }
        if (e.key === 'jkf_user' && !e.newValue) {
            window.location.href = '/';
        }
    }

    function onPageShow(e) {
        if (!e.persisted || !isLoggedIn()) return;
        var stored = null;
        try { stored = parseInt(localStorage.getItem('jkf_last_active'), 10); } catch (err) { }
        var awayMs = stored ? Date.now() - stored : LOGOUT_MS;
        if (awayMs >= LOGOUT_MS) {
            doSessionLogout();
        } else {
            resetTimers();
        }
    }

    function init() {
        if (!isLoggedIn()) return;
        injectModal();
        resetTimers();
        ACTIVITY_EVENTS.forEach(function (ev) {
            document.addEventListener(ev, recordActivity, { passive: true });
        });
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('storage', onStorageChange);
        window.addEventListener('pageshow', onPageShow);
    }

    function safeInit() {
        if (!isLoggedIn()) return;
        if (typeof Auth !== 'undefined' && typeof Auth.init === 'function') {
            Auth.init().then(function () {
                if (isLoggedIn()) init();
            }).catch(function () {
                if (isLoggedIn()) init();
            });
        } else {
            init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeInit);
    } else {
        safeInit();
    }

})();