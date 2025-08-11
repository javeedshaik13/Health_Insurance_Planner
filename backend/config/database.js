const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set connection timeout and retry options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('🔄 App will continue without database functionality');
    // Don't exit process, allow app to run without DB
  }
};

module.exports = connectDB;
