// Shared Navigation Component for Synthocracy
// This prevents nav bar duplication across pages

// Navigation configuration - single source of truth
const NAV_CONFIG = {
    brand: {
        text: "🏛️ Synthocracy",
        color: "var(--neural-purple)"
    },
    links: [
        { href: "/", text: "🏠 Home", mobileText: "🏠 Home", id: "home" },
        { href: "/dashboard", text: "📊 Dashboard", mobileText: "📊 Dashboard", id: "dashboard" }, 
        { href: "/prediction-markets", text: "🎯 Markets", mobileText: "🎯 Prediction Markets", id: "markets" },
        { href: "/roi-analytics", text: "📈 ROI", mobileText: "📈 ROI Analytics", id: "roi" },
        { href: "/ai-governance", text: "🤖 AI", mobileText: "🤖 AI Governance", id: "ai-governance" },
        { href: "/api/docs", text: "📖 Docs", mobileText: "📖 API Documentation", id: "docs" },
        { href: "https://github.com/ohmniscientbot/agent-network-state-synthesis-2026", text: "💻 GitHub", mobileText: "💻 GitHub", id: "github", external: true }
    ]
};

// Generate navigation HTML
function generateNavigation(currentPageId = null) {
    // Generate desktop navigation links
    const desktopLinks = NAV_CONFIG.links.map(link => {
        const isActive = link.id === currentPageId;
        const targetAttr = link.external ? `target="_blank"` : '';
        
        if (isActive) {
            return `<a href="${link.href}" ${targetAttr} style="color: var(--neural-cyan); text-decoration: none; padding: 6px 12px; border-radius: var(--radius-sm); transition: all 0.3s; background: var(--neural-cyan-glow); font-size: 0.85rem; white-space: nowrap;">${link.text}</a>`;
        } else {
            return `<a href="${link.href}" ${targetAttr} style="color: var(--primary-text); text-decoration: none; padding: 6px 12px; border-radius: var(--radius-sm); transition: all 0.3s; font-size: 0.85rem; white-space: nowrap;" onmouseover="this.style.background='var(--neural-blue-glow)'; this.style.color='var(--neural-blue)'" onmouseout="this.style.background='transparent'; this.style.color='var(--primary-text)'">${link.text}</a>`;
        }
    }).join('\n                    ');

    // Generate mobile navigation links  
    const mobileLinks = NAV_CONFIG.links.map(link => {
        const isActive = link.id === currentPageId;
        const targetAttr = link.external ? `target="_blank"` : '';
        const linkText = link.mobileText || link.text;
        
        if (isActive) {
            return `<a href="${link.href}" ${targetAttr} style="color: var(--neural-cyan); text-decoration: none; padding: 12px; border-radius: var(--radius-sm); background: var(--neural-cyan-glow); text-align: center;">${linkText}</a>`;
        } else {
            return `<a href="${link.href}" ${targetAttr} style="color: var(--primary-text); text-decoration: none; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-neural); text-align: center;">${linkText}</a>`;
        }
    }).join('\n                ');

    return `
    <nav style="background: var(--card-bg); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-neural); padding: 12px 0; position: sticky; top: 0; z-index: 100;">
        <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
            <h2 style="color: ${NAV_CONFIG.brand.color}; font-size: 1.4rem; margin: 0; font-family: 'Space Grotesk', sans-serif;">${NAV_CONFIG.brand.text}</h2>
            <div id="desktop-nav" style="display: flex; align-items: center; gap: 15px;">
                <div style="display: flex; gap: 8px;">
                    ${desktopLinks}
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span style="color: var(--secondary-text); font-size: 0.8rem;">Mode:</span>
                    <button id="demo-btn" class="mode-btn" style="background: transparent; color: var(--secondary-text); border: 1px solid var(--border-neural); padding: 6px 12px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem; transition: all 0.3s; font-family: 'Inter', sans-serif;">🎮 Demo</button>
                    <button id="live-btn" class="mode-btn active" style="background: var(--neural-green); color: white; border: none; padding: 6px 12px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem; transition: all 0.3s; font-family: 'Inter', sans-serif;">🟢 Live</button>
                </div>
            </div>
            <button id="mobile-menu-btn" style="display: none; background: none; border: none; color: var(--primary-text); font-size: 1.5rem; cursor: pointer;">☰</button>
        </div>
        <div id="mobile-nav" style="display: none; background: var(--card-bg); border-top: 1px solid var(--border-neural); padding: 20px;">
            <div style="display: flex; flex-direction: column; gap: 15px; max-width: 400px; margin: 0 auto;">
                ${mobileLinks}
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button id="demo-btn-mobile" style="flex: 1; background: transparent; color: var(--secondary-text); border: 1px solid var(--border-neural); padding: 12px; border-radius: var(--radius-sm); cursor: pointer; font-family: 'Inter', sans-serif;">🎮 Demo</button>
                    <button id="live-btn-mobile" style="flex: 1; background: var(--neural-green); color: white; border: none; padding: 12px; border-radius: var(--radius-sm); cursor: pointer; font-family: 'Inter', sans-serif;">🟢 Live</button>
                </div>
            </div>
        </div>
    </nav>`;
}

// Inject navigation into page
function injectNavigation(currentPageId = null) {
    const navHTML = generateNavigation(currentPageId);
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // Initialize mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            if (mobileNav.style.display === 'none' || !mobileNav.style.display) {
                mobileNav.style.display = 'block';
            } else {
                mobileNav.style.display = 'none';
            }
        });
    }

    // Mobile responsiveness
    function handleResize() {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const desktopNav = document.getElementById('desktop-nav');
        if (window.innerWidth <= 768) {
            if (mobileBtn) mobileBtn.style.display = 'block';
            if (desktopNav) desktopNav.style.display = 'none';
        } else {
            if (mobileBtn) mobileBtn.style.display = 'none';
            if (desktopNav) desktopNav.style.display = 'flex';
            if (mobileNav) mobileNav.style.display = 'none';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on load
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Page will call injectNavigation with appropriate pageId
    });
} else {
    // DOM already loaded
}