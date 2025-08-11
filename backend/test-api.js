const axios = require('axios');

const API_BASE = 'http://localhost:5000';

const testData = {
  age: "30",
  dependants: "2", 
  income: "10",
  geneticalRisk: "1",
  insurancePlan: "silver",
  employmentStatus: "salaried",
  gender: "male",
  maritalStatus: "married",
  bmiCategory: "normal",
  smokingStatus: "no-smoking",
  region: "northwest",
  medicalHistory: "no-disease"
};

async function testAPI() {
  console.log('🧪 Testing Health Insurance API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test simulated prediction
    console.log('2. Testing simulated prediction...');
    const simulatedResponse = await axios.post(`${API_BASE}/api/predict`, testData);
    console.log('✅ Simulated prediction:', simulatedResponse.data);
    console.log('');

    // Test Streamlit prediction (this might take longer)
    console.log('3. Testing Streamlit prediction (this may take 30+ seconds)...');
    try {
      const streamlitResponse = await axios.post(`${API_BASE}/api/predict-streamlit`, testData, {
        timeout: 60000 // 60 second timeout
      });
      console.log('✅ Streamlit prediction:', streamlitResponse.data);
    } catch (streamlitError) {
      console.log('⚠️  Streamlit prediction failed (this is expected if Streamlit is slow/unavailable)');
      console.log('Error:', streamlitError.message);
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm run dev');
    }
  }
}

// Run the test
testAPI();
