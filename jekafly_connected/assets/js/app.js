// ── Mobile nav (shared across all pages) ────────────────────
function toggleNavMenu() {
    const drawer = document.getElementById('nav-mobile-drawer');
    const overlay = document.getElementById('nav-mobile-overlay');
    const burger = document.getElementById('nav-burger');
    if (!drawer) return;
    const open = !drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
    if (burger) burger.innerHTML = open ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    document.body.style.overflow = open ? 'hidden' : '';
}
function closeNavMenu() {
    const drawer = document.getElementById('nav-mobile-drawer');
    const overlay = document.getElementById('nav-mobile-overlay');
    const burger = document.getElementById('nav-burger');
    if (!drawer) return;
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (burger) burger.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    document.body.style.overflow = '';
}
(function initMobileNav() {
    // Drawer stays open on scroll — user must tap overlay or X to close
})();


function updateNav() {
    const user = Auth.getCurrent();
    const ctaEl = document.querySelector('.nav-cta');
    const mCta = document.getElementById('nav-mobile-cta');

    let desktopHtml = '', mobileHtml = '';

    if (user) {
        const first = (user.name || 'User').split(' ')[0];
        const isAdmin = user.role === 'ADMIN' || user.role === 'admin';

        desktopHtml = `
          <span class="nav-user-hi">Hi, <strong>${first}</strong></span>
          <a href="dashboard.html" class="btn-outline btn-outline-link">My Dashboard</a>
          ${isAdmin ? '<a href="admin.html" class="btn-outline btn-outline-link btn-outline-danger">Admin</a>' : ''}
          <button class="btn-primary" onclick="handleLogout()">Logout</button>`;

        const _href = window.location.href;
        const isDashboard = _href.includes('dashboard.html') || (window._jekafly_page === 'dashboard');
        const isAdminPage = _href.includes('admin.html') || (window._jekafly_page === 'admin');
        const isAffiliatePage = _href.includes('affiliate.html') || (window._jekafly_page === 'affiliate');

        mobileHtml = `
          <div class="nav-mob-menu">
            <div class="nav-mob-scroll">
            <div class="nav-mob-user-row">
              <div class="nav-mob-avatar">${(user.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
              <div class="nav-mob-user-text">
                <div class="nav-mob-name">${user.name || first}</div>
                <div class="nav-mob-email">${user.email || ''}</div>
              </div>
            </div>

            ${isDashboard ? `
            <div class="nav-mob-divider"></div>
            <div class="nav-mob-list">
              <button class="nav-mob-row" onclick="showTab('applications',null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#EEF2FF;color:#3B5BDB"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg></span>
                <span class="nav-mob-row-label">Applications</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="showTab('track',null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#F3F0FF;color:#7048E8"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
                <span class="nav-mob-row-label">Track Visa</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="showTab('insurance',null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#FFF0F6;color:#C2255C"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg></span>
                <span class="nav-mob-row-label">Insurance</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="showTab('mydocs',null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#FFF9DB;color:#E67700"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg></span>
                <span class="nav-mob-row-label">My Documents</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="showTab('documents',null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#EBFBEE;color:#2F9E44"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/></svg></span>
                <span class="nav-mob-row-label">Consultation</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="showTab('flights',null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#E0F7FA;color:#0891B2"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 1-4 1L8.5 8.5l-8.3-1.8L2 9l8 2-1 5-5 2 1 2 6-1.5 2 6 2-2.5z"/></svg></span>
                <span class="nav-mob-row-label">Flights</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="showTab('hotels',null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#FFFDE7;color:#CA8A04"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24 8-5.5A2 2 0 0 0 18 8.5V8H6v.5a2 2 0 0 0 .652 1.76l8 5.5L15 16"/></svg></span>
                <span class="nav-mob-row-label">Hotels</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="showTab('profile',null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#E7F5FF;color:#1C7ED6"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M3 21a9 9 0 0 1 18 0"/></svg></span>
                <span class="nav-mob-row-label">My Profile</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            ` : isAdminPage ? `
            <div class="nav-mob-divider"></div>
            <div class="nav-mob-list">
              <button class="nav-mob-row" onclick="adminTab('overview', null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#EEF2FF;color:#3B5BDB"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
                <span class="nav-mob-row-label">Overview</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="adminTab('applications', null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#F3F0FF;color:#7048E8"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg></span>
                <span class="nav-mob-row-label">All Applications</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="adminTab('users', null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#EBFBEE;color:#2F9E44"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                <span class="nav-mob-row-label">Users</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="adminTab('fees', null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#FFF9DB;color:#E67700"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>
                <span class="nav-mob-row-label">Manage Fees</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="adminTab('reviews', null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#FFF0F6;color:#C2255C"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                <span class="nav-mob-row-label">Reviews</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="adminTab('consultations', null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#E0F7FA;color:#0891B2"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
                <span class="nav-mob-row-label">Consultations</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="adminTab('insurance', null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#FFF0F6;color:#C2255C"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg></span>
                <span class="nav-mob-row-label">Insurance</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button class="nav-mob-row" onclick="adminTab('affiliates', null);closeNavMenu()">
                <span class="nav-mob-row-icon" style="background:#FFFDE7;color:#CA8A04"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg></span>
                <span class="nav-mob-row-label">Affiliates</span>
                <svg class="nav-mob-row-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            ` : ''}

            </div>
            <div class="nav-mob-footer">
            <div class="nav-mob-footer-inner">
              ${isAdmin && !isAdminPage ? `
              <a href="admin.html" onclick="closeNavMenu()" class="nav-mob-admin-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
                Admin Panel
              </a>` : ''}
              <div class="nav-mob-action-row">
                ${isAdminPage ? `
                <a href="dashboard.html" onclick="closeNavMenu()" class="nav-mob-cta-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                  User Dashboard
                </a>` : isDashboard ? `
                <a href="apply.html" onclick="closeNavMenu()" class="nav-mob-cta-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Application
                </a>` : `
                <a href="dashboard.html" onclick="closeNavMenu()" class="nav-mob-cta-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                  My Dashboard
                </a>`}
                <button onclick="handleLogout();closeNavMenu()" class="nav-mob-logout-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            </div>
            </div>

          </div>`
    } else {
        desktopHtml = `
          <button class="btn-outline" onclick="openModal('login')">Login</button>
          <button class="btn-primary" onclick="openModal('register')">Get Started</button>`;

        mobileHtml = `
          <div class="nav-mob-footer">
            ${!isAffiliatePage ? `
            <a href="affiliate.html" onclick="closeNavMenu()" class="nav-mob-admin-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>
              Become an Affiliate
            </a>` : ''}
            <div class="nav-mob-action-row">
              <button class="nav-mob-cta-btn" onclick="openModal('login');closeNavMenu()">Login</button>
              <button class="nav-mob-cta-btn nav-mob-cta-btn--outline" onclick="openModal('register');closeNavMenu()">Get Started</button>
            </div>
          </div>`;
    }

    if (ctaEl) ctaEl.innerHTML = desktopHtml;
    if (mCta) mCta.innerHTML = mobileHtml;
}

async function handleLogout() {
    await Auth.logout();
    window.location.replace('index.html');
}


function showToast(msg, type = 'success') {
    let t = document.getElementById('jkf-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'jkf-toast';
        t.style.cssText =
            'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);z-index:9999;padding:14px 28px;border-radius:12px;font-family:"Plus Jakarta Sans",sans-serif;font-weight:600;font-size:0.9rem;box-shadow:0 8px 32px rgba(0,0,0,0.18);transition:opacity .3s;pointer-events:none;';
        document.body.appendChild(t);
    }
    t.style.background = type === 'error' ? '#E31E24' : '#10B981';
    t.style.color = 'white';
    t.innerHTML = msg;
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.opacity = '0'; }, 3000);
}


function openModal(type) {
    const auth = document.getElementById("modal-auth");
    const apply = document.getElementById("modal-apply");
    const ins = document.getElementById("modal-insurance");
    const overlay = document.getElementById("modal");

    const consult = document.getElementById("modal-consultation");
    if (auth) auth.style.display = "none";
    if (apply) apply.style.display = "none";
    if (ins) ins.style.display = "none";
    if (consult) consult.style.display = "none";

    if (type === "login" || type === "register") {
        if (auth) auth.style.display = "block";
        switchTab(type === "register" ? "register" : "login");
    } else if (type === "apply") {
        if (apply) apply.style.display = "block";
    } else if (type === "insurance") {
        if (ins) ins.style.display = "block";
        if (typeof PricingStore !== 'undefined') {
            PricingStore.get().then(p => { if (p) { window._livePricing = p; if (typeof applyInsPricing === 'function') applyInsPricing(p); } }).catch(() => { });
        }
    } else if (type === "consultation") {
        if (consult) consult.style.display = "block";
        if (typeof PricingStore !== 'undefined') {
            PricingStore.get().then(p => { if (p) { window._livePricing = p; if (typeof applyConsultPricing === 'function') applyConsultPricing(p); } }).catch(() => { });
        }
    }

    overlay?.classList.add("open");
}

function closeModal() {
    document.getElementById("modal")?.classList.remove("open");
}

function closeModalIfBg(e) {
    if (e.target === document.getElementById("modal")) closeModal();
}

function switchTab(tab) {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((t, i) => {
        t.classList.toggle("active", (i === 0 && tab === "login") || (i === 1 && tab === "register"));
    });
    document.getElementById("tab-login")?.classList.toggle("active", tab === "login");
    document.getElementById("tab-register")?.classList.toggle("active", tab === "register");
    const title = document.getElementById("modal-title");
    const sub = document.querySelector("#modal-auth .modal-sub");
    if (title) title.textContent = tab === "login" ? "Welcome Back" : "Create Account";
    if (sub) sub.textContent = tab === "login" ? "Sign in to your Jekafly account" : "Join thousands of travellers using Jekafly";
}


function selectPlan(el) {
    document.querySelectorAll(".ins-plan").forEach(p => p.classList.remove("active"));
    el.classList.add("active");
}


async function handleLogin() {
    const email = document.getElementById('login-email')?.value?.trim();
    const pass = document.getElementById('login-pass')?.value;

    if (!email || !pass) { showToast('Please fill in all fields.', 'error'); return; }

    const res = await Auth.login(email, pass);
    if (!res.ok) { showToast(res.msg, 'error'); return; }

    closeModal();
    updateNav();
    const firstName = (res.user.name || 'there').split(' ')[0];
    showToast('Welcome back, ' + firstName + '!');

    if (window.JKF_afterLoginRedirect && window.JKF_afterLoginRedirect()) return;

    setTimeout(() => {
        window.location.href = res.user.role === 'ADMIN' ? 'admin.html' : 'dashboard.html';
    }, 900);
}

async function handleRegister() {
    const name = document.getElementById('reg-name')?.value?.trim();
    const email = document.getElementById('reg-email')?.value?.trim();
    const phone = document.getElementById('reg-phone')?.value?.trim();
    const pass = document.getElementById('reg-pass')?.value;

    if (!name || !email || !phone || !pass) { showToast('Please fill in all fields.', 'error'); return; }

    const res = await Auth.register(name, email, phone, pass);
    if (!res.ok) { showToast(res.msg, 'error'); return; }

    closeModal();
    updateNav();
    showToast('Account created! Welcome to Jekafly');


    if (window.JKF_afterLoginRedirect && window.JKF_afterLoginRedirect()) return;

    setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
}

function handleInsuranceModal() {
    const dest = document.getElementById('ins-dest')?.value;
    const date = document.getElementById('ins-date')?.value;
    const travellers = document.getElementById('ins-travellers')?.value;
    const plan = document.querySelector('.ins-plan.active .ins-plan-name')?.textContent || 'Standard Plan';

    if (!dest || !date || !travellers) { showToast('Please fill in all fields.', 'error'); return; }

    const priceMap = {
        'Basic Plan': window._livePricing?.insuranceBasic || 25000,
        'Standard Plan': window._livePricing?.insuranceStandard || 45000,
        'Premium Plan': window._livePricing?.insurancePremium || 80000,
    };
    const price = priceMap[plan] || 45000;

    // Save intent first — so it survives the login redirect
    localStorage.setItem('jkf_pending_payment', JSON.stringify({
        type: 'insurance',
        plan,
        dest,
        date,
        travellers,
        amount: price * parseInt(travellers, 10),
    }));

    const user = Auth.getCurrent();
    if (!user) {
        closeModal();
        // Redirect to payment.html after login — it will read jkf_pending_payment
        window.JKF_afterLoginRedirect = function () {
            window.location.href = 'payment.html';
            return true;
        };
        openModal('login');
        showToast('Please login to complete your insurance purchase.', 'error');
        return;
    }

    window.location.href = 'payment.html';
}


async function handleTrackModal() {
    const ref = document.getElementById('track-ref')?.value?.trim();
    if (!ref) { document.getElementById('track-ref')?.focus(); return; }

    const app = await AppStore.track(ref);
    const demo = document.getElementById('track-demo');
    if (!demo) return;

    if (!app) { showToast('No application found with that reference.', 'error'); return; }

    const steps = ['received', 'processing', 'embassy', 'approved', 'delivered'];
    const labels = ['Received', 'Docs Verified', 'Embassy Review', 'Decision', 'Delivered'];
    const icons = ['<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>', '✅', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>', '⭐', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.1a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>'];
    const curIdx = steps.indexOf(app.status);

    demo.innerHTML = `
    <div class="track-progress">
      ${steps.map((s, i) => `
        <div class="track-step ${i < curIdx ? 'done' : i === curIdx ? 'active' : ''}">
          <div class="track-step-dot">${i < curIdx ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' : icons[i]}</div>
          <div class="track-step-label">${labels[i]}</div>
        </div>`).join('')}
    </div>
    <div class="track-ref">
      <p><strong>Ref:</strong> ${app.ref} &nbsp;|&nbsp; <strong>Destination:</strong> ${app.destination} &nbsp;|&nbsp; <strong>Purpose:</strong> ${app.purpose}</p>
      <p class="track-result-note">${(app.statusHistory || [])[app.statusHistory?.length - 1]?.note || ''}</p>
    </div>
  `;

    demo.classList.add('visible');
    demo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


var visaRequirements = window.visaRequirements = {

    // ── EUROPE ──────────────────────────────────────────────
    "Albania": {
        flag: "🇦🇱", region: "Europe", type: "Visa Required",
        fee: "€35", processing: "5–10 business days",
        docs: ["Valid passport (6+ months validity)", "Completed visa application form", "Recent passport photos (2)", "Bank statements (3 months)", "Return flight booking", "Hotel reservation or invitation letter", "Travel insurance (€30,000 min)", "Proof of employment or enrollment"]
    },
    "Andorra": {
        flag: "🇦🇩", region: "Europe", type: "Visa-Free (via Schengen)",
        fee: "Free", processing: "N/A",
        docs: ["Valid Schengen visa or residence permit", "Valid passport", "Note: No direct entry point — must enter via France or Spain with valid Schengen visa"]
    },
    "Austria": {
        flag: "🇦🇹", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return date)", "Schengen visa application form", "2 passport-sized photos", "Travel insurance (€30,000 min coverage)", "Bank statements (last 3 months)", "Proof of accommodation", "Return flight itinerary", "Employment letter or proof of business", "ITR or payslips"]
    },
    "Belarus": {
        flag: "🇧🇾", region: "Europe", type: "Visa Required",
        fee: "$65", processing: "5 business days",
        docs: ["Valid passport", "Visa application form", "Passport photo", "Travel insurance", "Invitation letter from Belarus (if visiting)", "Bank statements", "Hotel booking confirmation"]
    },
    "Belgium": {
        flag: "🇧🇪", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return date)", "Schengen visa application form", "2 passport-sized photos", "Travel insurance (€30,000 min)", "Bank statements (3 months)", "Proof of accommodation in Belgium", "Return flight itinerary", "Employment letter or proof of income"]
    },
    "Bosnia and Herzegovina": {
        flag: "🇧🇦", region: "Europe", type: "Visa Required",
        fee: "€35", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Hotel reservation", "Travel insurance", "Return flight booking"]
    },
    "Bulgaria": {
        flag: "🇧🇬", region: "Europe", type: "Visa Required",
        fee: "€35", processing: "10–15 business days",
        docs: ["Valid passport (6+ months)", "Visa application form", "2 passport photos", "Travel insurance", "Bank statements", "Hotel reservation", "Return flight itinerary", "Employment/income proof"]
    },
    "Croatia": {
        flag: "🇭🇷", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen application form", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Hotel booking", "Return ticket", "Employment letter"]
    },
    "Cyprus": {
        flag: "🇨🇾", region: "Europe", type: "Visa Required",
        fee: "€30", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Cyprus visa application form", "Passport photos (2)", "Travel insurance", "Bank statements", "Hotel booking", "Return flight ticket", "Proof of employment"]
    },
    "Czech Republic": {
        flag: "🇨🇿", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen visa form", "2 passport photos", "Travel insurance (€30,000 min)", "Bank statements (3 months)", "Accommodation proof", "Return ticket", "Employment/income proof"]
    },
    "Denmark": {
        flag: "🇩🇰", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen visa application", "2 passport photos", "Travel insurance (€30,000 min)", "Bank statements", "Accommodation proof", "Return ticket", "Employment letter"]
    },
    "Estonia": {
        flag: "🇪🇪", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen form", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Hotel booking", "Return ticket", "Employment proof"]
    },
    "Finland": {
        flag: "🇫🇮", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application form", "2 passport photos", "Travel insurance (€30,000 min)", "Bank statements (3 months)", "Hotel reservation", "Return flight", "Employment letter"]
    },
    "France": {
        flag: "🇫🇷", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen visa application form", "2 passport photos", "Travel insurance (€30,000 min)", "Bank statements (last 3 months)", "Proof of accommodation", "Return flight itinerary", "Employment letter & payslips"]
    },
    "Germany": {
        flag: "🇩🇪", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen visa application form", "2 biometric passport photos", "Travel insurance (€30,000 min)", "Bank statements (3–6 months)", "Proof of accommodation", "Return flight booking", "Employment letter / proof of financial means"]
    },
    "Greece": {
        flag: "🇬🇷", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen application", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Hotel booking", "Return ticket", "Proof of employment"]
    },
    "Hungary": {
        flag: "🇭🇺", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application", "2 photos", "Travel insurance", "Bank statements", "Accommodation proof", "Return ticket", "Employment or income proof"]
    },
    "Iceland": {
        flag: "🇮🇸", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Hotel booking", "Return ticket", "Proof of funds/employment"]
    },
    "Ireland": {
        flag: "🇮🇪", region: "Europe", type: "Visa Required",
        fee: "€60", processing: "8 weeks",
        docs: ["Valid passport (6+ months)", "Irish visa application form (online)", "Passport photos (2)", "Bank statements (6 months)", "Proof of accommodation in Ireland", "Return flight booking", "Travel insurance", "Employment/school letter", "Payslips or business proof"]
    },
    "Italy": {
        flag: "🇮🇹", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen application form", "2 passport photos", "Travel insurance (€30,000 min)", "Bank statements", "Hotel reservation", "Return flight", "Employment letter / proof of income"]
    },
    "Kosovo": {
        flag: "🇽🇰", region: "Europe", type: "Visa Required",
        fee: "€40", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Hotel booking", "Return ticket", "Travel insurance"]
    },
    "Latvia": {
        flag: "🇱🇻", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen form", "2 photos", "Travel insurance", "Bank statements", "Accommodation proof", "Return ticket", "Employment proof"]
    },
    "Liechtenstein": {
        flag: "🇱🇮", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen visa (apply via Switzerland)", "2 photos", "Travel insurance", "Bank statements", "Hotel booking", "Return ticket"]
    },
    "Lithuania": {
        flag: "🇱🇹", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Accommodation proof", "Return ticket", "Income/employment proof"]
    },
    "Luxembourg": {
        flag: "🇱🇺", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application", "2 photos", "Travel insurance", "Bank statements", "Hotel reservation", "Return ticket", "Employment proof"]
    },
    "Malta": {
        flag: "🇲🇹", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application form", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Accommodation proof", "Return ticket", "Employment/income proof"]
    },
    "Moldova": {
        flag: "🇲🇩", region: "Europe", type: "Visa Required",
        fee: "$50", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Hotel booking or invitation", "Return ticket", "Travel insurance"]
    },
    "Monaco": {
        flag: "🇲🇨", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid Schengen visa (apply via France)", "Valid passport", "Travel insurance", "Hotel booking", "Proof of funds"]
    },
    "Montenegro": {
        flag: "🇲🇪", region: "Europe", type: "Visa Required",
        fee: "€35", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photos", "Bank statements", "Hotel reservation", "Return ticket", "Travel insurance"]
    },
    "Netherlands": {
        flag: "🇳🇱", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen application", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Accommodation proof", "Return ticket", "Employment letter"]
    },
    "North Macedonia": {
        flag: "🇲🇰", region: "Europe", type: "Visa Required",
        fee: "€35", processing: "5–10 business days",
        docs: ["Valid passport", "Application form", "Photo", "Bank statements", "Hotel booking", "Return ticket", "Travel insurance"]
    },
    "Norway": {
        flag: "🇳🇴", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Accommodation proof", "Return ticket", "Employment proof"]
    },
    "Poland": {
        flag: "🇵🇱", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application form", "2 photos", "Travel insurance", "Bank statements", "Hotel reservation", "Return ticket", "Income/employment proof"]
    },
    "Portugal": {
        flag: "🇵🇹", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Hotel booking", "Return flight", "Employment/income proof"]
    },
    "Romania": {
        flag: "🇷🇴", region: "Europe", type: "Visa Required",
        fee: "€35", processing: "10–15 business days",
        docs: ["Valid passport (6+ months)", "Application form", "2 passport photos", "Travel insurance", "Bank statements", "Accommodation proof", "Return ticket", "Employment proof"]
    },
    "Russia": {
        flag: "🇷🇺", region: "Europe / Asia", type: "Visa Required",
        fee: "$50–$160", processing: "10–20 business days",
        docs: ["Valid passport (6+ months)", "Russian visa application form", "Invitation letter from Russia (tourist voucher from hotel or tour operator)", "2 passport photos", "Travel insurance", "Bank statements", "Flight itinerary"]
    },
    "San Marino": {
        flag: "🇸🇲", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid Schengen visa (apply via Italy)", "Valid passport", "Travel insurance", "Hotel booking"]
    },
    "Serbia": {
        flag: "🇷🇸", region: "Europe", type: "Visa Required",
        fee: "€35", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Hotel reservation", "Return ticket", "Travel insurance"]
    },
    "Slovakia": {
        flag: "🇸🇰", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen form", "2 photos", "Travel insurance", "Bank statements", "Accommodation proof", "Return ticket", "Employment proof"]
    },
    "Slovenia": {
        flag: "🇸🇮", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Hotel booking", "Return ticket", "Employment proof"]
    },
    "Spain": {
        flag: "🇪🇸", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen application", "2 passport photos", "Travel insurance (€30,000 min)", "Bank statements (3 months)", "Hotel reservation", "Return flight itinerary", "Employment letter / proof of funds"]
    },
    "Sweden": {
        flag: "🇸🇪", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport", "Schengen application", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Accommodation proof", "Return ticket", "Income/employment proof"]
    },
    "Switzerland": {
        flag: "🇨🇭", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid passport (3+ months beyond return)", "Schengen application form", "2 photos", "Travel insurance (€30,000 min)", "Bank statements", "Hotel booking", "Return ticket", "Employment letter"]
    },
    "Ukraine": {
        flag: "🇺🇦", region: "Europe", type: "Visa Required",
        fee: "$65", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Visa application form", "Passport photo", "Travel insurance", "Bank statements", "Hotel booking or invitation", "Return ticket"]
    },
    "United Kingdom": {
        flag: "🇬🇧", region: "Europe", type: "Visa Required",
        fee: "£115", processing: "3 weeks (standard)",
        docs: ["Valid passport (6+ months validity)", "UK visa application form (online)", "Biometric appointment", "Bank statements (last 6 months)", "Employment letter & payslips", "Proof of accommodation in UK", "Return flight itinerary", "Travel insurance", "Invitation letter (if visiting family/friends)", "Proof of ties to Nigeria (property, family, job)"]
    },
    "Vatican City": {
        flag: "🇻🇦", region: "Europe (Schengen)", type: "Schengen Visa Required",
        fee: "€80", processing: "10–15 business days",
        docs: ["Valid Schengen visa (apply via Italy)", "Valid passport", "No separate Vatican visa required"]
    },

    // ── NORTH AMERICA ────────────────────────────────────────
    "Antigua and Barbuda": {
        flag: "🇦🇬", region: "Caribbean", type: "Visa-Free (30 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Bahamas": {
        flag: "🇧🇸", region: "Caribbean", type: "Visa Required",
        fee: "$100", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Hotel reservation", "Return ticket", "Travel insurance"]
    },
    "Barbados": {
        flag: "🇧🇧", region: "Caribbean", type: "Visa-Free (6 months)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Belize": {
        flag: "🇧🇿", region: "Central America", type: "Visa Required",
        fee: "$50", processing: "5–10 business days",
        docs: ["Valid passport", "Application form", "Passport photo", "Bank statements", "Hotel reservation", "Return ticket"]
    },
    "Canada": {
        flag: "🇨🇦", region: "North America", type: "Visa Required (TRV)",
        fee: "CAD $100", processing: "4–8 weeks",
        docs: ["Valid passport (6+ months)", "Application form IMM5257 (online)", "Digital photo", "Bank statements (6–12 months)", "Employment/income proof", "Letter of invitation (if applicable)", "Travel history documentation", "Biometrics enrollment", "Proof of ties to Nigeria", "Travel insurance"]
    },
    "Costa Rica": {
        flag: "🇨🇷", region: "Central America", type: "Visa Required",
        fee: "$100", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Hotel booking", "Return ticket", "Travel insurance"]
    },
    "Cuba": {
        flag: "🇨🇺", region: "Caribbean", type: "Tourist Card Required",
        fee: "$25–$75", processing: "Immediate",
        docs: ["Valid passport (6+ months)", "Tourist card (can be purchased on arrival or before travel)", "Travel insurance (mandatory)", "Return/onward ticket", "Proof of accommodation"]
    },
    "Dominica": {
        flag: "🇩🇲", region: "Caribbean", type: "Visa-Free (21 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Dominican Republic": {
        flag: "🇩🇴", region: "Caribbean", type: "Tourist Card Required",
        fee: "$10", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Tourist card (included in most flight tickets)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "El Salvador": {
        flag: "🇸🇻", region: "Central America", type: "Visa Required",
        fee: "$50", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel booking"]
    },
    "Grenada": {
        flag: "🇬🇩", region: "Caribbean", type: "Visa-Free (30 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Guatemala": {
        flag: "🇬🇹", region: "Central America", type: "Visa Required",
        fee: "$30", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel booking"]
    },
    "Haiti": {
        flag: "🇭🇹", region: "Caribbean", type: "Visa-Free (3 months)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Sufficient funds"]
    },
    "Honduras": {
        flag: "🇭🇳", region: "Central America", type: "Visa Required",
        fee: "$30", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket"]
    },
    "Jamaica": {
        flag: "🇯🇲", region: "Caribbean", type: "Visa-Free (30 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Mexico": {
        flag: "🇲🇽", region: "North America", type: "Visa Required",
        fee: "$36", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Mexico visa application form", "Passport photo", "Bank statements (3 months)", "Return/onward ticket", "Hotel reservation", "Employment/income proof", "Travel insurance"]
    },
    "Nicaragua": {
        flag: "🇳🇮", region: "Central America", type: "Visa Required",
        fee: "$52", processing: "5–10 business days",
        docs: ["Valid passport", "Application form", "Passport photo", "Bank statements", "Return ticket"]
    },
    "Panama": {
        flag: "🇵🇦", region: "Central America", type: "Visa Required",
        fee: "$50", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel booking"]
    },
    "Saint Kitts and Nevis": {
        flag: "🇰🇳", region: "Caribbean", type: "Visa-Free (30 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Saint Lucia": {
        flag: "🇱🇨", region: "Caribbean", type: "Visa-Free (42 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Saint Vincent and the Grenadines": {
        flag: "🇻🇨", region: "Caribbean", type: "Visa-Free (30 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return ticket", "Proof of accommodation"]
    },
    "Trinidad and Tobago": {
        flag: "🇹🇹", region: "Caribbean", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "United States": {
        flag: "🇺🇸", region: "North America", type: "Visa Required (B1/B2)",
        fee: "$185 (MRV fee)", processing: "2–8 weeks (after interview)",
        docs: ["Valid passport (6+ months)", "DS-160 online application form", "Application fee payment receipt", "Embassy interview appointment letter", "Passport photo", "Bank statements (12 months)", "Employment letter & payslips", "Proof of strong ties to Nigeria (property, family)", "Travel itinerary", "Letter of invitation (if visiting family/friends)"]
    },

    // ── SOUTH AMERICA ─────────────────────────────────────────
    "Argentina": {
        flag: "🇦🇷", region: "South America", type: "Visa Required",
        fee: "$100", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel reservation", "Travel insurance"]
    },
    "Bolivia": {
        flag: "🇧🇴", region: "South America", type: "Visa Required",
        fee: "$30", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Yellow fever vaccination certificate"]
    },
    "Brazil": {
        flag: "🇧🇷", region: "South America", type: "eVisa Required",
        fee: "$40", processing: "5–15 business days",
        docs: ["Valid passport (6+ months)", "Brazil e-visa application (online)", "Passport photo", "Bank statements", "Return/onward ticket", "Hotel reservation", "Yellow fever vaccination certificate"]
    },
    "Chile": {
        flag: "🇨🇱", region: "South America", type: "Visa Required",
        fee: "$100", processing: "10–15 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel booking", "Employment/income proof"]
    },
    "Colombia": {
        flag: "🇨🇴", region: "South America", type: "Visa Required",
        fee: "$52", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Colombia visa application (online)", "Passport photo", "Bank statements", "Return/onward ticket", "Hotel booking"]
    },
    "Ecuador": {
        flag: "🇪🇨", region: "South America", type: "Visa Required",
        fee: "$50", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel reservation"]
    },
    "Guyana": {
        flag: "🇬🇾", region: "South America", type: "Visa-Free (30 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Paraguay": {
        flag: "🇵🇾", region: "South America", type: "Visa Required",
        fee: "$45", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket"]
    },
    "Peru": {
        flag: "🇵🇪", region: "South America", type: "Visa Required",
        fee: "$30", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel booking"]
    },
    "Suriname": {
        flag: "🇸🇷", region: "South America", type: "Tourist Card (eVisa)",
        fee: "$25", processing: "Online — immediate",
        docs: ["Valid passport (6+ months)", "Suriname tourist card (online application)", "Return/onward ticket", "Hotel reservation", "Yellow fever vaccination certificate"]
    },
    "Uruguay": {
        flag: "🇺🇾", region: "South America", type: "Visa Required",
        fee: "$50", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel booking"]
    },
    "Venezuela": {
        flag: "🇻🇪", region: "South America", type: "Visa Required",
        fee: "$30", processing: "5–15 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Invitation letter (if applicable)"]
    },

    // ── AFRICA ──────────────────────────────────────────────
    "Algeria": {
        flag: "🇩🇿", region: "Africa", type: "Visa Required",
        fee: "DZD 5,000", processing: "10–15 business days",
        docs: ["Valid passport (6+ months)", "Algeria visa application form", "2 passport photos", "Bank statements", "Return ticket", "Hotel booking or invitation letter", "Travel insurance", "Yellow fever vaccination certificate"]
    },
    "Angola": {
        flag: "🇦🇴", region: "Africa", type: "Visa Required",
        fee: "$80", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "2 passport photos", "Yellow fever vaccination certificate", "Bank statements", "Return ticket", "Hotel booking or invitation"]
    },
    "Benin": {
        flag: "🇧🇯", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Sufficient funds", "Yellow fever vaccination certificate (recommended)"]
    },
    "Botswana": {
        flag: "🇧🇼", region: "Africa", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Burkina Faso": {
        flag: "🇧🇫", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate"]
    },
    "Burundi": {
        flag: "🇧🇮", region: "Africa", type: "Visa on Arrival",
        fee: "$90", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Yellow fever vaccination certificate", "Sufficient funds"]
    },
    "Cabo Verde": {
        flag: "🇨🇻", region: "Africa", type: "eVisa / Visa on Arrival",
        fee: "€25", processing: "Immediate / online",
        docs: ["Valid passport (6+ months)", "Cape Verde eVisa (apply online)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Cameroon": {
        flag: "🇨🇲", region: "Africa", type: "Visa Required",
        fee: "CFA 75,000", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "2 passport photos", "Yellow fever vaccination certificate", "Bank statements", "Return ticket", "Hotel booking or invitation letter"]
    },
    "Central African Republic": {
        flag: "🇨🇫", region: "Africa", type: "Visa Required",
        fee: "$65", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Yellow fever vaccination certificate", "Return ticket", "Invitation letter (recommended)"]
    },
    "Chad": {
        flag: "🇹🇩", region: "Africa", type: "Visa Required",
        fee: "$75", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Yellow fever vaccination certificate", "Return ticket", "Invitation letter"]
    },
    "Comoros": {
        flag: "🇰🇲", region: "Africa", type: "Visa on Arrival",
        fee: "$30", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Democratic Republic of Congo": {
        flag: "🇨🇩", region: "Africa", type: "Visa Required",
        fee: "$85", processing: "5–15 business days",
        docs: ["Valid passport (6+ months)", "Application form", "2 passport photos", "Yellow fever vaccination certificate", "Bank statements", "Return ticket", "Invitation letter (recommended)"]
    },
    "Republic of Congo": {
        flag: "🇨🇬", region: "Africa", type: "Visa Required",
        fee: "$65", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Yellow fever vaccination certificate", "Return ticket", "Hotel booking or invitation"]
    },
    "Djibouti": {
        flag: "🇩🇯", region: "Africa", type: "eVisa / Visa on Arrival",
        fee: "$35", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Djibouti eVisa (recommended to apply online)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Egypt": {
        flag: "🇪🇬", region: "Africa", type: "eVisa / Visa on Arrival",
        fee: "$25", processing: "On arrival / 3–5 days online",
        docs: ["Valid passport (6+ months)", "Egypt eVisa (apply online) or obtain on arrival", "Return/onward ticket", "Proof of accommodation", "Bank statements", "Travel insurance"]
    },
    "Equatorial Guinea": {
        flag: "🇬🇶", region: "Africa", type: "Visa Required",
        fee: "$100", processing: "5–15 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Yellow fever certificate", "Return ticket", "Invitation letter (required)"]
    },
    "Eritrea": {
        flag: "🇪🇷", region: "Africa", type: "Visa Required",
        fee: "$40", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Return ticket", "Invitation letter (required)", "Bank statements"]
    },
    "Eswatini": {
        flag: "🇸🇿", region: "Africa", type: "Visa-Free (30 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Ethiopia": {
        flag: "🇪🇹", region: "Africa", type: "eVisa Required",
        fee: "$52", processing: "3–5 business days (online)",
        docs: ["Valid passport (6+ months)", "Ethiopia eVisa (apply online at evisa.gov.et)", "Digital passport photo", "Return/onward flight", "Hotel reservation", "Yellow fever vaccination certificate (if coming from endemic country)", "Sufficient funds"]
    },
    "Gabon": {
        flag: "🇬🇦", region: "Africa", type: "eVisa Required",
        fee: "$80", processing: "Online — 3–5 days",
        docs: ["Valid passport (6+ months)", "Gabon eVisa (apply online)", "Yellow fever vaccination certificate (mandatory)", "Return ticket", "Hotel booking", "Bank statements"]
    },
    "Gambia": {
        flag: "🇬🇲", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate", "Sufficient funds"]
    },
    "Ghana": {
        flag: "🇬🇭", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid Nigerian passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate", "Proof of accommodation", "Sufficient funds"]
    },
    "Guinea": {
        flag: "🇬🇳", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate"]
    },
    "Guinea-Bissau": {
        flag: "🇬🇼", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate"]
    },
    "Ivory Coast": {
        flag: "🇨🇮", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate", "Sufficient funds"]
    },
    "Kenya": {
        flag: "🇰🇪", region: "Africa", type: "eVisa Required",
        fee: "$51", processing: "2–3 business days (online)",
        docs: ["Valid passport (6+ months)", "Kenya eVisa (apply online at evisa.go.ke)", "Digital passport photo", "Return/onward flight booking", "Hotel reservation or invitation", "Yellow fever vaccination certificate", "Bank statements", "Travel insurance"]
    },
    "Lesotho": {
        flag: "🇱🇸", region: "Africa", type: "Visa on Arrival",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Liberia": {
        flag: "🇱🇷", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate"]
    },
    "Libya": {
        flag: "🇱🇾", region: "Africa", type: "Visa Required",
        fee: "Varies", processing: "Variable",
        docs: ["Valid passport (6+ months)", "Visa application form", "Invitation letter from Libya (required)", "Passport photo", "Bank statements", "Return ticket", "⚠️ Travel to Libya is not recommended due to ongoing instability"]
    },
    "Madagascar": {
        flag: "🇲🇬", region: "Africa", type: "Visa on Arrival",
        fee: "€35 (30 days)", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds", "Yellow fever vaccination certificate (if applicable)"]
    },
    "Malawi": {
        flag: "🇲🇼", region: "Africa", type: "Visa on Arrival",
        fee: "$75", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds", "Yellow fever certificate (if applicable)"]
    },
    "Mali": {
        flag: "🇲🇱", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate"]
    },
    "Mauritania": {
        flag: "🇲🇷", region: "Africa", type: "Visa on Arrival",
        fee: "MRO 1,000", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Yellow fever vaccination certificate", "Sufficient funds"]
    },
    "Mauritius": {
        flag: "🇲🇺", region: "Africa", type: "Visa-Free (60 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation (hotel booking)", "Sufficient funds (USD 100/day)"]
    },
    "Morocco": {
        flag: "🇲🇦", region: "Africa", type: "Visa Required",
        fee: "MAD 200", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "2 passport photos", "Bank statements (3 months)", "Return ticket", "Hotel reservation", "Employment letter", "Travel insurance"]
    },
    "Mozambique": {
        flag: "🇲🇿", region: "Africa", type: "eVisa / Visa on Arrival",
        fee: "$50", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Mozambique eVisa (apply online) or on arrival", "Return/onward ticket", "Proof of accommodation", "Yellow fever certificate (if applicable)", "Sufficient funds"]
    },
    "Namibia": {
        flag: "🇳🇦", region: "Africa", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Niger": {
        flag: "🇳🇪", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate"]
    },
    "Rwanda": {
        flag: "🇷🇼", region: "Africa", type: "eVisa / Visa on Arrival",
        fee: "$30", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Rwanda eVisa (apply at visitrwanda.com) or on arrival", "Return/onward ticket", "Proof of accommodation", "Yellow fever vaccination certificate", "Sufficient funds"]
    },
    "Sao Tome and Principe": {
        flag: "🇸🇹", region: "Africa", type: "Visa on Arrival",
        fee: "€30", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Yellow fever vaccination certificate", "Proof of accommodation", "Sufficient funds"]
    },
    "Senegal": {
        flag: "🇸🇳", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate", "Sufficient funds"]
    },
    "Seychelles": {
        flag: "🇸🇨", region: "Africa", type: "Visa-Free (Visitor's Permit on Arrival)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds (proof may be required)"]
    },
    "Sierra Leone": {
        flag: "🇸🇱", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate"]
    },
    "Somalia": {
        flag: "🇸🇴", region: "Africa", type: "Visa on Arrival",
        fee: "$60", processing: "On arrival",
        docs: ["Valid passport", "Return/onward ticket", "Invitation letter (recommended)", "⚠️ Travel not recommended due to security concerns"]
    },
    "South Africa": {
        flag: "🇿🇦", region: "Africa", type: "Visa Required",
        fee: "Free (no visa fee)", processing: "10–15 business days",
        docs: ["Valid passport (30+ days beyond return)", "South Africa visa application form", "2 passport photos", "Bank statements (3 months)", "Employment letter", "Return flight itinerary", "Yellow fever vaccination certificate", "Proof of accommodation", "Certified copy of birth certificate (with apostille)"]
    },
    "South Sudan": {
        flag: "🇸🇸", region: "Africa", type: "Visa Required",
        fee: "$100", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Yellow fever vaccination certificate", "Return ticket", "Invitation letter (required)"]
    },
    "Sudan": {
        flag: "🇸🇩", region: "Africa", type: "Visa Required",
        fee: "$100", processing: "10–15 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Yellow fever vaccination certificate", "Bank statements", "Return ticket", "Invitation letter"]
    },
    "Tanzania": {
        flag: "🇹🇿", region: "Africa", type: "eVisa / Visa on Arrival",
        fee: "$50", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Tanzania eVisa (apply at immigration.go.tz) or on arrival", "Return/onward ticket", "Proof of accommodation", "Yellow fever vaccination certificate", "Sufficient funds ($50/day)"]
    },
    "Togo": {
        flag: "🇹🇬", region: "Africa (ECOWAS)", type: "Visa-Free (90 days)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport or ECOWAS travel document", "Return/onward ticket", "Yellow fever vaccination certificate"]
    },
    "Tunisia": {
        flag: "🇹🇳", region: "Africa", type: "Visa Required",
        fee: "TND 30", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "2 passport photos", "Bank statements", "Return ticket", "Hotel booking", "Employment proof"]
    },
    "Uganda": {
        flag: "🇺🇬", region: "Africa", type: "eVisa / Visa on Arrival",
        fee: "$50", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Uganda eVisa (apply at visas.immigration.go.ug)", "Return/onward ticket", "Yellow fever vaccination certificate (mandatory)", "Proof of accommodation", "Bank statements", "Sufficient funds ($50/day)"]
    },
    "Zambia": {
        flag: "🇿🇲", region: "Africa", type: "eVisa / Visa on Arrival",
        fee: "$50 (single entry)", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Zambia eVisa (apply online) or on arrival", "Return/onward ticket", "Yellow fever vaccination certificate", "Proof of accommodation", "Sufficient funds"]
    },
    "Zimbabwe": {
        flag: "🇿🇼", region: "Africa", type: "Visa on Arrival",
        fee: "$30–$75", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Yellow fever vaccination certificate (if applicable)", "Sufficient funds ($30/day)"]
    },

    // ── MIDDLE EAST ──────────────────────────────────────────
    "Bahrain": {
        flag: "🇧🇭", region: "Middle East", type: "eVisa Required",
        fee: "BHD 29", processing: "Online — immediate",
        docs: ["Valid passport (6+ months)", "Bahrain eVisa (apply online at evisa.gov.bh)", "Digital passport photo", "Return/onward ticket", "Hotel reservation", "Bank statements"]
    },
    "Iran": {
        flag: "🇮🇷", region: "Middle East", type: "Visa on Arrival / eVisa",
        fee: "$30–$75", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Iran visa authorization code (apply through travel agency or embassy)", "Passport photo", "Travel insurance", "Return/onward ticket", "Hotel reservation", "Bank statements"]
    },
    "Iraq": {
        flag: "🇮🇶", region: "Middle East", type: "Visa Required",
        fee: "$75", processing: "5–15 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Invitation letter from Iraq (required for most cases)", "Bank statements", "Return ticket", "Travel insurance"]
    },
    "Israel": {
        flag: "🇮🇱", region: "Middle East", type: "Visa on Arrival",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds", "Evidence of purpose of visit", "⚠️ Entry may be denied at discretion of border officers"]
    },
    "Jordan": {
        flag: "🇯🇴", region: "Middle East", type: "Visa on Arrival",
        fee: "JOD 40", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds", "Travel insurance (recommended)"]
    },
    "Kuwait": {
        flag: "🇰🇼", region: "Middle East", type: "Visa Required",
        fee: "KWD 3", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Kuwait visa application form", "Passport photo", "Bank statements", "Return ticket", "Hotel reservation or sponsor letter", "Employment letter"]
    },
    "Lebanon": {
        flag: "🇱🇧", region: "Middle East", type: "Visa on Arrival",
        fee: "$17", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds", "⚠️ Entry conditions variable — check before travel"]
    },
    "Oman": {
        flag: "🇴🇲", region: "Middle East", type: "eVisa Required",
        fee: "OMR 6", processing: "Online — 24–48 hours",
        docs: ["Valid passport (6+ months)", "Oman eVisa (apply at evisa.rop.gov.om)", "Digital passport photo", "Return/onward ticket", "Hotel reservation", "Bank statements", "Travel insurance"]
    },
    "Palestine": {
        flag: "🇵🇸", region: "Middle East", type: "Coordinated via Israel",
        fee: "Varies", processing: "Via Israeli border control",
        docs: ["Valid passport (6+ months)", "Onward/return ticket", "Proof of accommodation", "⚠️ Entry subject to Israeli border controls"]
    },
    "Qatar": {
        flag: "🇶🇦", region: "Middle East", type: "Visa on Arrival / eVisa",
        fee: "Free (on arrival)", processing: "Immediate / online",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Hotel reservation or invitation from Qatari national", "Bank statements (showing sufficient funds)", "Travel insurance (recommended)"]
    },
    "Saudi Arabia": {
        flag: "🇸🇦", region: "Middle East", type: "eVisa Required",
        fee: "SAR 300 + insurance", processing: "Online — immediate to 24 hours",
        docs: ["Valid passport (6+ months)", "Saudi Arabia tourist eVisa (apply at visa.visitsaudi.com)", "Digital passport photo", "Return/onward flight", "Hotel reservation", "Travel insurance (mandatory — included in eVisa fee)", "Bank statements"]
    },
    "Syria": {
        flag: "🇸🇾", region: "Middle East", type: "Visa Required",
        fee: "$70", processing: "Variable",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Invitation or sponsorship letter from Syria", "⚠️ Travel to Syria is not recommended due to ongoing conflict"]
    },
    "Turkey": {
        flag: "🇹🇷", region: "Middle East / Europe", type: "eVisa Required",
        fee: "$33.50", processing: "Online — immediate",
        docs: ["Valid passport (6+ months)", "Turkey eVisa (apply at evisa.gov.tr)", "Digital passport photo", "Return/onward ticket", "Hotel reservation or invitation", "Bank statements (showing sufficient funds)"]
    },
    "UAE": {
        flag: "🇦🇪", region: "Middle East", type: "Visa Required",
        fee: "AED 270–1,100 (30–90 days)", processing: "3–5 business days",
        docs: ["Valid passport (6+ months)", "UAE visa application (through airline, hotel, or Jekafly)", "White-background passport photo", "Return flight ticket", "Bank statements (minimum $1,000 balance)", "Hotel booking or sponsor letter", "Travel insurance (recommended)"]
    },
    "Yemen": {
        flag: "🇾🇪", region: "Middle East", type: "Visa Required",
        fee: "$60", processing: "Variable",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Invitation letter from Yemen", "⚠️ Travel to Yemen not recommended due to ongoing conflict"]
    },

    // ── ASIA ─────────────────────────────────────────────────
    "Afghanistan": {
        flag: "🇦🇫", region: "Asia", type: "Visa Required",
        fee: "$50", processing: "Variable",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Invitation letter or proof of purpose", "⚠️ Travel to Afghanistan not recommended"]
    },
    "Armenia": {
        flag: "🇦🇲", region: "Asia", type: "eVisa / Visa on Arrival",
        fee: "$6–$31", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Armenia eVisa (apply at evisa.am)", "Return/onward ticket", "Hotel reservation", "Sufficient funds"]
    },
    "Azerbaijan": {
        flag: "🇦🇿", region: "Asia", type: "eVisa Required",
        fee: "$26", processing: "Online — 3 business days",
        docs: ["Valid passport (6+ months)", "Azerbaijan eVisa (apply at evisa.gov.az)", "Digital passport photo", "Return ticket", "Hotel booking", "Bank statements"]
    },
    "Bangladesh": {
        flag: "🇧🇩", region: "Asia", type: "eVisa / Visa on Arrival",
        fee: "$51", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Bangladesh eVisa (apply online) or on arrival at Dhaka airport", "Passport photo", "Return ticket", "Hotel reservation", "Bank statements", "Yellow fever certificate (if applicable)"]
    },
    "Bhutan": {
        flag: "🇧🇹", region: "Asia", type: "Visa Required (via tour only)",
        fee: "$200/day (Sustainable Development Fee)", processing: "Via authorized tour operator",
        docs: ["Valid passport (6+ months)", "Bhutan visa (must be applied through authorized Bhutanese tour operator)", "Pre-arranged tour itinerary", "Visa approval letter", "Return flight booking", "Travel insurance"]
    },
    "Brunei": {
        flag: "🇧🇳", region: "Asia", type: "Visa Required",
        fee: "BND 20", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Application form", "Passport photo", "Bank statements", "Return ticket", "Hotel booking", "Employment proof"]
    },
    "Cambodia": {
        flag: "🇰🇭", region: "Asia", type: "eVisa / Visa on Arrival",
        fee: "$30", processing: "On arrival / online (3 days)",
        docs: ["Valid passport (6+ months)", "Cambodia eVisa (apply at evisa.gov.kh) or on arrival", "Passport photo", "Return ticket", "Hotel booking", "Sufficient funds ($50/day)", "Yellow fever certificate (if applicable)"]
    },
    "China": {
        flag: "🇨🇳", region: "Asia", type: "Visa Required",
        fee: "$140", processing: "4–5 business days",
        docs: ["Valid passport (6+ months)", "China visa application form", "Recent passport photo (white background)", "Original return flight itinerary", "Hotel reservation or invitation letter", "Bank statements (3 months)", "Employment letter", "Travel insurance"]
    },
    "Georgia": {
        flag: "🇬🇪", region: "Asia", type: "eVisa / Visa on Arrival",
        fee: "$20", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Georgia eVisa (apply at evisa.gov.ge) or on arrival", "Return ticket", "Hotel reservation", "Bank statements", "Sufficient funds"]
    },
    "India": {
        flag: "🇮🇳", region: "Asia", type: "eVisa Required",
        fee: "$25–$80", processing: "Online — 72–96 hours",
        docs: ["Valid passport (6+ months, 2 blank pages)", "India eVisa (apply at indianvisaonline.gov.in)", "Digital passport photo (white background)", "Return/onward flight ticket", "Hotel reservation or invitation letter", "Bank statements", "Yellow fever vaccination certificate (if arriving from endemic country)"]
    },
    "Indonesia": {
        flag: "🇮🇩", region: "Asia", type: "eVisa / Visa on Arrival",
        fee: "$35", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Indonesia eVisa (molina.imigrasi.go.id) or on arrival", "Return/onward ticket", "Hotel reservation", "Bank statements", "Sufficient funds ($1,000 min)", "Yellow fever certificate (if applicable)"]
    },
    "Japan": {
        flag: "🇯🇵", region: "Asia", type: "Visa Required",
        fee: "JPY 3,000", processing: "5–7 business days",
        docs: ["Valid passport (6+ months)", "Japan visa application form", "Passport photo", "Bank statements (3–6 months)", "Employment letter", "Return flight itinerary", "Hotel reservation", "Day-by-day itinerary", "Travel insurance", "Proof of ties to Nigeria"]
    },
    "Kazakhstan": {
        flag: "🇰🇿", region: "Asia", type: "eVisa Required",
        fee: "$18", processing: "Online — 5 business days",
        docs: ["Valid passport (6+ months)", "Kazakhstan eVisa (apply at evisa.mfa.gov.kz)", "Digital photo", "Return ticket", "Hotel booking", "Bank statements"]
    },
    "Kyrgyzstan": {
        flag: "🇰🇬", region: "Asia", type: "eVisa Required",
        fee: "$25", processing: "Online — 3 business days",
        docs: ["Valid passport (6+ months)", "Kyrgyzstan eVisa (apply at evisa.e-gov.kg)", "Passport photo", "Return ticket", "Hotel booking"]
    },
    "Laos": {
        flag: "🇱🇦", region: "Asia", type: "eVisa / Visa on Arrival",
        fee: "$30–$42", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Laos eVisa (apply at laoevisa.gov.la) or on arrival", "Passport photo (2)", "Return ticket", "Hotel reservation", "Sufficient funds ($50/day)", "Yellow fever certificate (if applicable)"]
    },
    "Malaysia": {
        flag: "🇲🇾", region: "Asia", type: "eVisa Required",
        fee: "MYR 120 (~$25)", processing: "Online — immediate",
        docs: ["Valid passport (6+ months)", "Malaysia eVisa (apply at windowmalaysia.my)", "Digital passport photo", "Return/onward ticket", "Hotel reservation", "Bank statements", "Sufficient funds"]
    },
    "Maldives": {
        flag: "🇲🇻", region: "Asia", type: "Visa on Arrival (Free)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Confirmed hotel booking", "Sufficient funds ($100/day)", "Travel insurance (recommended)"]
    },
    "Mongolia": {
        flag: "🇲🇳", region: "Asia", type: "eVisa Required",
        fee: "$53", processing: "Online — 3–5 business days",
        docs: ["Valid passport (6+ months)", "Mongolia eVisa (apply at evisa.mfa.mn)", "Passport photo", "Return ticket", "Hotel booking", "Bank statements"]
    },
    "Myanmar": {
        flag: "🇲🇲", region: "Asia", type: "eVisa Required",
        fee: "$50", processing: "Online — 3 business days",
        docs: ["Valid passport (6+ months)", "Myanmar eVisa (apply at evisa.moip.gov.mm)", "Passport photo", "Return/onward ticket", "Hotel reservation", "Bank statements"]
    },
    "Nepal": {
        flag: "🇳🇵", region: "Asia", type: "eVisa / Visa on Arrival",
        fee: "$25–$100", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "Nepal eVisa (apply at nepalimmigration.gov.np) or on arrival", "Passport photo", "Return/onward ticket", "Hotel reservation", "Bank statements", "Yellow fever certificate (if applicable)"]
    },
    "North Korea": {
        flag: "🇰🇵", region: "Asia", type: "Visa Required (via tour only)",
        fee: "Varies", processing: "Via authorized tour operator",
        docs: ["Valid passport", "Organized tour with authorized operator", "Visa approval from North Korean authorities", "⚠️ Extremely limited tourist access — consult embassy"]
    },
    "Pakistan": {
        flag: "🇵🇰", region: "Asia", type: "eVisa Required",
        fee: "$25–$80", processing: "Online — 5–7 business days",
        docs: ["Valid passport (6+ months)", "Pakistan eVisa (apply at visa.nadra.gov.pk)", "Digital passport photo", "Return ticket", "Hotel reservation or invitation letter", "Bank statements"]
    },
    "Philippines": {
        flag: "🇵🇭", region: "Asia", type: "Visa Required",
        fee: "PHP 3,000 (~$55)", processing: "5–10 business days",
        docs: ["Valid passport (6+ months)", "Philippines visa application form", "Passport photo", "Bank statements", "Return/onward ticket", "Hotel reservation", "Employment letter", "Travel insurance"]
    },
    "Singapore": {
        flag: "🇸🇬", region: "Asia", type: "Visa Required",
        fee: "SGD 30", processing: "5–10 business days (online)",
        docs: ["Valid passport (6+ months)", "Singapore visa application (online via ICA portal)", "Digital passport photo", "Return/onward ticket", "Hotel reservation", "Bank statements (3–6 months)", "Employment letter or business proof", "Travel insurance"]
    },
    "South Korea": {
        flag: "🇰🇷", region: "Asia", type: "Visa Required",
        fee: "KRW 60,000", processing: "5–7 business days",
        docs: ["Valid passport (6+ months)", "South Korea visa application form", "Passport photo", "Bank statements (3–6 months)", "Employment letter & payslips", "Return flight ticket", "Hotel reservation", "Day-by-day travel plan"]
    },
    "Sri Lanka": {
        flag: "🇱🇰", region: "Asia", type: "eVisa Required (ETA)",
        fee: "$20", processing: "Online — immediate",
        docs: ["Valid passport (6+ months)", "Sri Lanka ETA (apply at eta.gov.lk)", "Digital photo", "Return/onward ticket", "Hotel reservation", "Sufficient funds ($50/day)"]
    },
    "Taiwan": {
        flag: "🇹🇼", region: "Asia", type: "Visa Required",
        fee: "TWD 1,600", processing: "5–7 business days",
        docs: ["Valid passport (6+ months, 2 blank pages)", "Taiwan visa application form", "Passport photo", "Bank statements", "Return ticket", "Hotel reservation", "Employment/income proof", "Travel insurance"]
    },
    "Tajikistan": {
        flag: "🇹🇯", region: "Asia", type: "eVisa Required",
        fee: "$50", processing: "Online — 3–5 business days",
        docs: ["Valid passport (6+ months)", "Tajikistan eVisa (apply at evisa.tj)", "Passport photo", "Return ticket", "Hotel booking"]
    },
    "Thailand": {
        flag: "🇹🇭", region: "Asia", type: "eVisa / Visa on Arrival",
        fee: "THB 2,000 (on arrival)", processing: "On arrival / online",
        docs: ["Valid passport (6+ months, 1 blank page)", "Thailand eVisa or visa on arrival", "Passport photo", "Return/onward ticket", "Hotel reservation", "Bank statements (minimum THB 20,000 or $600)", "Travel insurance", "Yellow fever certificate (if applicable)"]
    },
    "Timor-Leste": {
        flag: "🇹🇱", region: "Asia", type: "Visa on Arrival",
        fee: "$30", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Turkmenistan": {
        flag: "🇹🇲", region: "Asia", type: "Visa Required",
        fee: "$55", processing: "10–15 business days",
        docs: ["Valid passport (6+ months)", "Letter of invitation from Turkmenistan (required)", "Application form", "Passport photo", "Return ticket", "Bank statements"]
    },
    "Uzbekistan": {
        flag: "🇺🇿", region: "Asia", type: "eVisa Required",
        fee: "$20", processing: "Online — 3–5 business days",
        docs: ["Valid passport (6+ months)", "Uzbekistan eVisa (apply at e-visa.uz)", "Digital photo", "Return ticket", "Hotel booking", "Bank statements"]
    },
    "Vietnam": {
        flag: "🇻🇳", region: "Asia", type: "eVisa Required",
        fee: "$25", processing: "Online — 3 business days",
        docs: ["Valid passport (6+ months)", "Vietnam eVisa (apply at evisa.xuatnhapcanh.gov.vn)", "Digital passport photo", "Return/onward ticket", "Hotel reservation", "Bank statements"]
    },

    // ── OCEANIA ──────────────────────────────────────────────
    "Australia": {
        flag: "🇦🇺", region: "Oceania", type: "Visa Required (Subclass 600)",
        fee: "AUD 145", processing: "4–8 weeks",
        docs: ["Valid passport (6+ months)", "Australia visitor visa application (ImmiAccount online)", "Digital passport photo", "Bank statements (6–12 months)", "Statement of purpose", "Return flight itinerary", "Hotel reservation", "Employment letter & payslips", "Health insurance", "Proof of ties to Nigeria"]
    },
    "Fiji": {
        flag: "🇫🇯", region: "Oceania", type: "Visa-Free (4 months)",
        fee: "Free", processing: "N/A",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds ($200/week)"]
    },
    "Kiribati": {
        flag: "🇰🇮", region: "Oceania", type: "Visa on Arrival",
        fee: "AUD 50", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Marshall Islands": {
        flag: "🇲🇭", region: "Oceania", type: "Visa on Arrival",
        fee: "$20", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Micronesia": {
        flag: "🇫🇲", region: "Oceania", type: "Visa on Arrival (30 days)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Nauru": {
        flag: "🇳🇷", region: "Oceania", type: "Visa Required",
        fee: "$100", processing: "Prior approval required",
        docs: ["Valid passport (6+ months)", "Visa application to Nauru Government", "Return ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "New Zealand": {
        flag: "🇳🇿", region: "Oceania", type: "Visa Required",
        fee: "NZD 211", processing: "4–8 weeks",
        docs: ["Valid passport (6+ months)", "New Zealand visitor visa (apply online via Immigration NZ)", "Digital photo", "Bank statements (3–6 months)", "Employment letter", "Return ticket", "Hotel reservation or itinerary", "Travel insurance", "Proof of ties to Nigeria"]
    },
    "Palau": {
        flag: "🇵🇼", region: "Oceania", type: "Visa on Arrival (30 days)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds", "Palau Pledge (environmental commitment — signed on arrival)"]
    },
    "Papua New Guinea": {
        flag: "🇵🇬", region: "Oceania", type: "eVisa / Visa on Arrival",
        fee: "PGK 100", processing: "On arrival / online",
        docs: ["Valid passport (6+ months)", "PNG eVisa or on arrival", "Return ticket", "Hotel reservation", "Bank statements", "Yellow fever certificate (if applicable)"]
    },
    "Samoa": {
        flag: "🇼🇸", region: "Oceania", type: "Visa on Arrival (60 days)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Solomon Islands": {
        flag: "🇸🇧", region: "Oceania", type: "Visa on Arrival (90 days)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Tonga": {
        flag: "🇹🇴", region: "Oceania", type: "Visa on Arrival (31 days)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Tuvalu": {
        flag: "🇹🇻", region: "Oceania", type: "Visa on Arrival (1 month)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    },
    "Vanuatu": {
        flag: "🇻🇺", region: "Oceania", type: "Visa on Arrival (30 days)",
        fee: "Free", processing: "On arrival",
        docs: ["Valid passport (6+ months)", "Return/onward ticket", "Proof of accommodation", "Sufficient funds"]
    }
};

var nationalityList = [
    { name: "Afghan", flag: "🇦🇫" },
    { name: "Albanian", flag: "🇦🇱" },
    { name: "Algerian", flag: "🇩🇿" },
    { name: "Angolan", flag: "🇦🇴" },
    { name: "Argentine", flag: "🇦🇷" },
    { name: "Armenian", flag: "🇦🇲" },
    { name: "Australian", flag: "🇦🇺" },
    { name: "Austrian", flag: "🇦🇹" },
    { name: "Azerbaijani", flag: "🇦🇿" },
    { name: "Bahraini", flag: "🇧🇭" },
    { name: "Bangladeshi", flag: "🇧🇩" },
    { name: "Belarusian", flag: "🇧🇾" },
    { name: "Belgian", flag: "🇧🇪" },
    { name: "Belizean", flag: "🇧🇿" },
    { name: "Beninese", flag: "🇧🇯" },
    { name: "Bolivian", flag: "🇧🇴" },
    { name: "Bosnian", flag: "🇧🇦" },
    { name: "Botswanan", flag: "🇧🇼" },
    { name: "Brazilian", flag: "🇧🇷" },
    { name: "British", flag: "🇬🇧" },
    { name: "Bulgarian", flag: "🇧🇬" },
    { name: "Burkinabé", flag: "🇧🇫" },
    { name: "Burundian", flag: "🇧🇮" },
    { name: "Cambodian", flag: "🇰🇭" },
    { name: "Cameroonian", flag: "🇨🇲" },
    { name: "Canadian", flag: "🇨🇦" },
    { name: "Cape Verdean", flag: "🇨🇻" },
    { name: "Central African", flag: "🇨🇫" },
    { name: "Chadian", flag: "🇹🇩" },
    { name: "Chilean", flag: "🇨🇱" },
    { name: "Chinese", flag: "🇨🇳" },
    { name: "Colombian", flag: "🇨🇴" },
    { name: "Comorian", flag: "🇰🇲" },
    { name: "Congolese (DRC)", flag: "🇨🇩" },
    { name: "Congolese (Rep.)", flag: "🇨🇬" },
    { name: "Costa Rican", flag: "🇨🇷" },
    { name: "Croatian", flag: "🇭🇷" },
    { name: "Cuban", flag: "🇨🇺" },
    { name: "Cypriot", flag: "🇨🇾" },
    { name: "Czech", flag: "🇨🇿" },
    { name: "Danish", flag: "🇩🇰" },
    { name: "Djiboutian", flag: "🇩🇯" },
    { name: "Dominican", flag: "🇩🇴" },
    { name: "Dutch", flag: "🇳🇱" },
    { name: "Ecuadorian", flag: "🇪🇨" },
    { name: "Egyptian", flag: "🇪🇬" },
    { name: "Emirati", flag: "🇦🇪" },
    { name: "Eritrean", flag: "🇪🇷" },
    { name: "Estonian", flag: "🇪🇪" },
    { name: "Ethiopian", flag: "🇪🇹" },
    { name: "Fijian", flag: "🇫🇯" },
    { name: "Filipino", flag: "🇵🇭" },
    { name: "Finnish", flag: "🇫🇮" },
    { name: "French", flag: "🇫🇷" },
    { name: "Gabonese", flag: "🇬🇦" },
    { name: "Gambian", flag: "🇬🇲" },
    { name: "Georgian", flag: "🇬🇪" },
    { name: "German", flag: "🇩🇪" },
    { name: "Ghanaian", flag: "🇬🇭" },
    { name: "Greek", flag: "🇬🇷" },
    { name: "Guatemalan", flag: "🇬🇹" },
    { name: "Guinean", flag: "🇬🇳" },
    { name: "Guyanese", flag: "🇬🇾" },
    { name: "Haitian", flag: "🇭🇹" },
    { name: "Honduran", flag: "🇭🇳" },
    { name: "Hungarian", flag: "🇭🇺" },
    { name: "Icelandic", flag: "🇮🇸" },
    { name: "Indian", flag: "🇮🇳" },
    { name: "Indonesian", flag: "🇮🇩" },
    { name: "Iranian", flag: "🇮🇷" },
    { name: "Iraqi", flag: "🇮🇶" },
    { name: "Irish", flag: "🇮🇪" },
    { name: "Israeli", flag: "🇮🇱" },
    { name: "Italian", flag: "🇮🇹" },
    { name: "Ivorian", flag: "🇨🇮" },
    { name: "Jamaican", flag: "🇯🇲" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Jordanian", flag: "🇯🇴" },
    { name: "Kazakhstani", flag: "🇰🇿" },
    { name: "Kenyan", flag: "🇰🇪" },
    { name: "Kuwaiti", flag: "🇰🇼" },
    { name: "Kyrgyz", flag: "🇰🇬" },
    { name: "Laotian", flag: "🇱🇦" },
    { name: "Latvian", flag: "🇱🇻" },
    { name: "Lebanese", flag: "🇱🇧" },
    { name: "Liberian", flag: "🇱🇷" },
    { name: "Libyan", flag: "🇱🇾" },
    { name: "Lithuanian", flag: "🇱🇹" },
    { name: "Luxembourgish", flag: "🇱🇺" },
    { name: "Malagasy", flag: "🇲🇬" },
    { name: "Malawian", flag: "🇲🇼" },
    { name: "Malaysian", flag: "🇲🇾" },
    { name: "Maldivian", flag: "🇲🇻" },
    { name: "Malian", flag: "🇲🇱" },
    { name: "Maltese", flag: "🇲🇹" },
    { name: "Mauritanian", flag: "🇲🇷" },
    { name: "Mauritian", flag: "🇲🇺" },
    { name: "Mexican", flag: "🇲🇽" },
    { name: "Moldovan", flag: "🇲🇩" },
    { name: "Mongolian", flag: "🇲🇳" },
    { name: "Montenegrin", flag: "🇲🇪" },
    { name: "Moroccan", flag: "🇲🇦" },
    { name: "Mozambican", flag: "🇲🇿" },
    { name: "Myanmarese", flag: "🇲🇲" },
    { name: "Namibian", flag: "🇳🇦" },
    { name: "Nepali", flag: "🇳🇵" },
    { name: "New Zealander", flag: "🇳🇿" },
    { name: "Nicaraguan", flag: "🇳🇮" },
    { name: "Nigerien", flag: "🇳🇪" },
    { name: "Nigerian", flag: "🇳🇬" },
    { name: "Norwegian", flag: "🇳🇴" },
    { name: "Omani", flag: "🇴🇲" },
    { name: "Pakistani", flag: "🇵🇰" },
    { name: "Panamanian", flag: "🇵🇦" },
    { name: "Paraguayan", flag: "🇵🇾" },
    { name: "Peruvian", flag: "🇵🇪" },
    { name: "Polish", flag: "🇵🇱" },
    { name: "Portuguese", flag: "🇵🇹" },
    { name: "Qatari", flag: "🇶🇦" },
    { name: "Romanian", flag: "🇷🇴" },
    { name: "Russian", flag: "🇷🇺" },
    { name: "Rwandan", flag: "🇷🇼" },
    { name: "Saudi", flag: "🇸🇦" },
    { name: "Senegalese", flag: "🇸🇳" },
    { name: "Serbian", flag: "🇷🇸" },
    { name: "Sierra Leonean", flag: "🇸🇱" },
    { name: "Singaporean", flag: "🇸🇬" },
    { name: "Slovak", flag: "🇸🇰" },
    { name: "Slovenian", flag: "🇸🇮" },
    { name: "Somali", flag: "🇸🇴" },
    { name: "South African", flag: "🇿🇦" },
    { name: "South Korean", flag: "🇰🇷" },
    { name: "Spanish", flag: "🇪🇸" },
    { name: "Sri Lankan", flag: "🇱🇰" },
    { name: "Sudanese", flag: "🇸🇩" },
    { name: "Swedish", flag: "🇸🇪" },
    { name: "Swiss", flag: "🇨🇭" },
    { name: "Syrian", flag: "🇸🇾" },
    { name: "Taiwanese", flag: "🇹🇼" },
    { name: "Tajik", flag: "🇹🇯" },
    { name: "Tanzanian", flag: "🇹🇿" },
    { name: "Thai", flag: "🇹🇭" },
    { name: "Togolese", flag: "🇹🇬" },
    { name: "Trinidadian", flag: "🇹🇹" },
    { name: "Tunisian", flag: "🇹🇳" },
    { name: "Turkish", flag: "🇹🇷" },
    { name: "Ugandan", flag: "🇺🇬" },
    { name: "Ukrainian", flag: "🇺🇦" },
    { name: "American", flag: "🇺🇸" },
    { name: "Uruguayan", flag: "🇺🇾" },
    { name: "Uzbek", flag: "🇺🇿" },
    { name: "Venezuelan", flag: "🇻🇪" },
    { name: "Vietnamese", flag: "🇻🇳" },
    { name: "Yemeni", flag: "🇾🇪" },
    { name: "Zambian", flag: "🇿🇲" },
    { name: "Zimbabwean", flag: "🇿🇼" },
].sort((a, b) => a.name.localeCompare(b.name));


function makeSearchableSelect(selectId, placeholder, customList) {
    const nativeSelect = document.getElementById(selectId);
    if (!nativeSelect) return;

    const existing = nativeSelect.parentNode.querySelector('[data-select-id="' + selectId + '"]');
    if (existing) existing.remove();

    const items = customList
        ? customList.map(item => ({ value: item.name, label: item.name, flag: item.flag || "" }))
        : Object.entries(visaRequirements)
            .map(([country, data]) => ({ value: country, label: country, flag: data.flag || "" }))
            .sort((a, b) => a.label.localeCompare(b.label));

    nativeSelect.innerHTML = `<option value="">${placeholder || "— Select —"}</option>` +
        items.map(i => `<option value="${i.value}">${i.flag} ${i.label}</option>`).join("");

    const currentVal = nativeSelect.value;
    const currentItem = items.find(i => i.value === currentVal);
    const currentLabel = currentItem ? (currentItem.flag ? currentItem.flag + ' ' + currentItem.label : currentItem.label) : "";

    const wrapper = document.createElement("div");
    wrapper.className = "cs-wrapper";
    wrapper.setAttribute("data-select-id", selectId);
    wrapper.dataset.value = currentVal;

    wrapper.innerHTML = `
      <div class="cs-trigger" tabindex="0">
        <span class="cs-value">${currentLabel || placeholder || "— Select —"}</span>
        <svg class="cs-arrow" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="cs-dropdown">
        <div class="cs-search-wrap">
          <svg viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <input class="cs-search" type="text" placeholder="Search..." autocomplete="off" />
        </div>
        <div class="cs-list">
          ${items.map(item =>
        `<div class="cs-option${item.value === currentVal ? " selected" : ""}" data-value="${item.value}">
               <span class="cs-flag">${item.flag}</span>
               <span class="cs-name">${item.label}</span>
             </div>`).join("")}
        </div>
        <div class="cs-empty">No results found</div>
      </div>`;

    nativeSelect.style.display = "none";
    nativeSelect.parentNode.insertBefore(wrapper, nativeSelect);

    const trigger = wrapper.querySelector(".cs-trigger");
    const searchInput = wrapper.querySelector(".cs-search");
    const list = wrapper.querySelector(".cs-list");
    const emptyMsg = wrapper.querySelector(".cs-empty");
    const valueEl = wrapper.querySelector(".cs-value");

    function open() {
        wrapper.classList.add("open");
        searchInput.value = "";
        filterList("");
        setTimeout(() => searchInput.focus(), 50);
        const rect = wrapper.getBoundingClientRect();
        wrapper.classList.toggle("cs-up", window.innerHeight - rect.bottom < 260);
    }
    function close() { wrapper.classList.remove("open"); }

    trigger.addEventListener("click", e => {
        e.stopPropagation();
        wrapper.classList.contains("open") ? close() : open();
    });
    trigger.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });

    searchInput.addEventListener("input", () => filterList(searchInput.value));
    searchInput.addEventListener("click", e => e.stopPropagation());

    list.addEventListener("click", e => {
        const opt = e.target.closest(".cs-option");
        if (!opt) return;
        const val = opt.dataset.value;
        wrapper.dataset.value = val;
        nativeSelect.value = val;
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        const item = items.find(i => i.value === val);
        valueEl.textContent = item ? (item.flag ? item.flag + ' ' + item.label : item.label) : val;
        wrapper.classList.add("has-value");
        list.querySelectorAll(".cs-option").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        close();
    });

    function filterList(q) {
        const term = q.toLowerCase();
        let visible = 0;
        list.querySelectorAll(".cs-option").forEach(opt => {
            const name = opt.querySelector(".cs-name").textContent.toLowerCase();
            const show = name.includes(term);
            opt.style.display = show ? "" : "none";
            if (show) visible++;
        });
        emptyMsg.style.display = visible === 0 ? "block" : "none";
    }

    document.addEventListener("click", e => {
        if (!wrapper.contains(e.target)) close();
    });
}

function setSelectValue(selectId, value) {
    const wrapper = document.querySelector('[data-select-id="' + selectId + '"]');
    const nativeSel = document.getElementById(selectId);
    if (nativeSel) nativeSel.value = value;
    if (!wrapper) return;
    wrapper.dataset.value = value;
    const list = wrapper.querySelector('.cs-list');
    const valueEl = wrapper.querySelector('.cs-value');
    if (list) {
        list.querySelectorAll('.cs-option').forEach(o => {
            const match = o.dataset.value === value;
            o.classList.toggle('selected', match);
        });
    }
    if (valueEl) {
        const opt = list?.querySelector(`.cs-option[data-value="${value}"]`);
        if (opt) {
            const flag = opt.querySelector('.cs-flag')?.textContent || '';
            const name = opt.querySelector('.cs-name')?.textContent || '';
            valueEl.textContent = flag ? flag + ' ' + name : name;
            wrapper.classList.add('has-value');
        }
    }
    if (nativeSel) nativeSel.dispatchEvent(new Event('change', { bubbles: true }));
}

function getSelectValue(selectId) {
    const wrapper = document.querySelector('[data-select-id="' + selectId + '"]');
    if (wrapper) return wrapper.dataset.value || "";
    return document.getElementById(selectId)?.value || "";
}

function populateCountrySelect(selectId, placeholder) {
    makeSearchableSelect(selectId, placeholder);
}


function showRequirements() {
    const dest = getSelectValue("c-to");
    if (!dest) { showToast("Please select a destination country.", "error"); return; }

    const data = visaRequirements[dest];
    if (!data) return;

    const result = document.getElementById("checker-result");
    const title = document.getElementById("result-title");
    const list = document.getElementById("result-list");

    let badgeColor = "#E31E24";
    const t = (data.type || "").toLowerCase();
    if (t.includes("visa-free")) badgeColor = "#10B981";
    else if (t.includes("arrival") || t.includes("evisa")) badgeColor = "#F59E0B";

    if (title) {
        title.innerHTML = `${data.flag || ""} ${dest}
      <span class="visa-type-badge" style="background:${badgeColor}">${data.type || ""}</span>`;
    }

    const metaEl = document.getElementById("result-meta");
    if (metaEl) {
        const selectedPurpose = getSelectValue("c-type") || "Tourism";
        const metaParts = [];
        if (data.processing) metaParts.push(`<span class="result-meta-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${data.processing}</span>`);
        if (data.region) metaParts.push(`<span class="result-meta-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>${data.region}</span>`);
        metaParts.push(`<span class="result-meta-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${selectedPurpose}</span>`);
        metaEl.innerHTML = `<div class="result-meta-pills">${metaParts.join('')}</div><p class="result-note">Document requirements shown are general guidelines. Jekafly's team will verify and confirm all details for your specific application.</p>`;
    }

    const purpose = (getSelectValue("c-type") || "Tourism").toLowerCase();
    let docs = data.docs || [];

    // Purpose-aware doc filtering
    const isStudy = purpose.includes("study");
    const isBusiness = purpose.includes("business");
    const isMedical = purpose.includes("medical");
    const isFamily = purpose.includes("family");

    // Add purpose-specific docs if not already in list
    const purposeDocs = {
        business: ["Business invitation letter", "Company registration documents", "Business itinerary"],
        study: ["University/school admission letter", "Proof of tuition payment", "Sponsor's bank statements & letter"],
        medical: ["Hospital appointment letter", "Medical referral letter", "Proof of medical funds"],
        family: ["Invitation letter from host", "Host's residence/status proof", "Relationship proof (birth/marriage certificate)"],
    };

    const toAdd = isBusiness ? purposeDocs.business
        : isStudy ? purposeDocs.study
        : isMedical ? purposeDocs.medical
        : isFamily ? purposeDocs.family
        : [];

    // Remove generic tourism docs that don't apply to other purposes
    if (!purpose.includes("tourism") && !purpose.includes("holiday")) {
        docs = docs.filter(d => !/(hotel|accommodation|return flight itinerary)/i.test(d));
    }

    // Merge: base docs + purpose-specific, deduplicating
    const allDocs = [...docs];
    toAdd.forEach(d => { if (!allDocs.some(e => e.toLowerCase().includes(d.split(" ")[1]?.toLowerCase() || d))) allDocs.push(d); });

    if (list) list.innerHTML = allDocs.map(r => `<li>${r}</li>`).join("");
    result?.classList.add("visible");
    result?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function quickSearch() {
    const dest = getSelectValue("s-to");
    if (!dest) { showToast("Please select a destination.", "error"); return; }

    try { sessionStorage.setItem("jkf_hero_dest", dest); } catch (e) { }

    const checkerSection = document.getElementById("visa");
    if (checkerSection) {
        checkerSection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
            const cToWrapper = document.querySelector('[data-select-id="c-to"]');
            if (cToWrapper) {
                const opt = cToWrapper.querySelector(`[data-value="${dest}"]`);
                if (opt) { opt.click(); showRequirements(); return; }
            }
            const cTo = document.getElementById("c-to");
            if (cTo) { cTo.value = dest; cTo.dispatchEvent(new Event("change", { bubbles: true })); }
            showRequirements();
        }, 500);
    } else {
        window.location.href = `index.html?dest=${encodeURIComponent(dest)}`;
    }
}

