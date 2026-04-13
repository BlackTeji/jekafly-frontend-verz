var API_BASE = 'https://api.jekafly.com/api/v1';

var _accessToken = null;

async function apiFetch(method, path, body, isFormData = false) {
    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

    const res = await fetch(API_BASE + path, {
        method,
        credentials: 'include',
        headers,
        body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });

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
        }
        return null;
    }

    return res.json();
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
            return { ok: true, user: res.data.user, mustSetPassword: res.data.mustSetPassword };
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
    async adminGetAll() {
        const res = await get('/admin/affiliates');
        return res?.ok ? (res.data?.affiliates || []) : [];
    },
    async adminUpdateStatus(id, status) {
        return patch(`/admin/affiliates/${id}/status`, { status });
    },
    async adminProcessPayout(payoutId) {
        return patch(`/admin/affiliates/payouts/${payoutId}/process`, {});
    },
};