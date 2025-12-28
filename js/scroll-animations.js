/**
 * FoxyTech - Advanced Scroll Animations
 * Using GSAP, ScrollTrigger, and Lenis for buttery smooth effects
 */

// ==========================================
// Initialize Lenis Smooth Scroll
// ==========================================
class SmoothScroll {
    constructor() {
        this.lenis = null;
        this.init();
    }

    init() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Connect Lenis to GSAP ScrollTrigger
        this.lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }
}

// ==========================================
// Text Split Animation (Character by Character)
// ==========================================
class TextSplitReveal {
    constructor() {
        this.init();
    }

    splitText(element) {
        const text = element.textContent;
        element.innerHTML = '';

        // Split into words first, then characters
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';

            word.split('').forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                charSpan.style.transform = 'translateY(120%)';
                charSpan.style.opacity = '0';
                wordSpan.appendChild(charSpan);
            });

            element.appendChild(wordSpan);

            // Add space between words
            if (wordIndex < words.length - 1) {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                space.style.display = 'inline-block';
                element.appendChild(space);
            }
        });
    }

    init() {
        // Select all elements with text reveal animation
        const textElements = document.querySelectorAll('[data-text-reveal]');

        textElements.forEach((element) => {
            this.splitText(element);

            const chars = element.querySelectorAll('.char');

            gsap.to(chars, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.02,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
}

// ==========================================
// Hero Text Animation (Special Treatment)
// ==========================================
class HeroAnimation {
    constructor() {
        this.init();
    }

    init() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroCta = document.querySelector('.hero-cta');

        if (!heroTitle) return;

        // Create timeline for hero
        const tl = gsap.timeline({ delay: 0.5 });

        // Animate hero title words
        if (heroTitle) {
            const words = heroTitle.querySelectorAll('.word, span');
            if (words.length === 0) {
                // If no spans, animate the whole element
                tl.from(heroTitle, {
                    y: 100,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power4.out'
                });
            } else {
                tl.from(words, {
                    y: 100,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power4.out'
                });
            }
        }

        // Animate subtitle
        if (heroSubtitle) {
            tl.from(heroSubtitle, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5');
        }

        // Animate CTA buttons
        if (heroCta) {
            const buttons = heroCta.querySelectorAll('.btn, a');
            tl.from(buttons, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.4');
        }

        // Animate scroll indicator
        const scrollIndicator = document.querySelector('.scroll-down');
        if (scrollIndicator) {
            tl.from(scrollIndicator, {
                opacity: 0,
                y: -20,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.2');
        }
    }
}

// ==========================================
// Parallax Effects
// ==========================================
class ParallaxEffects {
    constructor() {
        this.init();
    }

    init() {
        // Image parallax
        const parallaxImages = document.querySelectorAll('[data-parallax]');

        parallaxImages.forEach((img) => {
            const speed = parseFloat(img.dataset.parallax) || 0.3;

            gsap.to(img, {
                yPercent: speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('section') || img,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Background parallax for sections
        const parallaxSections = document.querySelectorAll('[data-parallax-bg]');

        parallaxSections.forEach((section) => {
            const bg = section.querySelector('.parallax-bg') || section;

            gsap.to(bg, {
                backgroundPositionY: '30%',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }
}

// ==========================================
// Section Reveal Animations
// ==========================================
class SectionReveals {
    constructor() {
        this.init();
    }

    init() {
        // Fade up elements
        gsap.utils.toArray('[data-fade-up]').forEach((element) => {
            gsap.from(element, {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Fade in elements
        gsap.utils.toArray('[data-fade-in]').forEach((element) => {
            gsap.from(element, {
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Scale up elements
        gsap.utils.toArray('[data-scale-up]').forEach((element) => {
            gsap.from(element, {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Stagger children
        gsap.utils.toArray('[data-stagger-children]').forEach((container) => {
            const children = container.children;
            const staggerAmount = parseFloat(container.dataset.staggerChildren) || 0.1;

            gsap.from(children, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: staggerAmount,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
}

// ==========================================
// Horizontal Scroll Section
// ==========================================
class HorizontalScroll {
    constructor() {
        this.init();
    }

    init() {
        const horizontalSections = document.querySelectorAll('[data-horizontal-scroll]');

        horizontalSections.forEach((section) => {
            const wrapper = section.querySelector('.horizontal-wrapper');
            if (!wrapper) return;

            const items = wrapper.children;
            const totalWidth = wrapper.scrollWidth - window.innerWidth;

            gsap.to(wrapper, {
                x: -totalWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${totalWidth}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });
        });
    }
}

// ==========================================
// Magnetic Cursor Effect (Enhanced)
// ==========================================
class MagneticCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.init();
    }

    init() {
        // Only on desktop
        if (window.innerWidth < 1024) return;

        // Create custom cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);

        // Track mouse
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor follow
        gsap.ticker.add(() => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            gsap.set(this.cursor, { x: cursorX, y: cursorY });
            gsap.set(this.cursorDot, { x: mouseX, y: mouseY });
        });

        // Magnetic effect on buttons/links
        const magneticElements = document.querySelectorAll('a, button, .magnetic');

        magneticElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                gsap.to(this.cursor, { scale: 1.5, duration: 0.3 });
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                gsap.to(this.cursor, { scale: 1, duration: 0.3 });
            });

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.2;
                const deltaY = (e.clientY - centerY) * 0.2;

                gsap.to(el, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }
}

// ==========================================
// Image Reveal Animation
// ==========================================
class ImageReveal {
    constructor() {
        this.init();
    }

    init() {
        const revealImages = document.querySelectorAll('[data-image-reveal]');

        revealImages.forEach((container) => {
            const img = container.querySelector('img');
            if (!img) return;

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'image-reveal-overlay';
            overlay.style.cssText = `
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, #ff7a2f 0%, #00d4ff 100%);
                transform-origin: left;
                z-index: 2;
            `;
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            container.appendChild(overlay);

            // Initial state
            gsap.set(img, { scale: 1.3 });

            // Animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            tl.to(overlay, {
                scaleX: 0,
                transformOrigin: 'right',
                duration: 1,
                ease: 'power4.inOut'
            })
                .to(img, {
                    scale: 1,
                    duration: 1.2,
                    ease: 'power3.out'
                }, '-=0.8');
        });
    }
}

// ==========================================
// Counter Animation (Enhanced)
// ==========================================
class CounterAnimation {
    constructor() {
        this.init();
    }

    init() {
        const counters = document.querySelectorAll('[data-count]');

        counters.forEach((counter) => {
            const target = parseInt(counter.dataset.count);
            const suffix = counter.dataset.suffix || '';
            const prefix = counter.dataset.prefix || '';

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerHTML: 1 },
                        onUpdate: function () {
                            counter.innerHTML = prefix + Math.round(this.targets()[0].innerHTML) + suffix;
                        }
                    });
                },
                once: true
            });
        });
    }
}

// ==========================================
// Scroll Progress Indicator
// ==========================================
class ScrollProgress {
    constructor() {
        this.init();
    }

    init() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background: linear-gradient(90deg, #ff7a2f, #00d4ff);
            z-index: 9999;
            transition: none;
        `;
        document.body.appendChild(progressBar);

        gsap.to(progressBar, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }
}

// ==========================================
// Page Transition Effect
// ==========================================
class PageTransitions {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create transition overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #1a2845 0%, #0d1421 100%);
            z-index: 99999;
            transform: translateY(100%);
            pointer-events: none;
        `;
        document.body.appendChild(this.overlay);

        // Handle internal links
        document.querySelectorAll('a[href^="/"]:not([target]), a[href$=".html"]:not([target])').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                    e.preventDefault();
                    this.transitionTo(href);
                }
            });
        });

        // Animate in on page load
        gsap.fromTo(this.overlay,
            { translateY: 0 },
            { translateY: '-100%', duration: 0.8, ease: 'power3.inOut', delay: 0.1 }
        );
    }

    transitionTo(href) {
        gsap.to(this.overlay, {
            translateY: 0,
            duration: 0.6,
            ease: 'power3.inOut',
            onComplete: () => {
                window.location.href = href;
            }
        });
    }
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('Reduced motion preference detected. Animations disabled.');
        return;
    }

    // Initialize all animation classes
    new SmoothScroll();
    new ScrollProgress();
    new HeroAnimation();
    new TextSplitReveal();
    new ParallaxEffects();
    new SectionReveals();
    new ImageReveal();
    new CounterAnimation();
    // new MagneticCursor(); // DISABLED by user request
    new PageTransitions();

    // Refresh ScrollTrigger after images load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    console.log('🚀 FoxyTech Advanced Animations Initialized');
});

// Handle resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
