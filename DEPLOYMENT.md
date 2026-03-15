# Quick Deployment Options

## 🚀 Recommended: Railway (2 minutes)

1. Go to [railway.app](https://railway.app)
2. "Start a New Project" → "Deploy from GitHub repo"  
3. Select this repo
4. Add environment variables:
   ```
   NODE_ENV=production
   ADMIN_KEY=your-secure-key-here
   DEMO_MODE=true
   ```
5. **DONE!** Your URL: `https://PROJECT_NAME.up.railway.app`

## 🌐 Alternative Free Options

### Render.com
- Connect repo at render.com
- Build: `npm install`  
- Start: `node api/server.js`

### Fly.io
```bash
npm install -g @flydotio/flyctl
fly launch
fly deploy
```

### Cyclic.sh
- Connect GitHub repo
- Auto-deploys on push

## 🔧 Environment Variables Needed

```bash
NODE_ENV=production          # Disables autonomous demo system
ADMIN_KEY=your-secure-key    # For admin endpoints
DEMO_MODE=true              # Shows bustling activity for judges
PORT=8080                   # Default port
```

## 📊 Test Your Deployment

- **Health Check**: `/health`
- **Dashboard**: `/api/dashboard/metrics`  
- **Admin Info**: `/api/admin/info`
- **API Docs**: `/api/docs`

## 🎯 For Hackathon Judges

Your deployed URL provides:
- Live demo of AI agent governance
- Interactive API testing
- Real-time dashboard metrics
- Complete documentation
- Security-hardened endpoints

Ready for evaluation! 🏆