/* ============================================
   PREMIUM PORTFOLIO — HAMAS AHMED
   JavaScript: Animations & Interactions
   ============================================
   
   Table of Contents:
   1.  Preloader
   2.  Lenis Smooth Scroll + GSAP Sync
   3.  Custom Cursor
   4.  Scroll Progress
   5.  Navigation
   6.  Hero Animations
   7.  ScrollTrigger Animations
   8.  Counters
   9.  Skills Animation
   10. Portfolio Filter
   11. Testimonials Slider
   12. Mouse Parallax (Hero)
   13. Gradient Movement
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
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // RAF loop
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

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
   3. CUSTOM CURSOR
============================================ */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursor || window.innerWidth <= 768) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow (lerp)
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        
        cursor.style.transform = `translate(${cursorX - 6}px, ${cursorY - 6}px)`;
        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Cursor states on hoverable elements
    const cursorStates = {
        link: 'is-link',
        play: 'is-play',
        hover: 'is-link',
    };

    document.querySelectorAll('[data-cursor]').forEach(el => {
        const state = cursorStates[el.dataset.cursor];
        if (!state) return;
        
        el.addEventListener('mouseenter', () => cursor.classList.add(state));
        el.addEventListener('mouseleave', () => cursor.classList.remove(state));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorGlow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorGlow.style.opacity = '1';
    });
}

/* ============================================
   4. SCROLL PROGRESS
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
    const tl = gsap.timeline();
    
    // Name reveal from mask
    tl.to('.hero__name', {
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.15,
    })
    .to('.hero__subtitle-text', {
        y: 0,
        duration: 1,
        ease: 'power3.out',
    }, '-=0.8')
    .to('.hero__desc', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
    }, '-=0.6')
    .to('.hero__actions', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
    }, '-=0.5')
    .to('.hero__stats', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
    }, '-=0.5')
    .from('.hero__floating', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.15,
    }, '-=0.8')
    .from('.hero__image-wrap', {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
    }, '-=1.5')
    .from('.hero__scroll', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
    }, '-=0.5');

    // Animate hero gradient on scroll (parallax)
    gsap.to('.hero__gradient', {
        backgroundPosition: '50% 100%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });

    // Hero image parallax
    gsap.to('.hero__image-wrap', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });

    // Floating elements parallax
    gsap.to('.hero__floating--1', {
        y: -120,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });
    gsap.to('.hero__floating--2', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });
}

/* ============================================
   7. SCROLLTRIGGER ANIMATIONS
============================================ */
function initScrollAnimations() {
    // Section labels & titles — split text reveal
    document.querySelectorAll('.section-title span').forEach(el => {
        gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            }
        });
    });

    // Section labels
    document.querySelectorAll('.section-label').forEach(el => {
        gsap.from(el, {
            x: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
            }
        });
    });

    // Section descriptions
    document.querySelectorAll('.section-desc').forEach(el => {
        gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
            }
        });
    });

    // === REEL ===
    gsap.from('.reel__player', {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.reel',
            start: 'top 70%',
        }
    });

    // Reel play button scale on scroll
    gsap.from('.reel__play-btn', {
        scale: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.reel__player',
            start: 'top 75%',
        }
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

    // Journey cards reveal
    document.querySelectorAll('.journey__card').forEach((card, i) => {
        const isRight = card.classList.contains('journey__card--right');
        gsap.from(card, {
            x: isRight ? 60 : -60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
            }
        });
        
        // Dot pop
        const dot = card.querySelector('.journey__card-dot');
        gsap.from(dot, {
            scale: 0,
            duration: 0.5,
            ease: 'back.out(2)',
            delay: 0.3,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
            }
        });
    });

    // === SERVICES ===
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
        gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: (i % 3) * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            }
        });
    });

    // === PORTFOLIO ===
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, i) => {
        gsap.from(card, {
            y: 80,
            opacity: 0,
            scale: 0.95,
            duration: 0.9,
            ease: 'power3.out',
            delay: (i % 2) * 0.15,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            }
        });
    });

    // Portfolio filter buttons
    gsap.from('.portfolio__filter', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
            trigger: '.portfolio__filters',
            start: 'top 90%',
        }
    });

    // === SKILLS ===
    document.querySelectorAll('.skill-bar').forEach((bar, i) => {
        const fill = bar.querySelector('.skill-bar__fill');
        const value = fill.dataset.fill;
        
        gsap.to(fill, {
            width: value + '%',
            duration: 1.5,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
                trigger: bar,
                start: 'top 85%',
            }
        });
        
        gsap.from(bar, {
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 88%',
            }
        });
    });

    // === TESTIMONIALS ===
    gsap.from('.testimonials__slider', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.testimonials__slider',
            start: 'top 80%',
        }
    });

    // === WHY CHOOSE ME ===
    document.querySelectorAll('.why__stat').forEach((stat, i) => {
        gsap.from(stat, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: (i % 2) * 0.1,
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
            }
        });
    });

    document.querySelectorAll('.why__reason').forEach((reason, i) => {
        gsap.from(reason, {
            x: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
                trigger: reason,
                start: 'top 85%',
            }
        });
    });

    // === CONTACT ===
    document.querySelectorAll('.contact-card').forEach((card, i) => {
        gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
            }
        });
    });

    gsap.from('.contact__big-cta', {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact__big-cta',
            start: 'top 90%',
        }
    });

    // === FOOTER ===
    gsap.from('.footer__top, .footer__bottom', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 95%',
        }
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
   10. TESTIMONIALS SLIDER
