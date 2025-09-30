#!/bin/bash

echo "🔄 Resetting workspace..."

# 1. Remove node_modules if possible
if [ -d "node_modules" ]; then
  echo "🗑 Removing node_modules..."
  rm -rf node_modules || echo "⚠️  Cannot remove node_modules"
fi

# 2. Remove lock files
if [ -f "yarn.lock" ]; then
  echo "🗑 Removing yarn.lock..."
  rm -f yarn.lock
fi

if [ -f "package-lock.json" ]; then
  echo "🗑 Removing package-lock.json..."
  rm -f package-lock.json
fi

# 3. Handle .next
if [ -d ".next" ]; then
  echo "⚠️  Cannot remove .next directly, renaming instead..."
  mv .next .next_old_$(date +%s) || echo "❌ Cannot rename .next either"
fi

# 4. Reinstall dependencies
if [ -f "yarn.lock" ] || [ -f "package.json" ]; then
  if command -v yarn >/dev/null 2>&1; then
    echo "📦 Installing dependencies with yarn..."
    yarn install
  else
    echo "📦 Installing dependencies with npm..."
    npm install
  fi
fi

# 5. Build project
if [ -f "package.json" ]; then
  echo "🏗 Building project..."
  if command -v yarn >/dev/null 2>&1; then
    yarn build
  else
    npm run build
  fi
fi

echo "✅ Reset complete!"
