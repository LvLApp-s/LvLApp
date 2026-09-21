document.addEventListener('DOMContentLoaded', () => {
    // --- Cookie / storage consent -------------------------------------------
    //
    // LvL stores two kinds of thing in the browser:
    //
    //   essential   the Flask session cookie (HttpOnly, set server side). It
    //               carries sign-in state and the CSRF token, so it is never
    //               gated -- switching it off would mean "log out".
    //   preferences interface choices kept in localStorage: language, autoplay,
    //               notification sound, sidebar state, dismissed prompts. These
    //               never leave the device and are only written once allowed.
    //
    // There are no analytics, advertising or third-party tracking scripts, so
    // no such category is offered. If one is ever added it belongs here, off by
    // default, alongside a matching entry on the privacy page.

    const FEEDBACK_ALERT_CATEGORIES = ['error', 'warning'];
    const FEEDBACK_TIMEOUTS = { success: 4000, info: 5000, warning: 9000, error: 9000 };

    const FEEDBACK_ICONS = {
        success: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
        error: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.4h.01"/></svg>',
        warning: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19H3z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg>',
        info: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6h.01"/></svg>'
    };

    // How often a visible tab asks the server for its badge counts. This is
    // the app's idle load: one round trip per reader, per interval, for a
    // number that rarely moves, so it stays well clear of the feed's own
    // refresh. It lives up here because initLiveStatusBadges() runs before the
    // point in this file where the rest of that feature is defined.
    const LIVE_STATUS_INTERVAL = 20000;

    /* --- Prefetch on intent ------------------------------------------------
     *
     * The profile tabs, the rail and the feed tabs are ordinary links, so
     * every switch is a fresh page load: the server re-renders, and the
     * browser tears down and rebuilds the page. Nothing can start until the
     * click happens.
     *
     * Hovering a link, or touching it, is a reliable signal that it is about
     * to be clicked -- and it happens a few hundred milliseconds early. Asking
     * the browser to fetch the page then means the response is usually already
     * in its cache by the time the click lands, so the navigation is a cache
     * hit instead of a round trip.
     *
     * This only ever fetches pages the reader was about to open anyway. It
     * stays off when the device asks us to save data or reports a slow link,
     * skips anything that is not a plain same-origin GET, and never asks for
     * the same URL twice.
     */

    const PREFETCH_LIMIT = 12;
    const prefetched = new Set();

    function prefetchingIsWelcome() {
        const conn = navigator.connection;
        if (!conn) return true;
        if (conn.saveData) return false;
        return !/(^|-)2g$/.test(conn.effectiveType || '');
    }

    function worthPrefetching(link) {
        if (!link || prefetched.size >= PREFETCH_LIMIT) return false;
        if (link.target && link.target !== '_self') return false;
        if (link.hasAttribute('download') || link.dataset.noPrefetch === 'true') return false;
        let url;
        try {
            url = new URL(link.href, location.href);
        } catch (error) {
            return false;
        }
        if (url.origin !== location.origin) return false;
        // A fragment on the page we are already on navigates nothing.
        if (url.pathname === location.pathname && url.search === location.search) return false;
        // Anything that changes state must never be fetched speculatively.
        if (/\/(logout|delete|remove)(\/|$)/.test(url.pathname)) return false;
        return !prefetched.has(url.href);
    }

    function prefetch(link) {
        if (!prefetchingIsWelcome() || !worthPrefetching(link)) return;
        const href = new URL(link.href, location.href).href;
        prefetched.add(href);
        const hint = document.createElement('link');
        hint.rel = 'prefetch';
        hint.as = 'document';
        hint.href = href;
        document.head.appendChild(hint);
    }

    function initPrefetch() {
        const selector = [
            '.profile-tabs a',
            '.nav-list a',
            '.feed-tabs a',
            '.community-timeline-tabs a',
            '.reels-tabs a',
        ].join(', ');

        const onIntent = (event) => {
            const link = event.target.closest && event.target.closest(selector);
            if (link) prefetch(link);
        };

        document.addEventListener('pointerenter', onIntent, true);
        document.addEventListener('focusin', onIntent);
        document.addEventListener('touchstart', onIntent, { passive: true });
    }

    // Polling that respects tab visibility. A backgrounded tab should not keep
    // waking serverless functions; it catches up with one fetch on return.
    function startVisiblePolling(task, intervalMs) {
        let timer = null;

        const stop = () => {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        };

        const start = () => {
            if (timer !== null) return;
            timer = window.setInterval(() => {
                if (!document.hidden) task();
            }, intervalMs);
        };

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stop();
            } else {
                task();
                start();
            }
        });

        if (!document.hidden) start();
        return stop;
    }

    const CONSENT_KEY = 'lvl_cookie_consent';
    const CONSENT_PREFERENCE_KEYS = [
        'lvl_lang',
        'autoplay_next_reels',
        'notification_sounds_enabled',
        'sidebar-menu-open',
        'lvl_install_prompt_dismissed',
        'lvl_theme'
    ];

    /* --- Scroll memory -------------------------------------------------- */
    /* Opening a post and coming back used to drop the reader at the top of
       the timeline. Positions are kept per URL in sessionStorage (this tab
       only, cleared when it closes) and restored on a back/forward entry. */

    const SCROLL_KEY_PREFIX = 'lvl_scroll:';

    function sessionGet(key) {
        try { return window.sessionStorage.getItem(key); } catch (_) { return null; }
    }

    function sessionSet(key, value) {
        try { window.sessionStorage.setItem(key, value); } catch (_) { /* ignore */ }
    }

    function scrollKey() {
        return SCROLL_KEY_PREFIX + window.location.pathname + window.location.search;
    }

    function cameBackHere() {
        try {
            const entries = performance.getEntriesByType('navigation');
            if (entries && entries.length) return entries[0].type === 'back_forward';
            return performance.navigation && performance.navigation.type === 2;
        } catch (_) {
            return false;
        }
    }

    function initScrollMemory() {
        // Only long, scrollable surfaces: the reels player owns its own scroll.
        const timeline = document.querySelector('.timeline');
        if (!timeline || document.querySelector('.reel-player-container')) return;

        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

        let pending = null;
        const remember = () => {
            pending = null;
            sessionSet(scrollKey(), String(Math.round(window.scrollY)));
        };
        window.addEventListener('scroll', () => {
            if (pending !== null) return;
            pending = window.setTimeout(remember, 250);
        }, { passive: true });
        window.addEventListener('pagehide', remember);
        document.addEventListener('visibilitychange', () => { if (document.hidden) remember(); });

        if (!cameBackHere()) return;
        const stored = Number(sessionGet(scrollKey()));
        if (!Number.isFinite(stored) || stored <= 0) return;

        // Images and embeds settle after first paint, so the target is
        // re-applied a few times instead of once.
        let attempts = 0;
        const restore = () => {
            window.scrollTo({ top: stored, behavior: 'auto' });
            attempts += 1;
            if (attempts < 6) window.setTimeout(restore, 120);
        };
        requestAnimationFrame(restore);
        window.addEventListener('load', restore, { once: true });
    }

    /* --- Theme ----------------------------------------------------------- */
    /* Three choices, one of which is "follow the system". The resolved value
       lives in data-theme (the stylesheet reads it) and the raw choice in
       data-theme-choice (the settings control reads it). */

    const THEME_KEY = 'lvl_theme';
    const THEME_COLORS = { dark: '#000000', light: '#ffffff' };

    function systemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function storedThemeChoice() {
        const stored = safeStorageGet(THEME_KEY);
        return stored === 'light' || stored === 'dark' ? stored : 'system';
    }

    function applyTheme(choice) {
        const resolved = choice === 'light' || choice === 'dark' ? choice : systemTheme();
        document.documentElement.setAttribute('data-theme', resolved);
        document.documentElement.setAttribute('data-theme-choice', choice);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', THEME_COLORS[resolved] || THEME_COLORS.dark);
        document.dispatchEvent(new CustomEvent('lvl:themechange', { detail: { choice, resolved } }));
        return resolved;
    }

    function initTheme() {
        applyTheme(storedThemeChoice());

        // Follow the system in real time while the choice is "system".
        if (window.matchMedia) {
            const query = window.matchMedia('(prefers-color-scheme: light)');
            const onChange = () => { if (storedThemeChoice() === 'system') applyTheme('system'); };
            if (query.addEventListener) query.addEventListener('change', onChange);
            else if (query.addListener) query.addListener(onChange);
        }

        const controls = document.querySelectorAll('[data-theme-option]');
        if (!controls.length) return;

        const sync = () => {
            const choice = storedThemeChoice();
            controls.forEach((control) => {
                const active = control.dataset.themeOption === choice;
                control.classList.toggle('active', active);
                control.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
        };

        controls.forEach((control) => {
            control.addEventListener('click', () => {
                const choice = control.dataset.themeOption;
                if (choice === 'system') safeStorageRemove(THEME_KEY);
                else safeStorageSet(THEME_KEY, choice);
                applyTheme(choice);
                sync();
            });
        });

        sync();
    }

    /* --- New posts pill -------------------------------------------------- */

    const FEED_UPDATES_INTERVAL = 60000;

    function initFeedUpdates() {
        const root = document.querySelector('[data-feed-updates]');
        if (!root) return;
        const pill = root.querySelector('[data-feed-updates-pill]');
        const label = root.querySelector('[data-feed-updates-label]');
        const since = root.dataset.since;
        if (!pill || !since) return;

        const show = (count) => {
            if (count <= 0) return;
            if (label) {
                label.textContent = count === 1
                    ? translateUi('feed_new_post_one', '1 new post')
                    : `${count} ${translateUi('feed_new_posts_many', 'new posts')}`;
            }
            pill.hidden = false;
            requestAnimationFrame(() => pill.classList.add('is-visible'));
        };

        const check = () => {
            const url = `/api/feed/updates?since=${encodeURIComponent(since)}&feed=${encodeURIComponent(root.dataset.feed || 'all')}`;
            fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then((res) => res.json())
                .then((result) => { if (result && result.success) show(Number(result.count) || 0); })
                .catch(() => { /* a failed poll is not worth a message */ });
        };

        pill.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.location.reload();
        });

        // Polling pauses while the tab is hidden, like every other live check.
        startVisiblePolling(check, FEED_UPDATES_INTERVAL);
    }

    function safeStorageGet(key) {
        try { return window.localStorage.getItem(key); } catch (_) { return null; }
    }

    function safeStorageSet(key, value) {
        try { window.localStorage.setItem(key, value); return true; } catch (_) { return false; }
    }

    function safeStorageRemove(key) {
        try { window.localStorage.removeItem(key); } catch (_) { /* ignore */ }
    }

    function consentChoice() {
        const stored = safeStorageGet(CONSENT_KEY);
        return stored === 'all' || stored === 'essential' ? stored : null;
    }

    function preferencesAllowed() {
        // Before a choice is made we do not write optional storage, but we do
        // still read anything already there so the app does not visibly reset.
        return consentChoice() === 'all';
    }

    function readPreference(key, fallback) {
        const value = safeStorageGet(key);
        return value === null ? (fallback === undefined ? null : fallback) : value;
    }

    function writePreference(key, value) {
        if (!preferencesAllowed()) return false;
        return safeStorageSet(key, value);
    }

    function setConsent(choice) {
        safeStorageSet(CONSENT_KEY, choice);
        if (choice === 'essential') {
            CONSENT_PREFERENCE_KEYS.forEach(safeStorageRemove);
        }
        document.dispatchEvent(new CustomEvent('lvl:consent', { detail: { choice } }));
    }

    function initCookieConsent() {
        const banner = document.querySelector('[data-consent-banner]');

        const openBanner = () => {
            if (!banner) return;
            banner.hidden = false;
            window.requestAnimationFrame(() => banner.classList.add('is-visible'));
        };

        const closeBanner = () => {
            if (!banner) return;
            banner.classList.remove('is-visible');
            window.setTimeout(() => { banner.hidden = true; }, 260);
        };

        if (banner) {
            banner.querySelectorAll('[data-consent-choice]').forEach((button) => {
                button.addEventListener('click', () => {
                    setConsent(button.dataset.consentChoice === 'all' ? 'all' : 'essential');
                    closeBanner();
                });
            });
            if (!consentChoice()) openBanner();
        }

        // "Manage cookie choices" on the privacy page.
        document.querySelectorAll('[data-consent-reopen]').forEach((button) => {
            button.addEventListener('click', () => {
                safeStorageRemove(CONSENT_KEY);
                openBanner();
            });
        });
    }

    window.LvLConsent = {
        choice: consentChoice,
        allowsPreferences: preferencesAllowed,
        read: readPreference,
        write: writePreference,
        set: setConsent
    };

    function translateUi(key, fallback) {
        const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
        const dictionary = window.LvLI18n && window.LvLI18n.TRANSLATIONS
            ? window.LvLI18n.TRANSLATIONS[lang]
            : null;
        return dictionary && dictionary[key] !== undefined ? dictionary[key] : fallback;
    }

    function setFollowButtonState(button, following) {
        if (!button) return;
        const key = following ? 'profile_unfollow' : 'profile_follow';
        let label = button.querySelector('[data-follow-label]');
        if (!label) {
            label = document.createElement('span');
            label.setAttribute('data-follow-label', '');
            button.replaceChildren(label);
        }
        label.setAttribute('data-i18n', key);
        label.textContent = translateUi(key, following ? 'Unfollow' : 'Follow');
        button.classList.toggle('active', following);
    }

    function syncFollowControls(targetId, following) {
        document.querySelectorAll('.ajax-action-form[data-action="follow"]').forEach((followForm) => {
            const target = followForm.querySelector('input[name="target_id"]');
            if (!target || String(target.value) !== String(targetId)) return;
            setFollowButtonState(followForm.querySelector('button'), following);
        });
    }

    document.querySelectorAll('.ajax-action-form[data-action="follow"] button').forEach((button) => {
        setFollowButtonState(button, button.classList.contains('active'));
    });
    document.addEventListener('lvl:langchange', () => {
        document.querySelectorAll('.ajax-action-form[data-action="follow"] button').forEach((button) => {
            setFollowButtonState(button, button.classList.contains('active'));
        });
    });

    /* --- Spawn burst/shockwave/badge on document.body to avoid overflow:hidden clipping --- */
    function spawnBodyEffect(btn, className, durationMs) {
        if (!btn) return null;
        const rect = btn.getBoundingClientRect();
        const el = document.createElement('span');
        el.className = className;
        el.style.cssText = [
            'position:fixed',
            `left:${rect.left + rect.width / 2}px`,
            `top:${rect.top + rect.height / 2}px`,
            'transform:translate(-50%,-50%)',
            'pointer-events:none',
            'z-index:99999'
        ].join(';');
        document.body.appendChild(el);
        setTimeout(() => el.remove(), durationMs || 800);
        return el;
    }

    function triggerTwitterHeartBurst(btn) {
        if (!btn) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = btn.getBoundingClientRect();
        const burstContainer = document.createElement('span');
        burstContainer.className = 'lvl-x-burst-container';
        burstContainer.style.cssText = [
            'position:fixed',
            `left:${rect.left + rect.width / 2}px`,
            `top:${rect.top + rect.height / 2}px`,
            'transform:translate(-50%,-50%)',
            'pointer-events:none',
            'z-index:99999',
            'width:1px',
            'height:1px'
        ].join(';');
        // Colour comes from --dot-color in CSS, which resolves to the like accent.
        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('span');
            dot.className = `lvl-x-dot lvl-x-dot-${i}`;
            burstContainer.appendChild(dot);
        }
        document.body.appendChild(burstContainer);
        setTimeout(() => burstContainer.remove(), 650);
    }

    function triggerLvlInteractionFeedback(btn, labelText) {
        if (!btn) return;
        /* Shockwave ring */
        spawnBodyEffect(btn, 'lvl-shockwave-ring', 600);
        /* Heart particle burst */
        triggerTwitterHeartBurst(btn);
        /* +XP floating badge */
        const rect = btn.getBoundingClientRect();
        const xpBadge = document.createElement('span');
        xpBadge.className = 'lvl-xp-particle';
        xpBadge.textContent = labelText || '+XP';
        xpBadge.style.cssText = [
            'position:fixed',
            `left:${rect.left + rect.width / 2}px`,
            `top:${rect.top - 4}px`,
            'transform:translate(-50%,0)',
            'pointer-events:none',
            'z-index:99999'
        ].join(';');
        document.body.appendChild(xpBadge);
        setTimeout(() => xpBadge.remove(), 900);
    }

    function applyLikeFeedbackAndStyle(btn, liked, count) {
        if (!btn) return;
        btn.classList.toggle('active', !!liked);
        btn.classList.toggle('like-active', !!liked);
        // The .like-active class drives fill/stroke from tokens in feed.css.
        // Only the presentational attributes are reset here, because inline
        // fill/stroke on the SVG would otherwise outrank the stylesheet.
        const svg = btn.querySelector('svg');
        const paths = svg ? svg.querySelectorAll('path,circle,polygon,polyline') : [];
        if (svg) {
            svg.setAttribute('fill', liked ? 'currentColor' : 'none');
            svg.setAttribute('stroke', 'currentColor');
        }
        paths.forEach((path) => {
            path.setAttribute('fill', liked ? 'currentColor' : 'none');
            path.setAttribute('stroke', 'currentColor');
        });
        /* Update count */
        if (count !== undefined) {
            const countEl = btn.querySelector('strong') || btn.closest('form')?.querySelector('[data-reel-like-count]');
            if (countEl) countEl.textContent = count || '0';
        }
        /* Heart-pop animation via requestAnimationFrame (guarantees one rendered frame before applying) */
        if (liked) {
            const iconEl = btn.querySelector('.post-action-icon, .reel-action-icon') || svg;
            if (iconEl) {
                iconEl.style.webkitAnimation = 'none';
                iconEl.style.animation = 'none';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        iconEl.style.webkitAnimation = 'lvl-heart-pop 0.45s cubic-bezier(0.175,0.885,0.32,1.275) both';
                        iconEl.style.animation        = 'lvl-heart-pop 0.45s cubic-bezier(0.175,0.885,0.32,1.275) both';
                    });
                });
            }
            /* Run effects AFTER re-enable so iOS Safari is not blocked */
            setTimeout(() => triggerLvlInteractionFeedback(btn, '❤ +1'), 10);
        }
    }

    document.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.lvl-action-like, .reel-action-like');
        if (likeBtn) {
            triggerTwitterHeartBurst(likeBtn);
        }
    });

    function triggerClipDoubleTapBurst(frameContainer) {
        if (!frameContainer) return;
        const burst = document.createElement('div');
        burst.className = 'lvl-clip-doubletap-burst';
        burst.innerHTML = `
            <div class="lvl-clip-doubletap-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </div>
            <span class="lvl-clip-doubletap-label">+1 XP</span>
        `;
        frameContainer.appendChild(burst);
        setTimeout(() => burst.remove(), 900);
    }

    initFeedback();
    initCookieConsent();
    initXpToasts();
    initNewChatPanel();
    initServiceWorker();
    initInstallPrompt();
    initLiveStatusBadges();
    initBirthdayValidation();
    initUsernameAvailability();
    initPasswordConfirmation();
    initTermsAcceptance();
    initProfilePreview();
    initProfileAvatarModal();
    initWebBackButton();
    initSwipeBack();
    initPopovers();
    initMessageDock();
    initMarkAllRead();
    initCommunityNameAvailability();
    initPrefetch();
    initTheme();
    initScrollMemory();
    initFeedUpdates();
    initHomeReelPanel();
    initCommunityTimeline();
    initReelsFeed();
    initReelUploadPreview();
    initPublicProgress();
    initProfileTabs();
    initPreferencesSettings();
    initRichReplies();
    initProgressiveMedia();
    initAjaxDeletePosts();

    function initPublicProgress() {
        const toggle = document.getElementById('pprogress-toggle');
        const body = document.getElementById('pprogress-body');
        const container = document.getElementById('pprogress-inline') || (toggle ? toggle.closest('.pprogress-inline') : null);
        if (!toggle || !body) return;

        if (toggle.dataset.pprogressInit === 'true') return;
        toggle.dataset.pprogressInit = 'true';

        const doToggle = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const next = !isExpanded;
            toggle.setAttribute('aria-expanded', String(next));
            if (container) {
                container.setAttribute('aria-expanded', String(next));
                container.classList.toggle('is-expanded', next);
            }
            body.classList.toggle('is-collapsed', !next);
        };

        toggle.addEventListener('click', doToggle);
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                doToggle(e);
            }
        });

        body.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    function initProfileTabs() {
        const tabsNav = document.querySelector('.profile-tabs');
        if (!tabsNav) return;
        const activeTab = tabsNav.querySelector('a.active');
        if (activeTab) {
            requestAnimationFrame(() => {
                const navRect = tabsNav.getBoundingClientRect();
                const tabRect = activeTab.getBoundingClientRect();
                if (tabRect.left < navRect.left || tabRect.right > navRect.right) {
                    activeTab.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
                }
            });
        }
    }

    const SoundEffects = {
        audioCtx: null,
        lastPlayedTime: 0,
        minInterval: 1000,

        init() {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        },

        play(type) {
            const soundEnabled = readPreference('notification_sounds_enabled', 'true') !== 'false';
            if (!soundEnabled) return;

            this.init();
            if (this.audioCtx.state === 'suspended') {
                return;
            }

            const now = Date.now();
            if (now - this.lastPlayedTime < this.minInterval) {
                return;
            }
            this.lastPlayedTime = now;

            try {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                if (type === 'message') {
                    const t = this.audioCtx.currentTime;
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(587.33, t);
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

                    osc.frequency.setValueAtTime(880, t + 0.15);
                    gain.gain.linearRampToValueAtTime(0.18, t + 0.2);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

                    osc.start(t);
                    osc.stop(t + 0.4);
                } else {
                    const t = this.audioCtx.currentTime;
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, t);
                    osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.15);
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

                    osc.start(t);
                    osc.stop(t + 0.25);
                }
            } catch (e) {
                console.warn('Sound play blocked or failed:', e);
            }
        }
    };

    document.addEventListener('click', () => {
        if (SoundEffects.audioCtx && SoundEffects.audioCtx.state === 'suspended') {
            SoundEffects.audioCtx.resume();
        }
    }, { once: true });
    document.addEventListener('touchstart', () => {
        if (SoundEffects.audioCtx && SoundEffects.audioCtx.state === 'suspended') {
            SoundEffects.audioCtx.resume();
        }
    }, { once: true });

    function lockSubmitForm(form, submitBtn) {
        if (!form || form.dataset.submitting === '1') return false;
        form.dataset.submitting = '1';
        if (submitBtn) submitBtn.disabled = true;
        return true;
    }

    function unlockSubmitForm(form, submitBtn) {
        if (!form) return;
        delete form.dataset.submitting;
        if (submitBtn) submitBtn.disabled = false;
    }

    // Auth Tabs Logic
    const authTabs = document.querySelectorAll('[data-auth-tab]');
    const authPanels = document.querySelectorAll('[data-auth-panel]');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            authTabs.forEach(t => t.classList.remove('active'));
            authPanels.forEach(p => p.classList.remove('active'));

            // Add active classes
            tab.classList.add('active');
            const targetPanel = tab.getAttribute('data-auth-tab');
            const panel = document.querySelector(`[data-auth-panel="${targetPanel}"]`);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.auth-form, .premium-form').forEach((form) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', (event) => {
            if (submitBtn && submitBtn.disabled) {
                event.preventDefault();
                return;
            }
            if (!lockSubmitForm(form, submitBtn)) {
                event.preventDefault();
            }
        });
    });

    // Composer Character Count Logic
    const composers = document.querySelectorAll('.composer');
    composers.forEach(composer => {
        const textarea = composer.querySelector('textarea');
        const charCount = composer.querySelector('.char-count');
        const submitBtn = composer.querySelector('button[type="submit"]');
        const imageInput = composer.querySelector('input[type="file"][name="image"]');
        const imageLabel = composer.querySelector('[data-image-label]');
        const imagePreview = composer.querySelector('[data-image-preview]');
        const imagePreviewImg = imagePreview ? imagePreview.querySelector('img') : null;
        const clearImageBtn = composer.querySelector('[data-clear-image]');
        const maxLen = textarea ? parseInt(textarea.getAttribute('maxlength') || '280', 10) : 280;
        let previewUrl = null;
        const draftListUrl = composer.dataset.draftListUrl;
        const draftSaveUrl = composer.dataset.draftSaveUrl;
        const draftDeleteUrl = composer.dataset.draftDeleteUrl;
        const draftIdInput = composer.querySelector('[data-draft-id]');
        const draftClearImageInput = composer.querySelector('[data-draft-clear-image]');
        const saveDraftBtn = composer.querySelector('[data-save-draft]');
        const discardDraftBtn = composer.querySelector('[data-discard-draft]');
        const draftPicker = composer.querySelector('[data-draft-picker]');
        const draftStatus = composer.querySelector('[data-draft-status]');
        const csrfTokenInput = composer.querySelector('input[name="csrf_token"]');
        let drafts = [];
        let draftImageUrl = null;
        let draftImageCleared = false;
        let savingDraft = false;
        let autosaveTimer = null;
        let lastSavedText = '';

        if (textarea && charCount) {
            const updateComposerState = () => {
                const remaining = maxLen - textarea.value.length;
                const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
                const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};
                const suffix = t.composer_char_count_suffix || 'left';
                charCount.textContent = `${remaining} ${suffix}`;
                const hasImage = (imageInput && imageInput.files && imageInput.files.length > 0) || Boolean(draftImageUrl);
                const hasGif = Boolean(composer.querySelector('input[name="gif_url"]')?.value);
                const hasSticker = Boolean(composer.querySelector('input[name="sticker"]')?.value);

                if (remaining < 0) {
                    charCount.style.color = 'var(--error-color)';
                    submitBtn.disabled = true;
                } else if (textarea.value.trim().length === 0 && !hasImage && !hasGif && !hasSticker) {
                    submitBtn.disabled = true;
                } else {
                    charCount.style.color = 'var(--text-secondary)';
                    submitBtn.disabled = false;
                }
                
                // auto resize textarea
                textarea.style.height = 'auto';
                textarea.style.height = (textarea.scrollHeight) + 'px';
                updateDraftControls();
            };

            const clearImagePreview = () => {
                if (!imageInput) return;
                imageInput.value = '';
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    previewUrl = null;
                }
                if (imageLabel) {
                    const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
                    const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};
                    imageLabel.textContent = t.composer_add_image || 'Add image';
                }
                if (imagePreviewImg) imagePreviewImg.removeAttribute('src');
                if (imagePreview) imagePreview.hidden = true;
                draftImageUrl = null;
                draftImageCleared = true;
                if (draftClearImageInput) draftClearImageInput.value = '1';
                updateComposerState();
            };

            const refreshImagePreview = () => {
                if (!imageInput || !imageInput.files || !imageInput.files.length) {
                    clearImagePreview();
                    return;
                }

                const file = imageInput.files[0];
                if (imageLabel) imageLabel.textContent = file.name || translateUi('composer_image_selected', 'Image selected');
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    previewUrl = null;
                }
                draftImageUrl = null;
                draftImageCleared = false;
                if (draftClearImageInput) draftClearImageInput.value = '0';
                if (imagePreview && imagePreviewImg && file.type && file.type.startsWith('image/')) {
                    previewUrl = URL.createObjectURL(file);
                    imagePreviewImg.src = previewUrl;
                    imagePreview.hidden = false;
                } else if (imagePreview) {
                    imagePreview.hidden = true;
                }
            };

            const setDraftStatus = (message, isError = false) => {
                if (!draftStatus) return;
                draftStatus.textContent = message || '';
                draftStatus.style.color = isError ? 'var(--error-color)' : 'var(--text-muted)';
            };

            const currentDraftId = () => draftIdInput ? draftIdInput.value.trim() : '';

            function updateDraftControls() {
                const hasContent = textarea.value.trim().length > 0 || Boolean(draftImageUrl) || (imageInput && imageInput.files && imageInput.files.length > 0);
                if (saveDraftBtn) saveDraftBtn.disabled = savingDraft || !hasContent || textarea.value.length > maxLen;
                if (discardDraftBtn) discardDraftBtn.hidden = !currentDraftId() && !hasContent;
            }

            const showDraftImage = (imageUrl) => {
                draftImageUrl = imageUrl || null;
                draftImageCleared = false;
                if (draftClearImageInput) draftClearImageInput.value = '0';
                if (!imagePreview || !imagePreviewImg || !draftImageUrl) return;
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    previewUrl = null;
                }
                if (imageInput) imageInput.value = '';
                imagePreviewImg.src = draftImageUrl;
                imagePreview.hidden = false;
                if (imageLabel) imageLabel.textContent = translateUi('composer_saved_image', 'Saved image attached');
            };

            const renderDraftPicker = () => {
                if (!draftPicker) return;
                const selectedId = currentDraftId();
                draftPicker.innerHTML = `<option value="">${translateUi('drafts_title', 'Drafts')}</option>`;
                drafts.forEach((draft) => {
                    const option = document.createElement('option');
                    option.value = String(draft.id);
                    const label = (draft.content || '').trim() || (draft.image_url
                        ? translateUi('draft_image_label', 'Image draft')
                        : translateUi('draft_untitled_label', 'Untitled draft'));
                    option.textContent = label.length > 40 ? `${label.slice(0, 40)}...` : label;
                    draftPicker.appendChild(option);
                });
                draftPicker.value = selectedId;
                draftPicker.hidden = drafts.length === 0;
            };

            const rememberDraft = (draft) => {
                if (!draft || !draft.id) return;
                const existingIndex = drafts.findIndex((item) => String(item.id) === String(draft.id));
                if (existingIndex >= 0) {
                    drafts.splice(existingIndex, 1);
                }
                drafts.unshift(draft);
                drafts = drafts.slice(0, 20);
                renderDraftPicker();
            };

            const saveCurrentDraft = async (silent = false) => {
                if (!draftSaveUrl || savingDraft) return;
                const content = textarea.value.trim();
                const selectedFile = imageInput && imageInput.files && imageInput.files.length ? imageInput.files[0] : null;
                if (!content && !selectedFile && !draftImageUrl && !draftImageCleared) return;

                savingDraft = true;
                updateDraftControls();
                if (!silent) setDraftStatus('Saving...');

                const formData = new FormData();
                formData.append('content', content);
                if (currentDraftId()) formData.append('draft_id', currentDraftId());
                if (draftImageCleared) formData.append('clear_image', '1');
                if (selectedFile) formData.append('image', selectedFile);

                try {
                    const headers = { 'Accept': 'application/json' };
                    if (csrfTokenInput) headers['X-CSRF-Token'] = csrfTokenInput.value;
                    const response = await fetch(draftSaveUrl, {
                        method: 'POST',
                        body: formData,
                        headers
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success || !result.draft) {
                        throw new Error(result.error || 'Could not save draft.');
                    }
                    if (draftIdInput) draftIdInput.value = String(result.draft.id || '');
                    draftImageUrl = result.draft.image_url || null;
                    draftImageCleared = false;
                    if (draftClearImageInput) draftClearImageInput.value = '0';
                    if (selectedFile && imageInput) imageInput.value = '';
                    if (draftImageUrl) showDraftImage(draftImageUrl);
                    rememberDraft(result.draft);
                    lastSavedText = content;
                    setDraftStatus('Draft saved');
                } catch (error) {
                    console.error('Draft save failed:', error);
                    setDraftStatus(error.message || 'Draft save failed', true);
                    if (!silent) showAppToast(error.message || 'Draft save failed', 'error');
                } finally {
                    savingDraft = false;
                    updateDraftControls();
                }
            };

            const loadDrafts = async () => {
                if (!draftListUrl) return;
                try {
                    const response = await fetch(draftListUrl, { headers: { 'Accept': 'application/json' } });
                    const result = await response.json();
                    if (!response.ok || !result.success || !Array.isArray(result.drafts)) return;
                    drafts = result.drafts;
                    renderDraftPicker();
                } catch (error) {
                    console.error('Draft load failed:', error);
                }
            };

            const restoreDraft = (draftId) => {
                const draft = drafts.find((item) => String(item.id) === String(draftId));
                if (!draft) return;
                if (draftIdInput) draftIdInput.value = String(draft.id);
                textarea.value = draft.content || '';
                lastSavedText = textarea.value.trim();
                if (draft.image_url) {
                    showDraftImage(draft.image_url);
                } else {
                    draftImageUrl = null;
                    draftImageCleared = false;
                    if (draftClearImageInput) draftClearImageInput.value = '0';
                    if (imagePreviewImg) imagePreviewImg.removeAttribute('src');
                    if (imagePreview) imagePreview.hidden = true;
                }
                textarea.dispatchEvent(new Event('input'));
                textarea.focus();
                setDraftStatus('Draft restored');
            };

            const discardCurrentDraft = async () => {
                const draftId = currentDraftId();
                if (draftId && draftDeleteUrl) {
                    const formData = new FormData();
                    formData.append('draft_id', draftId);
                    try {
                        const headers = { 'Accept': 'application/json' };
                        if (csrfTokenInput) headers['X-CSRF-Token'] = csrfTokenInput.value;
                        const response = await fetch(draftDeleteUrl, {
                            method: 'POST',
                            body: formData,
                            headers
                        });
                        const result = await response.json();
                        if (!response.ok || !result.success) {
                            throw new Error(result.error || 'Could not discard draft.');
                        }
                        drafts = drafts.filter((item) => String(item.id) !== String(draftId));
                    } catch (error) {
                        console.error('Draft discard failed:', error);
                        showAppToast(error.message || 'Could not discard draft.', 'error');
                        return;
                    }
                }
                if (draftIdInput) draftIdInput.value = '';
                textarea.value = '';
                lastSavedText = '';
                clearImagePreview();
                draftImageCleared = false;
                if (draftClearImageInput) draftClearImageInput.value = '0';
                renderDraftPicker();
                setDraftStatus('Draft discarded');
                textarea.dispatchEvent(new Event('input'));
            };

            const scheduleDraftAutosave = () => {
                if (!draftSaveUrl) return;
                window.clearTimeout(autosaveTimer);
                const content = textarea.value.trim();
                if (!content || content === lastSavedText || textarea.value.length > maxLen) return;
                autosaveTimer = window.setTimeout(() => saveCurrentDraft(true), 1500);
            };

            textarea.addEventListener('input', () => {
                updateComposerState();
                scheduleDraftAutosave();
            });
            if (imageInput) {
                imageInput.addEventListener('change', () => {
                    refreshImagePreview();
                    updateComposerState();
                    scheduleDraftAutosave();
                });
            }
            if (clearImageBtn) {
                clearImageBtn.addEventListener('click', () => {
                    clearImagePreview();
                    scheduleDraftAutosave();
                });
            }
            if (saveDraftBtn) {
                saveDraftBtn.addEventListener('click', () => saveCurrentDraft(false));
            }
            if (discardDraftBtn) {
                discardDraftBtn.addEventListener('click', discardCurrentDraft);
            }
            if (draftPicker) {
                draftPicker.addEventListener('change', () => restoreDraft(draftPicker.value));
            }
            composer.addEventListener('submit', (event) => {
                if (submitBtn && submitBtn.disabled) {
                    event.preventDefault();
                    return;
                }
                if (!lockSubmitForm(composer, submitBtn)) {
                    event.preventDefault();
                }
            });
            // trigger on load
            textarea.dispatchEvent(new Event('input'));
            loadDrafts();
        }
    });

    // Auto resize utility for other textareas if needed
    const textareas = document.querySelectorAll('textarea:not(.composer textarea)');
    textareas.forEach(ta => {
        ta.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    // AJAX Messaging Logic
    const chatForm = document.querySelector('.chat-input-form');
    const messagesFeed = document.getElementById('messages-feed');

    if (chatForm && messagesFeed) {
        const textarea = chatForm.querySelector('textarea');
        const fileInput = document.getElementById('chat-file-input');
        const triggerBtn = document.getElementById('attachment-trigger-btn');
        const previewBox = document.getElementById('attachment-preview-box');
        const previewFilename = document.getElementById('preview-filename');
        const progressBar = document.getElementById('upload-progress-bar');
        const progressText = document.getElementById('upload-progress-text');
        const cancelUploadBtn = document.getElementById('cancel-upload-btn');

        const hiddenTempFilename = document.getElementById('hidden-temp-filename');
        const hiddenAttachmentName = document.getElementById('hidden-attachment-name');
        const hiddenAttachmentType = document.getElementById('hidden-attachment-type');

        let currentUploadXhr = null;

        // Auto focus and auto resize textarea
        if (textarea) {
            textarea.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
                    return;
                }

                event.preventDefault();
                const content = textarea.value.trim();
                const tempFilename = hiddenTempFilename.value;
                if (content || tempFilename) {
                    chatForm.requestSubmit();
                }
            });
        }

        // Trigger file input
        if (triggerBtn && fileInput) {
            triggerBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }

        // Handle file selection and AJAX upload
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                if (!file) return;

                // Validate file extension
                const filename = file.name;
                const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
                const allowedExtensions = [
                    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp',
                    '.mp4', '.webm', '.mov', '.m4v',
                    '.mp3', '.wav', '.ogg', '.m4a',
                    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'
                ];
                
                const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
                const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};

                if (!allowedExtensions.includes(ext)) {
                    showAppToast(t.error_unsupported_file || 'This file type is not supported for security reasons.');
                    fileInput.value = '';
                    return;
                }

                // Validate file size (max 15 MB)
                const maxSize = 15 * 1024 * 1024;
                if (file.size > maxSize) {
                    showAppToast(t.error_file_too_large || 'File size exceeds the limit of 15 MB.');
                    fileInput.value = '';
                    return;
                }

                // Cancel existing upload if any
                if (currentUploadXhr) {
                    currentUploadXhr.abort();
                    currentUploadXhr = null;
                }

                // Show preview box
                if (previewBox) {
                    previewBox.hidden = false;
                    previewFilename.textContent = filename;
                    progressBar.style.width = '0%';
                    progressText.textContent = '0%';
                }

                // Start AJAX upload
                const formData = new FormData();
                formData.append('file', file);

                const xhr = new XMLHttpRequest();
                currentUploadXhr = xhr;

                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        progressBar.style.width = percent + '%';
                        progressText.textContent = percent + '%';
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        try {
                            const res = JSON.parse(xhr.responseText);
                            if (res.success) {
                                hiddenTempFilename.value = res.temp_filename;
                                hiddenAttachmentName.value = res.attachment_name;
                                hiddenAttachmentType.value = res.attachment_type;
                                progressBar.style.width = '100%';
                                progressText.textContent = '100%';
                            } else {
                                showAppToast(res.error || translateUi('upload_failed', 'Upload failed'));
                                resetUploadPreview();
                            }
                        } catch (err) {
                            showAppToast(translateUi('upload_failed', 'Upload failed'));
                            resetUploadPreview();
                        }
                    } else {
                        showAppToast(translateUi('upload_failed', 'Upload failed'));
                        resetUploadPreview();
                    }
                    currentUploadXhr = null;
                });

                xhr.addEventListener('error', () => {
                    showAppToast(translateUi('upload_error', 'Upload error'));
                    resetUploadPreview();
                    currentUploadXhr = null;
                });

                xhr.addEventListener('abort', () => {
                    resetUploadPreview();
                    currentUploadXhr = null;
                });

                xhr.open('POST', '/api/upload_attachment');
                const csrfTokenEl = chatForm.querySelector('input[name="csrf_token"]');
                if (csrfTokenEl) {
                    xhr.setRequestHeader('X-CSRF-Token', csrfTokenEl.value);
                }
                xhr.send(formData);
            });
        }

        // Cancel upload button action
        if (cancelUploadBtn) {
            cancelUploadBtn.addEventListener('click', () => {
                if (currentUploadXhr) {
                    currentUploadXhr.abort();
                } else {
                    resetUploadPreview();
                }
            });
        }

        function resetUploadPreview() {
            if (previewBox) previewBox.hidden = true;
            if (previewFilename) previewFilename.textContent = '';
            if (progressBar) progressBar.style.width = '0%';
            if (progressText) progressText.textContent = '0%';
            if (fileInput) fileInput.value = '';
            if (hiddenTempFilename) hiddenTempFilename.value = '';
            if (hiddenAttachmentName) hiddenAttachmentName.value = '';
            if (hiddenAttachmentType) hiddenAttachmentType.value = '';
        }

        // Form submission
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = chatForm.querySelector('button[type="submit"]');
            const content = textarea.value.trim();
            const tempFilename = hiddenTempFilename.value;

            if (!content && !tempFilename) return;
            if (chatForm.dataset.submitting === '1') return;

            // Wait if upload is in progress
            if (currentUploadXhr) {
                showAppToast(translateUi('upload_wait', 'Please wait for the file to finish uploading.'));
                return;
            }

            lockSubmitForm(chatForm, submitBtn);

            const formData = new FormData(chatForm);
            formData.append('ajax', '1');

            try {
                const response = await fetch(chatForm.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    const wrapper = renderMessage(result.message, true);
                    messagesFeed.appendChild(wrapper);
                    textarea.value = '';
                    textarea.style.height = 'auto';
                    resetUploadPreview();
                    messagesFeed.scrollTop = messagesFeed.scrollHeight;

                    // Update streak display in chat header
                    if (typeof result.streak === 'number') {
                        const streakEl = document.querySelector('[data-chat-streak]');
                        if (streakEl) {
                            streakEl.innerHTML = `<svg class="high-five-svg streak-high-five-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6"/><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg> <span class="streak-count-val">${result.streak}</span>`;
                            streakEl.dataset.streakCount = result.streak;
                            const streakLabel = translateUi('streak_days_high_five', 'day high-five streak');
                            streakEl.title = `${result.streak} ${streakLabel}`;
                            streakEl.classList.toggle('streak-badge-zero', result.streak === 0);
                        }
                        if (result.streak_xp > 0) {
                            const streakLabel = translateUi('streak_days_high_five', 'day high-five streak');
                            showXpToasts([{ points: result.streak_xp, label: `${result.streak} ${streakLabel}` }]);
                        }
                    }
                } else {
                    showAppToast(result.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                showAppToast(translateUi('message_send_error', 'Message did not send. Try again.'));
            } finally {
                unlockSubmitForm(chatForm, submitBtn);
            }
        });

        const pollUrl = messagesFeed.dataset.messageApi;
        const loadOlderBtn = messagesFeed.querySelector('[data-load-older-messages]');
        if (pollUrl && loadOlderBtn) {
            loadOlderBtn.addEventListener('click', async () => {
                const firstMessage = messagesFeed.querySelector('[data-message-id]');
                if (!firstMessage || loadOlderBtn.disabled) return;

                loadOlderBtn.disabled = true;
                const previousScrollHeight = messagesFeed.scrollHeight;
                const previousScrollTop = messagesFeed.scrollTop;

                try {
                    const beforeId = firstMessage.dataset.messageId;
                    const response = await fetch(`${pollUrl}?before_id=${encodeURIComponent(beforeId)}`, {
                        headers: { 'Accept': 'application/json' }
                    });
                    const result = await response.json();
                    if (!response.ok || !result.success || !Array.isArray(result.messages)) {
                        throw new Error(result.error || 'Could not load older messages.');
                    }

                    const existing = new Set(Array.from(messagesFeed.querySelectorAll('[data-message-id]')).map(el => el.dataset.messageId));
                    const fragment = document.createDocumentFragment();
                    result.messages.forEach((message) => {
                        if (existing.has(String(message.id))) return;
                        fragment.appendChild(renderMessage(message, message.sender_id === result.viewer_id));
                    });
                    if (fragment.childNodes.length) {
                        messagesFeed.insertBefore(fragment, firstMessage);
                        messagesFeed.scrollTop = messagesFeed.scrollHeight - previousScrollHeight + previousScrollTop;
                    }
                    if (!result.has_more) {
                        loadOlderBtn.remove();
                    } else {
                        loadOlderBtn.disabled = false;
                    }
                } catch (error) {
                    console.error('Older messages load failed:', error);
                    showAppToast(error.message || 'Could not load older messages.', 'error');
                    loadOlderBtn.disabled = false;
                }
            });
        }

        // Live Poll refreshing
        if (pollUrl) {
            startVisiblePolling(async () => {
                const messageEls = Array.from(messagesFeed.querySelectorAll('[data-message-id]'));
                const latest = messageEls[messageEls.length - 1];
                const sinceId = latest ? latest.dataset.messageId : '0';
                try {
                    const response = await fetch(`${pollUrl}?since_id=${encodeURIComponent(sinceId)}`, {
                        headers: { 'Accept': 'application/json' }
                    });
                    const result = await response.json();
                    if (!result.success || !Array.isArray(result.messages) || !result.messages.length) return;
                    const existing = new Set(Array.from(messagesFeed.querySelectorAll('[data-message-id]')).map(el => el.dataset.messageId));
                    let newMsgsCount = 0;
                    result.messages.forEach((message) => {
                        if (existing.has(String(message.id))) return;
                        messagesFeed.appendChild(renderMessage(message, message.sender_id === result.viewer_id));
                        if (message.sender_id !== result.viewer_id) {
                            newMsgsCount++;
                        }
                    });
                    if (newMsgsCount > 0) {
                        SoundEffects.play('message');
                    }
                    messagesFeed.scrollTop = messagesFeed.scrollHeight;
                } catch (error) {
                    console.error('Message refresh failed:', error);
                }
            }, 7000);
        }

        // Delete dropdown logic and event delegation
        messagesFeed.addEventListener('click', async (event) => {
            const deleteBtn = event.target.closest('.delete-trigger-btn');
            if (deleteBtn) {
                event.stopPropagation();
                // Toggle dropdown menu
                const dropdownMenu = deleteBtn.nextElementSibling;
                if (dropdownMenu) {
                    const isHidden = dropdownMenu.hidden;
                    // Close all other dropdowns
                    messagesFeed.querySelectorAll('.delete-dropdown-menu').forEach(menu => {
                        menu.hidden = true;
                    });
                    dropdownMenu.hidden = !isHidden;
                }
                return;
            }

            const deleteMenuItem = event.target.closest('.delete-menu-item');
            if (deleteMenuItem) {
                event.preventDefault();
                event.stopPropagation();

                const messageId = deleteMenuItem.dataset.messageId;
                const deleteType = deleteMenuItem.dataset.deleteType; // 'me' or 'everyone'
                const deleteUrl = messagesFeed.dataset.deleteMessageUrl;
                const csrfToken = messagesFeed.dataset.csrfToken;

                if (!deleteUrl || !csrfToken || !messageId) return;

                const formData = new FormData();
                formData.append('message_id', messageId);
                formData.append('delete_type', deleteType);
                formData.append('csrf_token', csrfToken);
                formData.append('ajax', '1');

                try {
                    const response = await fetch(deleteUrl, {
                        method: 'POST',
                        body: formData
                    });
                    const res = await response.json();
                    if (res.success) {
                        const messageWrapper = messagesFeed.querySelector(`[data-message-id="${messageId}"]`);
                        if (messageWrapper) {
                            if (deleteType === 'everyone') {
                                // Replace content to "This message was deleted"
                                const bubble = messageWrapper.querySelector('.message-bubble');
                                if (bubble) {
                                    bubble.className = 'message-bubble deleted-message';
                                    const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
                                    const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};
                                    const text = t.message_deleted || 'This message was deleted';
                                    bubble.innerHTML = `<span data-i18n="message_deleted">${escapeHTML(text)}</span>`;
                                }
                                // Remove delete trigger dropdown element
                                const dropdown = messageWrapper.querySelector('.message-delete-dropdown');
                                if (dropdown) dropdown.remove();
                            } else {
                                // Delete for me: remove message wrapper completely
                                messageWrapper.remove();
                            }
                        }
                    } else {
                        showAppToast(res.error || 'Failed to delete message');
                    }
                } catch (error) {
                    console.error('Delete message error:', error);
                    showAppToast(translateUi('message_delete_error', 'Failed to delete message. Try again.'));
                }
                return;
            }

            // Close all dropdowns on click inside chat feed
            messagesFeed.querySelectorAll('.delete-dropdown-menu').forEach(menu => {
                menu.hidden = true;
            });
        });

        // Close dropdowns on document click
        document.addEventListener('click', () => {
            messagesFeed.querySelectorAll('.delete-dropdown-menu').forEach(menu => {
                menu.hidden = true;
            });
        });
    }

    function initNewChatSearch() {
        document.querySelectorAll('[data-new-chat-search]').forEach(input => {
            input.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase();
                const list = e.target.parentElement.nextElementSibling;
                if (list && list.classList.contains('user-selection-list')) {
                    list.querySelectorAll('.user-select-item').forEach(item => {
                        const name = item.querySelector('strong')?.textContent.toLowerCase() || '';
                        const handle = item.querySelector('span')?.textContent.toLowerCase() || '';
                        if (name.includes(val) || handle.includes(val)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    function initNewChatPanel() {
        initNewChatSearch();
        const panel = document.getElementById('new-chat-panel');
        const toggle = document.querySelector('[data-new-chat-toggle]');
        if (!panel || !toggle) return;

        const closeButtons = panel.querySelectorAll('[data-new-chat-close]');
        const setOpen = (open) => {
            panel.hidden = !open;
            toggle.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('new-chat-open', open);

            if (open) {
                const firstLink = panel.querySelector('.user-select-item');
                if (firstLink) firstLink.focus();
            } else {
                toggle.focus();
            }
        };

        toggle.addEventListener('click', () => setOpen(panel.hidden));
        closeButtons.forEach((button) => {
            button.addEventListener('click', () => setOpen(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !panel.hidden) {
                setOpen(false);
            }
        });
    }

    function initServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        if (!window.isSecureContext && !['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

        navigator.serviceWorker.register('/service-worker.js').catch((error) => {
            console.error('Service worker registration failed:', error);
        });
    }

    function initInstallPrompt() {
        const promptEl = document.querySelector('[data-install-prompt]');
        if (!promptEl) return;

        const actionButton = promptEl.querySelector('[data-install-action]');
        const dismissButton = promptEl.querySelector('[data-install-dismiss]');
        const iosSteps = promptEl.querySelector('[data-install-ios]');
        const manualSteps = promptEl.querySelector('[data-install-manual]');
        const message = promptEl.querySelector('[data-install-message]');
        const dismissedKey = 'lvl-install-dismissed';
        let deferredPrompt = null;
        let manualPromptTimer = null;

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        if (isStandalone || readPreference(dismissedKey) === '1') {
            return;
        }

        const isiOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
            || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

        const showPrompt = () => {
            promptEl.hidden = false;
        };

        const hidePrompt = () => {
            promptEl.hidden = true;
        };

        const showManualInstallHelp = () => {
            if (deferredPrompt || promptEl.hidden === false) return;
            if (actionButton) {
                actionButton.hidden = true;
            }
            if (manualSteps) {
                manualSteps.hidden = false;
            }
            if (message) {
                message.dataset.i18n = 'install_manual_fallback';
                message.textContent = translateUi('install_manual_fallback', 'Install LvL from your browser menu when the native install button is not available.');
            }
            showPrompt();
        };

        if (isiOS) {
            if (message) {
                message.dataset.i18n = 'install_ios_desc';
                message.textContent = translateUi('install_ios_desc', 'Install LvL from Safari using Share, then Add to Home Screen.');
            }
            if (iosSteps) {
                iosSteps.hidden = false;
            }
            if (manualSteps) {
                manualSteps.hidden = false;
            }
            showPrompt();
        } else {
            manualPromptTimer = window.setTimeout(showManualInstallHelp, 1600);
        }

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;
            if (manualPromptTimer) {
                window.clearTimeout(manualPromptTimer);
                manualPromptTimer = null;
            }
            if (iosSteps) {
                iosSteps.hidden = true;
            }
            if (manualSteps) {
                manualSteps.hidden = true;
            }
            if (actionButton) {
                actionButton.hidden = false;
            }
            if (message) {
                message.dataset.i18n = 'install_desc';
                message.textContent = translateUi('install_desc', 'Put LvL on your home screen for a faster app-like experience.');
            }
            showPrompt();
        });

        if (actionButton) {
            actionButton.addEventListener('click', async () => {
                if (!deferredPrompt) {
                    showManualInstallHelp();
                    return;
                }
                deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                deferredPrompt = null;
                if (choice && choice.outcome === 'accepted') {
                    writePreference(dismissedKey, '1');
                    hidePrompt();
                }
            });
        }

        if (dismissButton) {
            dismissButton.addEventListener('click', () => {
                writePreference(dismissedKey, '1');
                hidePrompt();
            });
        }

        window.addEventListener('appinstalled', () => {
            writePreference(dismissedKey, '1');
            hidePrompt();
        });
    }

    // Sidebar mode: desktop stays open; mobile uses header/bottom navigation.
    const sidebar = document.querySelector('.left-rail');
    if (sidebar) {
        safeStorageRemove('sidebar-menu-open');
        // Instagram's rail: icons by default, labels while the pointer (or
        // keyboard focus) is on it. `menu-open` is the same class the
        // labelled state already used, so every existing rule still applies.
        const DESKTOP_RAIL = '(min-width: 768px)';
        let railPinned = false;

        const desktopRail = () => window.matchMedia(DESKTOP_RAIL).matches;

        const openRail = () => {
            if (!desktopRail()) return;
            sidebar.classList.add('menu-open');
        };

        const closeRail = () => {
            if (railPinned) return;
            sidebar.classList.remove('menu-open');
        };

        const syncSidebarMode = () => {
            sidebar.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
            if (!desktopRail()) sidebar.classList.remove('menu-open');
        };

        sidebar.addEventListener('mouseenter', openRail);
        sidebar.addEventListener('mouseleave', closeRail);
        sidebar.addEventListener('focusin', openRail);
        sidebar.addEventListener('focusout', (event) => {
            if (sidebar.contains(event.relatedTarget)) return;
            closeRail();
        });

        // A popover anchored to the rail keeps it open, or it would collapse
        // out from under the menu the reader just opened.
        document.addEventListener('lvl:popover', (event) => {
            const detail = event.detail || {};
            if (!detail.trigger || !sidebar.contains(detail.trigger)) return;
            railPinned = !!detail.open;
            if (detail.open) openRail();
            else closeRail();
        });

        syncSidebarMode();
        window.addEventListener('resize', syncSidebarMode);
    }

    // Mobile Twitter/X-Style Drawer Controller
    const mobileDrawer = document.querySelector('[data-mobile-drawer]');
    const mobileBackdrop = document.querySelector('[data-mobile-drawer-backdrop]');
    const mobileDrawerTriggers = document.querySelectorAll('[data-mobile-drawer-trigger]');
    const mobileDrawerClose = document.querySelector('[data-mobile-drawer-close]');

    if (mobileDrawer && mobileBackdrop) {
        let isDrawerOpen = false;

        const openDrawer = () => {
            if (isDrawerOpen) return;
            isDrawerOpen = true;
            mobileBackdrop.hidden = false;
            mobileDrawer.hidden = false;
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                mobileBackdrop.classList.add('is-open');
                mobileDrawer.classList.add('is-open');
            });
            mobileDrawerTriggers.forEach(t => t.setAttribute('aria-expanded', 'true'));
        };

        const closeDrawer = () => {
            if (!isDrawerOpen) return;
            isDrawerOpen = false;
            mobileBackdrop.classList.remove('is-open');
            mobileDrawer.classList.remove('is-open');
            document.body.style.overflow = '';
            mobileDrawerTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
            setTimeout(() => {
                if (!isDrawerOpen) {
                    mobileBackdrop.hidden = true;
                    mobileDrawer.hidden = true;
                }
            }, 300);
        };

        mobileDrawerTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isDrawerOpen) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });
        });

        if (mobileDrawerClose) {
            mobileDrawerClose.addEventListener('click', (e) => {
                e.preventDefault();
                closeDrawer();
            });
        }

        mobileBackdrop.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isDrawerOpen) {
                closeDrawer();
            }
        });

        // Touch Swipe-to-Close gesture for Mobile Drawer
        let touchStartX = 0;
        let touchCurrentX = 0;

        mobileDrawer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchCurrentX = touchStartX;
        }, { passive: true });

        mobileDrawer.addEventListener('touchmove', (e) => {
            touchCurrentX = e.touches[0].clientX;
        }, { passive: true });

        mobileDrawer.addEventListener('touchend', () => {
            // If swiped left by more than 45px, close drawer
            if (touchStartX - touchCurrentX > 45) {
                closeDrawer();
            }
            touchStartX = 0;
            touchCurrentX = 0;
        });
    }

    // AJAX Like/Repost/Mute/Friend Logic
    const ajaxForms = document.querySelectorAll('.ajax-action-form');
    ajaxForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button');
            if (!btn || btn.dataset.pending === '1') return;
            btn.dataset.pending = '1';
            /* NOTE: Do NOT set btn.disabled – iOS Safari blocks CSS animations on disabled elements */

            const countTarget = btn.querySelector('strong');
            const formData = new FormData(form);
            formData.append('ajax', '1');

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showXpToasts(result.xp_toasts || []);
                    const action = form.dataset.action;
                    if (action === 'like') {
                        applyLikeFeedbackAndStyle(btn, result.liked, result.count);
                    } else if (action === 'repost') {
                        btn.classList.toggle('active', result.reposted);
                        btn.classList.toggle('repost-active', result.reposted);
                        if (countTarget) countTarget.textContent = result.count || '0';
                        if (result.reposted) triggerLvlInteractionFeedback(btn, 'BOOST!');
                    } else if (action === 'bookmark') {
                        btn.classList.toggle('active', result.bookmarked);
                        btn.classList.toggle('bookmark-active', result.bookmarked);
                        if (result.bookmarked) triggerLvlInteractionFeedback(btn, 'VAULTED!');
                    } else if (action === 'follow') {
                        syncFollowControls(formData.get('target_id'), Boolean(result.following));
                    } else if (action === 'mute') {
                        btn.classList.toggle('active', result.active);
                        const key = result.active ? 'profile_muted' : 'profile_mute';
                        btn.setAttribute('data-i18n', key);
                        btn.textContent = translateUi(key, result.active ? 'Muted' : 'Mute');
                    } else if (action === 'block') {
                        btn.classList.toggle('active', result.active);
                        const key = result.active ? 'profile_unblock' : 'profile_block';
                        btn.setAttribute('data-i18n', key);
                        btn.textContent = translateUi(key, result.active ? 'Unblock' : 'Block');
                    } else if (action === 'friend') {
                        btn.classList.toggle('active', !!result.status);
                        btn.textContent = result.label || 'Add friend';
                    }
                }
                if (!result.success && result.error) showAppToast(result.error);
            } catch (error) {
                console.error('Error performing AJAX action:', error);
                showAppToast(translateUi('action_failed', 'Action did not finish. Try again.'));
                return;
            } finally {
                delete btn.dataset.pending;
            }
        });
    });

    document.querySelectorAll('[data-copy-url]').forEach((button) => {
        button.addEventListener('click', async () => {
            const url = button.dataset.copyUrl;
            try {
                await navigator.clipboard.writeText(url);
                button.setAttribute('data-i18n', 'copied_label');
                button.textContent = translateUi('copied_label', 'Copied');
                window.setTimeout(() => {
                    button.setAttribute('data-i18n', 'post_copy_link');
                    button.textContent = translateUi('post_copy_link', 'Copy link');
                }, 1400);
            } catch (error) {
                window.prompt(translateUi('copy_prompt', 'Copy this link'), url);
            }
        });
    });

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderMessage(message, own) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-bubble-wrapper ${own ? 'own' : ''}`;
        wrapper.dataset.messageId = String(message.id || '');
        


        const time = new Date(message.created_at);
        const timeStr = Number.isNaN(time.getTime())
            ? ''
            : time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');

        const lang = window.LvLI18n ? window.LvLI18n.getCurrentLang() : 'en';
        const t = (window.LvLI18n && window.LvLI18n.TRANSLATIONS && window.LvLI18n.TRANSLATIONS[lang]) || {};

        let bodyHtml = '';
        if (message.deleted_for_everyone) {
            const msgDeletedText = t.message_deleted || 'This message was deleted';
            bodyHtml = `<span class="deleted-message" data-i18n="message_deleted" style="font-style: italic;">${escapeHTML(msgDeletedText)}</span>`;
        } else if (message.shared_post) {
            const postAuthor = message.shared_post.user || {};
            bodyHtml = `
                <div class="shared-post-label" data-i18n="messages_shared_post">${escapeHTML(t.messages_shared_post || 'Shared a post:')}</div>
                <div class="shared-post-card">
                    <a href="/post/${escapeHTML(String(message.shared_post.id))}" class="shared-post-link">
                        <div class="shared-post-author-row">
                            <img class="shared-post-avatar" src="${escapeHTML(postAuthor.profile_photo_url || '/static/assets/default-male-avatar.svg')}" alt="">
                            <strong>${escapeHTML(postAuthor.display_name || '')}</strong>
                            <span class="shared-post-handle">@${escapeHTML(postAuthor.username || '')}</span>
                        </div>
                        <p class="shared-post-content">${escapeHTML(message.shared_post.content || '')}</p>
                        ${message.shared_post.image_url ? `<img class="shared-post-image" src="${escapeHTML(message.shared_post.image_url)}" alt="">` : ''}
                    </a>
                </div>
            `;
        } else if (message.shared_reel) {
            const reelAuthor = message.shared_reel.user || {};
            bodyHtml = `
                <div class="shared-post-label" data-i18n="messages_shared_clip">${escapeHTML(t.messages_shared_clip || 'Shared a clip:')}</div>
                <div class="shared-post-card" style="position: relative; overflow: hidden; border-radius: 8px; padding: 0;">
                    <a href="/clips#reel-${escapeHTML(String(message.shared_reel.id))}" class="shared-post-link" style="display: block; position: relative; padding: 0;">
                        <div class="shared-post-author-row" style="position: absolute; top: 12px; left: 12px; z-index: 2; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.8); margin: 0;">
                            <img class="shared-post-avatar" src="${escapeHTML(reelAuthor.profile_photo_url || '/static/assets/default-male-avatar.svg')}" alt="" style="border: 2px solid white;">
                            <strong>${escapeHTML(reelAuthor.display_name || '')}</strong>
                        </div>
                        <video src="${escapeHTML(message.shared_reel.video_url || '')}" style="width: 100%; display: block; border-radius: 8px; max-height: 300px; object-fit: cover;" preload="metadata" muted playsinline loop></video>
                        <div style="position: absolute; bottom: 12px; left: 12px; z-index: 2; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.8); width: calc(100% - 24px); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; font-size: 0.9em; margin: 0;">${escapeHTML(message.shared_reel.caption || '')}</div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; color: white; opacity: 0.8; pointer-events: none;">
                            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </a>
                </div>
            `;
        } else {
            let attachmentHtml = '';
            if (message.attachment_url) {
                if (message.attachment_type === 'image') {
                    attachmentHtml = `<div class="message-attachment"><img src="${escapeHTML(message.attachment_url)}" alt="Attachment" class="message-image-preview" loading="lazy"></div>`;
                } else if (message.attachment_type === 'video') {
                    attachmentHtml = `<div class="message-attachment"><video src="${escapeHTML(message.attachment_url)}" controls class="message-video-preview" preload="metadata"></video></div>`;
                } else {
                    attachmentHtml = `
                        <div class="message-attachment">
                            <a href="${escapeHTML(message.attachment_url)}" download class="attachment-download-link">
                                <span class="attachment-icon">📁</span>
                                <span class="attachment-name-text">${escapeHTML(message.attachment_name || 'attachment')}</span>
                            </a>
                        </div>
                    `;
                }
            }

            let textHtml = '';
            if (message.content) {
                let contentEscaped = escapeHTML(message.content).replace(/\n/g, '<br>');
                contentEscaped = contentEscaped.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>');
                textHtml = `<span class="message-text-content">${contentEscaped}</span>`;
            }

            bodyHtml = `${attachmentHtml}${textHtml}`;
        }

        const bubbleClass = message.deleted_for_everyone ? 'message-bubble deleted-message' : 'message-bubble';
        
        wrapper.innerHTML = `
            <div class="${bubbleClass}" title="${escapeHTML(message.created_at || '')}">${bodyHtml}</div>
            <div class="message-meta">
                <span class="message-time">${timeStr}</span>
            </div>
        `;
        return wrapper;
    }

    function getThemeToken(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function initPreferencesSettings() {
        const autoplayCheckbox = document.getElementById('autoplay-next-reels-checkbox');
        if (autoplayCheckbox) {
            const autoplaySetting = readPreference('autoplay_next_reels');
            autoplayCheckbox.checked = autoplaySetting !== 'false';
            autoplayCheckbox.addEventListener('change', () => {
                writePreference('autoplay_next_reels', autoplayCheckbox.checked ? 'true' : 'false');
            });
        }

        const soundCheckbox = document.getElementById('notification-sounds-checkbox');
        if (soundCheckbox) {
            const soundSetting = readPreference('notification_sounds_enabled');
            soundCheckbox.checked = soundSetting !== 'false';
            soundCheckbox.addEventListener('change', () => {
                writePreference('notification_sounds_enabled', soundCheckbox.checked ? 'true' : 'false');
            });
        }
    }

    function initProfilePreview() {
        const preview = document.querySelector('[data-profile-preview]');
        if (!preview) return;

        const form = preview.closest('form');
        const avatar = preview.querySelector('.profile-preview-avatar');
        const name = preview.querySelector('[data-preview-name]');
        const username = preview.querySelector('[data-preview-username]');
        const bio = preview.querySelector('[data-preview-bio]');
        const color = form.querySelector('input[name="profile_pic"]');
        const first = form.querySelector('input[name="first_name"]');
        const last = form.querySelector('input[name="last_name"]');
        const nick = form.querySelector('input[name="nickname"]');
        const bioInput = form.querySelector('textarea[name="bio"]');
        const fileInput = form.querySelector('[data-profile-photo-input]');

        const update = () => {
            const displayName = `${first.value || ''} ${last.value || ''}`.trim() || translateUi('profile_preview_your_name', 'Your name');
            name.textContent = displayName;
            username.textContent = `@${nick.value || translateUi('profile_preview_username', 'username')}`;
            bio.textContent = bioInput.value || translateUi('profile_no_bio', 'No bio yet.');
            preview.style.setProperty('--profile-preview-color', color.value || getThemeToken('--lvl-primary'));
        };

        [first, last, nick, bioInput, color].forEach(input => input && input.addEventListener('input', update));
        if (fileInput && avatar) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files && fileInput.files[0];
                if (!file) return;
                avatar.src = URL.createObjectURL(file);
            });
        }
        update();
    }

    function initXpToasts() {
        const data = document.getElementById('xp-toast-data');
        if (!data) return;

        try {
            showXpToasts(JSON.parse(data.textContent || '[]'));
        } catch (error) {
            console.error('Could not read XP toast data:', error);
        }
    }

    // --- Feedback ----------------------------------------------------------
    //
    // One implementation for every message the app shows. Errors and warnings
    // go to the TOP alert stack (role="alert"); success and informational
    // feedback goes to the BOTTOM toast stack (role="status"), which sits above
    // the mobile bottom navigation and respects the bottom safe area.
    // Server-rendered flash messages are placed in the same two stacks by
    // templates/_feedback.html, so there is nothing to keep in sync.

    function isAlertCategory(category) {
        return FEEDBACK_ALERT_CATEGORIES.indexOf(category) !== -1;
    }

    function feedbackStack(category) {
        const selector = isAlertCategory(category) ? '[data-alert-stack]' : '[data-toast-stack]';
        let stack = document.querySelector(selector);
        if (!stack) {
            stack = document.createElement('div');
            stack.className = isAlertCategory(category) ? 'feedback-alerts' : 'feedback-toasts';
            stack.setAttribute(isAlertCategory(category) ? 'data-alert-stack' : 'data-toast-stack', '');
            stack.setAttribute('aria-live', isAlertCategory(category) ? 'assertive' : 'polite');
            document.body.appendChild(stack);
        }
        return stack;
    }

    function dismissFeedback(item) {
        if (!item || item.dataset.dismissed === '1') return;
        item.dataset.dismissed = '1';
        item.classList.add('is-leaving');
        const remove = () => item.remove();
        item.addEventListener('transitionend', remove, { once: true });
        // Fallback for reduced-motion / interrupted transitions.
        window.setTimeout(remove, 400);
    }

    function enhanceFeedbackItem(item) {
        if (item.dataset.feedbackReady === '1') return;
        item.dataset.feedbackReady = '1';

        const category = item.dataset.feedbackCategory || 'info';
        if (!item.querySelector('.feedback-close')) {
            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'feedback-close';
            closeButton.setAttribute('aria-label', translateUi('flash_close', 'Close message'));
            closeButton.dataset.i18nAria = 'flash_close';
            closeButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
            closeButton.addEventListener('click', () => dismissFeedback(item));
            item.appendChild(closeButton);
        }

        // Enter on the next frame so the transition actually runs.
        window.requestAnimationFrame(() => item.classList.add('is-visible'));

        const timeout = FEEDBACK_TIMEOUTS[category] || FEEDBACK_TIMEOUTS.info;
        let timer = window.setTimeout(() => dismissFeedback(item), timeout);
        item.addEventListener('mouseenter', () => window.clearTimeout(timer));
        item.addEventListener('mouseleave', () => {
            timer = window.setTimeout(() => dismissFeedback(item), 2000);
        });
    }

    function initFeedback() {
        document.querySelectorAll('[data-feedback]').forEach(enhanceFeedbackItem);
    }

    function showFeedback(message, category) {
        if (!message) return null;
        category = category || 'info';

        let text = String(message).trim();
        if (category === 'error' && text.length > 60) {
            console.error('Detailed error:', text);
            const lower = text.toLowerCase();
            if (lower.includes('size') || lower.includes('large')) {
                text = translateUi('error_file_too_large', 'File size too large.');
            } else if (lower.includes('type') || lower.includes('format')) {
                text = translateUi('error_unsupported_file', 'Unsupported file format.');
            } else if (lower.includes('permission') || lower.includes('authorized')) {
                text = translateUi('error_access_denied', 'Access denied.');
            } else {
                text = translateUi('action_failed', 'Action failed. Please try again.');
            }
        }

        const original = text;
        if (window.LvLI18n && typeof window.LvLI18n.translateServerMessage === 'function') {
            text = window.LvLI18n.translateServerMessage(original, window.LvLI18n.getCurrentLang());
        }

        const stack = feedbackStack(category);

        // Deduplicate: an identical live message is refreshed, not stacked.
        const duplicate = Array.from(stack.querySelectorAll('[data-feedback]')).find((node) => (
            node.dataset.dismissed !== '1'
            && node.dataset.feedbackCategory === category
            && (node.querySelector('.feedback-text') || {}).textContent === text
        ));
        if (duplicate) {
            duplicate.classList.remove('is-leaving');
            return duplicate;
        }

        const item = document.createElement('div');
        item.className = `feedback-item feedback-${category}`;
        item.setAttribute('role', isAlertCategory(category) ? 'alert' : 'status');
        item.dataset.feedback = '';
        item.dataset.feedbackCategory = category;
        item.dataset.serverMessage = '';
        item.dataset.serverMessageOriginal = original;
        item.innerHTML =
            `<span class="feedback-icon" aria-hidden="true">${FEEDBACK_ICONS[category] || FEEDBACK_ICONS.info}</span>` +
            `<span class="feedback-text"></span>`;
        item.querySelector('.feedback-text').textContent = text;

        stack.appendChild(item);
        enhanceFeedbackItem(item);
        return item;
    }

    // Kept as the app-wide entry point; ~40 call sites use this name.
    function showAppToast(message, category = 'error') {
        return showFeedback(message, category);
    }

    // XP and level-up feedback is ordinary bottom feedback with a progression
    // accent -- not a separate notification system.
    function showXpToasts(toasts) {
        if (!Array.isArray(toasts) || toasts.length === 0) return;
        toasts.forEach((toast, index) => {
            window.setTimeout(() => {
                const item = showFeedback(toast.message || '', 'info');
                if (item) {
                    item.classList.add('feedback-xp');
                    if (toast.type === 'level') item.classList.add('feedback-level-up');
                }
            }, index * 160);
        });
    }

    function initLiveStatusBadges() {
        const badges = document.querySelectorAll('[data-live-badge]');
        const notificationFeed = document.querySelector('[data-notifications-feed]');
        if (!badges.length && !notificationFeed) return;

        let lastNotifCount = null;
        let lastMessageCount = null;
        let lastNotificationId = notificationFeed
            ? parseEventId(notificationFeed.dataset.latestNotificationId, 0)
            : null;
        let lastMessageId = null;
        let notificationFeedRefreshing = false;

        const getNotificationSvgIcon = (type) => {
            switch (type) {
                case 'like':
                case 'reel_like':
                case 'comment_like':
                    return '<svg class="notif-svg notif-heart" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
                case 'repost':
                case 'comment_repost':
                    return '<svg class="notif-svg notif-repost" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>';
                case 'comment':
                case 'comment_reply':
                case 'reel_comment':
                    return '<svg class="notif-svg notif-comment" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
                case 'follow':
                    return '<svg class="notif-svg notif-follow" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>';
                case 'friend_request':
                    return '<svg class="notif-svg notif-friend-req" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
                case 'friend_accept':
                    return '<svg class="notif-svg notif-friend-acc" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
                case 'message':
                    return '<svg class="notif-svg notif-message" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
                case 'high_five':
                    return '<svg class="high-five-svg notif-high-five-svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6"/><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>';
                default:
                    return '<svg class="notif-svg notif-bell" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
            }
        };

        const notificationCopy = {
            like: ['notif_like', 'notif_open_post'],
            reel_like: ['notif_reel_like', 'notif_open_clip'],
            repost: ['notif_repost', 'notif_open_post'],
            comment: ['notif_comment', 'notif_open_post'],
            comment_reply: ['notif_comment_reply', 'notif_open_post'],
            comment_like: ['notif_comment_like', 'notif_open_post'],
            comment_repost: ['notif_comment_repost', 'notif_open_post'],
            reel_comment: ['notif_reel_comment', 'notif_open_clip'],
            follow: ['notif_follow', 'notif_open_profile'],
            friend_request: ['notif_friend_request', 'notif_open_profile'],
            friend_accept: ['notif_friend_accept', 'notif_open_profile'],
            message: ['notif_message', 'notif_open_message'],
            high_five: ['notif_high_five', 'notif_open_profile'],
        };

        function parseEventId(value, fallback = null) {
            const parsed = Number(value);
            return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
        }

        const formatCount = (count) => {
            const safeCount = Number.isFinite(Number(count)) ? Math.max(0, Number(count)) : 0;
            return safeCount > 99 ? '99+' : String(safeCount);
        };

        const updateBadgeGroup = (name, count) => {
            const safeCount = Number.isFinite(Number(count)) ? Math.max(0, Number(count)) : 0;

            document.querySelectorAll(`[data-live-badge="${name}"]`).forEach((badge) => {
                badge.hidden = safeCount <= 0;
                badge.textContent = formatCount(safeCount);
                const unreadKey = name === 'messages' ? 'unread_messages' : (name === 'notifications' ? 'unread_notifications' : 'unread_more');
                badge.setAttribute('aria-label', `${safeCount} ${translateUi(unreadKey, `unread ${name}`)}`);
            });
        };

        const notificationUrl = (notification) => {
            if (notification.post_id) return `/post/${encodeURIComponent(String(notification.post_id))}`;
            if (notification.reel_id) return notification.reel_url || `/clips#reel-${encodeURIComponent(String(notification.reel_id))}`;
            if (notification.type === 'message') return notification.message_url || (notification.actor_username ? `/messages?u=${encodeURIComponent(notification.actor_username)}` : '/messages');
            if (notification.actor_username) return `/profile/${encodeURIComponent(notification.actor_username)}`;
            return '';
        };

        const notificationTime = (value) => {
            const created = new Date(value);
            if (Number.isNaN(created.getTime())) return translateUi('notif_just_now', 'just now');
            const seconds = Math.max(0, Math.floor((Date.now() - created.getTime()) / 1000));
            if (seconds < 60) return translateUi('notif_just_now', 'just now');
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h`;
            return created.toLocaleDateString([], { month: 'short', day: 'numeric' });
        };

        const renderNotificationItem = (notification) => {
            const info = notificationCopy[notification.type] || ['notif_update', 'open_btn'];
            const actorUsername = notification.actor_username || '';
            const actorName = notification.actor_summary || notification.actor_name || translateUi('notif_someone', 'Someone');
            const actorAvatar = notification.actor_avatar || '/static/assets/default-male-avatar.svg';
            const actionUrl = notificationUrl(notification);
            const article = document.createElement('article');
            article.className = `notification-item ${notification.is_read ? '' : 'unread'} new-notification`.trim();
            article.dataset.notificationId = String(notification.id || '');
            const iconSvg = getNotificationSvgIcon(notification.type);
            article.innerHTML = `
                <div class="notification-avatar-container">
                    <a href="${actorUsername ? `/profile/${encodeURIComponent(actorUsername)}` : '#'}" class="actor-avatar-link">
                        <img class="avatar notif-actor-avatar" src="${escapeHTML(actorAvatar)}" alt="${escapeHTML(actorName)}" />
                    </a>
                    <div class="notification-icon notif-badge notif-badge-${escapeHTML(notification.type || 'update')} type-${escapeHTML(notification.type || 'update')}" title="${escapeHTML(notification.type || '')}">
                        ${iconSvg}
                    </div>
                </div>
                <div class="notification-body">
                    <div class="notification-header">
                        <a href="${actorUsername ? `/profile/${encodeURIComponent(actorUsername)}` : '#'}" class="actor-link">
                            <strong>${escapeHTML(actorName)}</strong>
                        </a>
                        <span class="notification-text">${escapeHTML(translateUi(info[0], notification.type || 'sent an update'))}</span>
                        <span class="time">· ${escapeHTML(notificationTime(notification.created_at))}</span>
                    </div>
                    ${actionUrl ? `<a href="${escapeHTML(actionUrl)}" class="notification-action notif-pill-action"><span>${escapeHTML(translateUi(info[1], 'Open'))}</span><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a>` : ''}
                </div>
                ${!notification.is_read ? '<div class="notif-unread-indicator" title="Unread"><span class="unread-pulse-ring"></span><span class="unread-pulse-core"></span></div>' : ''}
            `;
            return article;
        };

        const refreshNotificationFeed = async (sinceId) => {
            if (!notificationFeed || notificationFeedRefreshing) return null;
            notificationFeedRefreshing = true;
            try {
                const params = new URLSearchParams({ since_id: String(sinceId || 0), limit: '10' });
                const response = await fetch(`/api/notifications?${params.toString()}`, { headers: { 'Accept': 'application/json' } });
                if (!response.ok) return null;
                const result = await response.json();
                if (!result.success || !Array.isArray(result.notifications)) return result;

                const existingIds = new Set(Array.from(notificationFeed.querySelectorAll('[data-notification-id]')).map((item) => item.dataset.notificationId));
                const freshNotifications = result.notifications.filter((item) => item && item.id && !existingIds.has(String(item.id)));
                if (freshNotifications.length) {
                    const emptyState = notificationFeed.querySelector('[data-notifications-empty]');
                    if (emptyState) emptyState.remove();
                    freshNotifications.slice().reverse().forEach((item) => {
                        notificationFeed.prepend(renderNotificationItem(item));
                    });
                }

                const returnedLatestId = parseEventId(result.latest_notification_id, sinceId || 0);
                const itemLatestId = freshNotifications.reduce((maxId, item) => Math.max(maxId, parseEventId(item.id, 0)), returnedLatestId || 0);
                notificationFeed.dataset.latestNotificationId = String(itemLatestId || 0);
                return result;
            } catch (error) {
                console.error('Notification feed refresh failed:', error);
                return null;
            } finally {
                notificationFeedRefreshing = false;
            }
        };

        const refresh = async () => {
            try {
                const response = await fetch('/api/live-status', { headers: { 'Accept': 'application/json' } });
                if (!response.ok) return;
                const result = await response.json();
                if (!result.success) return;

                const notifCount = Number.isFinite(Number(result.unread_notifications)) ? Math.max(0, Number(result.unread_notifications)) : 0;
                const messageCount = Number.isFinite(Number(result.unread_messages)) ? Math.max(0, Number(result.unread_messages)) : 0;
                const currentNotificationId = parseEventId(result.latest_notification_id);
                const currentMessageId = parseEventId(result.latest_message_id);
                const hasNewNotificationId = lastNotificationId !== null && currentNotificationId !== null && currentNotificationId > lastNotificationId;
                const hasNewMessageId = lastMessageId !== null && currentMessageId !== null && currentMessageId > lastMessageId;

                if ((hasNewNotificationId || (lastNotifCount !== null && notifCount > lastNotifCount))) {
                    SoundEffects.play('notification');
                }
                if ((hasNewMessageId || (lastMessageCount !== null && messageCount > lastMessageCount))) {
                    SoundEffects.play('message');
                }

                const previousNotificationId = lastNotificationId;
                if (currentMessageId !== null) {
                    lastMessageId = Math.max(lastMessageId || 0, currentMessageId);
                }

                if (hasNewNotificationId && notificationFeed) {
                    const feedResult = await refreshNotificationFeed(previousNotificationId || 0);
                    if (feedResult && feedResult.success && currentNotificationId !== null) {
                        const feedLatestId = parseEventId(notificationFeed.dataset.latestNotificationId, currentNotificationId);
                        lastNotificationId = Math.max(lastNotificationId || 0, feedLatestId || 0, currentNotificationId);
                    }
                } else if (currentNotificationId !== null) {
                    lastNotificationId = Math.max(lastNotificationId || 0, currentNotificationId);
                }
                if (notificationFeed && lastNotificationId !== null) {
                    notificationFeed.dataset.latestNotificationId = String(lastNotificationId);
                }

                lastNotifCount = notifCount;
                lastMessageCount = messageCount;
                updateBadgeGroup('notifications', notifCount);
                updateBadgeGroup('messages', messageCount);
                updateBadgeGroup('more', notifCount + messageCount);
            } catch (error) {
                console.error('Live status refresh failed:', error);
            }
        };

        refresh();
        startVisiblePolling(refresh, LIVE_STATUS_INTERVAL);
    }

    document.querySelectorAll('[data-post-menu-toggle]').forEach((toggle) => {
        const header = toggle.closest('.post-header');
        const menu = header ? header.querySelector('[data-post-menu]') : null;
        if (!menu) return;

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const opening = menu.hidden;
            document.querySelectorAll('[data-post-menu]').forEach((otherMenu) => {
                if (otherMenu !== menu) otherMenu.hidden = true;
            });
            document.querySelectorAll('[data-post-menu-toggle]').forEach((otherToggle) => {
                if (otherToggle !== toggle) otherToggle.setAttribute('aria-expanded', 'false');
            });
            menu.hidden = !opening;
            toggle.setAttribute('aria-expanded', String(opening));
        });
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-post-menu]') || event.target.closest('[data-post-menu-toggle]')) {
            return;
        }
        document.querySelectorAll('[data-post-menu]').forEach((menu) => {
            menu.hidden = true;
        });
        document.querySelectorAll('[data-post-menu-toggle]').forEach((toggle) => {
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    function initCommunityTimeline() {
        const hub = document.querySelector('[data-community-hub]');
        if (!hub) return;

        const track = hub.querySelector('[data-community-track]');
        const tabs = Array.from(hub.querySelectorAll('[data-community-tab]'));
        const panes = Array.from(hub.querySelectorAll('[data-community-pane]'));
        if (!track || !tabs.length || !panes.length) return;

        hub.classList.add('is-enhanced');
        const tabOrder = tabs.map((tab) => tab.dataset.communityTab).filter(Boolean);

        const setActive = (key, updateHistory = false) => {
            if (!tabOrder.includes(key)) return false;

            hub.dataset.activeTab = key;
            tabs.forEach((tab) => {
                const active = tab.dataset.communityTab === key;
                tab.classList.toggle('active', active);
                if (active) {
                    tab.setAttribute('aria-current', 'page');
                } else {
                    tab.removeAttribute('aria-current');
                }
            });
            panes.forEach((pane) => {
                const active = pane.dataset.communityPane === key;
                pane.classList.toggle('active', active);
                pane.hidden = !active;
            });

            if (updateHistory) {
                const activeTab = tabs.find((tab) => tab.dataset.communityTab === key);
                if (activeTab && activeTab.href) {
                    window.history.replaceState(null, '', activeTab.href);
                }
            }

            return true;
        };

        const activateByOffset = (offset) => {
            const current = hub.dataset.activeTab || tabOrder[0];
            const currentIndex = Math.max(0, tabOrder.indexOf(current));
            const nextIndex = Math.min(tabOrder.length - 1, Math.max(0, currentIndex + offset));
            const nextKey = tabOrder[nextIndex];
            if (nextKey && nextKey !== current) {
                setActive(nextKey, true);
            }
        };

        tabs.forEach((tab) => {
            tab.addEventListener('click', (event) => {
                const key = tab.dataset.communityTab;
                if (!key) return;
                if (setActive(key, true)) {
                    event.preventDefault();
                }
            });
        });

        let pointerStart = null;
        track.addEventListener('pointerdown', (event) => {
            if (event.button !== 0) return;
            if (event.target.closest('a, button, input, textarea, select, label')) return;
            pointerStart = { x: event.clientX, y: event.clientY };
        }, { passive: true });

        track.addEventListener('pointerup', (event) => {
            if (!pointerStart) return;
            const deltaX = event.clientX - pointerStart.x;
            const deltaY = event.clientY - pointerStart.y;
            pointerStart = null;

            if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
            activateByOffset(deltaX < 0 ? 1 : -1);
        }, { passive: true });

        track.addEventListener('pointercancel', () => {
            pointerStart = null;
        }, { passive: true });

        const tabNav = hub.querySelector('.community-timeline-tabs');
        if (tabNav) {
            tabNav.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    activateByOffset(-1);
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    activateByOffset(1);
                }
            });
        }

        const initial = hub.dataset.activeTab || tabs[0].dataset.communityTab;
        setActive(initial, false);
    }

    function initReelsFeed() {
        const feeds = document.querySelectorAll('[data-reels-feed]');
        if (!feeds.length) return;

        feeds.forEach((feed) => {
            const cards = Array.from(feed.querySelectorAll('[data-reel-card]'));
            if (!cards.length) return;

            const viewed = new Set();
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const soundPreferenceKey = 'lvlReelsSoundOn';
            let soundOn = false;
            let activeCard = null;

            try {
                soundOn = window.sessionStorage.getItem(soundPreferenceKey) === '1';
            } catch (error) {
                soundOn = false;
            }

            const saveSoundPreference = () => {
                try {
                    window.sessionStorage.setItem(soundPreferenceKey, soundOn ? '1' : '0');
                } catch (error) {}
            };

            const translateUiLocal = (key, fallback) => {
                if (typeof translateUi === 'function') return translateUi(key, fallback);
                return fallback;
            };

            const updateMuteControl = (button, label, muted) => {
                if (!button) return;
                const labelKey = muted ? 'reel_muted' : 'reel_sound_on';
                const ariaKey = muted ? 'reel_unmute_aria' : 'reel_mute_aria';
                if (label) {
                    label.dataset.i18n = labelKey;
                    label.textContent = translateUiLocal(labelKey, muted ? 'Muted' : 'Sound on');
                }
                button.classList.toggle('active', !muted);
                button.dataset.i18nAria = ariaKey;
                button.setAttribute('aria-label', translateUiLocal(ariaKey, muted ? 'Unmute clips' : 'Mute clips'));
            };

            const applySoundPreference = (card) => {
                const video = card.querySelector('[data-reel-video]');
                const muteButton = card.querySelector('[data-reel-mute]');
                const muteLabel = card.querySelector('[data-reel-mute-icon]');
                if (!video) return;
                video.muted = !soundOn;
                updateMuteControl(muteButton, muteLabel, video.muted);
            };

            const applySoundPreferenceToAll = () => cards.forEach(applySoundPreference);

            const commentsAreOpen = () => document.body.classList.contains('reel-comments-open');

            const updatePlayIcon = (card) => {
                const video = card.querySelector('[data-reel-video]');
                const label = card.querySelector('[data-reel-play-icon]');
                if (!video || !label) return;
                const labelKey = video.paused ? 'reel_play' : 'reel_pause';
                label.dataset.i18n = labelKey;
                label.textContent = translateUiLocal(labelKey, video.paused ? 'Play' : 'Pause');
                card.classList.toggle('is-paused', video.paused);
            };

            const pauseCard = (card) => {
                const video = card.querySelector('[data-reel-video]');
                if (video && !video.paused) video.pause();
                card.classList.remove('active');
                updatePlayIcon(card);
            };

            const markViewed = async (card) => {
                const reelId = card.dataset.reelId;
                const viewUrl = card.dataset.viewUrl;
                if (!reelId || !viewUrl || viewed.has(reelId)) return;
                viewed.add(reelId);
                const token = card.querySelector('input[name="csrf_token"]');
                const formData = new FormData();
                formData.append('ajax', '1');
                if (token) formData.append('csrf_token', token.value);
                try {
                    const response = await fetch(viewUrl, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                    const data = await response.json();
                    if (data && data.success && typeof data.count !== 'undefined') {
                        const countStr = String(data.count);
                        card.querySelectorAll('[data-reel-view-count]').forEach(el => el.textContent = countStr);
                        card.querySelectorAll('[data-reel-view-count-badge]').forEach(el => el.textContent = countStr);
                    }
                } catch (e) {}
            };

            const retryActivePlay = (card, video) => {
                window.setTimeout(() => {
                    if (commentsAreOpen() || card !== activeCard || !video || !video.paused || video.readyState < 2) return;
                    video.play().catch(() => {
                        card.classList.add('is-paused');
                        updatePlayIcon(card);
                    });
                }, 400);
            };

            const activateCard = (card) => {
                if (!card || activeCard === card) return;
                cards.forEach((item) => { if (item !== card) pauseCard(item); });
                activeCard = card;
                card.classList.add('active');
                const video = card.querySelector('[data-reel-video]');
                if (!video) return;
                applySoundPreference(card);
                // load if preload=none
                if (video.readyState === 0) {
                    video.load();
                }
                if (video.paused) {
                    const pp = video.play();
                    if (pp && typeof pp.catch === 'function') {
                        pp.catch(() => {
                            card.classList.add('is-paused');
                            updatePlayIcon(card);
                            retryActivePlay(card, video);
                        });
                    }
                }
                updatePlayIcon(card);
                markViewed(card);
            };

            const scrollToCard = (card) => {
                if (!card) return;
                card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
            };

            const goToOffset = (offset) => {
                if (!activeCard) { scrollToCard(cards[0]); return; }
                const index = cards.indexOf(activeCard);
                const next = cards[Math.max(0, Math.min(cards.length - 1, index + offset))];
                scrollToCard(next);
            };

            // For the main reels page use the feed container as scroll root; for profile use viewport
            const isMainReelsFeed = feed.classList.contains('reels-feed');
            const observerRoot = isMainReelsFeed ? feed : null;
            const observerThreshold = isMainReelsFeed ? 0.5 : 0.3;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= observerThreshold) {
                        activateCard(entry.target);
                    } else if (!entry.isIntersecting) {
                        pauseCard(entry.target);
                    }
                });
            }, { root: observerRoot, threshold: [observerThreshold] });

            cards.forEach((card) => {
                observer.observe(card);
                const video = card.querySelector('[data-reel-video]');
                const playButton = card.querySelector('[data-reel-play]');
                const muteButton = card.querySelector('[data-reel-mute]');
                const muteLabel = card.querySelector('[data-reel-mute-icon]');

                const togglePlay = () => {
                    if (!video) return;
                    if (video.readyState === 0) video.load();
                    if (video.paused) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                    window.setTimeout(() => updatePlayIcon(card), 0);
                };

                if (video) {
                    // The stage stays 9:16 whatever the source is, the way Reels
                    // and TikTok do; .reel-video covers it. It used to reshape
                    // itself to the video, so a landscape clip turned the player
                    // into a wide box that read as a video player, not a clip.

                    let lastTapTime = 0;
                    let singleTapTimer = null;
                    // `.reel-play-toggle` covers the video, so it is what a
                    // click actually lands on; binding the tap logic to the
                    // video alone meant double-tap-to-like never fired on a
                    // pointer device.
                    const tapSurface = card.querySelector('[data-reel-play]') || video;
                    tapSurface.addEventListener('click', (e) => {
                        const currentCommentPanel = card.querySelector('[data-reel-comment-panel]');
                        const currentShareModal = card.querySelector('[data-share-modal]');
                        const commentOpen = (currentCommentPanel && currentCommentPanel.classList.contains('is-open')) || commentsAreOpen();
                        const shareOpen = currentShareModal && (currentShareModal.classList.contains('is-open') || !currentShareModal.hidden);
                        if (commentOpen || shareOpen) {
                            if (currentCommentPanel) {
                                currentCommentPanel.classList.remove('is-open');
                                document.body.classList.remove('reel-comments-open');
                            }
                            if (currentShareModal) {
                                currentShareModal.classList.remove('is-open');
                                window.setTimeout(() => {
                                    if (!currentShareModal.classList.contains('is-open')) {
                                        currentShareModal.setAttribute('hidden', '');
                                    }
                                }, 280);
                            }
                            return;
                        }

                        const currentTime = Date.now();
                        const tapLength = currentTime - lastTapTime;
                        if (tapLength < 300 && tapLength > 0) {
                            clearTimeout(singleTapTimer);
                            const frame = card.querySelector('.reel-video-frame');
                            if (typeof triggerClipDoubleTapBurst === 'function') triggerClipDoubleTapBurst(frame);
                            const likeForm = card.querySelector('[data-reel-like-form]');
                            if (likeForm) {
                                const likeBtn = likeForm.querySelector('button');
                                if (likeBtn) likeBtn.click();
                            }
                            lastTapTime = 0;
                        } else {
                            lastTapTime = currentTime;
                            singleTapTimer = setTimeout(() => { togglePlay(); }, 300);
                        }
                    });

                    video.addEventListener('play', () => updatePlayIcon(card));
                    video.addEventListener('pause', () => updatePlayIcon(card));
                    video.addEventListener('canplay', () => {
                        if (commentsAreOpen() || card !== activeCard || !video.paused) return;
                        video.play().catch(() => {
                            card.classList.add('is-paused');
                            updatePlayIcon(card);
                            retryActivePlay(card, video);
                        });
                    });
                    video.addEventListener('ended', () => {
                        const currentCommentPanel = card.querySelector('[data-reel-comment-panel]');
                        const isCommentOpen = (currentCommentPanel && currentCommentPanel.classList.contains('is-open')) || commentsAreOpen();
                        const currentShareModal = card.querySelector('[data-share-modal]');
                        const isShareOpen = currentShareModal && (currentShareModal.classList.contains('is-open') || !currentShareModal.hidden);
                        const isTyping = document.activeElement && (
                            document.activeElement.tagName === 'INPUT' ||
                            document.activeElement.tagName === 'TEXTAREA' ||
                            document.activeElement.isContentEditable
                        );
                        if (isCommentOpen || isShareOpen || isTyping) {
                            video.currentTime = 0;
                            video.play().catch(() => {});
                            return;
                        }
                        const autoplaySetting = readPreference('autoplay_next_reels', 'true') !== 'false';
                        if (!autoplaySetting) {
                            video.pause();
                            card.classList.add('is-paused');
                            updatePlayIcon(card);
                            return;
                        }
                        const index = cards.indexOf(card);
                        if (index < cards.length - 1) {
                            const nextCard = cards[index + 1];
                            scrollToCard(nextCard);
                            window.setTimeout(() => {
                                if (!commentsAreOpen()) activateCard(nextCard);
                            }, reducedMotion ? 0 : 450);
                        } else {
                            const note = document.querySelector('[data-reels-end]');
                            if (note && !commentsAreOpen()) {
                                note.hidden = false;
                                window.setTimeout(() => { note.hidden = true; }, 1800);
                            }
                            video.pause();
                            card.classList.add('is-paused');
                            updatePlayIcon(card);
                        }
                    });
                }

                // The tap handler above already toggles play on a single tap
                // (and likes on a double tap); a second listener here would
                // toggle twice per click.
                if (video) applySoundPreference(card);
                if (muteButton && video) {
                    muteButton.addEventListener('click', () => {
                        soundOn = video.muted;
                        saveSoundPreference();
                        applySoundPreferenceToAll();
                    });
                }

                // Comment panel toggle
                const commentToggle = card.querySelector('[data-reel-comment-toggle]');
                const commentPanel = card.querySelector('[data-reel-comment-panel]');
                const commentClose = card.querySelector('[data-reel-comment-close]');

                if (commentToggle && commentPanel) {
                    let commentsLoaded = false;

                    const openPanel = async () => {
                        const shareModal = card.querySelector('[data-share-modal]');
                        if (shareModal) {
                            shareModal.classList.remove('is-open');
                            window.setTimeout(() => {
                                if (!shareModal.classList.contains('is-open')) {
                                    shareModal.setAttribute('hidden', '');
                                }
                            }, 280);
                        }
                        commentPanel.classList.add('is-open');
                        document.body.classList.add('reel-comments-open');
                        if (!commentsLoaded) {
                            commentsLoaded = true;
                            await loadReelComments(card, commentPanel, commentToggle);
                        }
                    };

                    const closePanel = () => {
                        commentPanel.classList.remove('is-open');
                        document.body.classList.remove('reel-comments-open');
                    };

                    commentToggle.addEventListener('click', () => {
                        if (commentPanel.classList.contains('is-open')) {
                            closePanel();
                        } else {
                            openPanel();
                        }
                    });

                    if (commentClose) commentClose.addEventListener('click', closePanel);

                    const commentForm = commentPanel.querySelector('[data-reel-comment-form]');
                    if (commentForm) {
                        commentForm.addEventListener('submit', async (event) => {
                            event.preventDefault();
                            const input = commentForm.querySelector('input[name="comment"]');
                            const submitBtn = commentForm.querySelector('button[type="submit"]');
                            if (!input || !input.value.trim()) return;
                            if (commentForm.dataset.submitting === '1') return;
                            if (typeof lockSubmitForm === 'function') lockSubmitForm(commentForm, submitBtn);
                            const formData = new FormData(commentForm);
                            formData.append('ajax', '1');
                            try {
                                const response = await fetch(commentForm.action, {
                                    method: 'POST',
                                    body: formData,
                                    headers: { 'Accept': 'application/json' }
                                });
                                const result = await response.json();
                                if (!result.success) {
                                    if (typeof showAppToast === 'function') showAppToast(result.error || 'Could not post comment.');
                                    return;
                                }
                                const countEl = card.querySelector('[data-reel-comment-count]');
                                if (countEl) countEl.textContent = result.count || '0';
                                const commentData = result.comment || {};
                                commentData._viewerName = commentForm.dataset.viewerName;
                                commentData._viewerUsername = commentForm.dataset.viewerUsername;
                                commentData._viewerAvatar = commentForm.dataset.viewerAvatar;
                                appendReelComment(commentPanel, commentData, true);
                                input.value = '';
                                if (typeof showXpToasts === 'function') showXpToasts(result.xp_toasts || []);
                            } catch (error) {
                                console.error('Could not post reel comment:', error);
                                if (typeof showAppToast === 'function') showAppToast(translateUiLocal('comment_post_error', 'Comment did not post. Try again.'));
                            } finally {
                                if (typeof unlockSubmitForm === 'function') unlockSubmitForm(commentForm, submitBtn);
                            }
                        });
                    }
                }

                // More options dropdown toggle
                const moreToggle = card.querySelector('[data-reel-more-toggle]');
                const moreMenu = card.querySelector('[data-reel-more-menu]');
                const moreDropdown = card.querySelector('[data-reel-more-dropdown]');
                if (moreToggle && moreMenu) {
                    moreToggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isClosed = moreMenu.hidden || moreMenu.hasAttribute('hidden');
                        document.querySelectorAll('[data-reel-more-menu]').forEach(m => {
                            m.hidden = true;
                            m.setAttribute('hidden', '');
                        });
                        document.querySelectorAll('[data-reel-more-dropdown]').forEach(d => d.classList.remove('is-open'));
                        if (isClosed) {
                            moreMenu.hidden = false;
                            moreMenu.removeAttribute('hidden');
                            if (moreDropdown) moreDropdown.classList.add('is-open');
                        }
                    });
                    moreMenu.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }

                // Copy link in more menu with glamour feedback
                const copyLinkBtn = card.querySelector('[data-reel-copy-link]');
                if (copyLinkBtn) {
                    copyLinkBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const link = copyLinkBtn.dataset.link || window.location.href;
                        const span = copyLinkBtn.querySelector('span');
                        const origText = span ? span.textContent : '';
                        try {
                            await navigator.clipboard.writeText(link);
                            if (span) {
                                span.textContent = translateUi('copied', 'Copied');
                                copyLinkBtn.classList.add('is-copied');
                            }
                            if (typeof showAppToast === 'function') {
                                showAppToast(translateUi('link_copied', 'Link copied to clipboard.'), 'success');
                            }
                            setTimeout(() => {
                                if (span) span.textContent = origText;
                                copyLinkBtn.style.color = '';
                                if (moreMenu) moreMenu.hidden = true;
                                if (moreDropdown) moreDropdown.classList.remove('is-open');
                            }, 900);
                        } catch (err) {
                            prompt('Klip bağlantısı:', link);
                            if (moreMenu) moreMenu.hidden = true;
                        }
                    });
                }
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('[data-reel-more-dropdown]')) {
                    document.querySelectorAll('[data-reel-more-menu]').forEach(m => m.hidden = true);
                    document.querySelectorAll('[data-reel-more-dropdown]').forEach(d => d.classList.remove('is-open'));
                }
            });

            feed.querySelectorAll('[data-reel-like-form]').forEach((form) => {
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const btn = form.querySelector('button');
                    if (btn && btn.dataset.pending === '1') return;
                    if (btn) { btn.dataset.pending = '1'; /* No disabled – iOS Safari blocks CSS animations on disabled elements */ }
                    const formData = new FormData(form);
                    formData.append('ajax', '1');
                    try {
                        const response = await fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                        const result = await response.json();
                        if (!result.success) {
                            if (typeof showAppToast === 'function') showAppToast(result.error || 'Could not like reel.');
                            return;
                        }
                        applyLikeFeedbackAndStyle(btn, result.liked, result.count);
                        if (typeof showXpToasts === 'function') showXpToasts(result.xp_toasts || []);
                    } catch (error) {
                        console.error('Could not like reel:', error);
                        if (typeof showAppToast === 'function') showAppToast(translateUiLocal('action_failed', 'Action did not finish. Try again.'));
                    } finally {
                        if (btn) { delete btn.dataset.pending; }
                    }
                });
            });

            feed.querySelectorAll('[data-reel-bookmark-form]').forEach((form) => {
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const btn = form.querySelector('button');
                    if (btn && btn.dataset.pending === '1') return;
                    if (btn) { btn.dataset.pending = '1'; }
                    const formData = new FormData(form);
                    formData.append('ajax', '1');
                    try {
                        const response = await fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
                        const result = await response.json();
                        if (!result.success) {
                            if (typeof showAppToast === 'function') showAppToast(result.error || 'Could not bookmark clip.');
                            return;
                        }
                        btn.classList.toggle('active', result.bookmarked);
                        btn.classList.toggle('bookmark-active', result.bookmarked);
                        const svg = btn.querySelector('svg');
                        if (svg) svg.setAttribute('fill', result.bookmarked ? 'currentColor' : 'none');
                        if (result.bookmarked) {
                            if (typeof triggerLvlInteractionFeedback === 'function') triggerLvlInteractionFeedback(btn, 'KAYDEDİLDİ!');
                        }
                    } catch (error) {
                        console.error('Could not bookmark clip:', error);
                        if (typeof showAppToast === 'function') showAppToast(translateUiLocal('action_failed', 'Action did not finish. Try again.'));
                    } finally {
                        if (btn) { delete btn.dataset.pending; }
                    }
                });
            });

            // Keyboard navigation (only for main reels feed)
            if (isMainReelsFeed) {
                document.addEventListener('keydown', (event) => {
                    if (!document.querySelector('[data-reels-feed]')) return;
                    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
                    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
                        event.preventDefault();
                        goToOffset(1);
                    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
                        event.preventDefault();
                        goToOffset(-1);
                    } else if (event.key === ' ') {
                        event.preventDefault();
                        const button = activeCard ? activeCard.querySelector('[data-reel-play]') : null;
                        if (button) button.click();
                    } else if (event.key.toLowerCase() === 'm') {
                        const button = activeCard ? activeCard.querySelector('[data-reel-mute]') : null;
                        if (button) button.click();
                    }
                });
            }

            // Auto-activate first card in viewport
            window.requestAnimationFrame(() => {
                let targetCard = cards[0];
                if (isMainReelsFeed && window.location.hash) {
                    try {
                        const hashId = window.location.hash.substring(1);
                        const hashCard = feed.querySelector('#' + hashId) || feed.querySelector('[data-reel-id="' + hashId.replace('reel-', '') + '"]');
                        if (hashCard) targetCard = hashCard.closest('[data-reel-card]') || hashCard;
                    } catch (e) {}
                }
                activateCard(targetCard);
            });
        }); // end feeds.forEach
    }

    async function loadReelComments(card, panel, toggleBtn) {
        const listEl = panel.querySelector('[data-reel-comment-list]');
        if (!listEl) return;
        const url = toggleBtn.dataset.commentsUrl;
        if (!url) {
            listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(translateUi('reel_comments_unavailable', 'Comments are not available.'))}</p>`;
            return;
        }
        listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(translateUi('reel_loading_comments', 'Loading comments…'))}</p>`;
        try {
            const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
            const result = await response.json();
            listEl.innerHTML = '';
            if (!result.success) {
                listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(result.error || translateUi('reel_comments_load_error', 'Could not load comments.'))}</p>`;
                return;
            }
            if (!result.comments || result.comments.length === 0) {
                listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(translateUi('reel_comments_empty', 'No comments yet. Be the first!'))}</p>`;
                return;
            }
            result.comments.forEach((comment) => appendReelComment(panel, comment, false));
            listEl.scrollTop = listEl.scrollHeight;
        } catch (error) {
            console.error('Could not load reel comments:', error);
            listEl.innerHTML = `<p class="reel-comment-empty">${escapeHTML(translateUi('reel_comments_load_error', 'Could not load comments.'))}</p>`;
        }
    }

    function appendReelComment(panel, comment, scrollToBottom) {
        const listEl = panel.querySelector('[data-reel-comment-list]');
        if (!listEl) return;
        const empty = listEl.querySelector('.reel-comment-empty');
        if (empty) empty.remove();
        const user = comment.user || {};
        const avatarSrc = user.profile_photo_url || comment._viewerAvatar || '/static/assets/default-male-avatar.svg';
        const displayName = escapeHTML(user.display_name || comment._viewerName || user.username || 'User');
        const username = escapeHTML(user.username || comment._viewerUsername || '');
        const text = escapeHTML(comment.comment || '');
        const time = comment.created_at ? new Date(comment.created_at).toLocaleDateString() : '';
        const item = document.createElement('div');
        item.className = 'reel-comment-item';
        item.innerHTML = `
            <img class="avatar reel-comment-avatar" src="${escapeHTML(avatarSrc)}" alt="">
            <div class="reel-comment-body">
                <span class="reel-comment-author">${displayName}</span>
                <span class="reel-comment-handle">@${username}</span>
                <p class="reel-comment-text">${text}</p>
                ${time ? `<time class="reel-comment-time">${time}</time>` : ''}
            </div>
        `;
        listEl.appendChild(item);
        if (scrollToBottom) listEl.scrollTop = listEl.scrollHeight;
    }

    function initProfileAvatarModal() {
        const btn = document.querySelector('[data-profile-avatar-open]');
        if (!btn) return;
        const img = btn.querySelector('img');
        if (!img || !img.src) return;

        btn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'avatar-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-label', translateUi('profile_picture', 'Profile picture'));
            modal.innerHTML = `
                <button class="avatar-modal-close" aria-label="${escapeHTML(translateUi('nav_close', 'Close'))}">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
                <img src="${escapeHTML(img.src)}" alt="${escapeHTML(translateUi('profile_picture', 'Profile picture'))}">
            `;
            document.body.appendChild(modal);
            window.requestAnimationFrame(() => modal.classList.add('is-open'));

            const closeModal = () => {
                modal.classList.remove('is-open');
                window.setTimeout(() => modal.remove(), 220);
            };

            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.avatar-modal-close')) closeModal();
            });

            const keyHandler = (e) => {
                if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', keyHandler); }
            };
            document.addEventListener('keydown', keyHandler);
        });
    }

    function initReelUploadPreview() {
        const form = document.querySelector('[data-reel-upload-form]');
        if (!form) return;

        const input = form.querySelector('[data-reel-video-input]');
        const preview = form.querySelector('[data-reel-preview]');
        const previewVideo = preview ? preview.querySelector('video') : null;
        const submit = form.querySelector('[data-reel-submit]');
        const message = form.querySelector('[data-reel-upload-message]');
        const label = form.querySelector('[data-reel-file-label]');
        const caption = form.querySelector('textarea[name="caption"]');
        const captionCount = form.querySelector('[data-reel-caption-count]');
        const visibility = form.querySelector('[data-reel-visibility]');
        const communityField = form.querySelector('[data-reel-community-field]');
        const communitySelect = form.querySelector('select[name="community_id"]');
        const csrfTokenInput = form.querySelector('input[name="csrf_token"]');
        const allowComments = form.querySelector('input[name="allow_comments"]');
        const allowDownloads = form.querySelector('input[name="allow_downloads"]');
        const autoplayNext = form.querySelector('input[name="autoplay_next"]');
        const maxBytes = parseInt(form.dataset.maxVideoBytes || '0', 10);
        const uploadEndpoint = form.dataset.uploadUrl;
        const completeEndpoint = form.dataset.completeUrl;
        const allowedTypes = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']);
        let previewUrl = null;
        const defaultSubmitText = submit ? submit.textContent : '';

        const setMessage = (text, isError = false, i18nKey = '') => {
            if (!message) return;
            if (i18nKey) message.dataset.i18n = i18nKey;
            else delete message.dataset.i18n;
            message.textContent = text || '';
            message.classList.toggle('error', isError);
        };

        const clearPreview = () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            previewUrl = null;
            if (previewVideo) previewVideo.removeAttribute('src');
            if (preview) preview.hidden = true;
        };

        const validateVideo = () => {
            clearPreview();
            const file = input && input.files ? input.files[0] : null;
            if (!file) {
                if (submit) submit.disabled = true;
                if (label) {
                    label.dataset.i18n = 'reel_choose_video';
                    label.textContent = translateUi('reel_choose_video', 'Choose video');
                }
                setMessage('');
                return;
            }
            if (label) {
                delete label.dataset.i18n;
                label.textContent = file.name || translateUi('reel_video_selected', 'Video selected');
            }
            if (maxBytes && file.size > maxBytes) {
                if (submit) submit.disabled = true;
                setMessage(translateUi('reel_video_too_large', 'This video is larger than the configured upload limit.'), true, 'reel_video_too_large');
                return;
            }
            if (file.type && !allowedTypes.has(file.type)) {
                if (submit) submit.disabled = true;
                setMessage(translateUi('reel_video_type_error', 'Choose an MP4, WebM, MOV, or M4V video.'), true, 'reel_video_type_error');
                return;
            }
            previewUrl = URL.createObjectURL(file);
            if (previewVideo) {
                previewVideo.src = previewUrl;
                previewVideo.load();
            }
            if (preview) preview.hidden = false;
            if (submit) submit.disabled = false;
            setMessage(translateUi('reel_ready_upload', 'Ready to upload.'), false, 'reel_ready_upload');
        };

        if (input) input.addEventListener('change', validateVideo);
        if (caption && captionCount) {
            caption.addEventListener('input', () => {
                captionCount.textContent = String(Math.max(0, 220 - caption.value.length));
            });
        }
        if (visibility && communityField) {
            const toggleCommunity = () => {
                communityField.hidden = visibility.value !== 'community';
            };
            visibility.addEventListener('change', toggleCommunity);
            toggleCommunity();
        }

        const postUploadJson = async (url, payload) => {
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            if (csrfTokenInput && csrfTokenInput.value) {
                headers['X-CSRF-Token'] = csrfTokenInput.value;
            }
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            let data = {};
            try {
                data = await response.json();
            } catch (_error) {
                data = {};
            }
            if (!response.ok || data.success === false) {
                throw new Error(data.error || 'Could not upload that video.');
            }
            return data;
        };

        const uploadDirectly = async (file) => {
            if (submit) submit.textContent = 'Preparing...';
            setMessage('Preparing secure upload...');
            const prepared = await postUploadJson(uploadEndpoint, {
                filename: file.name,
                content_type: file.type || 'application/octet-stream',
                size: file.size
            });

            if (submit) submit.textContent = 'Uploading...';
            setMessage('Uploading video...');
            const uploadBody = new FormData();
            uploadBody.append('file', file, file.name);
            const uploadResponse = await fetch(prepared.upload_url, {
                method: 'PUT',
                body: uploadBody
            });
            if (!uploadResponse.ok) {
                throw new Error('Video upload failed before it reached LvL.');
            }

            if (submit) submit.textContent = 'Saving...';
            setMessage('Saving clip...');
            const completed = await postUploadJson(completeEndpoint, {
                storage_path: prepared.storage_path,
                caption: caption ? caption.value : '',
                visibility: visibility ? visibility.value : 'public',
                community_id: communitySelect ? communitySelect.value : '',
                allow_comments: !!(allowComments && allowComments.checked),
                allow_downloads: !!(allowDownloads && allowDownloads.checked),
                autoplay_next: !!(autoplayNext && autoplayNext.checked)
            });
            window.location.assign(completed.redirect_url || '/clips');
        };

        form.addEventListener('submit', async (event) => {
            if (submit && submit.disabled) {
                event.preventDefault();
                return;
            }
            const file = input && input.files ? input.files[0] : null;
            if (file && uploadEndpoint && completeEndpoint && window.fetch && window.FormData) {
                event.preventDefault();
                if (!lockSubmitForm(form, submit)) return;
                try {
                    await uploadDirectly(file);
                } catch (error) {
                    unlockSubmitForm(form, submit);
                    if (submit) submit.textContent = defaultSubmitText;
                    setMessage(error.message || 'Could not upload that video.', true);
                }
                return;
            }
            if (!lockSubmitForm(form, submit)) {
                event.preventDefault();
            }
        });
    }

    // --- Side clip rail autoplay -------------------------------------------
    //
    // One IntersectionObserver system, not two. Rules:
    //   * a slide that is meaningfully visible plays, muted
    //   * leaving the viewport pauses it
    //   * only one preview video plays at a time, app-wide
    //   * nothing preloads until it is about to play
    //   * a hidden tab pauses; returning resumes if still visible
    // Manual play/pause and mute/unmute always win over autoplay.

    let activePreviewVideo = null;

    function stopOtherPreviewVideos(video) {
        if (activePreviewVideo && activePreviewVideo !== video && !activePreviewVideo.paused) {
            activePreviewVideo.pause();
        }
        activePreviewVideo = video || null;
    }

    function playPreviewMuted(video) {
        if (!video) return;
        // Browsers only allow unattended playback while muted.
        if (!video.dataset.userUnmuted) video.muted = true;
        video.playsInline = true;
        if (video.preload === 'none') video.preload = 'metadata';
        stopOtherPreviewVideos(video);
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    }

    // --- Popovers ----------------------------------------------------------
    //
    // One controller for the account menu, the messages panel and the
    // notifications panel. Each is positioned from its trigger's bounding box
    // (the surface is position: fixed), so it is never clipped by the left
    // rail's own scroll container and behaves the same whether the rail is
    // expanded or collapsed.
    //
    // Exactly one popover is open at a time. Escape and an outside click close
    // it, and focus returns to the trigger.

    const POPOVER_GAP = 8;
    let openPopover = null;

    function positionPopover(popover, trigger, placement) {
        const t = trigger.getBoundingClientRect();
        const margin = 12;

        // Measure while laid out but not yet painted in.
        const wasHidden = popover.hidden;
        if (wasHidden) {
            popover.style.visibility = 'hidden';
            popover.hidden = false;
        }
        const p = popover.getBoundingClientRect();
        popover.style.visibility = '';

        let left;
        let top;

        if (placement === 'below-end') {
            // Notifications bell: hangs below, right edge aligned to the trigger.
            top = t.bottom + POPOVER_GAP;
            left = document.dir === 'rtl' ? t.left : t.right - p.width;
            popover.style.transformOrigin = 'top right';
        } else {
            // Rail popovers: sit beside the rail, bottom aligned to the trigger.
            top = Math.min(t.bottom, window.innerHeight - margin) - p.height;
            left = document.dir === 'rtl' ? t.left - p.width - POPOVER_GAP : t.right + POPOVER_GAP;
            popover.style.transformOrigin = 'bottom left';
        }

        left = Math.max(margin, Math.min(left, window.innerWidth - p.width - margin));
        top = Math.max(margin, Math.min(top, window.innerHeight - p.height - margin));

        popover.style.left = `${Math.round(left)}px`;
        popover.style.top = `${Math.round(top)}px`;
    }

    function closePopover(immediate) {
        if (!openPopover) return;
        const { popover, trigger } = openPopover;
        openPopover = null;
        trigger.setAttribute('aria-expanded', 'false');
        popover.classList.remove('is-open');
        document.dispatchEvent(new CustomEvent('lvl:popover', { detail: { trigger, popover, open: false } }));
        if (immediate) {
            popover.hidden = true;
        } else {
            window.setTimeout(() => {
                if (!popover.classList.contains('is-open')) popover.hidden = true;
            }, 160);
        }
    }

    function openPopoverFor(trigger, popover, placement, onOpen) {
        if (openPopover && openPopover.popover === popover) {
            closePopover();
            return;
        }
        closePopover(true);

        positionPopover(popover, trigger, placement);
        trigger.setAttribute('aria-expanded', 'true');
        openPopover = { popover, trigger, placement };
        document.dispatchEvent(new CustomEvent('lvl:popover', { detail: { trigger, popover, open: true } }));
        // Only animate in if this popover is still the open one; a scroll or
        // resize between frames must not leave `is-open` on a hidden element.
        window.requestAnimationFrame(() => {
            if (openPopover && openPopover.popover === popover) popover.classList.add('is-open');
        });

        if (typeof onOpen === 'function') onOpen(popover);

        const focusable = popover.querySelector('a, button, [tabindex]');
        if (focusable) focusable.focus({ preventScroll: true });
    }

    function initPopover(triggerSelector, popoverSelector, placement, onOpen) {
        const trigger = document.querySelector(triggerSelector);
        const popover = document.querySelector(popoverSelector);
        if (!trigger || !popover) return;

        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            openPopoverFor(trigger, popover, placement, onOpen);
        });
    }

    function initPopovers() {
        initPopover('[data-account-trigger]', '[data-account-menu]', 'rail');
        initPopover('[data-notifications-trigger]', '[data-notifications-popover]', 'below-end', loadNotificationsPopover);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && openPopover) {
                const { trigger } = openPopover;
                closePopover();
                trigger.focus({ preventScroll: true });
            }
        });

        document.addEventListener('click', (event) => {
            if (!openPopover) return;
            if (openPopover.popover.contains(event.target)) return;
            if (openPopover.trigger.contains(event.target)) return;
            closePopover();
        });

        // A popover is anchored to its trigger, so follow the trigger rather
        // than closing -- clicking a trigger can itself scroll the page, and
        // closing on that would shut the popover the moment it opened.
        const reanchor = () => {
            if (!openPopover) return;
            positionPopover(openPopover.popover, openPopover.trigger, openPopover.placement);
        };
        window.addEventListener('resize', reanchor);
        window.addEventListener('scroll', reanchor, { passive: true, capture: true });
    }

    // The CSRF token lives in a meta tag so any script can post without
    // borrowing a hidden input from whatever form happens to be rendered.
    function csrfToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') || '' : '';
    }

    function setNotificationsBadge(count) {
        const safe = Math.max(0, Number(count) || 0);
        document.querySelectorAll('[data-live-badge="notifications"]').forEach((badge) => {
            badge.hidden = safe <= 0;
            badge.textContent = safe > 99 ? '99+' : String(safe);
        });
        document.querySelectorAll('.mobile-header-unread-dot').forEach((dot) => {
            if (safe <= 0) dot.remove();
        });
    }

    function markAllNotificationsRead(button) {
        const body = new URLSearchParams({ ajax: '1', csrf_token: csrfToken() });
        if (button) button.disabled = true;

        return fetch('/mark_notifications_read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': csrfToken(),
            },
            body: body.toString(),
        })
            .then((res) => res.json())
            .then((result) => {
                if (!result || !result.success) throw new Error('failed');
                setNotificationsBadge(result.unread_notifications || 0);
                document.querySelectorAll('.popover-row.is-unread, .notification-item.unread')
                    .forEach((row) => row.classList.remove('is-unread', 'unread'));
                document.querySelectorAll('.notif-unread-indicator').forEach((dot) => dot.remove());
                showFeedback(translateUi('notif_marked_read', 'All alerts marked as read.'), 'success');
                return true;
            })
            .catch(() => {
                if (button) button.disabled = false;
                showAppToast(translateUi('action_failed', 'Something went wrong.'), 'error');
                return false;
            });
    }

    function initMarkAllRead() {
        document.addEventListener('click', (event) => {
            const button = event.target.closest('[data-mark-all-read]');
            if (!button) return;
            event.preventDefault();
            markAllNotificationsRead(button);
        });

        // The Alerts page keeps its plain form for no-JS use; with JS it stops
        // reloading the page.
        document.querySelectorAll('.notif-mark-read-form').forEach((form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const button = form.querySelector('button');
                markAllNotificationsRead(button).then((ok) => {
                    if (ok) form.querySelectorAll('button').forEach((el) => { el.disabled = true; });
                });
            });
        });
    }

    function popoverMessage(popover, listSelector, key, fallback) {
        const list = popover.querySelector(listSelector);
        if (list) list.innerHTML = `<p class="popover-empty">${escapeHTML(translateUi(key, fallback))}</p>`;
    }

    /* --- Message dock ---------------------------------------------------- */
    /* A pill, a conversation list and a small chat window at the bottom
       right. The full /messages page stays canonical; this is the quick
       surface, so it only ever holds one open thread. */

    const DOCK_POLL_MS = 12000;

    function initMessageDock() {
        const dock = document.querySelector('[data-msg-dock]');
        if (!dock) return;

        const panel = dock.querySelector('[data-msg-dock-panel]');
        const chat = dock.querySelector('[data-msg-dock-chat]');
        const list = dock.querySelector('[data-msg-dock-list]');
        const log = dock.querySelector('[data-msg-chat-log]');
        const form = dock.querySelector('[data-msg-chat-form]');
        const input = dock.querySelector('[data-msg-chat-input]');
        const receiver = dock.querySelector('[data-msg-chat-receiver]');
        const pill = dock.querySelector('.msg-dock-pill');
        if (!panel || !chat || !list) return;

        let openThread = null;   // { username, display_name, avatar, id }
        let lastMessageId = 0;
        let stopPolling = null;

        const show = (element) => {
            element.hidden = false;
            window.requestAnimationFrame(() => element.classList.add('is-open'));
        };

        const hide = (element) => {
            element.classList.remove('is-open');
            window.setTimeout(() => {
                if (!element.classList.contains('is-open')) element.hidden = true;
            }, 180);
        };

        const setExpanded = (expanded) => {
            dock.querySelectorAll('[data-msg-dock-toggle]').forEach((trigger) => {
                trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
            document.querySelectorAll('[data-msg-dock-toggle]').forEach((trigger) => {
                trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
        };

        const stopThreadPolling = () => {
            if (stopPolling) stopPolling();
            stopPolling = null;
        };

        const closeAll = () => {
            stopThreadPolling();
            openThread = null;
            hide(panel);
            hide(chat);
            setExpanded(false);
            if (pill) pill.hidden = false;
        };

        const openList = () => {
            stopThreadPolling();
            openThread = null;
            hide(chat);
            show(panel);
            setExpanded(true);
            if (pill) pill.hidden = true;
            loadConversationList();
        };

        function loadConversationList() {
            list.innerHTML = `<p class="popover-loading">${escapeHTML(translateUi('loading', 'Loading…'))}</p>`;
            fetch('/api/conversations?limit=12', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then((res) => res.json())
                .then((result) => {
                    const rows = Array.isArray(result.conversations) ? result.conversations : [];
                    if (!result.success || !rows.length) {
                        list.innerHTML = `<p class="msg-dock-empty">${escapeHTML(translateUi('messages_empty', 'No conversations yet.'))}</p>`;
                        return;
                    }
                    list.replaceChildren(...rows.map(conversationRow));
                })
                .catch(() => {
                    list.innerHTML = `<p class="msg-dock-error">${escapeHTML(translateUi('action_failed', 'Could not load messages.'))}</p>`;
                });
        }

        function conversationRow(row) {
            const link = document.createElement('a');
            link.className = `popover-row${row.unread_count ? ' is-unread' : ''}`;
            link.href = row.url;
            link.innerHTML =
                `<img class="popover-row-avatar" src="${escapeHTML(row.avatar || '')}" alt="" aria-hidden="true">` +
                '<span class="popover-row-body">' +
                '<span class="popover-row-title"><span class="popover-row-name"></span></span>' +
                '<span class="popover-row-text"></span></span>' +
                (row.unread_count ? '<span class="popover-row-dot" aria-hidden="true"></span>' : '');
            link.querySelector('.popover-row-name').textContent = row.display_name || row.username;
            link.querySelector('.popover-row-text').textContent = row.last_message || '';
            link.addEventListener('click', (event) => {
                event.preventDefault();
                openConversation(row);
            });
            return link;
        }

        function openConversation(row) {
            openThread = row;
            lastMessageId = 0;
            hide(panel);
            show(chat);
            setExpanded(true);
            if (pill) pill.hidden = true;

            const avatar = dock.querySelector('[data-msg-chat-avatar]');
            const name = dock.querySelector('[data-msg-chat-name]');
            const peer = dock.querySelector('[data-msg-chat-peer]');
            const expand = dock.querySelector('[data-msg-chat-expand]');
            if (avatar && row.avatar) avatar.src = row.avatar;
            if (name) name.textContent = row.display_name || row.username;
            if (peer) peer.href = `/profile/${encodeURIComponent(row.username)}`;
            if (expand) expand.href = row.url || `/messages?u=${encodeURIComponent(row.username)}`;
            if (receiver) receiver.value = row.id || '';

            log.innerHTML = `<p class="popover-loading">${escapeHTML(translateUi('loading', 'Loading…'))}</p>`;
            loadThread(true);
            stopThreadPolling();
            stopPolling = startVisiblePolling(() => loadThread(false), DOCK_POLL_MS);
            if (input) window.setTimeout(() => input.focus(), 220);
        }

        function loadThread(replace) {
            if (!openThread) return;
            const query = replace ? '' : `&since_id=${lastMessageId}`;
            fetch(`/api/messages/${encodeURIComponent(openThread.username)}?limit=30${query}`,
                  { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then((res) => res.json())
                .then((result) => {
                    if (!result.success) throw new Error('failed');
                    const rows = Array.isArray(result.messages) ? result.messages : [];
                    if (replace) {
                        log.replaceChildren();
                        if (!rows.length) {
                            log.innerHTML = `<p class="msg-dock-empty">${escapeHTML(translateUi('msg_dock_start', 'Say hello.'))}</p>`;
                        }
                    }
                    rows.forEach((message) => appendBubble(message, result.viewer_id));
                    if (rows.length) scrollLogToEnd();
                })
                .catch(() => {
                    if (replace) log.innerHTML = `<p class="msg-dock-error">${escapeHTML(translateUi('action_failed', 'Could not load messages.'))}</p>`;
                });
        }

        function sharedCard(message) {
            // A shared clip or post is a card, not a pasted link -- the same
            // card the Messages page renders, so both surfaces match.
            const reel = message.shared_reel;
            const post = message.shared_post;
            if (!reel && !post) return null;

            const card = document.createElement('div');
            const author = (reel || post).user || {};
            const avatar = escapeHTML(author.profile_photo_url || '/static/assets/default-male-avatar.svg');
            const name = escapeHTML(author.display_name || author.username || '');

            if (reel) {
                card.className = 'shared-reel-card msg-dock-shared';
                card.innerHTML =
                    `<a class="shared-reel-link" href="/clips#reel-${escapeHTML(String(reel.id))}">` +
                    `<video class="shared-reel-video" src="${escapeHTML(reel.video_url || '')}" preload="metadata" muted playsinline loop></video>` +
                    `<div class="shared-reel-author"><img class="shared-reel-avatar" src="${avatar}" alt=""><span>${name}</span></div>` +
                    '<div class="shared-reel-play"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>' +
                    (reel.caption ? `<div class="shared-reel-caption">${escapeHTML(reel.caption)}</div>` : '') +
                    '</a>';
                const video = card.querySelector('video');
                card.addEventListener('mouseenter', () => { if (video) video.play().catch(() => {}); });
                card.addEventListener('mouseleave', () => { if (video) video.pause(); });
                return card;
            }

            card.className = 'shared-post-card msg-dock-shared';
            card.innerHTML =
                `<a class="shared-post-link" href="/post/${escapeHTML(String(post.id))}">` +
                `<div class="shared-post-author-row"><img class="shared-post-avatar" src="${avatar}" alt=""><strong>${name}</strong></div>` +
                (post.content ? `<p class="shared-post-content">${escapeHTML(post.content)}</p>` : '') +
                (post.image_url ? `<img class="shared-post-image" src="${escapeHTML(post.image_url)}" alt="" loading="lazy">` : '') +
                '</a>';
            return card;
        }

        function appendBubble(message, viewerId) {
            const id = Number(message.id) || 0;
            if (id && id <= lastMessageId) return;
            if (id) lastMessageId = id;

            const empty = log.querySelector('.msg-dock-empty, .msg-dock-error, .popover-loading');
            if (empty) empty.remove();

            const outgoing = String(message.sender_id) === String(viewerId);
            const card = sharedCard(message);
            if (card) {
                card.classList.add(outgoing ? 'msg-dock-shared-out' : 'msg-dock-shared-in');
                log.appendChild(card);
                return;
            }

            const bubble = document.createElement('div');
            bubble.className = `msg-dock-bubble ${outgoing ? 'msg-dock-bubble-out' : 'msg-dock-bubble-in'}`;
            if (message.content) bubble.textContent = message.content;
            if (message.attachment_url && (message.attachment_type || '').startsWith('image')) {
                const image = document.createElement('img');
                image.src = message.attachment_url;
                image.alt = message.attachment_name || '';
                image.loading = 'lazy';
                bubble.appendChild(image);
            }
            log.appendChild(bubble);
        }

        function scrollLogToEnd() {
            log.scrollTop = log.scrollHeight;
        }

        // --- wiring ---------------------------------------------------------

        document.addEventListener('click', (event) => {
            const toggle = event.target.closest('[data-msg-dock-toggle]');
            if (toggle) {
                event.preventDefault();
                if (!panel.hidden || !chat.hidden) closeAll();
                else openList();
                return;
            }
            if (event.target.closest('[data-msg-dock-close]')) {
                event.preventDefault();
                closeAll();
                return;
            }
            if (event.target.closest('[data-msg-chat-back]')) {
                event.preventDefault();
                openList();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (panel.hidden && chat.hidden) return;
            closeAll();
        });

        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                if (!openThread || !input) return;
                const content = input.value.trim();
                if (!content) return;

                const body = new URLSearchParams(new FormData(form));
                body.set('content', content);
                input.value = '';

                fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': csrfToken(),
                    },
                    body: body.toString(),
                })
                    .then((res) => res.json())
                    .then((result) => {
                        if (!result || !result.success || !result.message) throw new Error('failed');
                        appendBubble(result.message, result.message.sender_id);
                        scrollLogToEnd();
                        if (result.streak_xp) showXpToasts([{ amount: result.streak_xp }]);
                    })
                    .catch(() => {
                        input.value = content;
                        showAppToast(translateUi('action_failed', 'Message could not be sent.'), 'error');
                    });
            });
        }
    }

    function loadNotificationsPopover(popover) {
        const list = popover.querySelector('[data-notifications-list]');
        if (!list) return;
        list.innerHTML = `<p class="popover-loading">${escapeHTML(translateUi('loading', 'Loading…'))}</p>`;

        fetch('/api/notifications?limit=12', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then((res) => res.json())
            .then((result) => {
                const rows = Array.isArray(result.notifications) ? result.notifications : [];
                if (!result.success || !rows.length) {
                    popoverMessage(popover, '[data-notifications-list]', 'notifications_empty', 'Nothing new yet.');
                    return;
                }
                list.replaceChildren(...rows.map((row) => {
                    const link = document.createElement('a');
                    link.className = `popover-row${row.is_read ? '' : ' is-unread'}`;
                    link.href = row.message_url || row.reel_url || (row.post_id ? `/post/${row.post_id}` : `/profile/${row.actor_username || ''}`);
                    link.innerHTML =
                        `<img class="popover-row-avatar" src="${escapeHTML(row.actor_avatar || '')}" alt="" aria-hidden="true">` +
                        `<span class="popover-row-body">` +
                        `<span class="popover-row-title"><span class="popover-row-name"></span></span>` +
                        `<span class="popover-row-text"></span></span>`;
                    link.querySelector('.popover-row-name').textContent = row.actor_name || translateUi('notif_someone', 'Someone');
                    link.querySelector('.popover-row-text').textContent = notificationSummary(row);
                    return link;
                }));
            })
            .catch(() => popoverMessage(popover, '[data-notifications-list]', 'action_failed', 'Could not load alerts.'));
    }

    function notificationSummary(row) {
        const byType = {
            like: translateUi('notif_liked', 'liked your post'),
            reel_like: translateUi('notif_liked_clip', 'liked your clip'),
            comment_like: translateUi('notif_liked_comment', 'liked your reply'),
            comment: translateUi('notif_commented', 'commented on your post'),
            comment_reply: translateUi('notif_replied', 'replied to you'),
            reel_comment: translateUi('notif_commented_clip', 'commented on your clip'),
            repost: translateUi('notif_reposted', 'reposted your post'),
            follow: translateUi('notif_followed', 'started following you'),
            friend_request: translateUi('notif_friend_request', 'sent you a friend request'),
            friend_accept: translateUi('notif_friend_accept', 'accepted your friend request'),
            message: translateUi('notif_messaged', 'sent you a message'),
        };
        return row.content || byType[row.type] || translateUi('notif_update', 'sent an update');
    }

    function initHomeReelPanel() {
        const panel = document.querySelector('[data-home-reel-panel]');
        if (!panel) return;

        const slides = Array.from(panel.querySelectorAll('[data-home-reel-slide]'));
        if (!slides.length) return;

        const slidesContainer = panel.querySelector('[data-home-reel-slides]');
        let current = 0;
        let panelVisible = false;

        const getVideo = (slide) => slide.querySelector('[data-home-reel-video]');

        const pauseSlide = (slide) => {
            const video = slide && getVideo(slide);
            if (video && !video.paused) video.pause();
        };

        const updatePlayState = (slide) => {
            const video = getVideo(slide);
            if (!video) return;
            slide.classList.toggle('is-playing', !video.paused);
        };

        const togglePlayback = (slide) => {
            const video = getVideo(slide);
            if (!video) return;
            if (video.paused) {
                playPreviewMuted(video);
            } else {
                video.pause();
            }
        };

        const activateSlide = (index, options = {}) => {
            const { scroll = false, autoplay = panelVisible } = options;
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === index);
                if (i !== index) pauseSlide(slide);
            });
            current = index;

            const activeSlide = slides[current];
            if (!activeSlide) return;

            if (scroll && slidesContainer) {
                slidesContainer.scrollTo({ top: activeSlide.offsetTop, behavior: 'smooth' });
            }
            if (autoplay) playPreviewMuted(getVideo(activeSlide));
            updatePlayState(activeSlide);
        };

        // Listeners are bound exactly once per slide, here.
        slides.forEach((slide) => {
            const video = getVideo(slide);
            const muteBtn = slide.querySelector('[data-home-reel-mute]');

            if (video) {
                const adjustAspect = () => {
                    const wrap = slide.querySelector('.home-reel-video-wrap');
                    if (!wrap || !video.videoWidth || !video.videoHeight) return;
                    const aspect = video.videoWidth / video.videoHeight;
                    wrap.dataset.aspect = aspect > 1.2 ? 'wide' : (aspect < 0.8 ? 'tall' : 'square');
                };
                if (video.readyState >= 1) adjustAspect();
                else video.addEventListener('loadedmetadata', adjustAspect);

                video.addEventListener('play', () => {
                    stopOtherPreviewVideos(video);
                    updatePlayState(slide);
                });
                video.addEventListener('pause', () => updatePlayState(slide));

                video.addEventListener('ended', () => {
                    const autoplayNext = readPreference('autoplay_next_reels', 'true') !== 'false';
                    const nextIndex = current + 1;
                    if (autoplayNext && nextIndex < slides.length) {
                        activateSlide(nextIndex, { scroll: true, autoplay: true });
                    } else {
                        updatePlayState(slide);
                    }
                });

                video.addEventListener('click', () => togglePlayback(slide));
                video.addEventListener('keydown', (event) => {
                    if (event.key === ' ' || event.key === 'Enter') {
                        event.preventDefault();
                        togglePlayback(slide);
                    }
                });
            }

            if (muteBtn && video) {
                muteBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    video.muted = !video.muted;
                    if (video.muted) delete video.dataset.userUnmuted;
                    else video.dataset.userUnmuted = '1';
                    muteBtn.classList.toggle('active', !video.muted);
                    const muteKey = video.muted ? 'home_unmute_aria' : 'home_mute_aria';
                    muteBtn.dataset.i18nAria = muteKey;
                    muteBtn.setAttribute('aria-label', translateUi(muteKey, video.muted ? 'Unmute' : 'Mute'));
                });
            }
        });

        // Which slide inside the rail is in view.
        if (slidesContainer) {
            const slideObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
                    const index = slides.indexOf(entry.target);
                    if (index >= 0 && index !== current) {
                        activateSlide(index, { autoplay: panelVisible });
                    }
                });
            }, { root: slidesContainer, threshold: [0.55, 0.75] });
            slides.forEach((slide) => slideObserver.observe(slide));
        }

        // Whether the rail itself is on screen at all.
        const panelObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                panelVisible = entry.isIntersecting && entry.intersectionRatio >= 0.3;
                if (panelVisible && !document.hidden) {
                    playPreviewMuted(getVideo(slides[current]));
                } else {
                    pauseSlide(slides[current]);
                }
            });
        }, { threshold: [0, 0.3, 0.6] });
        panelObserver.observe(panel);

        // A background tab should not keep decoding video.
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseSlide(slides[current]);
            } else if (panelVisible) {
                playPreviewMuted(getVideo(slides[current]));
            }
        });

        activateSlide(0, { autoplay: false });
    }

    // Auto-focus composer if URL has compose=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('compose') === '1') {
        const composerTextarea = document.querySelector('.composer textarea');
        if (composerTextarea) {
            composerTextarea.focus();
            // Scroll to top to ensure it's visible
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const MIN_SIGNUP_AGE = 16;

    // --- Registration field feedback ---------------------------------------
    //
    // Inline, progressive and quiet: a field only says something once it has
    // enough to say. The backend re-validates all of this -- these helpers are
    // UX assistance, never the authority.

    function setFieldStatus(node, state, message) {
        if (!node) return;
        node.dataset.state = state || '';
        node.textContent = message || '';
        const field = node.closest('label');
        if (field) {
            field.classList.toggle('has-error', state === 'invalid' || state === 'taken' || state === 'mismatch');
            field.classList.toggle('has-success', state === 'available' || state === 'match');
        }
    }

    function initUsernameAvailability() {
        const inputs = document.querySelectorAll('[data-username-check]');
        if (!inputs.length) return;

        inputs.forEach((input) => {
            const field = input.closest('label') || input.parentElement;
            const status = field ? field.querySelector('[data-username-status]') : null;
            if (!status) return;

            const original = (input.value || '').trim().toLowerCase();
            let timer = null;
            let pending = null;
            let lastQuery = '';

            const check = (value) => {
                if (pending) pending.abort();
                pending = new AbortController();
                setFieldStatus(status, 'checking', translateUi('username_checking', 'Checking availability...'));

                fetch(`/api/username-available?username=${encodeURIComponent(value)}`, {
                    signal: pending.signal,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                })
                    .then((res) => res.json())
                    .then((result) => {
                        if ((input.value || '').trim().toLowerCase() !== value) return;
                        if (result.status === 'invalid') {
                            setFieldStatus(status, 'invalid', translateUi('username_invalid', 'Use 3-24 letters, numbers or underscores.'));
                        } else if (result.status === 'current') {
                            setFieldStatus(status, 'available', translateUi('username_current', 'This is your current username.'));
                        } else if (result.available) {
                            setFieldStatus(status, 'available', translateUi('username_available', 'Username is available.'));
                        } else {
                            setFieldStatus(status, 'taken', translateUi('username_taken', 'That username is taken.'));
                        }
                    })
                    .catch((error) => {
                        if (error && error.name === 'AbortError') return;
                        setFieldStatus(status, '', '');
                    });
            };

            input.addEventListener('input', () => {
                const value = (input.value || '').trim().toLowerCase();
                window.clearTimeout(timer);
                if (pending) { pending.abort(); pending = null; }

                if (!value) { setFieldStatus(status, '', ''); return; }
                if (value === original) {
                    setFieldStatus(status, 'available', translateUi('username_current', 'This is your current username.'));
                    return;
                }
                if (!/^[a-z0-9_]{3,24}$/.test(value)) {
                    // Say nothing until the field could plausibly be valid.
                    setFieldStatus(status, value.length >= 3 ? 'invalid' : '', value.length >= 3
                        ? translateUi('username_invalid', 'Use 3-24 letters, numbers or underscores.')
                        : '');
                    return;
                }
                if (value === lastQuery) return;
                lastQuery = value;
                // Debounced: one request after typing settles, not per keystroke.
                timer = window.setTimeout(() => check(value), 450);
            });
        });
    }

    function initCommunityNameAvailability() {
        const inputs = document.querySelectorAll('[data-community-name-check]');
        if (!inputs.length) return;

        inputs.forEach((input) => {
            const field = input.closest('label') || input.parentElement;
            const status = field ? field.querySelector('[data-community-name-status]') : null;
            if (!status) return;

            // On the edit form the community's own name is not a clash.
            const original = (input.value || '').trim().toLowerCase();
            const excludeId = input.dataset.communityId || '';
            let timer = null;
            let pending = null;
            let lastQuery = '';

            const check = (value) => {
                if (pending) pending.abort();
                pending = new AbortController();
                setFieldStatus(status, 'checking', translateUi('community_name_checking', 'Checking availability...'));

                const params = new URLSearchParams({ name: value });
                if (excludeId) params.set('exclude_id', excludeId);

                fetch(`/api/community-name-available?${params.toString()}`, {
                    signal: pending.signal,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                })
                    .then((res) => res.json())
                    .then((result) => {
                        if ((input.value || '').trim().toLowerCase() !== value) return;
                        if (result.status === 'invalid') {
                            setFieldStatus(status, 'invalid', result.error || translateUi('community_name_invalid', 'That name cannot be used.'));
                        } else if (result.available) {
                            setFieldStatus(status, 'available', translateUi('community_name_available', 'That name is free.'));
                        } else {
                            setFieldStatus(status, 'taken', translateUi('community_name_taken', 'A community already uses that name.'));
                        }
                    })
                    .catch((error) => {
                        if (error && error.name === 'AbortError') return;
                        // The form still checks on submit, and the database is
                        // the authority, so silence is safe here.
                        setFieldStatus(status, '', '');
                    });
            };

            input.addEventListener('input', () => {
                const value = (input.value || '').trim().toLowerCase();
                window.clearTimeout(timer);
                if (pending) { pending.abort(); pending = null; }

                if (!value) { setFieldStatus(status, '', ''); return; }
                if (value === original) {
                    setFieldStatus(status, 'available', translateUi('community_name_current', 'This is the current name.'));
                    return;
                }
                if (value === lastQuery) return;
                lastQuery = value;
                timer = window.setTimeout(() => check(value), 450);
            });
        });
    }

    function initPasswordConfirmation() {
        document.querySelectorAll('[data-password-confirm]').forEach((confirmInput) => {
            const form = confirmInput.closest('form');
            if (!form) return;
            const passwordInput = form.querySelector('[data-password-primary]');
            const confirmField = confirmInput.closest('label') || confirmInput.parentElement;
            const status = confirmField ? confirmField.querySelector('[data-password-status]') : null;
            if (!passwordInput) return;

            const evaluate = (quiet) => {
                const password = passwordInput.value || '';
                const confirmation = confirmInput.value || '';
                if (!confirmation) {
                    if (!quiet) setFieldStatus(status, '', '');
                    return !password;
                }
                if (password !== confirmation) {
                    setFieldStatus(status, 'mismatch', translateUi('password_mismatch', 'Passwords do not match.'));
                    confirmInput.setCustomValidity(translateUi('password_mismatch', 'Passwords do not match.'));
                    return false;
                }
                setFieldStatus(status, 'match', translateUi('password_match', 'Passwords match.'));
                confirmInput.setCustomValidity('');
                return true;
            };

            confirmInput.addEventListener('input', () => evaluate(false));
            passwordInput.addEventListener('input', () => evaluate(true));

            form.addEventListener('submit', (event) => {
                if (!evaluate(false)) {
                    event.preventDefault();
                    confirmInput.focus();
                }
            });
        });
    }

    function initTermsAcceptance() {
        document.querySelectorAll('[data-terms-checkbox]').forEach((checkbox) => {
            const form = checkbox.closest('form');
            if (!form) return;
            // Never pre-select, even if the browser restored the form state.
            checkbox.checked = false;
            form.addEventListener('submit', (event) => {
                if (!checkbox.checked) {
                    event.preventDefault();
                    const row = checkbox.closest('.terms-row');
                    if (row) row.classList.add('has-error');
                    showAppToast(translateUi('terms_required', 'You must accept the Terms & Conditions to create an account.'), 'warning');
                    checkbox.focus();
                }
            });
            checkbox.addEventListener('change', () => {
                const row = checkbox.closest('.terms-row');
                if (row) row.classList.toggle('has-error', !checkbox.checked);
            });
        });
    }

    function initBirthdayValidation() {
        const birthdayInputs = document.querySelectorAll('input[type="date"][name="birthday"]');
        birthdayInputs.forEach(input => {
            const form = input.closest('form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                if (!input.value) return;

                const date = new Date(input.value);
                const today = new Date();
                
                if (date > today) {
                    e.preventDefault();
                    showAppToast(translateUi('birthday_future_error', 'Birthday cannot be in the future.'));
                    return;
                }

                let age = today.getFullYear() - date.getFullYear();
                const m = today.getMonth() - date.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                    age--;
                }

                if (age < MIN_SIGNUP_AGE) {
                    e.preventDefault();
                    showAppToast(translateUi('birthday_min_age_error', 'You must be at least 16 years old to use LvL.'));
                    return;
                }

                if (age > 120 || date.getFullYear() < 1900) {
                    e.preventDefault();
                    showAppToast(translateUi('birthday_realistic_error', 'Please enter a realistic birthday.'));
                    return;
                }
            });
        });
    }
});

function initRichReplies() {
    const form = document.querySelector('[data-ajax-reply-form]');
    if (!form) return;
    const textarea = form.querySelector('textarea[name="comment"]');
    const parentInput = form.querySelector('input[name="parent_comment_id"]');
    const stickerInput = form.querySelector('input[name="sticker"]');
    const imageInput = form.querySelector('[data-reply-image]');
    const status = form.querySelector('[data-reply-media-status]');
    const commentsFeed = document.querySelector('[data-comments-feed]');
    const countLabel = document.querySelector('[data-reply-count]');
    const translateReplyUi = (key, fallback) => {
        const lang = window.LvLI18n && typeof window.LvLI18n.getCurrentLang === 'function'
            ? window.LvLI18n.getCurrentLang()
            : 'en';
        const dictionary = window.LvLI18n && window.LvLI18n.TRANSLATIONS
            ? window.LvLI18n.TRANSLATIONS[lang]
            : null;
        return (dictionary && dictionary[key]) || fallback;
    };

    const toggle = (buttonSelector, panelSelector) => {
        const button = form.querySelector(buttonSelector);
        const panel = form.querySelector(panelSelector);
        if (button && panel) button.addEventListener('click', () => { panel.hidden = !panel.hidden; });
    };
    toggle('[data-emoji-toggle]', '[data-emoji-picker]');
    toggle('[data-sticker-toggle]', '[data-sticker-picker]');
    // Note: [data-gif-toggle] is handled by the GIF picker block below

    form.querySelectorAll('[data-insert-emoji]').forEach((button) => button.addEventListener('click', () => {
        const start = textarea.selectionStart || textarea.value.length;
        textarea.setRangeText(button.dataset.insertEmoji, start, textarea.selectionEnd || start, 'end');
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
    }));
    form.querySelectorAll('[data-select-sticker]').forEach((button) => button.addEventListener('click', () => {
        stickerInput.value = button.dataset.selectSticker;
        status.textContent = `${translateReplyUi('reply_sticker_selected', 'Sticker selected:')} ${button.dataset.selectSticker}`;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }));
    if (imageInput) imageInput.addEventListener('change', () => {
        status.textContent = imageInput.files[0] ? `${translateReplyUi('reply_photo_selected', 'Photo selected:')} ${imageInput.files[0].name}` : '';
    });

    document.addEventListener('click', (event) => {
        const replyButton = event.target.closest('[data-reply-to]');
        if (!replyButton) return;
        const username = replyButton.dataset.replyTo;
        textarea.value = `@${username} ${textarea.value.replace(/^@\w+\s*/, '')}`;
        parentInput.value = replyButton.dataset.parentComment || '';
        textarea.focus();
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    const bindInsertedActions = (root) => {
        root.querySelectorAll('.ajax-action-form').forEach((actionForm) => actionForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const button = actionForm.querySelector('button');
            if (!button || button.dataset.pending === '1') return;
            const data = new FormData(actionForm);
            data.append('ajax', '1');
            button.dataset.pending = '1';
            button.disabled = true;
            try {
                const response = await fetch(actionForm.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
                const result = await response.json();
                if (!result.success) { showAppToast(result.error || 'Action failed.'); return; }
                const count = button.querySelector('strong');
                if (actionForm.dataset.action === 'like') {
                    applyLikeFeedbackAndStyle(button, result.liked, result.count);
                }
                if (actionForm.dataset.action === 'repost') {
                    button.classList.toggle('active', result.reposted);
                    button.classList.toggle('repost-active', result.reposted);
                }
                if (count) count.textContent = result.count || '0';
            } catch (error) {
                console.error(error);
                showAppToast(translateReplyUi('action_failed', 'Action failed.'));
            } finally {
                delete button.dataset.pending;
                button.disabled = false;
            }
        }));
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submit = form.querySelector('button[type="submit"]');
        if (submit.dataset.pending === '1') return;
        const data = new FormData(form);
        data.append('ajax', '1');
        submit.dataset.pending = '1';
        submit.disabled = true;
        try {
            const response = await fetch(form.action, { method: 'POST', body: data });
            const result = await response.json();
            if (!result.success) { showAppToast(result.error || translateReplyUi('reply_post_error', 'Reply could not be posted.')); return; }
            const wrapper = document.createElement('div');
            wrapper.innerHTML = result.html.trim();
            const card = wrapper.firstElementChild;
            commentsFeed.querySelector('.empty-state')?.remove();
            commentsFeed.appendChild(card);
            bindInsertedActions(card);
            bindDeleteComment(card);
            const total = commentsFeed.querySelectorAll('[data-comment-id]').length;
            countLabel.textContent = `${total} ${translateReplyUi(total === 1 ? 'reply_singular' : 'reply_plural', total === 1 ? 'reply' : 'replies')}`;
            form.reset();
            parentInput.value = '';
            status.textContent = '';
            form.querySelectorAll('.reply-picker, [data-gif-field]').forEach((panel) => { panel.hidden = true; });
            const gifUrlInput = form.querySelector('input[name="gif_url"]');
            if (gifUrlInput) gifUrlInput.value = '';
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) {
            console.error(error);
            showAppToast(translateReplyUi('reply_post_error', 'Reply could not be posted.'));
        } finally {
            delete submit.dataset.pending;
            submit.disabled = false;
        }
    });
    // ── GIF Picker (Tenor via backend proxy) ─────────────────────────────────
    const gifField = form.querySelector('[data-gif-field]');
    const gifToggle = form.querySelector('[data-gif-toggle]');
    if (gifField && gifToggle) {
        const gifSearch = gifField.querySelector('[data-gif-search]');
        const gifSearchBtn = gifField.querySelector('[data-gif-search-btn]');
        const gifResults = gifField.querySelector('[data-gif-results]');
        const gifSelectedPreview = gifField.querySelector('[data-gif-selected-preview]');
        const gifPreviewImg = gifField.querySelector('[data-gif-preview-img]');
        const gifClear = gifField.querySelector('[data-gif-clear]');
        const gifUrlInput = form.querySelector('input[name="gif_url"]');

        const t = (key, fb) => translateReplyUi(key, fb);

        const renderGifResults = (gifs) => {
            gifResults.innerHTML = '';
            if (!gifs || !gifs.length) {
                gifResults.textContent = t('gif_no_results', 'No GIFs found');
                return;
            }
            gifs.forEach((gif) => {
                // Tenor format: gif.media_formats.tinygif.url for thumb, gif.media_formats.gif.url for full
                const thumbUrl = gif.media_formats?.tinygif?.url
                    || gif.media_formats?.mediumgif?.url
                    || gif.media_formats?.gif?.url || '';
                const fullUrl = gif.media_formats?.gif?.url
                    || gif.media_formats?.mediumgif?.url
                    || thumbUrl;
                if (!thumbUrl) return;
                const img = document.createElement('img');
                img.src = thumbUrl;
                img.alt = gif.title || 'GIF';
                img.loading = 'lazy';
                img.className = 'gif-result-item';
                img.addEventListener('click', () => {
                    gifUrlInput.value = fullUrl;
                    gifPreviewImg.src = thumbUrl;
                    gifSelectedPreview.hidden = false;
                    gifResults.hidden = true;
                    gifSearch.value = gif.title || '';
                    // Explicitly enable the submit button so users can post just a GIF
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) submitBtn.disabled = false;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                });
                gifResults.appendChild(img);
            });
        };

        const loadGifs = async (query) => {
            gifResults.textContent = t('gif_loading', 'Loading…');
            gifResults.hidden = false;
            try {
                const url = query
                    ? `/api/gif-search?q=${encodeURIComponent(query)}`
                    : `/api/gif-search?q=trending`;
                const resp = await fetch(url);
                const json = await resp.json();
                renderGifResults(json.results || []);
            } catch {
                gifResults.textContent = t('gif_no_results', 'No GIFs found');
            }
        };

        // On toggle open, load trending GIFs
        gifToggle.addEventListener('click', () => {
            const isOpen = !gifField.hidden;
            gifField.hidden = isOpen;
            if (!isOpen && !gifUrlInput.value) {
                loadGifs('');
            }
        });

        if (gifSearchBtn) gifSearchBtn.addEventListener('click', () => loadGifs(gifSearch.value.trim()));
        if (gifSearch) gifSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); loadGifs(gifSearch.value.trim()); }
        });
        if (gifClear) gifClear.addEventListener('click', () => {
            gifUrlInput.value = '';
            gifPreviewImg.src = '';
            gifSelectedPreview.hidden = true;
            gifResults.hidden = false;
            gifSearch.value = '';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            loadGifs('');
        });

        // Note: toggle is handled above, not by the generic toggle()
    }

    const bindDeleteComment = (root) => {
        root.querySelectorAll('.action-trigger-delete-comment').forEach((btn) => {
            if (btn.dataset.deleteCommentBound === '1') return;
            btn.dataset.deleteCommentBound = '1';
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const article = btn.closest('article.comment');
                const commentId = btn.dataset.commentId;
                const data = new FormData();
                data.append('csrf_token', document.querySelector('input[name="csrf_token"]')?.value || '');
                data.append('comment_id', commentId);
                data.append('ajax', '1');
                try {
                    const resp = await fetch('/delete_comment', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
                    const result = await resp.json();
                    if (!result.success) { showAppToast(result.error || translateReplyUi('reply_delete_error', 'Could not delete reply.')); return; }
                    if (article) {
                        article.style.opacity = '0';
                        article.style.transition = 'opacity 0.2s';
                        setTimeout(() => article.remove(), 220);
                    }
                    const feed = commentsFeed;
                    if (feed) {
                        const total = feed.querySelectorAll('[data-comment-id]').length - 1;
                        if (total <= 0) {
                            if (!feed.querySelector('.empty-state')) feed.innerHTML = `<div class="empty-state">${translateReplyUi('comments_empty', 'No replies yet.')}</div>`;
                            if (countLabel) countLabel.textContent = `0 ${translateReplyUi('reply_plural', 'replies')}`;
                        } else {
                            if (countLabel) countLabel.textContent = `${total} ${translateReplyUi(total === 1 ? 'reply_singular' : 'reply_plural', total === 1 ? 'reply' : 'replies')}`;
                        }
                    }
                } catch (err) {
                    console.error(err);
                    showAppToast(translateReplyUi('reply_delete_error', 'Could not delete reply.'));
                }
            });
        });
    };

    bindDeleteComment(document);

    // Also bind on newly-inserted comment cards
    const origBind = bindInsertedActions;
    const augmentedBind = (root) => {
        origBind(root);
        bindDeleteComment(root);
    };
}

// ▪ AJAX Delete Post (global, outside initRichReplies) ▪
function initAjaxDeletePosts() {
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.action-trigger-delete');
        if (!btn) return;
        e.preventDefault();
        
        const article = btn.closest('article.post');
        const postId = btn.dataset.postId;
        const data = new FormData();
        data.append('csrf_token', document.querySelector('input[name="csrf_token"]')?.value || '');
        data.append('post_id', postId);
        data.append('ajax', '1');
        
        const t = (k, fb) => {
            const lang = window.LvLI18n?.getCurrentLang?.() || 'en';
            return window.LvLI18n?.TRANSLATIONS?.[lang]?.[k] || fb;
        };
        
        try {
            const resp = await fetch('/delete_post', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
            const result = await resp.json();
            if (!result.success) { showAppToast(result.error || t('post_delete_error', 'Could not delete post.')); return; }
            if (article) {
                article.style.opacity = '0';
                article.style.transition = 'opacity 0.25s';
                setTimeout(() => {
                    article.remove();
                    // If on detail page, go home
                    if (document.querySelector('.thread-root') && !document.querySelector('article.post')) {
                        window.location.href = '/';
                    }
                }, 250);
            }
        } catch (err) {
            console.error(err);
            showAppToast(t('post_delete_error', 'Could not delete post.'));
        }
    });
}

function initProgressiveMedia() {
    document.querySelectorAll('.post-media img, .comment-media img').forEach((image) => {
        const container = image.closest('.post-media, .comment-media');
        if (!container) return;
        container.classList.add('media-loading');
        const done = () => container.classList.remove('media-loading');
        if (image.complete) done();
        else image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
    });

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const video = entry.target;
            if (video.preload === 'none') video.preload = 'metadata';
            observer.unobserve(video);
        });
    }, { rootMargin: '320px 0px' });
    document.querySelectorAll('video[preload="none"]').forEach((video) => observer.observe(video));
}

function initWebBackButton() {
    document.querySelectorAll('[data-web-back]').forEach((button) => {
        button.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
                return;
            }
            window.location.href = '/';
        });
    });
}

function initSwipeBack() {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    window.addEventListener('touchstart', (event) => {
        if (!event.touches || event.touches.length !== 1) return;
        const touch = event.touches[0];
        if (touch.clientX > 28) return;
        startX = touch.clientX;
        startY = touch.clientY;
        tracking = true;
    }, { passive: true });

    window.addEventListener('touchend', (event) => {
        if (!tracking || !event.changedTouches || event.changedTouches.length !== 1) return;
        tracking = false;
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = Math.abs(touch.clientY - startY);
        if (deltaX < 84 || deltaY > 70) return;
        if (window.history.length > 1) {
            window.history.back();
        }
    }, { passive: true });
}
