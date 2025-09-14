import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  originalFilename: String,
  fileSize: Number,
  textContent: String,
  overallScore: Number,
  skillsAnalysis: [{
    name: String,
    score: Number
  }],
  experienceAnalysis: [{
    role: String,
    company: String,
    analysis: String
  }],
  recommendations: [String],
  detailedFeedback: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);