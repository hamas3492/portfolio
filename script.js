/* ===== HAMAS AHMED — AURORA STUDIO PORTFOLIO JS ===== */

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader')?.classList.add('hide');
        animateHero();
    }, 1500);
});

// Hero animation
function animateHero() {
    if (!window.gsap) return;
    gsap.from('.hero__badge', { y: 20, opacity: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
    gsap.from('.hero__word', { y: 80, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.2, ease: 'power4.out' });
    gsap.from('.hero__sub', { y: 20, opacity: 0, duration: 0.6, delay: 0.6, ease: 'power3.out' });
    gsap.from('.hero__btns .btn', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero__stat', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 1, ease: 'power3.out' });
    gsap.from('.hero__stat-sep', { scaleY: 0, opacity: 0, duration: 0.4, stagger: 0.1, delay: 1.1, ease: 'power3.out' });
}

// Nav scroll
window.addEventListener('scroll', () => {
    document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger?.addEventListener('click', () => { burger.classList.toggle('active'); mobileMenu?.classList.toggle('active'); });
document.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', () => { burger?.classList.remove('active'); mobileMenu?.classList.remove('active'); }));

// ScrollTrigger
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    
    gsap.utils.toArray('.section-head').forEach(h => {
        gsap.from(h, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    gsap.utils.toArray('.glass-card').forEach((c, i) => {
        gsap.from(c, { y: 60, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 85%' } });
    });
    gsap.from('.about__lead, .about__body, .about__chips', { y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.about__grid', start: 'top 80%' } });
    gsap.utils.toArray('.skill-bar').forEach((s, i) => {
        gsap.from(s, { y: 30, opacity: 0, duration: 0.5, delay: i * 0.08, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 90%' } });
    });
    gsap.from('.contact__big, .contact__big2, .contact__email, .contact__socials', { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.contact', start: 'top 80%' } });
    gsap.from('.footer > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 95%' } });
    
    // Skill bar fills
    document.querySelectorAll('.skill-bar__fill').forEach(fill => {
        ScrollTrigger.create({
            trigger: fill, start: 'top 90%', once: true,
            onEnter: () => { fill.style.width = fill.dataset.w + '%'; }
        });
    });
    
    window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 200));
}

// Safety net: force-reveal stuck elements
setTimeout(() => {
    document.querySelectorAll('.section-head, .glass-card, .about__lead, .about__body, .about__chips, .skill-bar, .contact__big, .contact__big2, .contact__email, .contact__socials, .footer > *').forEach(el => {
        if (parseFloat(window.getComputedStyle(el).opacity) < 0.5) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
    });
}, 3500);

// Counter animation
const counters = document.querySelectorAll('[data-count]');
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target, target = parseInt(el.dataset.count);
            let cur = 0;
            const inc = Math.max(1, Math.floor(target / 30));
            const t = setInterval(() => { cur += inc; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = cur; }, 40);
            obs.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => obs.observe(c));

// Video modal
const modal = document.getElementById('videoModal');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalBg = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('click', () => {
        modalPlayer.innerHTML = `<iframe src="https://www.tiktok.com/player/v1/${card.dataset.projectVideo}?autoplay=1" allow="autoplay; fullscreen" scrolling="no"></iframe>`;
        modalTitle.textContent = card.dataset.projectTitle;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() { modal.classList.remove('active'); modalPlayer.innerHTML = ''; document.body.style.overflow = ''; }
modalBg?.addEventListener('click', closeModal);
modalClose?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });