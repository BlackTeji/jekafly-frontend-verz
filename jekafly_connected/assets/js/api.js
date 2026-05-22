var API_BASE = 'https://api.jekafly.com/api/v1';

var _accessToken = null;

async function apiFetch(method, path, body, isFormData = false) {
    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    let res;
    try {
        res = await fetch(API_BASE + path, {
            method,
            credentials: 'include',
            headers,
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
            signal: controller.signal,
        });
    } catch (err) {
        clearTimeout(timer);
        console.error('[apiFetch] Network error:', method, path, err.message);
        return null;
    }
    clearTimeout(timer);

    if (res.status === 401 && path !== '/auth/refresh') {
        const refreshed = await fetch(API_BASE + '/auth/refresh', {
            method: 'POST', credentials: 'include',
        });
        if (refreshed.ok) {
            const data = await refreshed.json();
            _accessToken = data.data.accessToken;
            return apiFetch(method, path, body, isFormData);
        }
        const stored = localStorage.getItem('jkf_user');
        if (!stored) {
            _accessToken = null;
            window.dispatchEvent(new CustomEvent('jkf:unauthenticated', { detail: { path } }));
            // Redirect to login with return path after short delay
            setTimeout(function () {
                if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/')) {
                    window.location.href = '/login?return=' + encodeURIComponent(window.location.pathname);
                }
            }, 2000);
        }
        return null;
    }

    try {
        return await res.json();
    } catch (err) {
        console.error('[apiFetch] JSON parse error:', method, path, res.status);
        return null;
    }
}

var get = (path) => apiFetch('GET', path);
var post = (path, body) => apiFetch('POST', path, body);
var patch = (path, body) => apiFetch('PATCH', path, body);
var put = (path, body) => apiFetch('PUT', path, body);
var del = (path) => apiFetch('DELETE', path);
var upload = (path, form) => apiFetch('POST', path, form, true);

async function apiFetchBlob(path) {
    const headers = {};
    if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;
    const res = await fetch(API_BASE + path, {
        method: 'GET',
        credentials: 'include',
        headers,
    });
    if (res.status === 401) {
        const refreshed = await fetch(API_BASE + '/auth/refresh', { method: 'POST', credentials: 'include' });
        if (refreshed.ok) {
            const data = await refreshed.json();
            _accessToken = data.data.accessToken;
            return apiFetchBlob(path);
        }
        return null;
    }
    if (!res.ok) return null;
    return res.blob();
}

var Auth = {
    async register(name, email, phone, password) {
        const res = await post('/auth/register', { name, email, phone, password });
        if (res?.ok) {
            _accessToken = res.data.accessToken;
            localStorage.setItem('jkf_user', JSON.stringify(res.data.user));
        }
        return res?.ok
            ? { ok: true, user: res.data.user }
            : { ok: false, msg: res?.error || 'Registration failed.' };
    },

    async login(email, password) {
        const res = await post('/auth/login', { email, password });
        if (res?.ok) {
            _accessToken = res.data.accessToken;
            localStorage.setItem('jkf_user', JSON.stringify(res.data.user));
        }
        return res?.ok
            ? { ok: true, user: res.data.user }
            : { ok: false, msg: res?.error || 'Login failed.' };
    },

    async logout() {
        await post('/auth/logout');
        _accessToken = null;
        localStorage.removeItem('jkf_user');
    },

    getCurrent() {
        try { return JSON.parse(localStorage.getItem('jkf_user') || 'null'); } catch { return null; }
    },

    async refreshCurrent() {
        const res = await get('/auth/me');
        if (res?.ok) {
            localStorage.setItem('jkf_user', JSON.stringify(res.data.user));
            return res.data.user;
        }
        return null;
    },

    async updateMe(name, phone) {
        const res = await patch('/auth/me', { name, phone });
        if (res?.ok) localStorage.setItem('jkf_user', JSON.stringify(res.data.user));
        return res;
    },

    async requestPasswordOtp() {
        return post('/auth/request-password-otp', {});
    },

    async changePassword(currentPassword, newPassword, otp) {
        return post('/auth/change-password', { currentPassword, newPassword, otp });
    },


    async magicLogin(token) {
        const res = await get('/auth/magic?token=' + encodeURIComponent(token));
        if (res?.ok) {
            _accessToken = res.data.accessToken;
            localStorage.setItem('jkf_user', JSON.stringify(res.data.user));
            return { ok: true, user: res.data.user, mustSetPassword: res.data.mustSetPassword, isNewUser: res.data.isNewUser };
        }
        return { ok: false, msg: res?.error || 'Invalid or expired link.' };
    },
    async init() {
        const user = this.getCurrent();
        if (!user) return null;
        if (Auth._initPromise) return Auth._initPromise;
        Auth._initPromise = (async () => {
            try {
                const tryRefresh = async () => {
                    const res = await fetch(API_BASE + '/auth/refresh', {
                        method: 'POST', credentials: 'include',
                    });
                    return res;
                };

                let res = await tryRefresh();

                if (!res.ok) {
                    await new Promise(r => setTimeout(r, 800));
                    res = await tryRefresh();
                }

                if (res.ok) {
                    const data = await res.json();
                    _accessToken = data.data.accessToken;
                    return user;
                }

                if (res.status === 401) {
                    localStorage.removeItem('jkf_user');
                    return null;
                }

                return user;
            } catch {
                return user;
            } finally {
                Auth._initPromise = null;
            }
        })();
        return Auth._initPromise;
    },
};

