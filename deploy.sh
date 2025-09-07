#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Deploying backend to Heroku..."
cd backend

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Deploy backend
echo "Deploying backend..."
git subtree push --prefix backend heroku main

if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
    echo "📝 Don't forget to:"
    echo "   1. Set environment variables: heroku config:set FLASK_ENV=production"
    echo "   2. Install spaCy model: heroku run python -m spacy download es_core_news_md"
    echo "   3. Update CORS with your Vercel URL"
else
    echo "❌ Backend deployment failed"
    exit 1
fi

cd ..

echo "🌐 Deploying frontend to Vercel..."
cd frontend

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first: npm i -g vercel"
    exit 1
fi

# Deploy frontend
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Frontend deployed successfully!"
    echo "📝 Don't forget to:"
    echo "   1. Set NEXT_PUBLIC_API_URL environment variable in Vercel dashboard"
    echo "   2. Update backend CORS with your Vercel URL"
else
    echo "❌ Frontend deployment failed"
    exit 1
fi

cd ..

echo "🎉 Deployment complete!"
echo "📋 Next steps:"
echo "   1. Update backend CORS in backend/main.py with your Vercel URL"
echo "   2. Set environment variables in both platforms"
echo "   3. Test your deployed application"
