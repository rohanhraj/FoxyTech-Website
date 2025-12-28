/* =============================================
   FoxyTech - Enhanced Particle System
   ============================================= */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.connectDistance = 180;
        this.mousePosition = { x: null, y: null };
        this.mouseTrail = [];
        this.maxTrailLength = 20;
        this.time = 0;
        this.glowIntensity = 0;

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2.5 + 1,
                baseRadius: Math.random() * 2.5 + 1,
                // Cycle between brand colors
                hue: Math.random() > 0.5 ? 22 : 195, // Orange or Cyan
                saturation: 100,
                lightness: 55,
                alpha: Math.random() * 0.5 + 0.3,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;

            // Add to trail
            this.mouseTrail.unshift({ x: e.clientX, y: e.clientY, age: 0 });
            if (this.mouseTrail.length > this.maxTrailLength) {
                this.mouseTrail.pop();
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mousePosition.x = null;
            this.mousePosition.y = null;
            this.mouseTrail = [];
        });
    }

    drawParticle(particle) {
        const { x, y, radius, hue, saturation, lightness, alpha } = particle;

        // Outer glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0)`);

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Core particle
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${alpha + 0.3})`;
        this.ctx.fill();
    }

    drawMouseTrail() {
        if (this.mouseTrail.length < 2) return;

        for (let i = 0; i < this.mouseTrail.length; i++) {
            const point = this.mouseTrail[i];
            const alpha = 1 - (i / this.mouseTrail.length);
            const radius = (1 - i / this.mouseTrail.length) * 8;

            const gradient = this.ctx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, radius * 3
            );
            gradient.addColorStop(0, `rgba(255, 122, 47, ${alpha * 0.6})`);
            gradient.addColorStop(0.5, `rgba(255, 122, 47, ${alpha * 0.2})`);
            gradient.addColorStop(1, 'rgba(255, 122, 47, 0)');

            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, radius * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }

    drawCursorSpotlight() {
        if (this.mousePosition.x === null) return;

        const { x, y } = this.mousePosition;
        const spotlightRadius = 200;

        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, spotlightRadius);
        gradient.addColorStop(0, 'rgba(255, 122, 47, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.beginPath();
        this.ctx.arc(x, y, spotlightRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectDistance) {
                    const opacity = 1 - (distance / this.connectDistance);

                    // Gradient line between particles
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    gradient.addColorStop(0, `hsla(${this.particles[i].hue}, 100%, 60%, ${opacity * 0.3})`);
                    gradient.addColorStop(1, `hsla(${this.particles[j].hue}, 100%, 60%, ${opacity * 0.3})`);

                    this.ctx.beginPath();
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = opacity * 1.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        // Pulsing effect
        particle.pulsePhase += particle.pulseSpeed;
        particle.radius = particle.baseRadius + Math.sin(particle.pulsePhase) * 0.5;
        particle.alpha = 0.4 + Math.sin(particle.pulsePhase) * 0.2;

        // Color morphing
        if (Math.random() < 0.001) {
            particle.hue = particle.hue === 22 ? 195 : 22;
        }

        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges with smooth deceleration
        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.vx *= -0.9;
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.vy *= -0.9;
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        }

        // Mouse interaction - magnetic attraction/repulsion
        if (this.mousePosition.x !== null) {
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                const force = (200 - distance) / 200;
                // Attract particles within close range, repel at very close range
                if (distance > 50) {
                    // Gentle attraction
                    particle.vx += (dx / distance) * force * 0.03;
                    particle.vy += (dy / distance) * force * 0.03;
                } else {
                    // Repulsion when too close
                    particle.vx -= (dx / distance) * force * 0.1;
                    particle.vy -= (dy / distance) * force * 0.1;
                }

                // Increase glow near mouse
                particle.alpha = Math.min(0.9, particle.alpha + force * 0.3);
            }

            // Limit velocity
            const maxVelocity = 2;
            const currentVelocity = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
            if (currentVelocity > maxVelocity) {
                particle.vx = (particle.vx / currentVelocity) * maxVelocity;
                particle.vy = (particle.vy / currentVelocity) * maxVelocity;
            }
        }
    }

    drawCenterGlow() {
        this.glowIntensity = 0.3 + Math.sin(this.time * 0.02) * 0.1;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, `rgba(255, 122, 47, ${this.glowIntensity * 0.15})`);
        gradient.addColorStop(0.5, `rgba(0, 212, 255, ${this.glowIntensity * 0.08})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    animate() {
        this.time++;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background effects
        this.drawCenterGlow();
        this.drawCursorSpotlight();
        this.drawMouseTrail();

        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        // Draw connections
        this.connectParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        new ParticleSystem('particles-canvas');
    }
});
