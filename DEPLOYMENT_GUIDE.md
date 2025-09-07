# 🚀 Complete Deployment Guide

## Overview
This project has two parts that need to be deployed separately:
1. **Python Backend** (Flask + spaCy) - Deploy to Heroku/Railway/DigitalOcean
2. **Next.js Frontend** - Deploy to Vercel

## Step 1: Deploy Python Backend

### Option A: Heroku (Recommended for beginners)

1. **Install Heroku CLI** and login:
```bash
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
heroku login
```

2. **Create Heroku app**:
```bash
cd backend
heroku create your-app-name-backend
```

3. **Set environment variables**:
```bash
heroku config:set FLASK_ENV=production
heroku config:set ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

4. **Deploy**:
```bash
git subtree push --prefix backend heroku main
```

5. **Install spaCy model** (this might take a few minutes):
```bash
heroku run python -m spacy download es_core_news_md
```

### Option B: Railway (Modern alternative)

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
railway login
```

2. **Deploy**:
```bash
cd backend
railway init
railway up
```

3. **Set environment variables** in Railway dashboard:
- `FLASK_ENV=production`
- `ALLOWED_ORIGINS=https://your-frontend-url.vercel.app`

### Option C: DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Configure:
   - **Source**: Select your repository
   - **Source Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python -m spacy download es_core_news_md`
   - **Run Command**: `gunicorn main:app --bind 0.0.0.0:$PORT`

## Step 2: Deploy Next.js Frontend to Vercel

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: vocabulary-frequency-analyzer
# - Directory: ./
# - Override settings? N
```

### Method 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Method 3: GitHub Integration
1. Push your code to GitHub
2. Connect GitHub to Vercel
3. Select repository
4. Vercel auto-detects Next.js configuration

## Step 3: Configure Environment Variables

### Frontend (Vercel)
In Vercel dashboard, go to your project → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
```

### Backend (Heroku/Railway/DigitalOcean)
Set these environment variables:
```
FLASK_ENV=production
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

## Step 4: Update CORS Configuration

After deploying both parts, update the backend CORS settings:

1. **Get your Vercel URL** (e.g., `https://vocabulary-frequency-analyzer.vercel.app`)
2. **Update backend CORS** in `backend/main.py`:
```python
allowed_origins = [
    "http://localhost:3000",  # Development
    "https://vocabulary-frequency-analyzer.vercel.app",  # Your actual Vercel URL
]
```
3. **Redeploy backend** with the updated CORS settings

## Step 5: Test Your Deployment

1. **Test Backend**: Visit `https://your-backend-url.herokuapp.com/api/analyze` (should show CORS error, which is expected)
2. **Test Frontend**: Visit your Vercel URL and try uploading a text or EPUB file
3. **Check Console**: Look for any CORS or API errors

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend CORS includes your Vercel domain
   - Check that `ALLOWED_ORIGINS` environment variable is set correctly

2. **spaCy Model Not Found**:
   - Run `heroku run python -m spacy download es_core_news_md` on Heroku
   - For Railway/DigitalOcean, add the download command to your build process

3. **Build Failures**:
   - Check that all dependencies are in `requirements.txt`
   - Ensure Python version is compatible (3.11.0)

4. **API Timeouts**:
   - Consider upgrading your backend hosting plan
   - Optimize the spaCy processing for large texts

### Environment Variables Checklist

**Backend**:
- ✅ `FLASK_ENV=production`
- ✅ `ALLOWED_ORIGINS=https://your-frontend-url.vercel.app`
- ✅ `PORT` (automatically set by hosting platform)

**Frontend**:
- ✅ `NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com`

## Cost Estimation

- **Vercel**: Free tier (hobby plan)
- **Heroku**: Free tier available (with limitations)
- **Railway**: $5/month for hobby plan
- **DigitalOcean**: $5/month for basic app

## Final URLs

After deployment, you'll have:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name-backend.herokuapp.com`

Update the CORS and environment variables with these actual URLs!
