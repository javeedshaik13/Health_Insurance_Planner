#!/bin/bash

echo "🚀 Starting Health Insurance Planner Development Environment"
echo "============================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Function to install dependencies if node_modules doesn't exist
install_if_needed() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir/node_modules" ]; then
        echo "📦 Installing $name dependencies..."
        cd "$dir"
        npm install
        cd ..
    else
        echo "✅ $name dependencies already installed"
    fi
}

# Install backend dependencies
install_if_needed "backend" "backend"

# Install frontend dependencies  
install_if_needed "health-insurance-ui" "frontend"

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (you can modify it if needed)"
fi

echo ""
echo "🎯 Starting services..."
echo "Backend API will be available at: http://localhost:5000"
echo "Frontend will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start backend in background
echo "🔧 Starting backend API..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "🎨 Starting frontend..."
cd health-insurance-ui
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
