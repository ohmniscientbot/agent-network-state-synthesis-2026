// Synthocracy Loading States & Skeleton Screens
// Provides professional loading UX across all pages

// ========================================
// SKELETON SCREEN COMPONENTS
// ========================================

function createSkeletonCard() {
    return `
        <div class="skeleton-card" style="
            background: var(--card-bg);
            border: 1px solid var(--border-neural);
            border-radius: var(--radius-neural);
            padding: var(--space-lg);
            margin-bottom: var(--space-md);
            backdrop-filter: blur(12px);
        ">
            <div class="skeleton-line skeleton-title" style="
                height: 20px;
                background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                border-radius: 4px;
                margin-bottom: 12px;
                width: 60%;
                animation: shimmer 2s infinite;
            "></div>
            <div class="skeleton-line" style="
                height: 16px;
                background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                border-radius: 4px;
                margin-bottom: 8px;
                width: 80%;
                animation: shimmer 2s infinite;
            "></div>
            <div class="skeleton-line" style="
                height: 16px;
                background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                border-radius: 4px;
                margin-bottom: 8px;
                width: 45%;
                animation: shimmer 2s infinite;
            "></div>
        </div>
    `;
}

function createSkeletonMetric() {
    return `
        <div class="skeleton-metric" style="
            background: var(--card-bg);
            border: 1px solid var(--border-neural);
            border-radius: var(--radius-neural);
            padding: var(--space-lg);
            text-align: center;
            backdrop-filter: blur(12px);
        ">
            <div class="skeleton-circle" style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                margin: 0 auto 12px;
                animation: shimmer 2s infinite;
            "></div>
            <div class="skeleton-line" style="
                height: 14px;
                background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                border-radius: 4px;
                width: 70%;
                margin: 0 auto;
                animation: shimmer 2s infinite;
            "></div>
        </div>
    `;
}

function createSkeletonChart() {
    return `
        <div class="skeleton-chart" style="
            background: var(--card-bg);
            border: 1px solid var(--border-neural);
            border-radius: var(--radius-neural);
            padding: var(--space-lg);
            backdrop-filter: blur(12px);
        ">
            <div class="skeleton-line skeleton-title" style="
                height: 18px;
                background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                border-radius: 4px;
                margin-bottom: 16px;
                width: 50%;
                animation: shimmer 2s infinite;
            "></div>
            <div style="
                height: 200px;
                background: linear-gradient(90deg, rgba(139, 92, 246, 0.05) 25%, rgba(139, 92, 246, 0.1) 50%, rgba(139, 92, 246, 0.05) 75%);
                border-radius: 8px;
                position: relative;
                overflow: hidden;
                animation: shimmer 2s infinite;
            ">
                <!-- Mock chart elements -->
                <div style="
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: end;
                ">
                    <div style="width: 20px; height: 60px; background: rgba(139, 92, 246, 0.3); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 80px; background: rgba(139, 92, 246, 0.3); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 40px; background: rgba(139, 92, 246, 0.3); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 100px; background: rgba(139, 92, 246, 0.3); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 70px; background: rgba(139, 92, 246, 0.3); border-radius: 2px;"></div>
                </div>
            </div>
        </div>
    `;
}

function createSkeletonFeed() {
    return `
        <div class="skeleton-feed" style="
            background: var(--card-bg);
            border: 1px solid var(--border-neural);
            border-radius: var(--radius-neural);
            padding: 0;
            backdrop-filter: blur(12px);
            overflow: hidden;
        ">
            ${Array.from({ length: 5 }, () => `
                <div style="
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--border-neural);
                ">
                    <div class="skeleton-circle" style="
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                        flex-shrink: 0;
                        animation: shimmer 2s infinite;
                    "></div>
                    <div style="flex: 1;">
                        <div class="skeleton-line" style="
                            height: 14px;
                            background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                            border-radius: 4px;
                            margin-bottom: 6px;
                            width: 85%;
                            animation: shimmer 2s infinite;
                        "></div>
                        <div class="skeleton-line" style="
                            height: 12px;
                            background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 25%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 75%);
                            border-radius: 4px;
                            width: 40%;
                            animation: shimmer 2s infinite;
                        "></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ========================================