function applyWithDest(dest) {
    const d = dest || getSelectValue("s-to") || getSelectValue("c-to") || "";
    try { if (d) sessionStorage.setItem("jkf_hero_dest", d); } catch (e) { }
    window.location.href = d ? `apply.html?dest=${encodeURIComponent(d)}` : "apply.html";
}

function selectDest(country) {
    const checker = document.getElementById("visa");
    if (checker) {
        checker.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
            const wrapper = document.querySelector('[data-select-id="c-to"]');
            if (wrapper) {
                const opt = wrapper.querySelector(`[data-value="${country}"]`);
                if (opt) { opt.click(); showRequirements(); return; }
            }
            const select = document.getElementById("c-to");
            if (select) {
                select.value = country;
                select.dispatchEvent(new Event("change", { bubbles: true }));
            }
            showRequirements();
        }, 600);
    }
}


window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    nav.style.boxShadow = window.scrollY > 20 ? "0 2px 20px rgba(14,14,184,0.08)" : "none";
});


document.addEventListener("DOMContentLoaded", async () => {
    makeSearchableSelect("c-to", "— Select Destination —");
    makeSearchableSelect("s-to", "Select Destination");
    makeSearchableSelect("c-from", "— Select Nationality —", nationalityList);
    makeSearchableSelect("s-from", "— Nationality —", nationalityList);

    setSelectValue("c-from", "Nigerian");
    setSelectValue("s-from", "Nigerian");

    document.getElementById("c-type")?.addEventListener("change", () => {
        if (document.getElementById("checker-result")?.classList.contains("visible")) {
            showRequirements();
        }
    });


    PricingStore.get().then(p => {
        if (!p) return;
        window._livePricing = p;
        applyConsultPricing(p);
        applyInsPricing(p);
    }).catch(() => { });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && typeof PricingStore !== 'undefined') {
            PricingStore.get().then(p => {
                if (!p) return;
                window._livePricing = p;
                if (typeof applyConsultPricing === 'function') applyConsultPricing(p);
                if (typeof applyInsPricing === 'function') applyInsPricing(p);
            }).catch(() => { });
        }
    });

    Auth.init().then(() => updateNav()).catch(() => updateNav());


    document.getElementById("btn-insurance-modal")?.addEventListener("click", handleInsuranceModal);

    document.getElementById("btn-track")?.addEventListener("click", handleTrackModal);
    document.getElementById("track-ref")?.addEventListener("keydown", e => {
        if (e.key === "Enter") handleTrackModal();
    });

    document.getElementById("btn-check-req")?.addEventListener("click", showRequirements);

    document.getElementById("btn-quick-search")?.addEventListener("click", quickSearch);

    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
});

(function () {
    function getQS() {
        try { return new URLSearchParams(window.location.search); } catch { return null; }
    }
    window.JKF_afterLoginRedirect = function () {
        const qs = getQS();
        if (!qs) return false;
        const ret = qs.get("return");
        if (ret) { window.location.href = decodeURIComponent(ret); return true; }
        return false;
    };
})();