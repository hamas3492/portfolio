/* ===== HAMAS AHMED — EDITING TIMELINE PORTFOLIO JS ===== */

// ===== LOADER =====
const loaderFill = document.getElementById('loaderFill');
const loaderPct = document.getElementById('loaderPct');
let loadProgress = 0;

const loadTimer = setInterval(() => {
    loadProgress += Math.random() * 12;
    if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(loadTimer);
        setTimeout(() => {
            document.getElementById('loader').classList.add('hide');
            animateHero();
        }, 400);
    }
    if (loaderFill) loaderFill.style.width = loadProgress + '%';
    if (loaderPct) loaderPct.textContent = Math.floor(loadProgress) + '%';
}, 120);

// ===== HERO ANIMATION =====
function animateHero() {
    if (!window.gsap) return;
    gsap.from('.hero__slate', { y: 20, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' });
    gsap.from('.hero__title .reveal', { y: 100, opacity: 0, duration: 1, stagger: 0.1, delay: 0.2, ease: 'power4.out' });
    gsap.from('.hero__sub', { y: 20, opacity: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' });
    gsap.from('.hero__btns .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.9, ease: 'power3.out' });
    gsap.from('.hero__photo', { x: 40, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
    gsap.from('.hero__photo-tag', { scale: 0, opacity: 0, duration: 0.5, delay: 1.2, ease: 'back.out(1.7)' });
    gsap.from('.hero__corner-bl, .hero__corner-br', { opacity: 0, duration: 0.8, delay: 1.4, ease: 'power3.out' });
}

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}
document.querySelectorAll('[data-nav]').forEach(a => {
    a.addEventListener('click', () => {
        burger?.classList.remove('active');
        mobileMenu?.classList.remove('active');
    });
});

// ===== TIMECODE DISPLAY =====
const timecodeEl = document.getElementById('timecode');
const renderFill = document.getElementById('renderFill');
const totalDuration = 272; // 4:32 in seconds

function formatTC(seconds) {
    const hh = 0;
    const mm = Math.floor(seconds / 60);
    const ss = Math.floor(seconds % 60);
    const ff = Math.floor((seconds % 1) * 24);
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}:${String(ff).padStart(2,'0')}`;
}

window.addEventListener('scroll', () => {
    const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const currentSec = scrollProgress * totalDuration;
    if (timecodeEl) timecodeEl.textContent = formatTC(currentSec);
    if (renderFill) renderFill.style.width = (scrollProgress * 100) + '%';
}, { passive: true });

// ===== SCROLLTRIGGER ANIMATIONS =====
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Track headers
    gsap.utils.toArray('.track-header').forEach(head => {
        gsap.from(head, {
            y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: head, start: 'top 85%' }
        });
    });
    
    // Clips
    gsap.utils.toArray('.clip').forEach((clip, i) => {
        gsap.from(clip, {
            x: -60, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: clip, start: 'top 85%' }
        });
    });
    
    // About text
    gsap.from('.about__left p', {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__left', start: 'top 80%' }
    });
    
    // Stats
    gsap.from('.stat', {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__right', start: 'top 80%' }
    });
    
    // Gear cards
    gsap.from('.gear-card', {
        y: 50, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.gear__grid', start: 'top 80%' }
    });
    
    // Contact
    gsap.from('.contact__big, .contact__email, .contact__socials', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact', start: 'top 80%' }
    });
    
    // Footer
    gsap.from('.footer__left, .footer__right', {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer', start: 'top 95%' }
    });
}

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            let current = 0;
            const increment = Math.max(1, Math.floor(target / 30));
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current;
            }, 40);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ===== VIDEO MODAL =====
const modal = document.getElementById('videoModal');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalBg = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.clip').forEach(card => {
    card.addEventListener('click', () => {
        const videoId = card.dataset.projectVideo;
        const title = card.dataset.projectTitle;
        modalPlayer.innerHTML = `<iframe src="https://www.tiktok.com/player/v1/${videoId}?autoplay=1" allow="autoplay; fullscreen" scrolling="no"></iframe>`;
        modalTitle.textContent = title;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    modal.classList.remove('active');
    modalPlayer.innerHTML = '';
    document.body.style.overflow = '';
}
if (modalBg) modalBg.addEventListener('click', closeModal);
if (modalClose) modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});