var AppStore = {
    async create(data) {
        const res = await post('/applications', data);
        return res?.ok ? res.data.application : null;
    },

    async getAll() {
        const res = await get('/admin/applications?limit=100');
        return res?.ok ? res.data.applications : [];
    },

    async getByUser() {
        const res = await get('/applications?limit=100');
        return res?.ok ? res.data.applications : [];
    },

    async getByRef(ref) {
        const res = await get(`/applications/${ref}`);
        return res?.ok ? res.data.application : null;
    },

    async track(ref) {
        const res = await get(`/applications/track/${ref}`);
        return res?.ok ? res.data : null;
    },

    async updateStatus(ref, status, note) {
        const res = await patch(`/admin/applications/${ref}/status`, {
            status: status.toUpperCase(), note,
        });
        return res?.ok ? res.data.application : null;
    },

    async setPaid(ref) {
        return true;
    },
};

var DocStore = {
    async upload(files, ref, docIndex) {
        const hasSlotIndex = files.some(f => f.docIndex != null);
        if (hasSlotIndex) {
            const results = [];
            for (const f of files) {
                const form = new FormData();
                form.append('files', f.file, f.name);
                if (ref) form.append('ref', ref);
                if (f.docIndex != null) form.append('docIndex', String(f.docIndex));
                const res = await upload('/documents/upload', form);
                if (res?.ok) results.push(...res.data.uploaded);
            }
            return results;
        }
        const form = new FormData();
        files.forEach(f => form.append('files', f.file, f.name));
        if (ref) form.append('ref', ref);
        if (docIndex != null) form.append('docIndex', docIndex);
        const res = await upload('/documents/upload', form);
        return res?.ok ? res.data.uploaded : [];
    },

    async getVault(ref) {
        const path = ref ? `/documents?ref=${ref}` : '/documents';
        const res = await get(path);
        return res?.ok ? res.data.documents : [];
    },

    async getSignedUrl(id) {
        const res = await get(`/documents/${id}/url`);
        return res?.ok ? res.data.url : null;
    },

    async remove(id) {
        return del(`/documents/${id}`);
    },
};

var FeeStore = {
    _cache: null,
    _cacheTime: 0,
    _TTL: 30 * 1000,

    async getAll() {
        const now = Date.now();
        if (this._cache && (now - this._cacheTime) < this._TTL) return this._cache;
        const res = await get('/fees');
        if (res?.ok) {
            this._cache = res.data;
            this._cacheTime = now;
            return res.data;
        }
        return { serviceFee: 25000, destinations: {} };
    },

    async setServiceFee(amount) {
        this._cache = null;
        this._cacheTime = 0;
        return put('/fees/service', { amount: Number(amount) });
    },

    async setDestinationFee(country, amount) {
        this._cache = null;
        this._cacheTime = 0;
        return put(`/fees/${encodeURIComponent(country)}`, { amount: Number(amount) });
    },

    async resetDestinationFee(country) {
        this._cache = null;
        this._cacheTime = 0;
        return del(`/fees/${encodeURIComponent(country)}`);
    },

    async toggleCountry(country) {
        this._cacheTime = 0;
        return patch(`/fees/${encodeURIComponent(country)}/toggle`);
    },
};

