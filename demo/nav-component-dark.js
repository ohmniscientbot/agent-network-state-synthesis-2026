/**
 * Shared Neural Navigation Component
 * Dark theme navigation for AI Agent Network design system
 */

// Navigation configuration
const NAV_CONFIG = {
    links: [
        { href: 'index.html', icon: '🏠', label: 'Landing Page', id: 'landing' },
        { href: 'interactive.html', icon: '🎮', label: 'Interactive Demo', id: 'interactive' },
        { href: 'contracts.html', icon: '📜', label: 'Smart Contracts', id: 'contracts' },
        { href: 'dashboard.html', icon: '📊', label: 'Live Dashboard', id: 'dashboard' },
        { href: 'prediction-markets.html', icon: '🎯', label: 'Prediction Markets', id: 'prediction-markets' },
        { href: '/api/docs', icon: '📡', label: 'Agent API', id: 'api' }
    ]
};

// CSS for neural navigation styling - dark theme
const NAV_CSS = `
.nav-bar { 
    background: rgba(31, 31, 47, 0.6);
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 20px;
    padding: 12px 20px;
    margin-bottom: 32px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    backdrop-filter: blur(16px) saturate(180%);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
}
.nav-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
    opacity: 0.5;
}
.nav-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
    transition: left 0.8s ease;
}
.nav-bar:hover::after {
    left: 100%;
}
.nav-link { 
    color: #9ca3af;
    text-decoration: none;
    padding: 10px 16px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    font-weight: 500;
    font-size: 14px;
    position: relative;
    z-index: 1;
    backdrop-filter: blur(8px);
    border: 1px solid transparent;
}
.nav-link::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 1px;
    transition: width 0.3s ease;
}
.nav-link:hover { 
    color: #e6e7eb;
    background: rgba(59, 130, 246, 0.12);
    transform: translateY(-2px);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}
.nav-link:hover::before {
    width: 80%;
}
.nav-link.active { 
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    border-color: rgba(139, 92, 246, 0.6);
}
.nav-link.active::before {
    display: none;
}
.nav-link.active::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 12px;
    padding: 1px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
}

/* Neural pulse animation for active link */
.nav-link.active {
    animation: neuralPulse 2s ease-in-out infinite;
}

@keyframes neuralPulse {
    0%, 100% {
        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }
    50% {
        box-shadow: 0 8px 32px rgba(59, 130, 246, 0.6), 0 0 24px rgba(139, 92, 246, 0.3);
    }
}

/* Mobile responsive */
@media (max-width: 768px) {
    .nav-bar {
        flex-direction: column;
        gap: 4px;
        padding: 16px 20px;
    }
    
    .nav-link {
        text-align: center;
        padding: 12px 20px;
    }
}
`;

/**
 * Create navigation HTML
 * @param {string} activePage - ID of currently active page
 * @returns {string} Navigation HTML
 */
function createNavigation(activePage) {
    const links = NAV_CONFIG.links.map(link => {
        const activeClass = link.id === activePage ? 'active' : '';
        return `<a href="${link.href}" class="nav-link ${activeClass}">${link.icon} ${link.label}</a>`;
    }).join('');
    
    return `<div class="nav-bar">${links}</div>`;
}

/**
 * Inject CSS into page head
 */
function injectCSS() {
    // Only inject if not already present
    if (!document.querySelector('#nav-component-css')) {
        const style = document.createElement('style');
        style.id = 'nav-component-css';
        style.textContent = NAV_CSS;
        document.head.appendChild(style);
    }
}

/**
 * Add neural interaction effects
 */
function addNeuralEffects() {
    // Add hover sound effect (optional)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Add subtle glow effect
            this.style.filter = 'brightness(1.2)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
        
        // Add click ripple effect
        link.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(59, 130, 246, 0.5)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'neuralRipple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation if not already present
    if (!document.querySelector('#neural-ripple-animation')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'neural-ripple-animation';
        rippleStyle.textContent = `
            @keyframes neuralRipple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
}

/**
 * Render navigation into specified container
 * @param {string} containerId - ID of container element
 * @param {string} activePage - ID of currently active page
 */
function renderNavigation(containerId, activePage) {
    injectCSS();
    
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = createNavigation(activePage);
        // Add neural effects after rendering
        setTimeout(addNeuralEffects, 100);
    } else {
        console.warn(`Navigation container '${containerId}' not found`);
    }
}

/**
 * Auto-render navigation if container exists
 * Call this at the end of each page to auto-setup navigation
 * @param {string} activePage - ID of currently active page
 */
function initNavigation(activePage) {
    document.addEventListener('DOMContentLoaded', function() {
        renderNavigation('navigation-container', activePage);
    });
    
    // Also try to render immediately if DOM is already loaded
    if (document.readyState === 'loading') {
        // Wait for DOM content loaded
    } else {
        renderNavigation('navigation-container', activePage);
    }
}

// Export for use in different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderNavigation, initNavigation, createNavigation };
}

// Global function for direct script tag usage
window.renderNavigation = renderNavigation;
window.initNavigation = initNavigation;