# Health Insurance Plan Predictor

An interactive machine learning-based Insurance Planner with a user-friendly UI. Helps users explore the best insurance options based on personal features like age, income, dependents, and health indicators.

## Architecture

- **Frontend**: React + TypeScript with shadcn/ui components
- **Backend API**: Node.js Express server
- **ML Service**: Python Streamlit app deployed at https://health-insurance-planner.onrender.com
- **Authentication**: Clerk

## Working Description

This project is an ML-powered web application that helps users identify the most suitable insurance plans based on key features such as:

- Age
- Annual income
- Number of dependents
- Health condition (BMI, smoking status)
- Employment type

The application includes:
- A trained ML model for prediction or recommendation
- A clean, user-friendly web interface
- Node.js API bridge to Streamlit ML service
- Insights and explanations for better decision-making

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **ML Service**: Python, Streamlit, scikit-learn, XGBoost
- **Authentication**: Clerk
- **Deployment**: Render (ML service)


# Health Insurance Planner - Setup Guide

This guide will help you set up the complete Health Insurance Planner application with React frontend, Node.js API backend, and integration with your deployed Streamlit ML service.

## Architecture Overview

```
React Frontend (Port 5173) 
    ↓ HTTP Requests
Node.js API Backend (Port 5000)
    ↓ Web Scraping/Automation  
Streamlit ML Service (https://health-insurance-planner.onrender.com)
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Setup Instructions

### 1. Backend API Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd health-insurance-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

The React app will be available at `http://localhost:5173`

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
STREAMLIT_URL=https://health-insurance-planner.onrender.com
NODE_ENV=development
```

## API Endpoints

### Backend API Endpoints

- **GET** `/health` - Health check
- **POST** `/api/predict` - Simulated prediction (fast)
- **POST** `/api/predict-streamlit` - Real Streamlit prediction (slower, more accurate)

### Testing the API

```bash
# Health check
curl http://localhost:5000/health

# Test prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": "30",
    "dependants": "2",
    "income": "10",
    "geneticalRisk": "1",
    "insurancePlan": "silver",
    "employmentStatus": "salaried",
    "gender": "male",
    "maritalStatus": "married",
    "bmiCategory": "normal",
    "smokingStatus": "no-smoking",
    "region": "northwest",
    "medicalHistory": "no-disease"
  }'
```

## Features

### Frontend Features
- ✅ Modern React + TypeScript interface
- ✅ Responsive design with Tailwind CSS
- ✅ Form validation and error handling
- ✅ Loading states and user feedback
- ✅ Clerk authentication integration
- ✅ Dashboard with analytics charts

### Backend Features
- ✅ Express.js REST API
- ✅ CORS enabled for frontend integration
- ✅ Input validation and error handling
- ✅ Two prediction modes:
  - Simulated (fast, for development)
  - Streamlit integration (real ML predictions)

### ML Integration
- ✅ Connects to deployed Streamlit app
- ✅ Automated form filling and prediction extraction
- ✅ Handles all input parameters from your ML model
- ✅ Fallback to simulated predictions if Streamlit is unavailable

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is running on port 5000
2. **Streamlit Connection Issues**: Check if your Streamlit app is accessible
3. **Puppeteer Issues**: Install additional dependencies if needed:
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
   ```

### Development Tips

1. **Use Simulated Endpoint**: For faster development, use `/api/predict` instead of `/api/predict-streamlit`
2. **Check Logs**: Monitor both frontend and backend console logs for errors
3. **Network Tab**: Use browser dev tools to inspect API requests/responses

## Deployment

### Backend Deployment
- Deploy to services like Heroku, Railway, or Render
- Set environment variables in your deployment platform
- Ensure Puppeteer dependencies are available

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update API base URL in production

## Next Steps

1. Test the complete flow: Frontend → Backend → Streamlit
2. Add error handling and retry logic
3. Implement caching for better performance
4. Add authentication to API endpoints
5. Set up monitoring and logging
