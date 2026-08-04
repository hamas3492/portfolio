/* ============================================
   PREMIUM PORTFOLIO — HAMAS AHMED
   JavaScript: Animations & Interactions
   Reference-style: section-level curtain reveals
   ============================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* ============================================
   1. PRELOADER
============================================ */
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPercent = document.getElementById('loaderPercent');
const loaderStartTime = performance.now();
const MIN_LOAD_TIME = 1800; // ms

let progress = 0;
const loaderInterval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress > 100) progress = 100;
    
    loaderBar.style.width = progress + '%';
    loaderPercent.textContent = Math.floor(progress);
    
    if (progress >= 100) {
        clearInterval(loaderInterval);
        const elapsed = performance.now() - loaderStartTime;
        const delay = Math.max(0, MIN_LOAD_TIME - elapsed);
        
        setTimeout(() => {
            loader.classList.add('is-loaded');
            initAnimations();
            setTimeout(() => {
                loader.classList.add('is-hidden');
                document.body.style.overflow = 'auto';
            }, 600);
        }, delay);
    }
}, 80);

// Prevent scroll during load
document.body.style.overflow = 'hidden';

/* ============================================
   2. LENIS SMOOTH SCROLL + GSAP SYNC
============================================ */
let lenis;

function initLenis() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lenis = new Lenis({
        duration: 0.75,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(1000, 16);

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -80, duration: 1.5 });
                closeMobileMenu();
            }
        });
    });
}

/* ============================================
   3. SCROLL PROGRESS
============================================ */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    function update() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const percent = (scrolled / scrollHeight) * 100;
        bar.style.width = percent + '%';
    }
    
    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ============================================
   5. NAVIGATION
