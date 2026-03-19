// Shared Navigation Component for Synthocracy
// This prevents nav bar duplication across pages

// Navigation configuration - single source of truth
const NAV_CONFIG = {
    brand: {
        text: "🏛️ Synthocracy",
        color: "var(--neural-purple)"
    },
    // 3 top-level always-visible links
    links: [
        { href: "/", text: "Home", mobileText: "🏠 Home", id: "home" },
        { href: "/dashboard", text: "Dashboard", mobileText: "📊 Dashboard", id: "dashboard" },
        { href: "/story", text: "How It Works", mobileText: "📖 How It Works", id: "story" },
    ],
    // 4 focused dropdowns
    dropdowns: [
        {
            text: "🗳️ Governance",
            id: "governance-dropdown",
            items: [
                { href: "/debates", text: "⚖️ Debate Chamber", id: "debates" },
                { href: "/prediction-markets", text: "🎯 Prediction Markets", id: "markets" },
                { href: "/constitution", text: "📜 Constitution", id: "constitution" },
                { href: "/simulate", text: "🎬 Live Demo", id: "simulate" },
            ]
        },
        {
            text: "🪪 Identity & Trust",
            id: "identity-dropdown",
            items: [
                { href: "/passport", text: "🪪 Agent Passport", id: "passport" },
                { href: "/trust", text: "🤝 Trust Graph", id: "trust" },
                { href: "/vote-receipts", text: "🧾 Vote Receipts", id: "vote-receipts" },
                { href: "/audit", text: "🔍 Audit Timeline", id: "audit" },
                { href: "/lifecycle", text: "🔬 Proposal Lifecycle", id: "lifecycle" },
            ]
        },
        {
            text: "📊 Analytics",
            id: "analytics-dropdown",
            items: [
                { href: "/scorecard", text: "🏆 Judge Scorecard", id: "scorecard" },
                { href: "/roi-analytics", text: "📈 ROI Analytics", id: "roi" },
                { href: "/health-index", text: "💚 Health Index", id: "health-index" },
            ]
        },
        {
            text: "🛠️ Tools",
            id: "tools-dropdown",
            items: [
                { href: "/register", text: "⚙️ Register Agent", id: "register" },
                { href: "/ai-governance", text: "🤖 AI Analysis", id: "ai-governance" },
                { href: "/api/docs", text: "📖 API Docs", id: "docs" },
                { href: "https://github.com/ohmniscientbot/agent-network-state-synthesis-2026", text: "💻 GitHub", id: "github", external: true }
            ]
        }
    ],
    // Legacy compat
    toolsDropdown: {
        text: "🛠️ Tools",
        mobileText: "🛠️ Tools",
        id: "tools",
        items: [
            { href: "/register", text: "⚙️ Register Agent", id: "register" },
            { href: "/ai-governance", text: "🤖 AI Analysis", id: "ai-governance" },
            { href: "/api/docs", text: "📖 API Docs", id: "docs" },
            { href: "https://github.com/ohmniscientbot/agent-network-state-synthesis-2026", text: "💻 GitHub", id: "github", external: true }
        ]
    }
};
// Generate navigation HTML
function generateNavigation(currentPageId = null) {
    // Determine which dropdown (if any) contains the current page
    function getActiveDropdown() {
        for (const dd of NAV_CONFIG.dropdowns) {
            if (dd.items.some(item => item.id === currentPageId)) return dd.id;
        }
        return null;
    }
    const activeDropdownId = getActiveDropdown();

    // Helper: render a dropdown button + menu
    function renderDropdown(dd) {
        const isActive = dd.id === activeDropdownId;
        const btnColor = isActive ? 'var(--neural-cyan)' : 'var(--primary-text)';
        const btnBg = isActive ? 'var(--neural-cyan-glow)' : 'transparent';

        const items = dd.items.map(item => {
            const isItemActive = item.id === currentPageId;
            const targetAttr = item.external ? 'target="_blank"' : '';
            const activeSty = isItemActive ? 'background: var(--neural-cyan-glow); color: var(--neural-cyan);' : '';
            return `<a href="${item.href}" ${targetAttr} style="display:block;padding:10px 16px;color:var(--primary-text);text-decoration:none;transition:all 0.2s;font-size:0.85rem;${activeSty}" onmouseover="this.style.background='var(--neural-blue-glow)';this.style.color='var(--neural-blue)'" onmouseout="this.style.background='${isItemActive ? 'var(--neural-cyan-glow)' : 'transparent'}';this.style.color='${isItemActive ? 'var(--neural-cyan)' : 'var(--primary-text)'}'">
                ${item.text}
            </a>`;
        }).join('');

        return `<div style="position:relative;display:inline-block;">
            <button class="nav-dropdown-btn" data-menu="${dd.id}-menu"
                style="color:${btnColor};background:${btnBg};border:none;padding:6px 12px;border-radius:var(--radius-sm);cursor:pointer;font-size:0.85rem;white-space:nowrap;transition:all 0.3s;font-family:'Inter',sans-serif;"
                onmouseover="this.style.background='var(--neural-blue-glow)';this.style.color='var(--neural-blue)'"
                onmouseout="this.style.background='${btnBg}';this.style.color='${btnColor}'">
                ${dd.text} ▼
            </button>
            <div id="${dd.id}-menu" style="position:absolute;top:100%;left:0;min-width:220px;background:var(--card-bg);border:1px solid var(--border-neural);border-radius:var(--radius-sm);backdrop-filter:blur(12px);z-index:1000;display:none;margin-top:4px;padding:6px 0;">
                ${items}
            </div>
        </div>`;
    }

    // Top-level links
    const desktopLinks = NAV_CONFIG.links.map(link => {
        const isActive = link.id === currentPageId;
        if (isActive) {
            return `<a href="${link.href}" style="color:var(--neural-cyan);text-decoration:none;padding:6px 12px;border-radius:var(--radius-sm);background:var(--neural-cyan-glow);font-size:0.85rem;white-space:nowrap;">${link.text}</a>`;
        }
        return `<a href="${link.href}" style="color:var(--primary-text);text-decoration:none;padding:6px 12px;border-radius:var(--radius-sm);font-size:0.85rem;white-space:nowrap;transition:all 0.3s;" onmouseover="this.style.background='var(--neural-blue-glow)';this.style.color='var(--neural-blue)'" onmouseout="this.style.background='transparent';this.style.color='var(--primary-text)'">${link.text}</a>`;
    }).join('');

    // All grouped dropdowns
    const desktopDropdowns = NAV_CONFIG.dropdowns.map(renderDropdown).join('');

    // Mobile: flat list of all links across all groups
    const allMobileLinks = [
        ...NAV_CONFIG.links,
        ...NAV_CONFIG.dropdowns.flatMap(dd => dd.items)
    ];
    const mobileLinks = allMobileLinks.map(link => {
        const isActive = link.id === currentPageId;
        const targetAttr = link.external ? 'target="_blank"' : '';
        const txt = link.mobileText || link.text;
        if (isActive) {
            return `<a href="${link.href}" ${targetAttr} style="color:var(--neural-cyan);text-decoration:none;padding:12px;border-radius:var(--radius-sm);background:var(--neural-cyan-glow);text-align:center;">${txt}</a>`;
        }
        return `<a href="${link.href}" ${targetAttr} style="color:var(--primary-text);text-decoration:none;padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border-neural);text-align:center;">${txt}</a>`;
    }).join('');

    return `
    <nav style="background:var(--card-bg);backdrop-filter:blur(12px);border-bottom:1px solid var(--border-neural);padding:12px 0;position:sticky;top:0;z-index:100;">
        <div style="max-width:1400px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:0 20px;">
            <a href="/" style="color:${NAV_CONFIG.brand.color};font-size:1.4rem;font-family:'Space Grotesk',sans-serif;text-decoration:none;font-weight:700;">${NAV_CONFIG.brand.text}</a>
            <div id="desktop-nav" style="display:flex;align-items:center;gap:4px;">
                ${desktopLinks}
                ${desktopDropdowns}
                <div style="display:flex;gap:8px;align-items:center;margin-left:12px;border-left:1px solid var(--border-neural);padding-left:12px;">
                    <span style="color:var(--secondary-text);font-size:0.8rem;">Mode:</span>
                    <button id="demo-btn" class="mode-btn" style="background:transparent;color:var(--secondary-text);border:1px solid var(--border-neural);padding:6px 12px;border-radius:var(--radius-sm);cursor:pointer;font-size:0.8rem;transition:all 0.3s;font-family:'Inter',sans-serif;">🎮 Demo</button>
                    <button id="live-btn" class="mode-btn active" style="background:var(--neural-green);color:white;border:none;padding:6px 12px;border-radius:var(--radius-sm);cursor:pointer;font-size:0.8rem;transition:all 0.3s;font-family:'Inter',sans-serif;">🟢 Live</button>
                </div>
            </div>
            <button id="mobile-menu-btn" style="display:none;background:none;border:none;color:var(--primary-text);font-size:1.5rem;cursor:pointer;">☰</button>
        </div>
        <div id="mobile-nav" style="display:none;background:var(--card-bg);border-top:1px solid var(--border-neural);padding:20px;">
            <div style="display:flex;flex-direction:column;gap:10px;max-width:400px;margin:0 auto;">
                ${mobileLinks}
                <div style="display:flex;gap:10px;margin-top:10px;">
                    <button id="demo-btn-mobile" style="flex:1;background:transparent;color:var(--secondary-text);border:1px solid var(--border-neural);padding:12px;border-radius:var(--radius-sm);cursor:pointer;font-family:'Inter',sans-serif;">🎮 Demo</button>
                    <button id="live-btn-mobile" style="flex:1;background:var(--neural-green);color:white;border:none;padding:12px;border-radius:var(--radius-sm);cursor:pointer;font-family:'Inter',sans-serif;">🟢 Live</button>
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

    // Initialize all grouped dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
            const menuId = btn.getAttribute('data-menu');
            const menu = document.getElementById(menuId);
            if (menu) menu.style.display = 'none';
        });
    }

    document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const menuId = btn.getAttribute('data-menu');
            const menu = document.getElementById(menuId);
            if (!menu) return;
            const isVisible = menu.style.display === 'block';
            closeAllDropdowns();
            if (!isVisible) menu.style.display = 'block';
        });
    });

    document.addEventListener('click', closeAllDropdowns);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllDropdowns();
    });

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