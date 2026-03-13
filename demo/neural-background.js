/**
 * Neural Network Background System
 * Creates AI-themed animated background elements
 * Inspired by neural connections, data flows, and agent networks
 */

class NeuralBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            particleCount: 50,
            connectionDistance: 150,
            colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
            speed: 0.5,
            ...options
        };
        
        this.particles = [];
        this.connections = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.6';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
    }
    
    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
                size: Math.random() * 2 + 1,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Update pulse for glow effect
            particle.pulse += 0.05;
        });
    }
    
    findConnections() {
        this.connections = [];
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectionDistance) {
                    this.connections.push({
                        p1: this.particles[i],
                        p2: this.particles[j],
                        distance: distance,
                        opacity: 1 - distance / this.options.connectionDistance
                    });
                }
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections first (behind particles)
        this.connections.forEach(conn => {
            const gradient = this.ctx.createLinearGradient(
                conn.p1.x, conn.p1.y,
                conn.p2.x, conn.p2.y
            );
            gradient.addColorStop(0, conn.p1.color + Math.floor(conn.opacity * 80).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, conn.p2.color + Math.floor(conn.opacity * 80).toString(16).padStart(2, '0'));
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(conn.p1.x, conn.p1.y);
            this.ctx.lineTo(conn.p2.x, conn.p2.y);
            this.ctx.stroke();
        });
        
        // Draw particles with glow effect
        this.particles.forEach(particle => {
            const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;
            const glowIntensity = 0.3 + Math.sin(particle.pulse) * 0.2;
            
            // Glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            
            // Main particle
            this.ctx.fillStyle = particle.color + Math.floor(glowIntensity * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
        });
    }
    
    animate() {
        this.updateParticles();
        this.findConnections();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    handleResize() {
        window.addEventListener('resize', () => this.resize());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
        window.removeEventListener('resize', this.resize);
    }
}

// Auto-initialize neural backgrounds
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero background if hero section exists
    const heroSection = document.querySelector('.hero-neural, .hero-section');
    if (heroSection) {
        heroSection.style.position = 'relative';
        new NeuralBackground(heroSection, {
            particleCount: 40,
            connectionDistance: 120,
            speed: 0.3
        });
    }
    
    // Initialize section backgrounds
    const neuralSections = document.querySelectorAll('.section-neural');
    neuralSections.forEach(section => {
        if (!section.querySelector('canvas')) {
            section.style.position = 'relative';
            new NeuralBackground(section, {
                particleCount: 20,
                connectionDistance: 100,
                speed: 0.2
            });
        }
    });
});

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NeuralBackground;
}
window.NeuralBackground = NeuralBackground;