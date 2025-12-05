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

    // Filter Toggle for Mobile
    const filterToggle = document.getElementById('filterToggle');
    const filterContent = document.getElementById('filterContent');

    if (filterToggle && filterContent) {
        filterToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            filterContent.classList.toggle('active');
        });
    }

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

    // ========================================
    // GEOLOCATION MODULE
    // ========================================
    const locationBtn = document.getElementById('locationBtn');
    const locationStatus = document.getElementById('locationStatus');

    // D1 Highway reference points (approximate) 
    // Prague (km 0) to Brno (km 248)
    const D1_START = { lat: 50.0755, lng: 14.4378, km: 0 };    // Prague
    const D1_END = { lat: 49.1951, lng: 16.6068, km: 248 };    // Brno

    // Calculate distance from point to D1 line and estimate km
    function estimateD1Km(lat, lng) {
        // Vector from D1_START to D1_END
        const dx = D1_END.lng - D1_START.lng;
        const dy = D1_END.lat - D1_START.lat;

        // Vector from D1_START to user point
        const px = lng - D1_START.lng;
        const py = lat - D1_START.lat;

        // Project user point onto D1 line (0 = Prague, 1 = Brno)
        const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)));

        // Estimated km
        const km = Math.round(t * 248);

        // Distance from D1 (rough check if user is near highway)
        const closestLng = D1_START.lng + t * dx;
        const closestLat = D1_START.lat + t * dy;
        const distFromD1 = Math.sqrt(Math.pow(lat - closestLat, 2) + Math.pow(lng - closestLng, 2)) * 111; // km approx

        return { km, distFromD1, t };
    }

    // Find and highlight nearest stops
    function highlightNearestStops(userKm) {
        // Clear previous highlights
        document.querySelectorAll('.stop-card.nearest-stop').forEach(card => {
            card.classList.remove('nearest-stop');
            const badge = card.querySelector('.nearest-badge');
            if (badge) badge.remove();
        });

        // Get all stop cards and their km values
        const brnoStops = Array.from(document.querySelectorAll('#smer-brno .stop-card, #stopsBrno .stop-card'));
        const prahaStops = Array.from(document.querySelectorAll('#smer-praha .stop-card, #stopsPraha .stop-card'));

        function getKm(card) {
            const kmEl = card.querySelector('.km-number');
            return kmEl ? parseInt(kmEl.textContent) : null;
        }

        // Find nearest stop going towards Brno (higher km)
        let nearestBrno = null;
        let nearestBrnoDist = Infinity;
        brnoStops.forEach(card => {
            const km = getKm(card);
            if (km !== null && km >= userKm) {
                const dist = km - userKm;
                if (dist < nearestBrnoDist) {
                    nearestBrnoDist = dist;
                    nearestBrno = card;
                }
            }
        });

        // Find nearest stop going towards Praha (lower km for smer-brno list, or use praha stops)
        let nearestPraha = null;
        let nearestPrahaDist = Infinity;
        prahaStops.forEach(card => {
            const km = getKm(card);
            if (km !== null) {
                // Praha stops go from 249 down, so we need stops with km <= userKm
                const dist = Math.abs(km - userKm);
                if (km <= userKm + 20 && dist < nearestPrahaDist) {
                    nearestPrahaDist = dist;
                    nearestPraha = card;
                }
            }
        });

        // Highlight nearest stops
        if (nearestBrno) {
            nearestBrno.classList.add('nearest-stop');
            const badge = document.createElement('span');
            badge.className = 'nearest-badge';
            badge.textContent = '📍 Nejbližší';
            nearestBrno.appendChild(badge);
        }

        if (nearestPraha) {
            nearestPraha.classList.add('nearest-stop');
            const badge = document.createElement('span');
            badge.className = 'nearest-badge';
            badge.textContent = '📍 Nejbližší';
            nearestPraha.appendChild(badge);
        }

        // Scroll to nearest stop in current direction (optional)
        if (nearestBrno) {
            nearestBrno.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Handle location button click
    if (locationBtn) {
        locationBtn.addEventListener('click', function () {
            if (!navigator.geolocation) {
                locationStatus.textContent = 'Geolokace není podporována';
                locationStatus.className = 'location-status error';
                return;
            }

            locationBtn.classList.add('loading');
            locationStatus.textContent = 'Zjišťuji polohu...';
            locationStatus.className = 'location-status';

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const result = estimateD1Km(latitude, longitude);

                    locationBtn.classList.remove('loading');

                    if (result.distFromD1 > 50) {
                        locationStatus.textContent = `Jste ${Math.round(result.distFromD1)} km od D1`;
                        locationStatus.className = 'location-status error';
                    } else {
                        locationStatus.textContent = `📍 Přibližně ${result.km}. km D1`;
                        locationStatus.className = 'location-status success';
                        highlightNearestStops(result.km);
                    }
                },
                (error) => {
                    locationBtn.classList.remove('loading');
                    let msg = 'Poloha není dostupná na tomto zařízení';
                    if (error.code === 1) msg = 'Přístup k poloze zamítnut';
                    if (error.code === 3) msg = 'Časový limit vypršel';

                    // For desktop without GPS, offer manual input
                    if (error.code === 2) {
                        const userKm = prompt('GPS není dostupná. Zadejte přibližný km na D1 (0-248):');
                        if (userKm !== null && !isNaN(parseInt(userKm))) {
                            const km = Math.max(0, Math.min(248, parseInt(userKm)));
                            locationStatus.textContent = `📍 Zadáno: ${km}. km D1`;
                            locationStatus.className = 'location-status success';
                            highlightNearestStops(km);
                            return;
                        }
                    }

                    locationStatus.textContent = msg;
                    locationStatus.className = 'location-status error';
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
            );
        });
    }
});
