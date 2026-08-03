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
        { yPercent: 0, opacity: 1, duration: 1.4, ease: 'power4.out' }
    );

    // Hero visual slides in from the right
    tl.fromTo('.hero__visual',
        { xPercent: 20, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1.2, ease: 'power4.out' },
        '-=1.2'
    );

    // Within the hero, text elements have a subtle stagger
    tl.fromTo('.hero__tag',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.8'
    );

    // Name lines — mask reveal (slide up from behind overflow:hidden)
    tl.fromTo('.hero__name',
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.12 },
        '-=0.6'
    );

    // Subtitle — mask reveal
    tl.fromTo('.hero__subtitle-text',
        { yPercent: 100 },
        { yPercent: 0, duration: 0.8 },
        '-=0.5'
    );

    // Description
    tl.fromTo('.hero__desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.4'
    );

    // Buttons
    tl.fromTo('.hero__actions .btn',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
        '-=0.3'
    );

    // Stats
    tl.fromTo('.hero__stat',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        '-=0.2'
    );

    // Floating icons — pop in
    tl.fromTo('.hero__floating',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.7)' },
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
function initScrollAnimations() {

    // === JOURNEY SECTION — rises up as one block ===
    const journeyContainer = document.querySelector('.journey .container');
    if (journeyContainer) {
        const tl1 = gsap.timeline({
            scrollTrigger: { trigger: '.journey', start: 'top 75%', once: true }
        });
        tl1.fromTo(journeyContainer,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
        );
        tl1.fromTo('.journey .section-title span',
            { yPercent: 110 },
            { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' },
            '-=0.6'
        );
    }

    // Journey progress line
    gsap.to('#journeyProgress', {
        height: '100%',
        ease: 'none',
        scrollTrigger: { trigger: '.journey__timeline', start: 'top 60%', end: 'bottom 60%', scrub: true }
    });

    // Journey cards — subtle stagger within the block
    document.querySelectorAll('.journey__card').forEach((card, i) => {
        const isRight = card.classList.contains('journey__card--right');
        gsap.fromTo(card,
            { x: isRight ? 50 : -50, opacity: 0 },
            {
                x: 0, opacity: 1,
                duration: 0.9, ease: 'power4.out',
                delay: 0.1 + i * 0.08,
                scrollTrigger: { trigger: card, start: 'top 85%', once: true }
            }
        );
        const dot = card.querySelector('.journey__card-dot');
        if (dot) {
            gsap.fromTo(dot, { scale: 0 },
                { scale: 1, duration: 0.4, ease: 'back.out(2)', delay: 0.3,
                  scrollTrigger: { trigger: card, start: 'top 82%', once: true }
                });
        }
    });

    // === SERVICES SECTION — rises up as one block ===
    const servicesContainer = document.querySelector('.services .container');
    if (servicesContainer) {
        const tl2 = gsap.timeline({
            scrollTrigger: { trigger: '.services', start: 'top 75%', once: true }
        });
        tl2.fromTo(servicesContainer,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
        );
        tl2.fromTo('.services .section-title span',
            { yPercent: 110 },
            { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' },
            '-=0.6'
        );
    }

    // Service cards — stagger within the block
    document.querySelectorAll('.service-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out',
              delay: 0.15 + (i % 3) * 0.1,
              scrollTrigger: { trigger: card, start: 'top 88%', once: true }
            });
    });

    // === PORTFOLIO SECTION — rises up as one block ===
    const portfolioContainer = document.querySelector('.portfolio .container');
    if (portfolioContainer) {
        const tl3 = gsap.timeline({
            scrollTrigger: { trigger: '.portfolio', start: 'top 75%', once: true }
        });
        tl3.fromTo(portfolioContainer,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
        );
        tl3.fromTo('.portfolio .section-title span',
            { yPercent: 110 },
            { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' },
            '-=0.6'
        );
    }

    // Portfolio filter buttons
    gsap.fromTo('.portfolio__filter',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: '.portfolio__filters', start: 'top 90%', once: true }
        });

    // Project cards — stagger within the block
    document.querySelectorAll('.project-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power4.out',
              delay: (i % 2) * 0.1,
              scrollTrigger: { trigger: card, start: 'top 88%', once: true }
            });
    });

    // === SKILLS SECTION — rises up as one block ===
    const skillsContainer = document.querySelector('.skills .container');
    if (skillsContainer) {
        const tl4 = gsap.timeline({
            scrollTrigger: { trigger: '.skills', start: 'top 75%', once: true }
        });
        tl4.fromTo(skillsContainer,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
        );
        tl4.fromTo('.skills .section-title span',
            { yPercent: 110 },
            { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' },
            '-=0.6'
        );
    }

    // Skill bars — stagger with fill
    document.querySelectorAll('.skill-bar').forEach((bar, i) => {
        gsap.fromTo(bar,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, ease: 'power4.out',
              delay: i * 0.06,
              scrollTrigger: { trigger: bar, start: 'top 90%', once: true }
            });
        const fill = bar.querySelector('.skill-bar__fill');
        if (fill && fill.dataset.fill) {
            gsap.to(fill, {
                width: fill.dataset.fill + '%',
                duration: 1.3, ease: 'power3.out',
                delay: i * 0.06 + 0.2,
                scrollTrigger: { trigger: bar, start: 'top 88%', once: true }
            });
        }
    });

    // === WHY SECTION — rises up as one block ===
    const whyContainer = document.querySelector('.why .container');
    if (whyContainer) {
        const tl5 = gsap.timeline({
            scrollTrigger: { trigger: '.why', start: 'top 75%', once: true }
        });
        tl5.fromTo(whyContainer,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
        );
        tl5.fromTo('.why .section-title span',
            { yPercent: 110 },
            { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' },
            '-=0.6'
        );
    }

    document.querySelectorAll('.why__stat').forEach((stat, i) => {
        gsap.fromTo(stat,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out',
              delay: (i % 2) * 0.1,
              scrollTrigger: { trigger: stat, start: 'top 88%', once: true }
            });
    });

    document.querySelectorAll('.why__reason').forEach((reason, i) => {
        gsap.fromTo(reason,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power4.out',
              delay: i * 0.08,
              scrollTrigger: { trigger: reason, start: 'top 88%', once: true }
            });
    });

    // === CONTACT SECTION — rises up as one block ===
    const contactContainer = document.querySelector('.contact .container');
    if (contactContainer) {
        const tl6 = gsap.timeline({
            scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true }
        });
        tl6.fromTo(contactContainer,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
        );
        tl6.fromTo('.contact .section-title span',
            { yPercent: 110 },
            { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' },
            '-=0.6'
        );
    }

    document.querySelectorAll('.contact-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power4.out',
              delay: i * 0.08,
              scrollTrigger: { trigger: card, start: 'top 90%', once: true }
            });
    });

    // === FOOTER ===
    gsap.fromTo('.footer__content',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.footer__content', start: 'top 92%', once: true }
        });

    // === SECTION LABELS — slide in from left ===
    document.querySelectorAll('.section-label').forEach(label => {
        gsap.fromTo(label,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power4.out',
              scrollTrigger: { trigger: label, start: 'top 90%', once: true }
            });
        const line = label.querySelector('.section-label__line');
        if (line) {
            gsap.fromTo(line,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.6, ease: 'power4.out', delay: 0.15,
                  scrollTrigger: { trigger: label, start: 'top 90%', once: true }
                });
        }
    });

    // === SECTION DESCRIPTIONS ===
    document.querySelectorAll('.section-desc').forEach(desc => {
        gsap.fromTo(desc,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2,
              scrollTrigger: { trigger: desc, start: 'top 90%', once: true }
            });
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
