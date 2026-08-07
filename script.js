/* ===== HAMAS AHMED — PORTFOLIO JS ===== */

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hide');
        // Animate hero
        if (window.gsap) {
            gsap.from('.hero__tag', { y: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
            gsap.from('.hero__title .line', { y: 100, opacity: 0, duration: 1, stagger: 0.1, delay: 0.3, ease: 'power4.out' });
            gsap.from('.hero__sub', { y: 20, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
            gsap.from('.hero__btns .btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, delay: 1, ease: 'power3.out' });
            gsap.from('.hero__photo', { x: 40, opacity: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
        }
    }, 1800);
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// Mobile menu
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

// ScrollTrigger animations
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Section headers
    gsap.utils.toArray('.section-head').forEach(head => {
        gsap.from(head, {
            y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: head, start: 'top 85%' }
        });
    });
    
    // Work cards
    gsap.utils.toArray('.work-card').forEach((card, i) => {
        gsap.from(card, {
            y: 60, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' }
        });
    });
    
    // About text
    gsap.from('.about__text p', {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__text', start: 'top 80%' }
    });
    
    // Stats
    gsap.from('.stat', {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__stats', start: 'top 80%' }
    });
    
    // Contact
    gsap.from('.contact__big, .contact__email, .contact__socials', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact', start: 'top 80%' }
    });
    
    // Footer
    gsap.from('.footer p', {
        opacity: 0, duration: 1,
        scrollTrigger: { trigger: '.footer', start: 'top 95%' }
    });
}

// Counter animation
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
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current;
            }, 40);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// Video modal
const modal = document.getElementById('videoModal');
const modalPlayer = document.getElementById('modalPlayer');
const modalTitle = document.getElementById('modalTitle');
const modalBg = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.work-card').forEach(card => {
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