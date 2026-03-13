/**
 * Improved Navigation Component
 * Inspired by Uniswap, Aave, and Compound navigation patterns
 * Separates primary user functionality from developer resources
 */

// Primary navigation - Core user functionality (like Uniswap Swap/Pool/Vote)
const PRIMARY_NAV_CONFIG = {
    links: [
        { href: 'index.html', icon: '🏠', label: 'Home', id: 'landing' },
        { href: 'dashboard.html', icon: '📊', label: 'Dashboard', id: 'dashboard' },
        { href: 'prediction-markets.html', icon: '🎯', label: 'Markets', id: 'prediction-markets' }
    ]
};

// Secondary navigation - Developer/technical resources (like docs.uniswap.org)
const SECONDARY_NAV_CONFIG = {
    links: [
        { href: 'interactive.html', icon: '🎮', label: 'Manual Registration', id: 'interactive', demoOnly: true },
        { href: 'api-docs.html', icon: '📡', label: 'API Docs', id: 'api' },
        { href: 'contracts.html', icon: '📜', label: 'Contracts', id: 'contracts' },
        { href: 'https://github.com/ohmniscientbot/agent-network-state-synthesis-2026', icon: '💻', label: 'GitHub', id: 'github', external: true }
    ]
};

// Demo mode configuration
let demoMode = localStorage.getItem('demo-mode') === 'true';

// CSS for improved navigation styling
const NAV_CSS = `
/* Main navigation container */
.nav-container {
    background: rgba(31, 31, 47, 0.8);
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 16px;
    backdrop-filter: blur(16px) saturate(180%);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    margin-bottom: 32px;
    padding: 16px 24px;
    position: relative;
    overflow: hidden;
}

.nav-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
    opacity: 0.6;
}

/* Main layout */
.nav-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
}

/* Primary navigation (left side) */
.nav-primary {
    display: flex;
    gap: 8px;
    align-items: center;
}

/* Secondary navigation + demo toggle (right side) */
.nav-secondary {
    display: flex;
    align-items: center;
    gap: 16px;
}

.nav-secondary-links {
    display: flex;
    gap: 8px;
    align-items: center;
}

/* Demo mode toggle */
.demo-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 12px;
    color: #f59e0b;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: all 0.2s ease;
}

.demo-toggle:hover {
    background: rgba(245, 158, 11, 0.2);
    border-color: rgba(245, 158, 11, 0.5);
}

.demo-toggle.live {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
}

.demo-toggle.live:hover {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
}

.demo-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: demoPulse 2s ease-in-out infinite;
}

@keyframes demoPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
}

/* Common link styling */
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
    backdrop-filter: blur(8px);
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Primary nav links (more prominent) */
.nav-primary .nav-link {
    font-weight: 600;
    font-size: 15px;
}

/* Secondary nav links (more subtle) */
.nav-secondary .nav-link {
    font-size: 13px;
    opacity: 0.8;
}

.nav-link:hover {
    color: #e6e7eb;
    background: rgba(59, 130, 246, 0.12);
    transform: translateY(-1px);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.nav-link.active {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    border-color: rgba(139, 92, 246, 0.6);
}

/* External link indicator */
.nav-link.external::after {
    content: '↗';
    font-size: 10px;
    opacity: 0.6;
    margin-left: 2px;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .nav-main {
        flex-direction: column;
        gap: 12px;
    }
    
    .nav-primary,
    .nav-secondary {
        justify-content: center;
    }
    
    .nav-secondary {
        flex-direction: column;
        gap: 12px;
    }
    
    .nav-secondary-links {
        justify-content: center;
    }
    
    .demo-toggle {
        order: -1;
    }
}

/* Notification for mode changes */
.mode-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: rgba(31, 31, 47, 0.9);
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 12px;
    color: #e6e7eb;
    font-size: 14px;
    font-weight: 500;
    backdrop-filter: blur(16px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
}

.mode-notification.show {
    transform: translateX(0);
    opacity: 1;
}
`;

/**
 * Create primary navigation HTML
 * @param {string} activePage - ID of currently active page
 * @returns {string} Primary navigation HTML
 */
function createPrimaryNavigation(activePage) {
    const links = PRIMARY_NAV_CONFIG.links.map(link => {
        const activeClass = link.id === activePage ? 'active' : '';
        return `<a href="${link.href}" class="nav-link ${activeClass}">${link.icon} ${link.label}</a>`;
    }).join('');
    
    return `<div class="nav-primary">${links}</div>`;
}

/**
 * Create secondary navigation HTML
 * @param {string} activePage - ID of currently active page
 * @returns {string} Secondary navigation HTML
 */
function createSecondaryNavigation(activePage) {
    const links = SECONDARY_NAV_CONFIG.links
        .filter(link => !link.demoOnly || demoMode) // Only show demo-only links in demo mode
        .map(link => {
            const activeClass = link.id === activePage ? 'active' : '';
            const externalClass = link.external ? 'external' : '';
            const target = link.external ? 'target="_blank"' : '';
            return `<a href="${link.href}" class="nav-link ${activeClass} ${externalClass}" ${target}>${link.icon} ${link.label}</a>`;
        }).join('');
    
    return `<div class="nav-secondary-links">${links}</div>`;
}

/**
 * Create demo mode toggle
 * @returns {string} Demo toggle HTML
 */
function createDemoToggle() {
    const toggleClass = demoMode ? 'demo-toggle' : 'demo-toggle live';
    const toggleText = demoMode ? 'Demo Mode' : 'Live Data';
    const toggleIcon = demoMode ? '🎭' : '🔴';
    
    return `
        <div class="${toggleClass}" onclick="toggleDemoMode()" title="Toggle between demo data and live mainnet data">
            <div class="demo-indicator"></div>
            ${toggleIcon} ${toggleText}
        </div>
    `;
}

/**
 * Create complete navigation HTML
 * @param {string} activePage - ID of currently active page
 * @returns {string} Complete navigation HTML
 */
function createNavigation(activePage) {
    const primary = createPrimaryNavigation(activePage);
    const secondary = createSecondaryNavigation(activePage);
    const demoToggle = createDemoToggle();
    
    return `
        <div class="nav-container">
            <div class="nav-main">
                ${primary}
                <div class="nav-secondary">
                    ${secondary}
                    ${demoToggle}
                </div>
            </div>
        </div>
    `;
}

/**
 * Toggle demo mode
 */
function toggleDemoMode() {
    demoMode = !demoMode;
    localStorage.setItem('demo-mode', demoMode.toString());
    
    // Show notification
    showModeNotification(demoMode ? 'Switched to Demo Mode' : 'Switched to Live Data');
    
    // Refresh the page to apply new mode
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

/**
 * Show mode change notification
 */
function showModeNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.mode-notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'mode-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Inject CSS into page head
 */
function injectCSS() {
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
 * @param {string} activePage - ID of currently active page
 */
function initNavigation(activePage) {
    document.addEventListener('DOMContentLoaded', function() {
        renderNavigation('navigation-container', activePage);
        
        // Apply demo mode styling to page if needed
        if (demoMode) {
            document.body.classList.add('demo-mode');
        }
    });
    
    if (document.readyState !== 'loading') {
        renderNavigation('navigation-container', activePage);
        if (demoMode) {
            document.body.classList.add('demo-mode');
        }
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderNavigation, initNavigation, createNavigation, toggleDemoMode };
}

// Global functions
window.renderNavigation = renderNavigation;
window.initNavigation = initNavigation;
window.toggleDemoMode = toggleDemoMode;