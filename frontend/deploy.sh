#!/bin/bash

# Agent Network State Frontend Deployment Script
# For deployment to Kubernetes 'openclaw' namespace

set -e

echo "🤖 Agent Network State Frontend Deployment"
echo "=========================================="

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not available. Please install kubectl first."
    exit 1
fi

# Check if we can connect to the cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

# Check if openclaw namespace exists
if ! kubectl get namespace openclaw &> /dev/null; then
    echo "📦 Creating openclaw namespace..."
    kubectl create namespace openclaw
else
    echo "✅ openclaw namespace exists"
fi

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t agent-network-state:latest .

# Apply Kubernetes manifests
echo "🚀 Deploying to Kubernetes..."
kubectl apply -f k8s-deployment.yaml

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/agent-network-state-frontend -n openclaw

# Get the service information
echo "📋 Deployment Information:"
echo "========================="
kubectl get deployment agent-network-state-frontend -n openclaw
kubectl get service agent-network-state-service -n openclaw
kubectl get ingress agent-network-state-ingress -n openclaw

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your Agent Network State frontend should be available at:"
echo "   https://agent-network-state.openclaw.ai"
echo ""
echo "📊 Monitor the deployment with:"
echo "   kubectl get pods -n openclaw -l app=agent-network-state"
echo "   kubectl logs -n openclaw -l app=agent-network-state"
echo ""
echo "🔧 To update the deployment:"
echo "   1. Make changes to your code"
echo "   2. Rebuild: docker build -t agent-network-state:latest ."
echo "   3. Restart: kubectl rollout restart deployment/agent-network-state-frontend -n openclaw"