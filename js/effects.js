/* =============================================
   FoxyTech - Interactive Effects Controller
   ============================================= */

// ==========================================
// Magnetic Button Effect
// ==========================================
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.boundingRect = null;
        this.strength = 0.3;

        this.init();
    }

    init() {
        this.element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';

        this.element.addEventListener('mouseenter', () => this.updateBounds());
        this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.element.addEventListener('mouseleave', () => this.onMouseLeave());
    }

    updateBounds() {
        this.boundingRect = this.element.getBoundingClientRect();
    }

    onMouseMove(e) {
        if (!this.boundingRect) return;

        const centerX = this.boundingRect.left + this.boundingRect.width / 2;
        const centerY = this.boundingRect.top + this.boundingRect.height / 2;

        const deltaX = (e.clientX - centerX) * this.strength;
        const deltaY = (e.clientY - centerY) * this.strength;

        this.element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    onMouseLeave() {
        this.element.style.transform = 'translate(0, 0)';
    }
}

// ==========================================
// 3D Tilt Card Effect
// ==========================================
class TiltCard {
    constructor(element) {
        this.element = element;
        this.boundingRect = null;
        this.maxRotation = 15;
        this.perspective = 1000;
        this.glareElement = null;

        this.init();
    }

    init() {
        this.element.style.transformStyle = 'preserve-3d';
        this.element.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';

        // Create glare overlay
        this.createGlare();

        this.element.addEventListener('mouseenter', () => this.onMouseEnter());
        this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.element.addEventListener('mouseleave', () => this.onMouseLeave());
    }

    createGlare() {
        this.glareElement = document.createElement('div');
        this.glareElement.className = 'tilt-glare';
        this.glareElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0) 50%);
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: inherit;
            z-index: 10;
        `;
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
        this.element.appendChild(this.glareElement);
    }

    onMouseEnter() {
        this.boundingRect = this.element.getBoundingClientRect();
        this.glareElement.style.opacity = '1';
    }

    onMouseMove(e) {
        if (!this.boundingRect) return;

        const x = e.clientX - this.boundingRect.left;
        const y = e.clientY - this.boundingRect.top;

        const centerX = this.boundingRect.width / 2;
        const centerY = this.boundingRect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -this.maxRotation;
        const rotateY = ((x - centerX) / centerX) * this.maxRotation;

        this.element.style.transform = `
            perspective(${this.perspective}px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(1.02, 1.02, 1.02)
        `;

        // Update glare position
        const glareX = (x / this.boundingRect.width) * 100;
        const glareY = (y / this.boundingRect.height) * 100;
        this.glareElement.style.background = `
            radial-gradient(circle at ${glareX}% ${glareY}%, 
            rgba(255,255,255,0.3) 0%, 
            rgba(255,255,255,0.1) 30%, 
            rgba(255,255,255,0) 60%)
        `;
    }

    onMouseLeave() {
        this.element.style.transform = `
            perspective(${this.perspective}px) 
            rotateX(0deg) 
            rotateY(0deg) 
            scale3d(1, 1, 1)
        `;
        this.glareElement.style.opacity = '0';
    }
}

// ==========================================
// Hero Text Animation - Elegant Typewriter Effect
// ==========================================
class HeroTextAnimation {
    constructor(element) {
        this.element = element;
        this.originalText = element.innerText;
        this.currentIndex = 0;
        this.typingSpeed = 100; // ms per character

        this.init();
    }

    init() {
        // Store original gradient style
        this.element.style.opacity = '1';

        // Clear the text and start typing
        this.element.textContent = '';
        this.element.style.borderRight = '3px solid #ff7a2f';

        // Start typing after a delay
        setTimeout(() => this.typeText(), 600);
    }

    typeText() {
        if (this.currentIndex < this.originalText.length) {
            this.element.textContent += this.originalText.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.typeText(), this.typingSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                this.element.style.borderRight = 'none';
                // Restore the gradient text style
                this.element.classList.add('text-gradient-animated');
            }, 500);
        }
    }
}

// ==========================================
// Shimmer Effect
// ==========================================
class ShimmerEffect {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        // Add shimmer pseudo-element styles
        this.element.classList.add('shimmer-effect');
    }
}

// ==========================================
// Ripple Effect
// ==========================================
class RippleEffect {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';

        this.element.addEventListener('click', (e) => this.createRipple(e));
    }

    createRipple(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: rippleAnimation 0.6s linear;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            margin-left: -5px;
            margin-top: -5px;
        `;

        this.element.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
    }
}

