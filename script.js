/* ============================================
   PREMIUM PORTFOLIO — HAMAS AHMED
   JavaScript: Animations & Interactions
   ============================================
   
   Table of Contents:
   1.  Preloader
   2.  Lenis Smooth Scroll + GSAP Sync
   4.  Scroll Progress
   5.  Navigation
   6.  Hero Animations
   7.  ScrollTrigger Animations
   8.  Counters
   9.  Skills Animation
   10. Portfolio Filter
   12. Mouse Parallax (Hero)
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

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Share GSAP's ticker with Lenis and ScrollTrigger to avoid competing RAF loops.
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(1000, 16);

    // Anchor links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.5,
                });
                // Close mobile menu if open
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

    // Scrolled state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }
    }, { passive: true });

    // Burger toggle
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
============================================ */
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Tag
    tl.fromTo('.hero__tag',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 }
    );

    // Name — dramatic mask reveal
    tl.fromTo('.hero__name',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
        '-=0.3'
    );

    // Subtitle
    tl.fromTo('.hero__subtitle-text',
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
    );

    // Description
    tl.fromTo('.hero__desc',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
    );

    // Buttons
    tl.fromTo('.hero__actions .btn',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        '-=0.3'
    );

    // Stats
    tl.fromTo('.hero__stat',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        '-=0.2'
    );

    // Image
    tl.fromTo('.hero__image-wrap',
        { clipPath: 'inset(100% 0 0 0 round 16px)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0 round 16px)', opacity: 1, duration: 1.3, ease: 'power4.out' },
        '-=1'
    );

    // Floating icons
    tl.fromTo('.hero__floating',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)' },
        '-=0.4'
    );

    // Scroll indicator
    tl.fromTo('.hero__scroll',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.2'
    );

    // Parallax on scroll
    gsap.to('.hero__image', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });

    // Hero background elements parallax
    gsap.to('.hero__grid', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Mouse parallax on hero
    if (!window.matchMedia('(pointer: coarse)').matches) {
        const heroContent = document.querySelector('.hero__content');
        const heroVisual = document.querySelector('.hero__visual');
        if (!heroContent || !heroVisual) return;

        let pending = null;
        document.querySelector('.hero').addEventListener('pointermove', (e) => {
            pending = e;
            if (frame) return;
            frame = requestAnimationFrame(() => {
                const rect = heroContent.getBoundingClientRect();
                const x = pending.clientX - rect.left - rect.width / 2;
                const y = pending.clientY - rect.top - rect.height / 2;
                gsap.to('.hero__floating--1', { x: x * 0.02, y: y * 0.02, duration: 0.8, ease: 'power2.out' });
                gsap.to('.hero__floating--2', { x: x * 0.03, y: y * 0.03, duration: 0.8, ease: 'power2.out' });
                gsap.to('.hero__floating--3', { x: x * 0.025, y: y * 0.025, duration: 0.8, ease: 'power2.out' });
                frame = 0;
            });
        }, { passive: true });
        let frame = 0;
    }
}

