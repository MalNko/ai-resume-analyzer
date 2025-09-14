import { connectDB } from '../../lib/db';
import Analysis from '../../models/Analysis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Analysis ID required' });
  }

  try {
    await connectDB();
    const analysis = await Analysis.findById(id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Analysis fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}