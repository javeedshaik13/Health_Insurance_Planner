const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputData: {
    age: { type: Number, required: true },
    dependants: { type: Number, required: true },
    income: { type: Number, required: true },
    geneticalRisk: { type: Number, default: 0 },
    insurancePlan: { type: String, required: false, default: '' },
    employmentStatus: { type: String, required: false, default: '' },
    gender: { type: String, required: false, default: '' },
    maritalStatus: { type: String, required: false, default: '' },
    bmiCategory: { type: String, required: false, default: '' },
    smokingStatus: { type: String, required: false, default: '' },
    region: { type: String, required: false, default: '' },
    medicalHistory: { type: String, required: false, default: '' }
  },
  prediction: {
    type: Number,
    required: true
  },
  predictionType: {
    type: String,
    enum: ['simulated', 'streamlit'],
    default: 'simulated'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
predictionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