============================================ */
function initNav() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
    }, { passive: true });

    burger.addEventListener('click', () => {
        burger.classList.toggle('is-open');
        mobileMenu.classList.toggle('is-open');
        document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    const burger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (burger.classList.contains('is-open')) {
        burger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
    }
}

/* ============================================
   6. HERO ANIMATIONS
   The ENTIRE hero content rises up as one block
   when the preloader finishes — like a curtain lift.
============================================ */
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // The entire hero content rises up from below as one block
    tl.fromTo('.hero__content',
        { yPercent: 30, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 2, ease: 'power3.out' }
    );

    // Hero visual slides in from the right
    tl.fromTo('.hero__visual',
        { xPercent: 20, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1.8, ease: 'power3.out' },
        '-=1.6'
    );

    // Within the hero, text elements have a subtle stagger
    tl.fromTo('.hero__tag',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=1.2'
    );

    // Name lines — mask reveal (slide up from behind overflow:hidden)
    tl.fromTo('.hero__name',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.4, stagger: 0.15 },
        '-=0.8'
    );

    // Subtitle — mask reveal
    tl.fromTo('.hero__subtitle-text',
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2 },
        '-=0.7'
    );

    // Description
    tl.fromTo('.hero__desc',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.6'
    );

    // Buttons
    tl.fromTo('.hero__actions .btn',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
        '-=0.4'
    );

    // Stats
    tl.fromTo('.hero__stat',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
        '-=0.3'
    );

    // Floating icons — pop in
    tl.fromTo('.hero__floating',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.7)' },
        '-=0.3'
    );

    // Scroll indicator
    tl.fromTo('.hero__scroll',
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.1'
    );

    // Parallax on scroll
    gsap.to('.hero__image', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.to('.hero__grid', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
}

/* ============================================
   7. SCROLLTRIGGER ANIMATIONS
   Each SECTION rises up from the bottom as one block.
   Internal elements have subtle stagger within the block.
============================================ */

    /* ============================================
       SCROLL-TRIGGERED ANIMATIONS
       Style: Each section rises up as one block on scroll.
       Internal elements have subtle stagger within the block.
       Key fix: immediateRender:false so elements are VISIBLE by default
       and only get hidden right before the animation fires.
       Durations are slow and cinematic.
    ============================================ */
function initScrollAnimations() {

    // Helper: create a section reveal — y movement only, NO opacity on container
    function revealSection(selector, delay = 0) {
        const container = document.querySelector(selector + ' .container') || document.querySelector(selector);
        if (!container) return;
        gsap.fromTo(container,
            { y: 80, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 1.6, ease: 'power3.out',
                delay: delay,
                immediateRender: false,
                scrollTrigger: { trigger: selector, start: 'top 80%', once: true }
            }
        );
    }

    // Helper: reveal section title with mask
    function revealTitle(selector, delay = 0) {
        const spans = document.querySelectorAll(selector + ' .section-title span');
        if (!spans.length) return;
        gsap.fromTo(spans,
            { yPercent: 110 },
            {
                yPercent: 0,
                duration: 1.4, ease: 'power4.out',
                stagger: 0.12,
                delay: delay,
                immediateRender: false,
                scrollTrigger: { trigger: selector, start: 'top 80%', once: true }
            }
        );
    }

    // === JOURNEY SECTION ===
    revealSection('.journey');
    revealTitle('.journey', 0.3);

    // Journey progress line
    gsap.to('#journeyProgress', {
        height: '100%',
        ease: 'none',
        scrollTrigger: { trigger: '.journey__timeline', start: 'top 60%', end: 'bottom 60%', scrub: true }
    });

    // Journey cards
    document.querySelectorAll('.journey__card').forEach((card, i) => {
        const isRight = card.classList.contains('journey__card--right');
        gsap.fromTo(card,
            { x: isRight ? 60 : -60, opacity: 0 },
            {
                x: 0, opacity: 1,
                duration: 1.2, ease: 'power3.out',
                delay: 0.1 + i * 0.1,
                immediateRender: false,
                scrollTrigger: { trigger: card, start: 'top 88%', once: true }
            }
        );
        const dot = card.querySelector('.journey__card-dot');
        if (dot) {
            gsap.fromTo(dot,
                { scale: 0 },
                {
                    scale: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.4,
                    immediateRender: false,
                    scrollTrigger: { trigger: card, start: 'top 85%', once: true }
                });
        }
    });

    // === SERVICES SECTION ===
    revealSection('.services');
    revealTitle('.services', 0.3);

    document.querySelectorAll('.service-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 1.1, ease: 'power3.out',
                delay: 0.2 + (i % 3) * 0.12,
                immediateRender: false,
                scrollTrigger: { trigger: card, start: 'top 90%', once: true }
            });
    });

    // === PORTFOLIO SECTION ===
    revealSection('.portfolio');
    revealTitle('.portfolio', 0.3);

    // Portfolio filter buttons
    gsap.fromTo('.portfolio__filter',
        { y: 20, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08,
            immediateRender: false,
            scrollTrigger: { trigger: '.portfolio__filters', start: 'top 92%', once: true }
        });

    // Project cards
    document.querySelectorAll('.project-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 70, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 1.2, ease: 'power3.out',
                delay: (i % 2) * 0.12,
                immediateRender: false,
                scrollTrigger: { trigger: card, start: 'top 90%', once: true }
            });
    });

    // === SKILLS SECTION ===
    revealSection('.skills');
    revealTitle('.skills', 0.3);

    document.querySelectorAll('.skill-bar').forEach((bar, i) => {
        gsap.fromTo(bar,
            { x: -40, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                delay: i * 0.08,
                immediateRender: false,
                scrollTrigger: { trigger: bar, start: 'top 92%', once: true }
            });
        const fill = bar.querySelector('.skill-bar__fill');
        if (fill && fill.dataset.fill) {
            gsap.to(fill, {
                width: fill.dataset.fill + '%',
                duration: 1.8, ease: 'power3.out',
                delay: i * 0.08 + 0.3,
                scrollTrigger: { trigger: bar, start: 'top 90%', once: true }
            });
        }
    });

    // === WHY SECTION ===
    revealSection('.why');
    revealTitle('.why', 0.3);

    document.querySelectorAll('.why__stat').forEach((stat, i) => {
        gsap.fromTo(stat,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                delay: (i % 2) * 0.12,
                immediateRender: false,
                scrollTrigger: { trigger: stat, start: 'top 90%', once: true }
            });
    });

    document.querySelectorAll('.why__reason').forEach((reason, i) => {
        gsap.fromTo(reason,
            { x: 50, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                delay: i * 0.1,
                immediateRender: false,
                scrollTrigger: { trigger: reason, start: 'top 90%', once: true }
            });
    });

    // === CONTACT SECTION ===
    revealSection('.contact');
    revealTitle('.contact', 0.3);

    document.querySelectorAll('.contact-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                delay: i * 0.1,
                immediateRender: false,
                scrollTrigger: { trigger: card, start: 'top 92%', once: true }
            });
    });

    // === FOOTER ===
    gsap.fromTo('.footer__content',
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1.4, ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: '.footer__content', start: 'top 94%', once: true }
        });

    // === SECTION LABELS ===
    document.querySelectorAll('.section-label').forEach(label => {
        gsap.fromTo(label,
            { x: -40, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: { trigger: label, start: 'top 92%', once: true }
            });
        const line = label.querySelector('.section-label__line');
        if (line) {
            gsap.fromTo(line,
                { scaleX: 0 },
                {
                    scaleX: 1, duration: 0.8, ease: 'power3.out', delay: 0.2,
                    immediateRender: false,
                    scrollTrigger: { trigger: label, start: 'top 92%', once: true }
                });
        }
    });

    // === SECTION DESCRIPTIONS ===
    document.querySelectorAll('.section-desc').forEach(desc => {
        gsap.fromTo(desc,
            { y: 25, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3,
                immediateRender: false,
                scrollTrigger: { trigger: desc, start: 'top 92%', once: true }
            });
    });
}
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        let hasRun = false;

        const runCount = () => {
            if (hasRun) return;
            hasRun = true;
            let current = 0;
            const duration = 2000;
            const stepTime = 16;
            const steps = duration / stepTime;
            const increment = target / steps;

            const update = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };
            update();
        };

        const st = ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: runCount,
            once: true,
        });

        // Elements already in view when the page loads (e.g. hero stats above
        // the fold) never cross the "start" boundary via scrolling, so
        // onEnter would otherwise never fire. Run immediately in that case.
        if (st.isActive) {
            runCount();
        }
    });
}

