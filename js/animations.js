/* =============================================
   FoxyTech - Animation Controller
   ============================================= */

// Scroll Animation Observer
class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    // Trigger counter animation if element has data-count
                    if (entry.target.dataset.count) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, this.observerOptions);

        // Observe all elements with .animate class
        document.querySelectorAll('.animate').forEach(el => {
            observer.observe(el);
        });

        // Observe counter elements
        document.querySelectorAll('[data-count]').forEach(el => {
            observer.observe(el);
        });
    }

    animateCounter(element) {
        if (element.dataset.animated) return;
        element.dataset.animated = 'true';

        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(start + (target - start) * easedProgress);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
                // Add suffix if exists
                if (element.dataset.suffix) {
                    element.textContent += element.dataset.suffix;
                }
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// Typing Effect
class TypeWriter {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
    }

    type() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    start() {
        this.element.textContent = '';
        this.type();
    }
}

// Parallax Effect
class ParallaxController {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        if (this.elements.length === 0) return;

        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.update());
        });
    }

    update() {
        const scrollY = window.scrollY;

        this.elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Add animate-ready class to body to enable animations
        document.body.classList.add('animate-ready');

        // Small delay to let CSS transitions initialize
        requestAnimationFrame(() => {
            new ScrollAnimator();
            new ParallaxController();
        });
    } else {
        // Show all animated elements immediately for reduced motion
        document.querySelectorAll('.animate').forEach(el => {
            el.classList.add('in-view');
        });
    }
});