// LOADING UTILITIES
// ========================================

function showSkeletonGrid(containerId, skeletonCount = 6, skeletonType = 'card') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let skeletonHTML = '';
    for (let i = 0; i < skeletonCount; i++) {
        switch (skeletonType) {
            case 'metric':
                skeletonHTML += createSkeletonMetric();
                break;
            case 'chart':
                skeletonHTML += createSkeletonChart();
                break;
            case 'feed':
                skeletonHTML += createSkeletonFeed();
                break;
            default:
                skeletonHTML += createSkeletonCard();
        }
    }

    container.innerHTML = skeletonHTML;
}

function showLoadingSpinner(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="loading-spinner-container" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
        ">
            <div class="loading-spinner" style="
                width: 40px;
                height: 40px;
                border: 3px solid var(--border-neural);
                border-top: 3px solid var(--neural-purple);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
            "></div>
            <div style="color: var(--secondary-text); font-size: 0.9rem;">
                ${message}
            </div>
        </div>
    `;
}

function showProgressBar(containerId, progress = 0, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="progress-container" style="
            padding: 40px 20px;
            text-align: center;
        ">
            <div style="color: var(--primary-text); margin-bottom: 12px; font-size: 0.9rem;">
                ${message}
            </div>
            <div style="
                width: 100%;
                max-width: 300px;
                height: 6px;
                background: var(--border-neural);
                border-radius: 3px;
                overflow: hidden;
                margin: 0 auto;
            ">
                <div style="
                    height: 100%;
                    background: linear-gradient(90deg, var(--neural-purple), var(--neural-cyan));
                    width: ${progress}%;
                    border-radius: 3px;
                    transition: width 0.3s ease;
                "></div>
            </div>
            <div style="color: var(--secondary-text); margin-top: 8px; font-size: 0.8rem;">
                ${Math.round(progress)}%
            </div>
        </div>
    `;
}

// ========================================
// FADE TRANSITIONS
// ========================================

function fadeOut(elementId, duration = 300) {
    const element = document.getElementById(elementId);
    if (!element) return Promise.resolve();

    return new Promise(resolve => {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
            resolve();
        }, duration);
    });
}

function fadeIn(elementId, duration = 300) {
    const element = document.getElementById(elementId);
    if (!element) return Promise.resolve();

    return new Promise(resolve => {
        element.style.display = 'block';
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        // Trigger reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
        setTimeout(resolve, duration);
    });
}

async function crossFade(fadeOutId, fadeInId, duration = 300) {
    await Promise.all([
        fadeOut(fadeOutId, duration),
        fadeIn(fadeInId, duration)
    ]);
}

// ========================================
// GLOBAL STYLES
// ========================================

function injectLoadingStyles() {
    if (document.getElementById('loading-states-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'loading-states-styles';
    styles.textContent = `
        @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .skeleton-line {
            background-size: 200px 100%;
            background-repeat: no-repeat;
            display: inline-block;
        }

        .skeleton-card, .skeleton-metric, .skeleton-chart, .skeleton-feed {
            position: relative;
            overflow: hidden;
        }

        .loading-fade-enter {
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }

        .loading-fade-enter-active {
            opacity: 1;
            transform: translateY(0);
        }

        .loading-fade-exit {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.3s ease;
        }

        .loading-fade-exit-active {
            opacity: 0;
            transform: translateY(-10px);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
            .skeleton-card {
                padding: 16px;
            }
            
            .skeleton-metric {
                padding: 20px 16px;
            }
            
            .skeleton-chart {
                padding: 16px;
            }
            
            .skeleton-chart > div:last-child {
                height: 150px !important;
            }
        }
    `;

    document.head.appendChild(styles);
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Auto-inject styles when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLoadingStyles);
} else {
    injectLoadingStyles();
}

// Make functions globally available
window.SynthocracyLoading = {
    showSkeletonGrid,
    showLoadingSpinner,
    showProgressBar,
    fadeOut,
    fadeIn,
    crossFade,
    createSkeletonCard,
    createSkeletonMetric,
    createSkeletonChart,
    createSkeletonFeed
};

console.log('🎨 Synthocracy Loading States initialized');