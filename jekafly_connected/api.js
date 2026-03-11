// ============================================================
// JEKAFLY API CLIENT
// Replaces all localStorage / AppStore / Auth calls
// ============================================================

var API_BASE = 'https://jekafly-api-production.up.railway.app/api/v1';

var _accessToken = null;

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
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

  // Auto-refresh on 401
  if (res.status === 401 && path !== '/auth/refresh') {
    const refreshed = await fetch(API_BASE + '/auth/refresh', {
      method: 'POST', credentials: 'include',
    });
    if (refreshed.ok) {
      const data = await refreshed.json();
      _accessToken = data.data.accessToken;
      return apiFetch(method, path, body, isFormData); // retry
    }
    // Refresh failed — only redirect if we have no user stored
    // (avoids redirect when race condition causes one refresh to fail)
    const stored = localStorage.getItem('jkf_user');
    if (!stored) {
      _accessToken = null;
      window.location.href = 'index.html';
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

// ─── Auth ─────────────────────────────────────────────────────────────────────
var Auth = {
  async register(name, email, phone, password) {
    const res = await post('/auth/register', { name, email, phone, password });
    if (res?.ok) {
      _accessToken = res.data.accessToken;
      localStorage.setItem('jkf_user', JSON.stringify(res.data.user));
    }
    return res?.ok ? { ok: true, user: res.data.user } : { ok: false, msg: res?.error || 'Registration failed.' };
  },

  async login(email, password) {
    const res = await post('/auth/login', { email, password });
    if (res?.ok) {
      _accessToken = res.data.accessToken;
      localStorage.setItem('jkf_user', JSON.stringify(res.data.user));
    }
    return res?.ok ? { ok: true, user: res.data.user } : { ok: false, msg: res?.error || 'Login failed.' };
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

  async changePassword(currentPassword, newPassword) {
    return post('/auth/change-password', { currentPassword, newPassword });
  },

  // Restore access token on page load by calling /auth/me
  async init() {
    const user = this.getCurrent();
    if (!user) return null;
    // Prevent multiple simultaneous refresh calls
    if (Auth._initPromise) return Auth._initPromise;
    Auth._initPromise = (async () => {
      try {
        const res = await fetch(API_BASE + '/auth/refresh', {
          method: 'POST', credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          _accessToken = data.data.accessToken;
          return user;
        }
        // Only clear user if refresh definitively failed (not a race condition)
        if (res.status === 401) {
          localStorage.removeItem('jkf_user');
        }
        return null;
      } finally {
        Auth._initPromise = null;
      }
    })();
    return Auth._initPromise;
  }
};

// ─── Applications ─────────────────────────────────────────────────────────────
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
      status: status.toUpperCase(), note
    });
    return res?.ok ? res.data.application : null;
  },

  async setPaid(ref) {
    // Handled server-side by payment webhook — no client action needed
    return true;
  },
};

// ─── Documents (Vault) ────────────────────────────────────────────────────────
var DocStore = {
  async upload(files, ref, docIndex) {
    // If files have individual docIndex, upload each separately to preserve slot mapping
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
    // Batch upload without slot index
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

// ─── Fees ─────────────────────────────────────────────────────────────────────
var FeeStore = {
  _cache: null,
  _cacheTime: 0,
  _TTL: 30 * 1000, // 30 seconds — short enough to reflect admin changes quickly

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

// ─── Payments ─────────────────────────────────────────────────────────────────
var PaymentStore = {
  async initiate(type, ref, amount, email, metadata) {
    const body = { type, amount: Number(amount), email, metadata };
    if (ref) body.ref = ref; // omit if null/undefined — backend zod rejects null
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

// ─── Insurance ────────────────────────────────────────────────────────────────
var InsuranceStore = {
  async getAll() {
    const res = await get('/insurance');
    return res?.ok ? res.data.policies : [];
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────
var AdminStore = {
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
};

// ─── Logout helper ────────────────────────────────────────────────────────────
async function doLogout() {
  await Auth.logout();
  window.location.href = 'index.html';
}

// ─── PricingStore ─────────────────────────────────────────────────────────────
var PricingStore = {
  async get() {
    const res = await get('/pricing');
    return res?.ok ? res.data.pricing : null;
  },
  async update(data) {
    return patch('/pricing', data);
  },
};