============================================ */
function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');
    const dotsContainer = document.getElementById('testDots');
    
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let current = 0;
    let autoPlay;

    // Create dots
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.testimonials__dot');

    function goTo(index) {
        current = index;
        if (current < 0) current = total - 1;
        if (current >= total) current = 0;

        track.style.transform = `translateX(-${current * 100}%)`;
        
        dots.forEach((d, i) => {
            d.classList.toggle('is-active', i === current);
        });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
    prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });

    // Auto-play
    function startAutoPlay() {
        autoPlay = setInterval(next, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlay);
        startAutoPlay();
    }

    startAutoPlay();

    // Pause on hover
    const slider = document.getElementById('testimonialsSlider');
    slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
    slider.addEventListener('mouseleave', startAutoPlay);
}

/* ============================================
   11. MOUSE PARALLAX (HERO)
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

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        layers.forEach(({ el, strength }) => {
            const element = document.querySelector(el);
            if (element) {
                gsap.to(element, {
                    x: x * strength,
                    y: y * strength,
                    duration: 1.5,
                    ease: 'power2.out',
                });
            }
        });
    });
}

/* ============================================
   12. GRADIENT MOVEMENT
============================================ */
function initGradientMovement() {
    const gradient = document.getElementById('heroGradient');
    if (!gradient) return;

    let angle = 135;
    
    function animateGradient() {
        angle += 0.2;
        if (angle > 360) angle = 135;
        
        gradient.style.background = `
            radial-gradient(ellipse at ${30 + Math.sin(angle * 0.01) * 20}% ${20 + Math.cos(angle * 0.01) * 20}%, 
                rgba(212, 175, 55, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at ${70 + Math.cos(angle * 0.015) * 20}% ${80 + Math.sin(angle * 0.015) * 20}%, 
                rgba(212, 175, 55, 0.08) 0%, transparent 50%)
        `;
        
        requestAnimationFrame(animateGradient);
    }
    animateGradient();
}

/* ============================================
   13. REEL PLAYER INTERACTION
============================================ */
function initReelPlayer() {
    const player = document.getElementById('reelPlayer');
    if (!player) return;

    player.addEventListener('click', (e) => {
        // Visual feedback — could open a modal or redirect
        gsap.to('.reel__play-btn', {
            scale: 0.9,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
        });
    });
}

/* ============================================
   INIT — Master Function
============================================ */
function initAnimations() {
    initLenis();
    initCursor();
    initScrollProgress();
    initNav();
    initHero();
    initScrollAnimations();
    initCounters();
    initPortfolioFilter();
    initTestimonials();
    initMouseParallax();
    initGradientMovement();
    initReelPlayer();
    
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
