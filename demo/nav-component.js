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

// CSS for navigation - Professional DeFi styling
const NAV_CSS = `
.nav-bar { 
    background: #ffffff; 
    border: 1px solid #e2e8f0; 
    border-radius: 12px; 
    padding: 12px 16px; 
    margin-bottom: 24px; 
    display: flex; 
    gap: 8px; 
    flex-wrap: wrap; 
    justify-content: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.nav-link { 
    color: #64748b; 
    text-decoration: none; 
    padding: 8px 16px; 
    border-radius: 8px; 
    transition: all 0.2s ease;
    white-space: nowrap;
    font-weight: 500;
    font-size: 14px;
}
.nav-link:hover { 
    background: #f1f5f9;
    color: #1e293b;
}
.nav-link.active { 
    background: #2563eb; 
    color: white; 
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