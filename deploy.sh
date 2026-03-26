# deploy.sh
#!/usr/bin/env bash
set -e

if [ -z "$REPO_URL" ]; then
  echo "REPO_URL not set"
  exit 1
fi

if [ -z "$FIREBASE_TOKEN" ]; then
  echo "FIREBASE_TOKEN not set"
  exit 1
fi

echo "Cloning repository..."
git clone $REPO_URL repo

cd repo

if [ ! -d "frontend" ]; then
  echo "frontend directory not found"
  exit 1
fi

cd frontend

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

cd ..

echo "Deploying to Firebase..."
firebase deploy --token "$FIREBASE_TOKEN"

echo "Deployment completed"