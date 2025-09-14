import multer from 'multer';
import { parsePDF } from '../../utils/pdfParser';
import { connectDB } from '../../lib/db';
import Analysis from '../../models/Analysis';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Extract text from PDF
      const text = await parsePDF(file.buffer);
      
      // Create analysis record
      const analysis = new Analysis({
        originalFilename: file.originalname,
        fileSize: file.size,
        textContent: text,
        status: 'pending'
      });

      await analysis.save();

      // Trigger analysis (you can make this async)
      setTimeout(() => analyzeResume(analysis._id), 1000);

      res.status(200).json({ 
        id: analysis._id, 
        message: 'File uploaded successfully' 
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

async function analyzeResume(analysisId) {
  try {
    // This would call your AI analysis function
    // For now, we'll simulate analysis
    const mockAnalysis = {
      overallScore: Math.floor(Math.random() * 40) + 60,
      skillsAnalysis: [
        { name: 'JavaScript', score: 85 },
        { name: 'React', score: 78 },
        { name: 'Node.js', score: 92 }
      ],
      recommendations: [
        'Add more quantifiable achievements',
        'Include relevant certifications',
        'Highlight leadership experience'
      ],
      status: 'completed'
    };

    await Analysis.findByIdAndUpdate(analysisId, {
      ...mockAnalysis,
      status: 'completed'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'failed',
      error: error.message
    });
  }
}