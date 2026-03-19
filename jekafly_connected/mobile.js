/**
 * JEKAFLY — mobile.js
 * Handles: sticky bottom CTA, smooth scroll reveal, tap feedback
 * Runs only on mobile (≤768px). Desktop behaviour is untouched.
 */

(function () {
    'use strict';

    const isMobile = () => window.innerWidth <= 768;

    /* ── Sticky bottom CTA ─────────────────────────────────────── */
    function initStickyCTA() {
        if (!isMobile()) return;

        // Only inject on the homepage (index.html)
        const isHome =
            location.pathname === '/' ||
            location.pathname.endsWith('index.html') ||
            location.pathname.endsWith('/');

        if (!isHome) return;

        // Create element
        const cta = document.createElement('div');
        cta.className = 'mob-sticky-cta';
        cta.innerHTML = `
      <div class="mob-sticky-cta-text">
        <strong>Ready to travel?</strong>
        <span>Start your visa application now</span>
      </div>
      <a href="apply.html" class="mob-sticky-cta-btn">Apply Now →</a>
    `;
        document.body.appendChild(cta);

        // Show after scrolling past the hero
        let lastY = 0;
        const heroEl = document.querySelector('.hero');

        function updateCTA() {
            const y = window.scrollY;
            const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : 300;
            const atBottom = y + window.innerHeight >= document.body.scrollHeight - 80;

            if (y > heroBottom && !atBottom) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
            lastY = y;
        }

        window.addEventListener('scroll', updateCTA, { passive: true });
        updateCTA();
    }

    /* ── Nav height correction ─────────────────────────────────── */
    function fixNavHeight() {
        if (!isMobile()) return;
        const nav = document.querySelector('nav');
        if (!nav) return;
        document.documentElement.style.scrollPaddingTop = nav.offsetHeight + 'px';
    }

    /* ── Tap feedback for service cards ───────────────────────── */
    function initTapFeedback() {
        if (!isMobile()) return;

        const cards = document.querySelectorAll('.service-card, .dest-card, .testi-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transition = 'opacity 0.1s';
                card.style.opacity = '0.85';
            }, { passive: true });

            ['touchend', 'touchcancel'].forEach(ev => {
                card.addEventListener(ev, () => {
                    card.style.opacity = '';
                    setTimeout(() => { card.style.transition = ''; }, 150);
                }, { passive: true });
            });
        });
    }

    /* ── Prevent iOS double-tap zoom on buttons ────────────────── */
    function preventDoubleTapZoom() {
        if (!isMobile()) return;
        let last = 0;
        document.addEventListener('touchend', function (e) {
            const now = Date.now();
            if (now - last < 320 && e.target.tagName === 'BUTTON') {
                e.preventDefault();
            }
            last = now;
        });
    }

    /* ── Smooth scroll for anchor links ───────────────────────── */
    function initSmoothScroll() {
        if (!isMobile()) return;
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                const navH = document.querySelector('nav')?.offsetHeight || 60;
                const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });
    }

    /* ── Init ─────────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        fixNavHeight();
        initStickyCTA();
        initTapFeedback();
        preventDoubleTapZoom();
        initSmoothScroll();
    });

})();