// ==========================================
// Stagger Reveal Animation
// ==========================================
class StaggerReveal {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const staggerItems = entry.target.querySelectorAll('.stagger-item');
                    staggerItems.forEach((item, index) => {
                        item.style.animationDelay = `${index * 100}ms`;
                        item.classList.add('stagger-visible');
                    });
                    entry.target.classList.add('stagger-revealed');
                }
            });
        }, this.observerOptions);

        document.querySelectorAll('.stagger-container').forEach(el => {
            observer.observe(el);
        });
    }
}

// ==========================================
// Smooth Number Counter
// ==========================================
class SmoothCounter {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.dataset.count) || 0;
        this.suffix = element.dataset.suffix || '';
        this.duration = 2500;
        this.counted = false;
    }

    animate() {
        if (this.counted) return;
        this.counted = true;

        const start = 0;
        const startTime = performance.now();

        const easeOutElastic = (t) => {
            const p = 0.3;
            return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
        };

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const easedProgress = easeOutElastic(progress);

            const current = Math.floor(start + (this.target - start) * Math.min(easedProgress, 1));
            this.element.textContent = current.toLocaleString() + (progress >= 1 ? this.suffix : '');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

// ==========================================
// Cursor Follower
// ==========================================
class CursorFollower {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.dotX = 0;
        this.dotY = 0;

        this.init();
    }

    init() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor-follower';
        this.cursor.innerHTML = '<div class="cursor-follower-inner"></div>';

        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);

        // Event listeners
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hover effects
        document.querySelectorAll('a, button, .card, .portfolio-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                this.cursorDot.classList.add('cursor-dot-hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                this.cursorDot.classList.remove('cursor-dot-hover');
            });
        });

        this.animate();
    }

    animate() {
        // Smooth follow with easing
        this.cursorX += (this.mouseX - this.cursorX) * 0.15;
        this.cursorY += (this.mouseY - this.cursorY) * 0.15;

        this.dotX += (this.mouseX - this.dotX) * 0.5;
        this.dotY += (this.mouseY - this.dotY) * 0.5;

        this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
        this.cursorDot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Scroll Progress Indicator
// ==========================================
class ScrollProgress {
    constructor() {
        this.progressBar = null;
        this.init();
    }

    init() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        document.body.appendChild(this.progressBar);

        window.addEventListener('scroll', () => this.update());
    }

    update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;

        this.progressBar.style.width = `${progress}%`;
    }
}

// ==========================================
// Initialize All Effects
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    // Initialize magnetic buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        new MagneticButton(btn);
    });

    // Initialize 3D tilt cards
    document.querySelectorAll('.service-card, .benefit-card, .portfolio-card').forEach(card => {
        new TiltCard(card);
    });

    // Initialize shimmer effect
    document.querySelectorAll('.btn').forEach(btn => {
        new ShimmerEffect(btn);
    });

    // Initialize ripple effect
    document.querySelectorAll('.btn, .card').forEach(el => {
        new RippleEffect(el);
    });

    // Initialize stagger reveal
    new StaggerReveal();

    // Initialize smooth counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = new SmoothCounter(entry.target);
                counter.animate();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    // Initialize cursor follower (DISABLED by user request)
    // if (!('ontouchstart' in window)) {
    //     new CursorFollower();
    // }

    // Initialize scroll progress
    new ScrollProgress();

    // Hero text animation (if exists)
    const heroGradientText = document.querySelector('.hero h1 .text-gradient');
    if (heroGradientText) {
        new HeroTextAnimation(heroGradientText);
    }
});

// Add ripple animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        to {
            transform: scale(40);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
