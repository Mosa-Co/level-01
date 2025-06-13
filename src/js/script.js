// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the application
    initializeSplashScreen();
    initializeLanguageToggle();
    initializeThemeToggle();
    initializeScrollEffects();
    initializeBackToTop();
    loadBrandConfiguration();
});

// Load brand configuration
function loadBrandConfiguration() {
    if (typeof BRAND_CONFIG !== 'undefined') {
        // Update brand elements with configuration
        const brandElements = document.querySelectorAll('.brand-text, .cafe-name');
        brandElements.forEach(element => {
            const currentLang = document.documentElement.lang || 'en';
            element.textContent = BRAND_CONFIG.name[currentLang];
        });

        // Update logo icons
        const logoElements = document.querySelectorAll('.navbar-brand i, .brand-logo i, .logo-animation i');
        logoElements.forEach(element => {
            element.className = BRAND_CONFIG.logo;
        });
    }
}

// Splash Screen Management
function initializeSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');

    if (splashScreen) {
        // Hide splash screen after 3 seconds
        setTimeout(() => {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }, 3000);
    }
}

// Language Toggle Functionality
function initializeLanguageToggle() {
    const languageSwitch = document.getElementById('languageSwitch');
    const langLabels = document.querySelectorAll('.lang-label');

    if (languageSwitch) {
        languageSwitch.addEventListener('change', function () {
            const isArabic = this.checked;
            const currentLang = isArabic ? 'ar' : 'en';

            // Update document attributes
            document.documentElement.lang = currentLang;
            document.documentElement.dir = isArabic ? 'rtl' : 'ltr';

            // Update active language label
            langLabels.forEach(label => {
                label.classList.remove('active');
                if (label.dataset.lang === currentLang) {
                    label.classList.add('active');
                }
            });

            // Update all translatable elements
            updateLanguageContent(currentLang);

            // Update brand configuration
            loadBrandConfiguration();
        });
    }
}

// Update content based on selected language
function updateLanguageContent(lang) {
    const elements = document.querySelectorAll('[data-en][data-ar]');

    elements.forEach(element => {
        const content = element.getAttribute(`data-${lang}`);
        if (content) {
            element.textContent = content;
        }
    });
}

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeSwitch = document.getElementById('themeSwitch');

    if (themeSwitch) {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        themeSwitch.checked = savedTheme === 'dark';

        themeSwitch.addEventListener('change', function () {
            const theme = this.checked ? 'dark' : 'light';
            setTheme(theme);
            localStorage.setItem('theme', theme);
        });
    }
}

// Set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Back to Top Functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.98)';
                }
            } else {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.95)';
                }
            }
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.menu-item-card, .about-content, .menu-preview');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Menu page specific functionality
if (window.location.pathname.includes('menu.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        // Initialize Bootstrap tabs
        const triggerTabList = [].slice.call(document.querySelectorAll('#menuTabs button'));
        triggerTabList.forEach(function (triggerEl) {
            const tabTrigger = new bootstrap.Tab(triggerEl);

            triggerEl.addEventListener('click', function (event) {
                event.preventDefault();
                tabTrigger.show();
            });
        });

        // Add animation to menu items when tab is shown
        const tabPanes = document.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => {
            pane.addEventListener('shown.bs.tab', function () {
                const menuItems = this.querySelectorAll('.menu-item-card');
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            });
        });
    });
}

// Utility function to handle responsive navigation
function handleResponsiveNav() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');

    if (navbarToggler) {
        navbarToggler.addEventListener('click', function () {
            navbar.classList.toggle('navbar-expanded');
        });
    }
}

// Initialize responsive navigation
handleResponsiveNav();

// Handle window resize
window.addEventListener('resize', function () {
    // Recalculate any position-dependent elements
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator && window.innerWidth <= 768) {
        scrollIndicator.style.bottom = '1rem';
    } else if (scrollIndicator) {
        scrollIndicator.style.bottom = '2rem';
    }

    // Adjust hero bottom CTA position
    const heroBottomCta = document.querySelector('.hero-bottom-cta');
    if (heroBottomCta && window.innerWidth <= 768) {
        heroBottomCta.style.bottom = '80px';
    } else if (heroBottomCta) {
        heroBottomCta.style.bottom = '120px';
    }
});

// Preload critical images
function preloadImages() {
    const images = [
        'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();