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
        { href: '/api/docs', icon: '📡', label: 'Agent API', id: 'api' }
    ]
};

// CSS for navigation (injected once)
const NAV_CSS = `
.nav-bar { 
    background: rgba(30, 41, 59, 0.7); 
    border: 1px solid #334155; 
    border-radius: 12px; 
    padding: 12px 20px; 
    margin-bottom: 25px; 
    display: flex; 
    gap: 15px; 
    flex-wrap: wrap; 
    justify-content: center; 
}
.nav-link { 
    color: #8b5cf6; 
    text-decoration: none; 
    padding: 8px 16px; 
    border-radius: 8px; 
    transition: background 0.3s;
    white-space: nowrap;
}
.nav-link:hover { 
    background: rgba(139, 92, 246, 0.2); 
}
.nav-link.active { 
    background: #8b5cf6; 
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