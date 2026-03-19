#!/usr/bin/env node
/**
 * Synthocracy Browser Test Suite
 * Uses Selenium + remote Chrome pod in k8s (openclaw namespace)
 *
 * Setup (one-time):
 *   kubectl apply -f k8s/selenium-chrome.yaml
 *
 * Usage:
 *   kubectl port-forward pod/selenium-chrome 14444:4444 -n openclaw &
 *   node tests/browser-tests.js
 *
 * Or via run-tests.sh (handles port-forward lifecycle automatically)
 */

const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const SELENIUM_URL = process.env.SELENIUM_URL || 'http://localhost:14444/wd/hub';
const BASE_URL = process.env.BASE_URL || 'https://synthocracy.up.railway.app';

const results = { passed: 0, failed: 0, errors: [] };

function pass(name) {
    results.passed++;
    console.log(`  ✅ ${name}`);
}

function fail(name, err) {
    results.failed++;
    results.errors.push({ test: name, error: String(err) });
    console.log(`  ❌ ${name}: ${err}`);
}

async function makeDriver() {
    return new Builder()
        .usingServer(SELENIUM_URL)
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options())
        .build();
}

async function withDriver(fn) {
    const driver = await makeDriver();
    try {
        await fn(driver);
    } finally {
        await driver.quit().catch(() => {});
    }
}

async function runPageTests() {
    console.log('📄 Page Load Tests');
    const pages = [
        { path: '/', expected: 'Synthocracy', name: 'Landing' },
        { path: '/dashboard', expected: 'Dashboard', name: 'Dashboard' },
        { path: '/debates', expected: 'Debate', name: 'Debates' },
        { path: '/prediction-markets', expected: 'Prediction', name: 'Prediction Markets' },
        { path: '/roi-analytics', expected: 'ROI', name: 'ROI Analytics', waitMs: 3000 },
        { path: '/ai-governance', expected: 'AI', name: 'AI Governance' },
        { path: '/register', expected: 'Agent', name: 'Register' },
    ];

    // Run each page in its own driver to avoid memory crashes on heavy pages
    for (const { path, expected, name, waitMs } of pages) {
        await withDriver(async (driver) => {
            try {
                await driver.get(`${BASE_URL}${path}`);
                if (waitMs) await driver.sleep(waitMs);
                const title = await driver.getTitle();
                if (title.includes(expected)) {
                    pass(`${name} — "${title}"`);
                } else {
                    fail(name, `expected "${expected}" in title "${title}"`);
                }
            } catch (e) {
                fail(name, e.message);
            }
        });
    }
}

async function runNavTests() {
    console.log('\n🧭 Navigation Tests');
    await withDriver(async (driver) => {
        try {
            await driver.get(`${BASE_URL}/`);
            const links = await driver.findElements(By.css('nav a, .nav-links a'));
            if (links.length >= 3) pass(`Nav has ${links.length} links`);
            else fail('Nav links', `only ${links.length} found`);

            // Check dark theme applied
            const bg = await driver.executeScript(
                'return window.getComputedStyle(document.body).backgroundColor'
            );
            const isDark = bg.includes('0, 0') || bg.includes('10,') || bg.includes('13,');
            if (isDark) pass(`Dark theme active (bg: ${bg})`);
            else fail('Dark theme', `bg is "${bg}" — may be light`);
        } catch (e) {
            fail('Navigation', e.message);
        }

    });

    // Mode toggle gets its own driver — dashboard is memory-heavy
    await withDriver(async (driver) => {
        try {
            await driver.get(`${BASE_URL}/dashboard`);
            const btn = await driver.findElement(By.css('button'));
            const text = await btn.getText();
            pass(`Mode button found: "${text.substring(0, 25)}"`);
        } catch (e) {
            fail('Mode toggle', e.message);
        }
    });
}

async function runApiTests() {
    console.log('\n📡 API Endpoint Tests');
    const endpoints = [
        { path: '/api/dashboard/metrics', must: 'activeAgents', name: 'Dashboard metrics' },
        { path: '/api/governance/proposals', must: null, name: 'Proposals' },
        { path: '/api/agents', must: null, name: 'Agents list' },
        { path: '/api/debates', must: null, name: 'Debates' },
        { path: '/api/governance/security/scan', must: null, name: 'Security scan' },
        { path: '/api/agent/manifest', must: 'Ohmniscient', name: 'Agent manifest' },
        { path: '/api/agent/log', must: 'autonomous_cycle', name: 'Agent log' },
        { path: '/api/agent/stats', must: 'summary', name: 'Agent stats' },
    ];

    await withDriver(async (driver) => {
        for (const { path, must, name } of endpoints) {
            try {
                await driver.get(`${BASE_URL}${path}`);
                const src = await driver.getPageSource();
                if (!src.includes('{')) { fail(name, 'no JSON'); continue; }
                if (src.includes('"error"') && !src.includes('"totalAgents"')) {
                    fail(name, 'returned error'); continue;
                }
                if (must && !src.includes(must)) {
                    fail(name, `missing "${must}"`); continue;
                }
                pass(name);
            } catch (e) {
                fail(name, e.message);
            }
        }
    });
}

async function runIdentityTests() {
    console.log('\n🔗 ERC-8004 Identity Tests');
    await withDriver(async (driver) => {
        try {
            await driver.get(`${BASE_URL}/api/agent/manifest`);
            const src = await driver.getPageSource();
            if (src.includes('erc8004') || src.includes('8004')) pass('ERC-8004 registry in manifest');
            else fail('ERC-8004 registry', 'not found');
            if (src.includes('0x7a5b')) pass('Operator wallet present');
            else fail('Operator wallet', 'not found');
            if (src.includes('29497')) pass('Agent ID #29497 present');
            else fail('Agent ID', 'not found');
            if (src.includes('self_custody')) pass('Self-custody status present');
            else fail('Self-custody', 'not found');
        } catch (e) {
            fail('Identity manifest', e.message);
        }

        try {
            await driver.get(`${BASE_URL}/api/agent/log`);
            const src = await driver.getPageSource();
            // Extract total from JSON
            const match = src.match(/"total"\s*:\s*(\d+)/);
            const total = match ? parseInt(match[1]) : 0;
            if (total >= 20) pass(`Agent log: ${total} entries`);
            else fail('Agent log count', `only ${total} (need 20+)`);
            if (src.includes('human_feedback')) pass('Human feedback entries present');
            else fail('Human feedback', 'missing from log');
            if (src.includes('bug')) pass('Bug/self-correction entries present');
            else fail('Bug entries', 'missing from log');
        } catch (e) {
            fail('Agent log', e.message);
        }
    });
}

async function main() {
    console.log(`\n🤖 Synthocracy Browser Test Suite`);
    console.log(`   ${BASE_URL}`);
    console.log(`   ${new Date().toISOString()}\n`);

    await runPageTests();
    await runNavTests();
    await runApiTests();
    await runIdentityTests();

    const total = results.passed + results.failed;
    const pct = Math.round((results.passed / total) * 100);

    console.log('\n' + '═'.repeat(50));
    console.log(`📊 ${results.passed}/${total} passed (${pct}%)`);
    if (results.errors.length > 0) {
        console.log('\nFailures:');
        results.errors.forEach(({ test, error }) =>
            console.log(`  ❌ ${test}: ${error}`)
        );
    } else {
        console.log('   All tests passed! 🎉');
    }
    console.log('═'.repeat(50) + '\n');

    process.exit(results.failed === 0 ? 0 : 1);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
