import { connectDB } from '../../lib/db';
import Analysis from '../../models/Analysis';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    await connectDB();

    // Create analysis record
    const analysis = new Analysis({
      originalFilename: filename || 'resume.pdf',
      fileSize: text.length,
      textContent: text,
      status: 'pending'
    });

    await analysis.save();
    console.log('💾 Analysis saved:', analysis._id);

    // Trigger AI analysis
    analyzeWithAI(analysis._id, text);

    res.status(200).json({ 
      id: analysis._id,
      message: 'Upload successful'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function analyzeWithAI(analysisId, text) {
  try {
    const HF_TOKEN = process.env.HF_TOKEN;
    
    // Skills analysis
    const skillResponse = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text.slice(0, 1024),
          parameters: { 
            candidate_labels: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git']
          }
        })
      }
    );

    const skillData = await skillResponse.json();
    
    const skillsAnalysis = skillData.labels?.slice(0, 6).map((skill, idx) => ({
      name: skill,
      score: Math.round(skillData.scores[idx] * 100)
    })) || [];

    const overallScore = Math.round(
      skillsAnalysis.reduce((sum, s) => sum + s.score, 0) / skillsAnalysis.length || 50
    );

    await Analysis.findByIdAndUpdate(analysisId, {
      overallScore,
      skillsAnalysis,
      recommendations: [
        'Add quantifiable achievements',
        'Include relevant certifications',
        'Use strong action verbs'
      ],
      detailedFeedback: 'Professional resume with relevant experience.',
      status: 'completed'
    });

    console.log('✅ Analysis completed:', analysisId);

  } catch (error) {
    console.error('AI error:', error);
    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'failed',
      error: error.message
    });
  }
}