/* ============================================
   7. SCROLLTRIGGER ANIMATIONS
============================================ */
function initScrollAnimations() {
    // ==========================================
    // PREMIUM ANIMATIONS — Reference Video Style
    // Clip-path mask wipes, text mask reveals,
    // staggered card entrances, premium easing
    // ==========================================

    // === SECTION TITLES — Masked text reveal ===
    document.querySelectorAll('.section-title').forEach(title => {
        const spans = title.querySelectorAll('span');
        spans.forEach((span, i) => {
            // Wrap in mask container if not already
            gsap.fromTo(span,
                { yPercent: 120, opacity: 0 },
                {
                    yPercent: 0, opacity: 1,
                    duration: 1.2,
                    ease: 'power4.out',
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 85%',
                        once: true,
                    }
                }
            );
        });
    });

    // === SECTION LABELS — Slide in from left with gold line ===
    document.querySelectorAll('.section-label').forEach(label => {
        const line = label.querySelector('.section-label__line');
        const text = label.querySelector('span:last-child');
        
        gsap.fromTo(label,
            { x: -40, opacity: 0 },
            {
                x: 0, opacity: 1,
                duration: 0.9,
                ease: 'power4.out',
                scrollTrigger: { trigger: label, start: 'top 90%', once: true }
            }
        );
        if (line) {
            gsap.fromTo(line,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'power4.out',
                    delay: 0.2,
                    scrollTrigger: { trigger: label, start: 'top 90%', once: true }
                }
            );
        }
    });

    // === SECTION DESCRIPTIONS — Fade up ===
    document.querySelectorAll('.section-desc').forEach(desc => {
        gsap.fromTo(desc,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 1,
                ease: 'power3.out',
                delay: 0.3,
                scrollTrigger: { trigger: desc, start: 'top 88%', once: true }
            }
        );
    });

    // === JOURNEY TIMELINE ===
    // Progress line fill
    gsap.to('#journeyProgress', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.journey__timeline',
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true,
        }
    });

    // Journey cards — clip-path wipe reveal
    document.querySelectorAll('.journey__card').forEach((card, i) => {
        const isRight = card.classList.contains('journey__card--right');
        gsap.fromTo(card,
            {
                x: isRight ? 80 : -80,
                opacity: 0,
                clipPath: 'inset(0 0 100% 0 round 16px)',
            },
            {
                x: 0,
                opacity: 1,
                clipPath: 'inset(0 0 0% 0 round 16px)',
                duration: 1.1,
                ease: 'power4.out',
                delay: i * 0.05,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 82%',
                    once: true,
                }
            }
        );

        // Dot pop
        const dot = card.querySelector('.journey__card-dot');
        if (dot) {
            gsap.fromTo(dot,
                { scale: 0 },
                {
                    scale: 1,
                    duration: 0.5,
                    ease: 'back.out(2)',
                    delay: 0.4,
                    scrollTrigger: { trigger: card, start: 'top 80%', once: true }
                }
            );
        }
    });

    // === SERVICES — Clip-path reveal with stagger ===
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
        gsap.fromTo(card,
            {
                y: 80,
                opacity: 0,
                clipPath: 'inset(0 0 100% 0 round 12px)',
            },
            {
                y: 0,
                opacity: 1,
                clipPath: 'inset(0 0 0% 0 round 12px)',
                duration: 1,
                ease: 'power4.out',
                delay: (i % 3) * 0.12,
                scrollTrigger: { trigger: card, start: 'top 85%', once: true }
            }
        );
    });

    // === PORTFOLIO — Dramatic clip-path reveal ===
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, i) => {
        gsap.fromTo(card,
            {
                y: 100,
                opacity: 0,
                clipPath: 'inset(100% 0 0 0 round 16px)',
            },
            {
                y: 0,
                opacity: 1,
                clipPath: 'inset(0% 0 0 0 round 16px)',
                duration: 1.2,
                ease: 'power4.out',
                delay: (i % 2) * 0.15,
                scrollTrigger: { trigger: card, start: 'top 85%', once: true }
            }
        );
    });

    // Portfolio filter buttons
    gsap.fromTo('.portfolio__filter',
        { y: 20, opacity: 0 },
        {
            y: 0, opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: '.portfolio__filters', start: 'top 90%', once: true }
        }
    );

    // === SKILLS — Slide in with bar fill ===
    document.querySelectorAll('.skill-bar').forEach((bar, i) => {
        const fill = bar.querySelector('.skill-bar__fill');
        const value = fill.dataset.fill;
        
        gsap.fromTo(bar,
            { x: -40, opacity: 0 },
            {
                x: 0, opacity: 1,
                duration: 0.9,
                ease: 'power4.out',
                delay: i * 0.08,
                scrollTrigger: { trigger: bar, start: 'top 88%', once: true }
            }
        );
        
        gsap.to(fill, {
            width: value + '%',
            duration: 1.5,
            ease: 'power3.out',
            delay: i * 0.08 + 0.3,
            scrollTrigger: { trigger: bar, start: 'top 85%', once: true }
        });
    });

    // === WHY CHOOSE ME — Staggered reveals ===
    document.querySelectorAll('.why__stat').forEach((stat, i) => {
        gsap.fromTo(stat,
            { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0 round 12px)' },
            {
                y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0 round 12px)',
                duration: 0.9, ease: 'power4.out',
                delay: (i % 2) * 0.12,
                scrollTrigger: { trigger: stat, start: 'top 85%', once: true }
            }
        );
    });

    document.querySelectorAll('.why__reason').forEach((reason, i) => {
        gsap.fromTo(reason,
            { x: 50, opacity: 0 },
            {
                x: 0, opacity: 1,
                duration: 0.9, ease: 'power4.out',
                delay: i * 0.1,
                scrollTrigger: { trigger: reason, start: 'top 85%', once: true }
            }
        );
    });

    // === CONTACT — Clip-path reveal ===
    document.querySelectorAll('.contact-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 60, opacity: 0, clipPath: 'inset(0 0 100% 0 round 12px)' },
            {
                y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0 round 12px)',
                duration: 0.9, ease: 'power4.out',
                delay: i * 0.1,
                scrollTrigger: { trigger: card, start: 'top 88%', once: true }
            }
        );
    });

    // === FOOTER ===
    gsap.fromTo('.footer__content', {
        y: 40, opacity: 0
    }, {
        y: 0, opacity: 1,
        duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer__content', start: 'top 90%', once: true }
    });
}

/* ============================================
   8. COUNTERS
============================================ */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => {
                let current = 0;
                const duration = 2000; // ms
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
            },
            once: true,
        });
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
            // Update active filter
            filters.forEach(f => f.classList.remove('is-active'));
            filter.classList.add('is-active');

            const category = filter.dataset.filter;

            // Filter cards with animation
            cards.forEach(card => {
                const matches = category === 'all' || card.dataset.category === category;
                
                if (matches) {
                    card.classList.remove('is-hidden');
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power3.out',
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.4,
                        ease: 'power3.out',
                        onComplete: () => card.classList.add('is-hidden'),
                    });
                }
            });

            // Refresh ScrollTrigger
            setTimeout(() => ScrollTrigger.refresh(), 500);
        });
    });
}

/* ============================================
   10. MOUSE PARALLAX (HERO)
============================================ */
function initMouseParallax() {
    if (window.innerWidth <= 768) return;

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
        return { strength, x: gsap.quickTo(element, 'x', { duration: 0.45, ease: 'power2.out' }), y: gsap.quickTo(element, 'y', { duration: 0.45, ease: 'power2.out' }) };
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
            setters.forEach(({ strength, x: setX, y: setY }) => { setX(x * strength); setY(y * strength); });
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
    initLenis();
    initScrollProgress();
    initNav();
    initHero();
    initScrollAnimations();
    initCounters();
    initPortfolioFilter();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) initMouseParallax();
    initProjectPlayer();
    
    // Refresh ScrollTrigger after everything loads
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
}

// If preloader is skipped (slow CDN), init after 3s max
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
