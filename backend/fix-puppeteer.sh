#!/bin/bash

echo "🔧 Fixing Puppeteer dependencies..."

# Remove node_modules and package-lock.json to start fresh
echo "📦 Cleaning up existing installations..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install missing proxy-agent specifically
echo "📦 Installing proxy-agent..."
npm install proxy-agent@6.3.0

# Update puppeteer to latest stable version
echo "📦 Updating Puppeteer..."
npm install puppeteer@latest

echo "✅ Puppeteer setup complete!"
echo ""
echo "Now try running: npm run dev"
