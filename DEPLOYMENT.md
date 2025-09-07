# 🚀 Deployment Guide

## Vercel Deployment (Frontend)

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project root
cd /Users/hughgramelspacher/repos/epub-to-frequency-list

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: vocabulary-frequency-analyzer
# - Directory: ./frontend
# - Override settings? N
```

### Option 2: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click "Deploy"

### Option 3: GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub account to Vercel
3. Select the repository
4. Vercel will auto-detect Next.js and configure automatically

## Backend Deployment Options

### Option 1: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables
railway variables set FLASK_ENV=production

# Deploy
railway up
```

### Option 2: Heroku
```bash
# Install Heroku CLI
# Create Procfile in backend/
echo "web: python main.py" > backend/Procfile

# Create requirements.txt
cd backend
pip freeze > requirements.txt

# Deploy
heroku create your-app-name
git subtree push --prefix backend heroku main
```

### Option 3: DigitalOcean App Platform
1. Create a new app on DigitalOcean
2. Connect your GitHub repository
3. Configure:
   - **Source Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Run Command**: `python main.py`
4. Deploy

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend
```env
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

## Post-Deployment Steps

1. **Update CORS Settings**: Modify `backend/main.py` to allow your Vercel domain
2. **Update API URL**: Change the fetch URL in `frontend/src/app/page.tsx`
3. **Test the Application**: Verify all features work in production
4. **Set up Custom Domain**: (Optional) Configure a custom domain in Vercel

## Monitoring & Maintenance

### Vercel Analytics
- Enable Vercel Analytics for usage insights
- Monitor performance and user behavior

### Backend Monitoring
- Set up logging for the Python backend
- Monitor API response times
- Track error rates

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows your frontend domain
2. **Build Failures**: Check Node.js version compatibility
3. **API Timeouts**: Consider upgrading backend hosting plan
4. **File Upload Issues**: Verify file size limits

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/2.0.x/deploying/)

---

**Your app will be live at: `https://your-app-name.vercel.app`**