var PaymentStore = {
    async initiate(type, ref, amount, email, metadata) {
        const body = { type, amount: Number(amount), email, metadata };
        if (ref) body.ref = ref;
        return post('/payments/initiate', body);
    },

    async verify(reference) {
        return get(`/payments/${reference}/verify`);
    },

    async list() {
        const res = await get('/payments');
        return res?.ok ? res.data.payments : [];
    },
};

var InsuranceStore = {
    async getAll() {
        const res = await get('/insurance');
        return res?.ok ? res.data.policies : [];
    },

    async downloadReceipt(id, plan) {
        const blob = await apiFetchBlob(`/insurance/${encodeURIComponent(id)}/receipt`);
        if (!blob) { return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jekafly-insurance-' + (plan || 'policy').replace(/\s+/g, '-').toLowerCase() + '.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    },
};

var AdminStore = {
    async getByRef(ref) {
        const res = await get(`/admin/applications/${ref}`);
        return res?.ok ? res.data.application : null;
    },

    async getUsers() {
        const res = await get('/admin/users?limit=100');
        return res?.ok ? res.data.users : [];
    },

    async updateRole(id, role) {
        return patch(`/admin/users/${id}/role`, { role: role.toUpperCase() });
    },

    async getDocuments(ref) {
        const path = ref ? `/admin/documents?ref=${ref}` : '/admin/documents';
        const res = await get(path);
        return res?.ok ? res.data.documents : [];
    },

    async deleteUser(id) {
        return del(`/admin/users/${id}`);
    },

    async getPageviews(days = 30) {
        const res = await get('/admin/pageviews?days=' + days);
        return res?.ok ? res.data : null;
    },

    async getAnalytics(period = '30d') {
        const res = await get('/admin/analytics?period=' + period);
        return res?.ok ? res.data : null;
    },

    async getAllPayments() {
        const res = await get('/admin/payments');
        return res?.ok ? res.data.payments : [];
    },

    async getFlightOrders() {
        const res = await get('/admin/flights');
        return res?.ok ? res : { orders: [] };
    },

    async getHotelOrders() {
        const res = await get('/admin/hotels');
        return res?.ok ? res : { orders: [] };
    },
};

async function doLogout() {
    await Auth.logout();
    window.location.href = '/';
}

var PricingStore = {
    async get() {
        const res = await get('/pricing');
        return res?.ok ? res.data.pricing : null;
    },
    async update(data) {
        return patch('/pricing', data);
    },
};

var AffiliateStore = {
    async apply(data) {
        return post('/affiliates/apply', data);
    },
    async getMe() {
        const res = await get('/affiliates/me');
        return res?.ok ? res.data : null;
    },
    async getStats() {
        const res = await get('/affiliates/stats');
        return res?.ok ? res.data : null;
    },
    async getPayouts() {
        const res = await get('/affiliates/payouts');
        return res?.ok ? (res.data?.payouts || []) : [];
    },
    async requestPayout(amount, bankDetails) {
        return post('/affiliates/payouts/request', { amount, bankDetails });
    },
    async getReferrals() {
        const res = await get('/affiliates/referrals');
        return res?.ok ? res.data.referrals : [];
    },
    async adminGetAll() {
        const res = await get('/admin/affiliates');
        return res?.ok ? (res.data?.affiliates || []) : [];
    },
    async adminUpdateStatus(id, status) {
        return patch(`/admin/affiliates/${id}/status`, { status });
    },
    async adminGetAllPayouts() {
        const res = await get('/admin/affiliates/payouts');
        return res?.ok ? (res.data?.payouts || []) : [];
    },
    async adminProcessPayout(payoutId) {
        return patch(`/admin/affiliates/payouts/${payoutId}/process`, {});
    },
};

(function () {
    'use strict';

    var IDLE_MS = 5 * 60 * 1000;
    var WARN_MS = 4 * 60 * 1000;
    var _warnEl = null;
    var _warnCountdown = null;
    var _idleTimer = null;
    var _warnTimer = null;
    var _active = false;
    var _lastActivity = Date.now();

    function _isLoggedIn() {
        try { return !!localStorage.getItem('jkf_user'); } catch { return false; }
    }

    function _removeWarn() {
        if (_warnEl) { _warnEl.remove(); _warnEl = null; }
        if (_warnCountdown) { clearInterval(_warnCountdown); _warnCountdown = null; }
    }

    function _showWarn() {
        _removeWarn();
        var secs = 60;
        _warnEl = document.createElement('div');
        _warnEl.id = 'jkf-idle-warn';
        _warnEl.style.cssText = [
            'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:99999;',
            'background:#0D1560;color:#fff;border-radius:14px;padding:16px 24px;',
            'font-family:Poppins,sans-serif;font-size:0.9rem;font-weight:600;',
            'box-shadow:0 8px 32px rgba(0,0,0,0.28);display:flex;align-items:center;gap:16px;',
            'max-width:92vw;',
        ].join('');
        _warnEl.innerHTML =
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E31E24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
            '<span>Session expiring in <strong id="jkf-idle-secs">60</strong>s due to inactivity.</span>' +
            '<button onclick="window.__jkfIdleReset && window.__jkfIdleReset()" style="' +
            'background:#E31E24;border:none;color:#fff;padding:8px 16px;border-radius:8px;' +
            'font-family:Poppins,sans-serif;font-weight:700;font-size:0.85rem;cursor:pointer;white-space:nowrap;' +
            '">Stay Logged In</button>';
        document.body.appendChild(_warnEl);

        _warnCountdown = setInterval(function () {
            secs--;
            var el = document.getElementById('jkf-idle-secs');
            if (el) el.textContent = secs;
            if (secs <= 0) { clearInterval(_warnCountdown); _warnCountdown = null; }
        }, 1000);
    }

    function _logout() {
        _removeWarn();
        _active = false;
        _clearTimers();
        if (typeof Auth !== 'undefined') {
            Auth.logout().catch(function () { }).finally(function () {
                window.location.replace('/');
            });
        } else {
            localStorage.removeItem('jkf_user');
            window.location.replace('/');
        }
    }

    function _clearTimers() {
        if (_idleTimer) { clearTimeout(_idleTimer); _idleTimer = null; }
        if (_warnTimer) { clearTimeout(_warnTimer); _warnTimer = null; }
    }

    function _reset() {
        if (!_active) return;
        _lastActivity = Date.now();
        _removeWarn();
        _clearTimers();
        _warnTimer = setTimeout(_showWarn, WARN_MS);
        _idleTimer = setTimeout(_logout, IDLE_MS);
    }

    function _start() {
        if (_active) return;
        if (!_isLoggedIn()) return;
        _active = true;
        _lastActivity = Date.now();
        _reset();
    }

    function _stop() {
        _active = false;
        _clearTimers();
        _removeWarn();
    }

    document.addEventListener('visibilitychange', function () {
        if (!_active) return;
        if (document.hidden) return;

        var elapsed = Date.now() - _lastActivity;

        if (elapsed >= IDLE_MS) {
            _logout();
        } else if (elapsed >= WARN_MS) {
            var remaining = Math.ceil((IDLE_MS - elapsed) / 1000);
            _removeWarn();
            _showWarn();
            var el = document.getElementById('jkf-idle-secs');
            if (el) el.textContent = remaining;
            _clearTimers();
            _idleTimer = setTimeout(_logout, IDLE_MS - elapsed);
        } else {
            _clearTimers();
            var timeLeft = IDLE_MS - elapsed;
            var warnLeft = WARN_MS - elapsed;
            if (warnLeft > 0) _warnTimer = setTimeout(_showWarn, warnLeft);
            _idleTimer = setTimeout(_logout, timeLeft);
        }
    });

    window.addEventListener('focus', function () {
        if (!_active) return;
        var elapsed = Date.now() - _lastActivity;
        if (elapsed >= IDLE_MS) _logout();
    });

    window.__jkfIdleReset = function () { _reset(); };

    var EVENTS = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click', 'wheel'];
    var _throttle = null;
    function _onActivity() {
        if (!_active) return;
        if (_throttle) return;
        _throttle = setTimeout(function () { _throttle = null; }, 500);
        _reset();
    }
    EVENTS.forEach(function (ev) {
        document.addEventListener(ev, _onActivity, { passive: true, capture: true });
    });

    document.addEventListener('DOMContentLoaded', function () {
        if (_isLoggedIn()) _start();
    });

    window.addEventListener('storage', function (e) {
        if (e.key === 'jkf_user') {
            if (e.newValue) { _start(); }
            else { _stop(); }
        }
    });

    window.addEventListener('jkf:unauthenticated', _stop);

    window.JKF_IdleSession = { start: _start, stop: _stop, reset: _reset };
})();