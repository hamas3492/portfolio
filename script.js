/* ===== HAMAS AHMED — PREMIUM CREATIVE PORTFOLIO JS ===== */

// ===== LENIS SMOOTH SCROLL =====
let lenis = null;
if (window.Lenis) {
    lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
}

// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader')?.classList.add('hide');
        animateHero();
    }, 1500);
});

// ===== HERO ANIMATION =====
function animateHero() {
    if (!window.gsap) return;
    const items = document.querySelectorAll('[data-anim]');
    items.forEach((el, i) => {
        if (el.closest('.hero')) {
            const delay = parseInt(el.dataset.animDelay || i * 0.1);
            gsap.from(el, { y: 40, opacity: 0, duration: 0.8, delay: delay + 0.1, ease: 'power3.out' });
        }
    });
    gsap.from('.hero__meta-item', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero__meta-divider', { scaleY: 0, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.9, ease: 'power3.out' });
}

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
const progressFill = document.getElementById('progressFill');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    const sp = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (progressFill) progressFill.style.width = (sp * 100) + '%';
}, { passive: true });

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger?.addEventListener('click', () => { burger.classList.toggle('active'); mobileMenu?.classList.toggle('active'); });
document.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', () => { burger?.classList.remove('active'); mobileMenu?.classList.remove('active'); }));

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
let glowVisible = false;
window.addEventListener('mousemove', (e) => {
    if (!glowVisible) { cursorGlow.style.opacity = '1'; glowVisible = true; }
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});
window.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; glowVisible = false; });

// ===== SCROLLTRIGGER =====
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    // Lenis + ScrollTrigger sync
    if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }
    
    // Section headers
    gsap.utils.toArray('.section-head').forEach(h => {
        gsap.from(h, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    
    // Work items
    gsap.utils.toArray('.work-item').forEach((c, i) => {
        gsap.from(c, { y: 60, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
    });
    
    // About
    gsap.from('.about__left > *', { y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.about__left', start: 'top 80%' } });
    gsap.from('.about-card', { x: 40, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.about__right', start: 'top 80%' } });
    
    // Skill cards
    gsap.utils.toArray('.skill-card').forEach((c, i) => {
        gsap.from(c, { y: 60, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 85%' } });
    });
    
    // Skill bars
    document.querySelectorAll('.skill-item__fill').forEach(fill => {
        ScrollTrigger.create({
            trigger: fill, start: 'top 90%', once: true,
            onEnter: () => { fill.style.width = fill.dataset.w + '%'; }
        });
    });
    
    // Tool chips
    gsap.from('.tool-chip', { y: 30, opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power3.out', scrollTrigger: { trigger: '.tools__grid', start: 'top 85%' } });
    
    // Contact
    gsap.from('.contact__title, .contact__desc, .contact__email, .contact__socials', { y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.contact__inner', start: 'top 80%' } });
    
    // Footer
    gsap.from('.footer > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 95%' } });
    
    window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 200));
}

// ===== SAFETY NET =====
setTimeout(() => {
    document.querySelectorAll('[data-anim], .section-head, .work-item, .about__left > *, .about-card, .skill-card, .tool-chip, .contact__title, .contact__desc, .contact__email, .contact__socials, .footer > *').forEach(el => {
        if (parseFloat(window.getComputedStyle(el).opacity) < 0.5) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
    });
    document.querySelectorAll('.skill-item__fill').forEach(fill => { if (!fill.style.width || fill.style.width === '0px') fill.style.width = fill.dataset.w + '%'; });
}, 4000);

// ===== COUNTERS =====
const counters = document.querySelectorAll('[data-count]');
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target, target = parseInt(el.dataset.count);
            let cur = 0; const inc = Math.max(1, Math.floor(target / 30));
            const t = setInterval(() => { cur += inc; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = cur; }, 40);
            obs.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => obs.observe(c));

// ===== VIDEO MODAL =====
const modal = document.getElementById('videoModal');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalBg = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.work-item').forEach(card => {
    card.addEventListener('click', () => {
        modalPlayer.innerHTML = `<iframe src="https://www.tiktok.com/player/v1/${card.dataset.projectVideo}?autoplay=1" allow="autoplay; fullscreen" scrolling="no"></iframe>`;
        modalTitle.textContent = card.dataset.projectTitle;
        modal.classList.add('active');
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    modal.classList.remove('active');
    modalPlayer.innerHTML = '';
    if (lenis) lenis.start();
    document.body.style.overflow = '';
}
modalBg?.addEventListener('click', closeModal);
modalClose?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });