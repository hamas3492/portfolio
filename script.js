/* ============================================
   HAMAS AHMED — CREATIVE VIDEO EDITOR
   moncy.dev inspired interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ===== Loader =====
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    const loaderFill = document.getElementById('loaderFill');
    
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loader.classList.add('is-done');
                startHeroAnim();
            }, 400);
        }
        loaderPercent.textContent = Math.floor(progress) + '%';
        loaderFill.style.width = progress + '%';
    }, 80);

    // ===== Nav scroll =====
    const nav = document.getElementById('nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (scroll > 20) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }
        lastScroll = scroll;
    }, { passive: true });

    // ===== Mobile menu =====
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    
    burger?.addEventListener('click', () => {
        mobileMenu.classList.add('is-open');
    });
    
    menuClose?.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
    });
    
    document.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
        });
    });

    // ===== Smooth scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== Hero animations =====
    function startHeroAnim() {
        if (typeof gsap === 'undefined') {
            // Fallback without GSAP
            document.querySelectorAll('.hero__left, .hero__avatar, .hero__right').forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 200);
            });
            return;
        }

        gsap.set('.hero__left, .hero__avatar, .hero__right', { opacity: 0, y: 40 });
        
        gsap.to('.hero__avatar', {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2
        });
        gsap.to('.hero__left', {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5
        });
        gsap.to('.hero__right', {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.7
        });
    }

    // ===== Scroll animations =====
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: header, start: 'top 85%' }
            });
        });

        // Timeline items
        gsap.utils.toArray('.timeline__item').forEach((item, i) => {
            gsap.from(item, {
                opacity: 0, x: -30, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 90%' }
            });
        });

        // Work items
        gsap.utils.toArray('.work__item').forEach((item, i) => {
            gsap.from(item, {
                opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 90%' }
            });
        });

        // Stack items
        gsap.utils.toArray('.stack__item').forEach((item, i) => {
            gsap.from(item, {
                opacity: 0, y: 40, duration: 0.6, ease: 'power3.out',
                delay: i * 0.1,
                scrollTrigger: { trigger: item, start: 'top 90%' }
            });
        });

        // Contact items
        gsap.utils.toArray('.contact__item').forEach((item, i) => {
            gsap.from(item, {
                opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
                delay: i * 0.1,
                scrollTrigger: { trigger: item, start: 'top 90%' }
            });
        });
    }

    // ===== Project Player =====
    const player = document.getElementById('projectPlayer');
    const playerBackdrop = document.getElementById('playerBackdrop');
    const playerClose = document.getElementById('playerClose');
    const playerMedia = document.getElementById('playerMedia');
    const playerTitle = document.getElementById('playerTitle');
    
    document.querySelectorAll('.project-card__play').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const videoId = btn.dataset.projectVideo;
            const title = btn.dataset.projectTitle;
            
            if (!videoId) return;
            
            playerTitle.textContent = title || 'Playing';
            playerMedia.innerHTML = `<iframe src="https://www.tiktok.com/embed/v2/${videoId}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
            player.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        });
    });
    
    function closePlayer() {
        player.classList.remove('is-open');
        playerMedia.innerHTML = '';
        document.body.style.overflow = '';
    }
    
    playerClose?.addEventListener('click', closePlayer);
    playerBackdrop?.addEventListener('click', closePlayer);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && player.classList.contains('is-open')) {
            closePlayer();
        }
    });
    
    // Close player when clicking on work item (not just the play button)
    document.querySelectorAll('.work__item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.project-card__play')) return;
            const playBtn = item.querySelector('.project-card__play');
            if (playBtn) playBtn.click();
        });
    });

    // ===== Active nav link on scroll =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === '#' + id 
                        ? 'var(--gold)' 
                        : '';
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => sectionObserver.observe(section));
});
