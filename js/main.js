/* =============================================
   FoxyTech - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initCarousels();
    initFAQ();
    initForms();
    initRippleEffect();
    initSmoothScroll();
    initPortfolioFilter();
});

/* =============================================
   Header Scroll Effect
   ============================================= */

function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    // Check if header should always be in scrolled state (e.g., blog post pages)
    const alwaysScrolled = header.classList.contains('scrolled');
    let lastScrollY = window.scrollY;

    const updateHeader = () => {
        const scrollY = window.scrollY;

        if (scrollY > 100 || alwaysScrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateHeader);
    });

    updateHeader();
}

/* =============================================
   Mobile Menu
   ============================================= */

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    if (!menuBtn || !mobileNav) return;

    const toggleMenu = () => {
        menuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    });
}

/* =============================================
   Carousels / Sliders
   ============================================= */

function initCarousels() {
    initPortfolioSlider();
    initTestimonialsSlider();
}

function initPortfolioSlider() {
    const track = document.querySelector('.portfolio-track');
    const slides = document.querySelectorAll('.portfolio-slide');
    const prevBtn = document.querySelector('.portfolio-prev');
    const nextBtn = document.querySelector('.portfolio-next');
    const dots = document.querySelectorAll('.portfolio-dot');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;
    const slideCount = slides.length;

    const getSlideWidth = () => {
        const slide = slides[0];
        const style = getComputedStyle(slide);
        const gap = parseInt(getComputedStyle(track).gap) || 32;
        return slide.offsetWidth + gap;
    };

    const updateSlider = () => {
        const offset = -currentIndex * getSlideWidth();
        track.style.transform = `translateX(${offset}px)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
    };

    const goToSlide = (index) => {
        currentIndex = index;
        updateSlider();
    };

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { stopAutoPlay(); goToSlide(index); startAutoPlay(); });
    });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });

    const handleSwipe = () => {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    };

    // Start autoplay
    startAutoPlay();

    // Handle resize
    window.addEventListener('resize', updateSlider);
}

function initTestimonialsSlider() {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;

    // Similar implementation to portfolio slider
    // Can be extended as needed
}

/* =============================================
   FAQ Accordion
   ============================================= */

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                const a = i.querySelector('.faq-answer');
                if (a) a.style.maxHeight = '0';
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* =============================================
   Forms
   ============================================= */

function initForms() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm(form)) return;

            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="animate-spin">&#9696;</span> Sending...';

            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Thanks! We\'ll be in touch within 24 hours.';
            form.insertBefore(successMessage, form.firstChild);

            // Reset form
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            // Remove success message after 5 seconds
            setTimeout(() => successMessage.remove(), 5000);
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('[required]');

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });

    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =============================================
   Ripple Effect
   ============================================= */

function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* =============================================
   Smooth Scroll
   ============================================= */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =============================================
   Portfolio Filter
   ============================================= */

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items
            portfolioItems.forEach(item => {
                const category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    item.classList.add('animate-fade-up', 'in-view');
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
