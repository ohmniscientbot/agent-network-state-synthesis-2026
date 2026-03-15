# Railway Deployment Guide

## Quick Deploy (2 minutes)

### Step 1: Prepare Repository
1. Make GitHub repo public (if not already)
2. Ensure package.json has correct start script

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose `agent-network-state-synthesis-2026`
5. Railway auto-detects Node.js and starts building!

### Step 3: Configure Environment
1. Go to your project → Variables tab
2. Add environment variables:
```
NODE_ENV=production
ADMIN_KEY=your-secure-hackathon-key-2026
PORT=8080
DEMO_MODE=true
```

### Step 4: Get Your URL
- Railway provides: `https://your-project-name.up.railway.app`
- Ready for judges immediately!

## Expected Build Output
```
✅ Build succeeded
🚀 Deployment live at: https://agent-network-state-abc123.up.railway.app
📊 Dashboard: https://agent-network-state-abc123.up.railway.app/api/dashboard/metrics  
🔑 Admin info: https://agent-network-state-abc123.up.railway.app/api/admin/info
```

## Free Tier Limits
- **750 hours/month** (enough for entire hackathon)
- **1GB RAM** (sufficient for our API)
- **1GB storage** (handles agent data)
- **Custom domain** (.railway.app)

## If Deployment Fails

### Missing package.json scripts?
Add to your package.json:
```json
{
  "scripts": {
    "start": "node api/server.js",
    "dev": "node api/server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### Wrong directory structure?
Make sure your structure is:
```
/
├── api/
│   └── server.js
├── package.json
└── README.md
```

### Build failing?
Check Railway logs:
1. Go to your project dashboard
2. Click "Deployments" tab  
3. Click latest deployment
4. Check build logs

## Alternative: Manual Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway deploy
```

## Testing Your Deployment

1. **Visit your URL** - should see landing page
2. **Check health**: `/health` - should return 200 OK  
3. **Test API**: `/api/dashboard/metrics` - should show metrics
4. **Get admin key**: `/api/admin/info` - shows your admin credentials
5. **Try demo mode**: `?demo=true` for bustling activity

## Hackathon Submission

Use your Railway URL for:
- **Demo URL**: `https://your-app.up.railway.app` 
- **API Documentation**: `https://your-app.up.railway.app/api/docs`
- **Live Dashboard**: `https://your-app.up.railway.app/api/dashboard/metrics`

Perfect for judges to test and evaluate! 🏆