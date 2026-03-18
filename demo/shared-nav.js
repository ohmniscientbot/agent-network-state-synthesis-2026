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
        { href: "/debates", text: "⚖️ Debates", mobileText: "⚖️ Debate Chamber", id: "debates" },
        { href: "/trust", text: "🤝 Trust Graph", mobileText: "🤝 Trust Graph", id: "trust" },
        { href: "/reputation", text: "⏳ Reputation", mobileText: "⏳ Reputation Decay", id: "reputation" },
        { href: "/vote-receipts", text: "🧾 Receipts", mobileText: "🧾 Vote Receipts", id: "vote-receipts" },
        { href: "/execution-log", text: "⚡ Execution Log", mobileText: "⚡ Autonomous Executions", id: "execution-log" },
        { href: "/constitution", text: "📜 Constitution", mobileText: "📜 Constitutional Layer", id: "constitution" },
        { href: "/slash-ledger", text: "⚔️ Slash Ledger", mobileText: "⚔️ Agent Slash Ledger", id: "slash-ledger" },
        { href: "/audit", text: "🔍 Audit", mobileText: "🔍 Audit Timeline", id: "audit" },
        { href: "/alignment", text: "⚖️ Alignment", mobileText: "⚖️ Incentive Alignment", id: "alignment" },
        { href: "/delegation", text: "🗳️ Delegation", mobileText: "🗳️ Liquid Democracy", id: "delegation" },
        { href: "/constitution-enforcement", text: "🛡️ Enforcement", mobileText: "🛡️ Constitutional Enforcement", id: "constitution-enforcement" },
        { href: "/council", text: "🏛️ Council", mobileText: "🏛️ Emergency Council", id: "council" },
        { href: "/attestations", text: "🤝 Attestations", mobileText: "🤝 Peer Attestations", id: "attestations" },
        { href: "/passport", text: "🪪 Passport", mobileText: "🪪 Agent Passport", id: "passport" }
    ],
    toolsDropdown: {
        text: "🛠️ Tools",
        mobileText: "🛠️ Developer Tools",
        id: "tools",
        items: [
            { href: "/simulate", text: "🎬 Live Simulation", id: "simulate" },
            { href: "/ai-governance", text: "🤖 AI Testing", id: "ai-governance" },
            { href: "/register", text: "⚙️ Register Agent", id: "register" },
            { href: "/api/docs", text: "📖 API Documentation", id: "docs" },
            { href: "https://github.com/ohmniscientbot/agent-network-state-synthesis-2026", text: "💻 GitHub", id: "github", external: true }
        ]
    }
};

