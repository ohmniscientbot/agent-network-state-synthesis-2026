/**
 * Shared Navigation Component
 * Ensures all pages have consistent navigation
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

// CSS for organic navigation styling
const NAV_CSS = `
.nav-bar { 
    background: #ffffff; 
    border: 1px solid #e8eaf0; 
    border-radius: 16px; 
    padding: 12px 20px; 
    margin-bottom: 32px; 
    display: flex; 
    gap: 8px; 
    flex-wrap: wrap; 
    justify-content: center;
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.05), 0 1px 2px rgba(16, 24, 40, 0.03);
    position: relative;
    overflow: hidden;
}
.nav-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.03), transparent);
    transition: left 0.8s ease;
}
.nav-bar:hover::before {
    left: 100%;
}
.nav-link { 
    color: #525866; 
    text-decoration: none; 
    padding: 8px 16px; 
    border-radius: 12px; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    font-weight: 500;
    font-size: 14px;
    position: relative;
    z-index: 1;
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
    background: rgba(59, 130, 246, 0.08);
    color: #1a1d24;
    transform: translateY(-1px);
}
.nav-link:hover::before {
    width: 80%;
}
.nav-link.active { 
    background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
    color: white; 
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.nav-link.active::before {
    display: none;
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
 * Render navigation into specified container
 * @param {string} containerId - ID of container element
 * @param {string} activePage - ID of currently active page
 */
function renderNavigation(containerId, activePage) {
    injectCSS();
    
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = createNavigation(activePage);
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