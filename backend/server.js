const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

// Conditionally load StreamlitClient only when needed
let StreamlitClient = null;
try {
  StreamlitClient = require('./streamlit-client');
  console.log('✅ Puppeteer/StreamlitClient loaded successfully');
} catch (error) {
  console.log('⚠️  Puppeteer not available, Streamlit integration disabled');
  console.log('   You can still use the simulated prediction endpoint');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'OK', message: 'Health Insurance API is running' });
});

// Development-only endpoints (when MongoDB is not available)
if (process.env.NODE_ENV === 'development') {
  // Create a test token for development
  app.post('/api/dev/create-token', (req, res) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: 'dev-user-123' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: 'dev-user-123',
        username: 'dev_user',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User'
      },
      message: 'Development token created'
    });
  });

  // Test prediction endpoint (no auth, no DB)
  app.post('/api/predict-test', async (req, res) => {
    try {
      const {
        age,
        dependants,
        income,
        geneticalRisk,
        insurancePlan,
        employmentStatus,
        gender,
        maritalStatus,
        bmiCategory,
        smokingStatus,
        region,
        medicalHistory
      } = req.body;

      console.log('Test prediction request received:', req.body);

      // Simple prediction calculation
      const basePrice = 5000;
      const ageMultiplier = parseInt(age) * 50;
      const dependantsMultiplier = parseInt(dependants) * 2000;
      const incomeMultiplier = parseInt(income) * 100;
      const prediction = basePrice + ageMultiplier + dependantsMultiplier + incomeMultiplier;

      res.json({
        success: true,
        prediction: Math.round(prediction),
        data: req.body,
        message: 'Test prediction successful'
      });

    } catch (error) {
      console.error('Test prediction error:', error);
      res.status(500).json({
        error: 'Test prediction failed',
        message: error.message
      });
    }
  });
}

// Prediction endpoint (protected)
app.post('/api/predict', auth, async (req, res) => {
  try {
    const {
      age,
      dependants,
      income,
      geneticalRisk,
      insurancePlan,
      employmentStatus,
      gender,
      maritalStatus,
      bmiCategory,
      smokingStatus,
      region,
      medicalHistory
    } = req.body;

    // Validate required fields
    if (!age || !dependants === undefined || !income === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: age, dependants, income'
      });
    }

    // Map React form values to Streamlit expected values
    const streamlitData = {
      'Age': parseInt(age),
      'Number of Dependants': parseInt(dependants),
      'Income in Lakhs': parseInt(income),
      'Genetical Risk': parseInt(geneticalRisk) || 0,
      'Insurance Plan': mapInsurancePlan(insurancePlan),
      'Employment Status': mapEmploymentStatus(employmentStatus),
      'Gender': mapGender(gender),
      'Marital Status': mapMaritalStatus(maritalStatus),
      'BMI Category': mapBMICategory(bmiCategory),
      'Smoking Status': mapSmokingStatus(smokingStatus),
      'Region': mapRegion(region),
      'Medical History': mapMedicalHistory(medicalHistory)
    };

    console.log('Sending data to Streamlit:', streamlitData);

    // Since Streamlit doesn't provide direct API endpoints, we'll simulate the prediction
    // In a real scenario, you might need to use Streamlit's session state or create a separate API
    const prediction = await simulateStreamlitPrediction(streamlitData);

    // Save prediction to MongoDB
    let predictionId = null;
    try {
      const Prediction = require('./models/Prediction');
      const savedPrediction = new Prediction({
        userId: req.user._id,
        inputData: {
          age: parseInt(age),
          dependants: parseInt(dependants),
          income: parseInt(income),
          geneticalRisk: parseInt(geneticalRisk) || 0,
          insurancePlan: insurancePlan || '',
          employmentStatus: employmentStatus || '',
          gender: gender || '',
          maritalStatus: maritalStatus || '',
          bmiCategory: bmiCategory || '',
          smokingStatus: smokingStatus || '',
          region: region || '',
          medicalHistory: medicalHistory || ''
        },
        prediction: prediction,
        predictionType: 'simulated'
      });

      await savedPrediction.save();
      predictionId = savedPrediction._id;
      console.log('Prediction saved to MongoDB:', predictionId);
    } catch (dbError) {
      console.error('Failed to save prediction to MongoDB:', dbError.message);
      // Continue without saving to DB
    }

    res.json({
      success: true,
      prediction: prediction,
      data: streamlitData,
      predictionId: predictionId
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      error: 'Failed to get prediction',
      message: error.message
    });
  }
});

// Helper functions to map React form values to Streamlit expected values
function mapInsurancePlan(plan) {
  const mapping = {
    'bronze': 'Bronze',
    'silver': 'Silver',
    'gold': 'Gold'
  };
  return mapping[plan?.toLowerCase()] || 'Bronze';
}

function mapEmploymentStatus(status) {
  const mapping = {
    'salaried': 'Salaried',
    'self-employed': 'Self-Employed',
    'freelancer': 'Freelancer',
    'unemployed': ''
  };
  return mapping[status?.toLowerCase()] || 'Salaried';
}