/* ============================================
   9. PORTFOLIO FILTER
============================================ */
function initPortfolioFilter() {
    const filters = document.querySelectorAll('.portfolio__filter');
    const cards = document.querySelectorAll('.project-card');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('is-active'));
            filter.classList.add('is-active');

            const category = filter.dataset.filter;

            cards.forEach(card => {
                const matches = category === 'all' || card.dataset.category === category;
                
                if (matches) {
                    card.classList.remove('is-hidden');
                    gsap.to(card, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
                } else {
                    gsap.to(card, {
                        opacity: 0, scale: 0.9, duration: 0.4, ease: 'power3.out',
                        onComplete: () => card.classList.add('is-hidden'),
                    });
                }
            });

            setTimeout(() => ScrollTrigger.refresh(), 500);
        });
    });
}

/* ============================================
   10. MOUSE PARALLAX (HERO)
============================================ */
function initMouseParallax() {
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const layers = [
        { el: '.hero__floating--1', strength: 0.03 },
        { el: '.hero__floating--2', strength: 0.05 },
        { el: '.hero__floating--3', strength: 0.04 },
        { el: '.hero__image-wrap', strength: 0.015 },
        { el: '.hero__gradient', strength: 0.01 },
    ];

    const setters = layers.map(({ el, strength }) => {
        const element = document.querySelector(el);
        if (!element) return null;
        return {
            strength,
            x: gsap.quickTo(element, 'x', { duration: 0.45, ease: 'power2.out' }),
            y: gsap.quickTo(element, 'y', { duration: 0.45, ease: 'power2.out' })
        };
    }).filter(Boolean);

    let frame = 0;
    let pending = null;
    hero.addEventListener('mousemove', (e) => {
        pending = e;
        if (frame) return;
        frame = requestAnimationFrame(() => {
            const rect = hero.getBoundingClientRect();
            const x = pending.clientX - rect.left - rect.width / 2;
            const y = pending.clientY - rect.top - rect.height / 2;
            setters.forEach(({ strength, x: setX, y: setY }) => {
                setX(x * strength);
                setY(y * strength);
            });
            frame = 0;
        });
    }, { passive: true });
}

/* ============================================
   IN-PAGE PROJECT PLAYER
============================================ */
function initProjectPlayer() {
    const player = document.getElementById('projectPlayer');
    const media = document.getElementById('projectPlayerMedia');
    const title = document.getElementById('projectPlayerTitle');
    const message = document.getElementById('projectPlayerMessage');
    if (!player || !media) return;
    let lastFocused = null;

    function close() {
        player.classList.remove('is-open');
        player.setAttribute('aria-hidden', 'true');
        media.replaceChildren();
        document.body.classList.remove('player-open');
        if (lastFocused) lastFocused.focus();
    }
    function open(button) {
        lastFocused = button;
        const id = button.dataset.projectVideo;
        title.textContent = button.dataset.projectTitle || 'Project Preview';
        media.replaceChildren();
        if (id) {
            const frame = document.createElement('iframe');
            frame.src = `https://www.tiktok.com/player/v1/${encodeURIComponent(id)}?description=1&music_info=1&rel=0`;
            frame.title = `${title.textContent} video player`;
            frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
            frame.loading = 'eager';
            frame.allowFullscreen = true;
            media.appendChild(frame);
            message.textContent = 'Playing inside the portfolio.';
        } else {
            const image = document.createElement('img');
            image.src = button.dataset.projectPoster;
            image.alt = `${title.textContent} preview`;
            media.appendChild(image);
            message.textContent = 'Project preview by Hamas Ahmed.';
        }
        player.classList.add('is-open');
        player.setAttribute('aria-hidden', 'false');
        document.body.classList.add('player-open');
        player.querySelector('.project-player__close').focus();
    }
    document.querySelectorAll('.project-card__play').forEach(button => button.addEventListener('click', () => open(button)));
    player.querySelectorAll('[data-player-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && player.classList.contains('is-open')) close(); });
}

/* ============================================
   INIT — Master Function
============================================ */
function initAnimations() {
    document.body.classList.add("gsap-ready");
    initLenis();
    initScrollProgress();
    initNav();
    initHero();
    initScrollAnimations();
    initCounters();
    initPortfolioFilter();
    initMouseParallax();
    initProjectPlayer();
    
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
}

// If preloader is skipped (slow CDN), init after 4s max
setTimeout(() => {
    if (!document.querySelector('.loader.is-hidden') && !document.querySelector('.loader.is-loaded')) {
        loader.classList.add('is-loaded');
        setTimeout(() => {
            loader.classList.add('is-hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 600);
    }
}, 4000);
