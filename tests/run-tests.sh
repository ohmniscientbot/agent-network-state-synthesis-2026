#!/usr/bin/env bash
# Synthocracy Test Runner
# Handles Chrome pod lifecycle + port-forward automatically
set -e

NAMESPACE="openclaw"
POD="selenium-chrome"
LOCAL_PORT="14444"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🔍 Synthocracy Test Runner"

# 1. Ensure Chrome pod is running
POD_STATUS=$(kubectl get pod $POD -n $NAMESPACE -o jsonpath='{.status.phase}' 2>/dev/null || echo "Missing")

if [ "$POD_STATUS" != "Running" ]; then
    echo "🚀 Starting Chrome pod..."
    kubectl apply -f "$PROJECT_DIR/k8s/selenium-chrome.yaml" -n $NAMESPACE > /dev/null 2>&1 || true
    echo -n "   Waiting for Chrome..."
    for i in $(seq 1 30); do
        STATUS=$(kubectl get pod $POD -n $NAMESPACE -o jsonpath='{.status.phase}' 2>/dev/null || echo "Pending")
        if [ "$STATUS" = "Running" ]; then
            echo " ready!"
            break
        fi
        echo -n "."
        sleep 2
    done
else
    echo "✅ Chrome pod already running"
fi

# 2. Kill any existing port-forward on that port
pkill -f "port-forward.*$LOCAL_PORT" 2>/dev/null || true
sleep 1

# 3. Start fresh port-forward
kubectl port-forward pod/$POD $LOCAL_PORT:4444 -n $NAMESPACE --address 127.0.0.1 > /dev/null 2>&1 &
PF_PID=$!
echo "🔌 Port-forward PID: $PF_PID"

# 4. Wait for Selenium to be ready
echo -n "   Waiting for Selenium..."
for i in $(seq 1 15); do
    if curl -s --max-time 2 "http://localhost:$LOCAL_PORT/status" | grep -q '"ready":true'; then
        echo " ready!"
        break
    fi
    echo -n "."
    sleep 1
done

# 5. Run tests
cd "$PROJECT_DIR"
export SELENIUM_URL="http://localhost:$LOCAL_PORT/wd/hub"
node tests/browser-tests.js
EXIT_CODE=$?

# 6. Cleanup port-forward
kill $PF_PID 2>/dev/null || true

exit $EXIT_CODE