function mapGender(gender) {
  const mapping = {
    'male': 'Male',
    'female': 'Female'
  };
  return mapping[gender?.toLowerCase()] || 'Male';
}

function mapMaritalStatus(status) {
  const mapping = {
    'married': 'Married',
    'unmarried': 'Unmarried'
  };
  return mapping[status?.toLowerCase()] || 'Unmarried';
}

function mapBMICategory(category) {
  const mapping = {
    'underweight': 'Underweight',
    'normal': 'Normal',
    'overweight': 'Overweight',
    'obese': 'Obesity'
  };
  return mapping[category?.toLowerCase()] || 'Normal';
}

function mapSmokingStatus(status) {
  const mapping = {
    'no-smoking': 'No Smoking',
    'smoking': 'Regular',
    'occasional': 'Occasional'
  };
  return mapping[status?.toLowerCase()] || 'No Smoking';
}

function mapRegion(region) {
  const mapping = {
    'northwest': 'Northwest',
    'northeast': 'Northeast',
    'southeast': 'Southeast',
    'southwest': 'Southwest'
  };
  return mapping[region?.toLowerCase()] || 'Northwest';
}

function mapMedicalHistory(history) {
  const mapping = {
    'no-disease': 'No Disease',
    'diabetes': 'Diabetes',
    'heart-disease': 'Heart disease',
    'high-blood-pressure': 'High blood pressure',
    'thyroid': 'Thyroid'
  };
  return mapping[history?.toLowerCase()] || 'No Disease';
}

// Simulate prediction logic based on your ML model
async function simulateStreamlitPrediction(data) {
  // This simulates the prediction logic from your ML model
  // In production, you'd want to either:
  // 1. Load the actual ML models here
  // 2. Create a separate Python API
  // 3. Use a service like Streamlit Cloud API (if available)
  
  const basePrice = 5000;
  const ageMultiplier = data['Age'] * 50;
  const dependantsMultiplier = data['Number of Dependants'] * 2000;
  const incomeMultiplier = data['Income in Lakhs'] * 100;
  const riskMultiplier = data['Genetical Risk'] * 500;
  
  let smokingMultiplier = 0;
  if (data['Smoking Status'] === 'Regular') smokingMultiplier = 3000;
  else if (data['Smoking Status'] === 'Occasional') smokingMultiplier = 1500;
  
  let planMultiplier = 0;
  if (data['Insurance Plan'] === 'Gold') planMultiplier = 2000;
  else if (data['Insurance Plan'] === 'Silver') planMultiplier = 1000;
  
  let medicalMultiplier = 0;
  if (data['Medical History'] !== 'No Disease') medicalMultiplier = 2000;
  
  const total = basePrice + ageMultiplier + dependantsMultiplier + 
                incomeMultiplier + riskMultiplier + smokingMultiplier + 
                planMultiplier + medicalMultiplier;
  
  return Math.round(total);
}

// Alternative endpoint using actual Streamlit interaction (protected)
app.post('/api/predict-streamlit', auth, async (req, res) => {
  // Check if StreamlitClient is available
  if (!StreamlitClient) {
    return res.status(503).json({
      error: 'Streamlit integration not available',
      message: 'Puppeteer dependencies not installed. Use /api/predict for simulated predictions.',
      fallback: 'Use the /api/predict endpoint instead'
    });
  }

  let streamlitClient = null;

  try {
    const {
      age,
      dependants,
      income,
      geneticalRisk,
      insurancePlan,
      employmentStatus,
      gender,
      maritalStatus,
      bmiCategory,
      smokingStatus,
      region,
      medicalHistory
    } = req.body;

    // Validate required fields
    if (!age || dependants === undefined || income === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: age, dependants, income'
      });
    }

    // Map React form values to Streamlit expected values
    const streamlitData = {
      'Age': parseInt(age),
      'Number of Dependants': parseInt(dependants),
      'Income in Lakhs': parseInt(income),
      'Genetical Risk': parseInt(geneticalRisk) || 0,
      'Insurance Plan': mapInsurancePlan(insurancePlan),
      'Employment Status': mapEmploymentStatus(employmentStatus),
      'Gender': mapGender(gender),
      'Marital Status': mapMaritalStatus(maritalStatus),
      'BMI Category': mapBMICategory(bmiCategory),
      'Smoking Status': mapSmokingStatus(smokingStatus),
      'Region': mapRegion(region),
      'Medical History': mapMedicalHistory(medicalHistory)
    };

    console.log('Connecting to Streamlit app...');

    // Initialize Streamlit client
    streamlitClient = new StreamlitClient(process.env.STREAMLIT_URL || 'https://health-insurance-planner.onrender.com');
    const initialized = await streamlitClient.initialize();

    if (!initialized) {
      throw new Error('Failed to connect to Streamlit app');
    }

    console.log('Sending data to Streamlit:', streamlitData);

    // Get prediction from Streamlit
    const prediction = await streamlitClient.fillFormAndPredict(streamlitData);

    if (prediction === null) {
      throw new Error('Failed to get prediction from Streamlit');
    }

    res.json({
      success: true,
      prediction: prediction,
      data: streamlitData,
      source: 'streamlit'
    });

  } catch (error) {
    console.error('Streamlit prediction error:', error);
    res.status(500).json({
      error: 'Failed to get prediction from Streamlit',
      message: error.message
    });
  } finally {
    if (streamlitClient) {
      await streamlitClient.close();
    }
  }
});