// Generate navigation HTML
function generateNavigation(currentPageId = null) {
    // Check if current page is in tools dropdown
    const isInToolsDropdown = NAV_CONFIG.toolsDropdown.items.some(item => item.id === currentPageId);
    
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

    // Generate tools dropdown
    const toolsDropdownItems = NAV_CONFIG.toolsDropdown.items.map(item => {
        const isActive = item.id === currentPageId;
        const targetAttr = item.external ? `target="_blank"` : '';
        const activeStyle = isActive ? 'background: var(--neural-cyan-glow); color: var(--neural-cyan);' : '';
        
        return `<a href="${item.href}" ${targetAttr} style="display: block; padding: 12px 16px; color: var(--primary-text); text-decoration: none; transition: all 0.2s; ${activeStyle}" onmouseover="this.style.background='var(--neural-blue-glow)'" onmouseout="this.style.background='${isActive ? 'var(--neural-cyan-glow)' : 'transparent'}'">${item.text}</a>`;
    }).join('\n                            ');

    const toolsDropdown = `
        <div style="position: relative; display: inline-block;">
            <button id="tools-dropdown-btn" style="color: ${isInToolsDropdown ? 'var(--neural-cyan)' : 'var(--primary-text)'}; background: ${isInToolsDropdown ? 'var(--neural-cyan-glow)' : 'transparent'}; text-decoration: none; padding: 6px 12px; border-radius: var(--radius-sm); transition: all 0.3s; font-size: 0.85rem; white-space: nowrap; border: none; cursor: pointer;" onmouseover="this.style.background='var(--neural-blue-glow)'; this.style.color='var(--neural-blue)'" onmouseout="this.style.background='${isInToolsDropdown ? 'var(--neural-cyan-glow)' : 'transparent'}'; this.style.color='${isInToolsDropdown ? 'var(--neural-cyan)' : 'var(--primary-text)'}'">
                ${NAV_CONFIG.toolsDropdown.text} ▼
            </button>
            <div id="tools-dropdown-menu" style="position: absolute; top: 100%; right: 0; min-width: 200px; background: var(--card-bg); border: 1px solid var(--border-neural); border-radius: var(--radius-sm); backdrop-filter: blur(12px); z-index: 1000; display: none; margin-top: 5px;">
                <div style="padding: 8px 0;">
                    ${toolsDropdownItems}
                </div>
            </div>
        </div>`;

    // Generate mobile navigation links (flat structure for mobile)
    const allMobileLinks = [
        ...NAV_CONFIG.links,
        ...NAV_CONFIG.toolsDropdown.items
    ];

    const mobileLinks = allMobileLinks.map(link => {
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
                <div style="display: flex; gap: 8px; align-items: center;">
                    ${desktopLinks}
                    ${toolsDropdown}
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
    
    // Initialize PWA support
    injectPWASupport();
    
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

    // Initialize tools dropdown functionality
    const toolsDropdownBtn = document.getElementById('tools-dropdown-btn');
    const toolsDropdownMenu = document.getElementById('tools-dropdown-menu');
    
    if (toolsDropdownBtn && toolsDropdownMenu) {
        toolsDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = toolsDropdownMenu.style.display === 'block';
            toolsDropdownMenu.style.display = isVisible ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!toolsDropdownBtn.contains(e.target) && !toolsDropdownMenu.contains(e.target)) {
                toolsDropdownMenu.style.display = 'none';
            }
        });

        // Close dropdown when pressing escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                toolsDropdownMenu.style.display = 'none';
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

// ========================================
// PWA SUPPORT
// ========================================
function injectPWASupport() {
    // Add manifest link to head if not already present
    if (!document.querySelector('link[rel="manifest"]')) {
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = '/manifest.json';
        document.head.appendChild(manifestLink);
    }

    // Add PWA meta tags for better app-like experience
    const metaTags = [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Synthocracy' },
        { name: 'msapplication-TileColor', content: '#8b5cf6' },
        { name: 'theme-color', content: '#8b5cf6' }
    ];

    metaTags.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
            const meta = document.createElement('meta');
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
        }
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('🏛️ Synthocracy PWA: Service Worker registered', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateAvailable();
                            }
                        });
                    });
                })
                .catch(function(error) {
                    console.warn('🏛️ Synthocracy PWA: Service Worker registration failed', error);
                });
        });
    }

    // Handle install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });

    // Listen for successful app install
    window.addEventListener('appinstalled', (e) => {
        console.log('🎉 Synthocracy PWA installed successfully');
        hideInstallPrompt();
    });
}

function showInstallPrompt() {
    // Create install button (only show on supported pages)
    const currentPage = window.location.pathname;
    if (currentPage === '/' || currentPage === '/dashboard') {
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.innerHTML = '📱 Install App';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--neural-purple);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            animation: slideUp 0.3s ease-out;
        `;

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('🎉 User accepted PWA install');
                }
                deferredPrompt = null;
                hideInstallPrompt();
            }
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #pwa-install-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(installBtn);
    }
}

function hideInstallPrompt() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.remove();
    }
}

function showUpdateAvailable() {
    // Show subtle update notification
    const updateNotification = document.createElement('div');
    updateNotification.id = 'pwa-update-notification';
    updateNotification.innerHTML = `
        <span>🔄 Update available</span>
        <button onclick="location.reload()">Refresh</button>
    `;
    updateNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--neural-blue);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        z-index: 1001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideIn 0.3s ease-out;
    `;

    const refreshBtn = updateNotification.querySelector('button');
    refreshBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
    `;

    document.body.appendChild(updateNotification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (updateNotification.parentNode) {
            updateNotification.remove();
        }
    }, 10000);
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Page will call injectNavigation with appropriate pageId
    });
} else {
    // DOM already loaded
}