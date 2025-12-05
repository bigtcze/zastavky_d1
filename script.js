// Zástavky D1 - JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Theme Toggle - Pill Switch
    const html = document.documentElement;
    const options = document.querySelectorAll('.theme-toggle-option');

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    }

    // Set initial active state based on saved theme
    options.forEach(option => {
        if (option.dataset.theme === savedTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    options.forEach(option => {
        option.addEventListener('click', function () {
            const selectedTheme = this.dataset.theme;

            // Update active state on toggle options
            options.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            if (selectedTheme === 'dark') {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // Filter Functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const stopCards = document.querySelectorAll('.stop-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            stopCards.forEach(card => {
                if (filter === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const tags = card.dataset.tags || '';
                    card.classList.toggle('hidden', !tags.includes(filter));
                }
            });
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = (document.querySelector('.navbar')?.offsetHeight || 0) +
                    (document.querySelector('.filter-section')?.offsetHeight || 0) + 20;
                window.scrollTo({
                    top: targetElement.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.pageYOffset > 100 ? 'var(--shadow)' : 'none';
    });

    // Animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.stop-card, .tip-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background-color 0.3s, border-color 0.3s';
        observer.observe(card);
    });

    // Placeholder images
    const heroImage = document.getElementById('heroImage');
    const storyImage = document.getElementById('storyImage');
    function createPlaceholder(text) {
        const isDark = html.getAttribute('data-theme') === 'dark';
        const bg = isDark ? '#111' : '#f5f5f7';
        const fg = isDark ? '#333' : '#ccc';
        return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="${bg}" width="800" height="600"/><text x="400" y="300" text-anchor="middle" fill="${fg}" font-family="Inter, sans-serif" font-size="24">${text}</text></svg>`)}`;
    }
    if (heroImage) heroImage.onerror = function () { this.src = createPlaceholder('🚗 Zástavky D1'); };
    if (storyImage) storyImage.onerror = function () { this.src = createPlaceholder('👨‍👩‍👧‍👦 Rodinný výlet'); };
});