// Get user's prediction history
app.get('/api/predictions', auth, async (req, res) => {
  try {
    const Prediction = require('./models/Prediction');
    const predictions = await Prediction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 predictions

    res.json({
      success: true,
      predictions
    });

  } catch (error) {
    console.error('Prediction history error:', error);
    res.status(500).json({
      error: 'Failed to fetch prediction history'
    });
  }
});

// Get dashboard analytics
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const Prediction = require('./models/Prediction');

    // Get all user predictions
    const predictions = await Prediction.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (predictions.length === 0) {
      return res.json({
        success: true,
        data: {
          currentPremium: 0,
          claimsThisYear: 0,
          familyMembers: 1,
          healthScore: 85,
          monthlyTrend: [],
          healthTrend: [],
          recentPredictions: [],
          totalPredictions: 0
        }
      });
    }

    // Calculate current premium (latest prediction)
    const currentPremium = predictions[0]?.prediction || 0;

    // Calculate family members from latest prediction
    const latestPrediction = predictions[0];
    const familyMembers = (latestPrediction?.inputData?.dependants || 0) + 1; // +1 for user

    // Generate monthly trend data (last 6 months)
    const monthlyTrend = generateMonthlyTrend(predictions);

    // Generate health trend based on predictions over time
    const healthTrend = generateHealthTrend(predictions);

    // Calculate health score based on user data
    const healthScore = calculateHealthScore(latestPrediction?.inputData);

    // Mock claims data (you can extend this based on your needs)
    const claimsThisYear = Math.floor(Math.random() * 5); // Random for demo

    res.json({
      success: true,
      data: {
        currentPremium,
        claimsThisYear,
        familyMembers,
        healthScore,
        monthlyTrend,
        healthTrend,
        recentPredictions: predictions.slice(0, 5),
        totalPredictions: predictions.length,
        premiumChange: calculatePremiumChange(predictions),
        avgMonthlyPremium: Math.round(currentPremium / 12)
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data'
    });
  }
});

// Helper functions for dashboard calculations
function generateMonthlyTrend(predictions) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const trend = [];

  for (let i = 0; i < 6; i++) {
    const monthPredictions = predictions.filter(p => {
      const predDate = new Date(p.createdAt);
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - (5 - i));
      return predDate.getMonth() === targetDate.getMonth();
    });

    const avgPremium = monthPredictions.length > 0
      ? Math.round(monthPredictions.reduce((sum, p) => sum + p.prediction, 0) / monthPredictions.length / 12)
      : Math.random() * 2000 + 3000; // Fallback data

    trend.push({
      month: months[i],
      value: avgPremium
    });
  }

  return trend;
}

function generateHealthTrend(predictions) {
  const trend = [];

  for (let i = 0; i < 6; i++) {
    const score = predictions.length > i
      ? calculateHealthScore(predictions[i].inputData)
      : 85 + Math.random() * 10;

    trend.push({
      month: i + 1,
      score: Math.round(score)
    });
  }

  return trend;
}

function calculateHealthScore(inputData) {
  if (!inputData) return 85;

  let score = 100;

  // Age factor
  if (inputData.age > 50) score -= 10;
  else if (inputData.age > 35) score -= 5;

  // Smoking factor
  if (inputData.smokingStatus === 'smoking' || inputData.smokingStatus === 'Regular') score -= 15;
  else if (inputData.smokingStatus === 'occasional' || inputData.smokingStatus === 'Occasional') score -= 8;

  // BMI factor
  if (inputData.bmiCategory === 'obese' || inputData.bmiCategory === 'Obesity') score -= 12;
  else if (inputData.bmiCategory === 'overweight' || inputData.bmiCategory === 'Overweight') score -= 6;
  else if (inputData.bmiCategory === 'underweight' || inputData.bmiCategory === 'Underweight') score -= 4;

  // Medical history factor
  if (inputData.medicalHistory && inputData.medicalHistory !== 'no-disease' && inputData.medicalHistory !== 'No Disease') {
    score -= 10;
  }

  // Genetic risk factor
  if (inputData.geneticalRisk > 5) score -= 8;
  else if (inputData.geneticalRisk > 2) score -= 4;

  return Math.max(score, 60); // Minimum score of 60
}

function calculatePremiumChange(predictions) {
  if (predictions.length < 2) return 0;

  const latest = predictions[0].prediction;
  const previous = predictions[1].prediction;

  return ((latest - previous) / previous * 100).toFixed(1);
}

app.listen(PORT, () => {
  console.log(`Health Insurance API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Prediction endpoints:`);
  console.log(`  - Simulated: POST http://localhost:${PORT}/api/predict`);
  console.log(`  - Streamlit: POST http://localhost:${PORT}/api/predict-streamlit`);
});
