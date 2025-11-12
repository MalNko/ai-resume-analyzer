import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Results() {
  const router = useRouter();
  const { id } = router.query;
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      analyzeResume();
    }
  }, [id]);

  const analyzeResume = async () => {
    try {
      // Get stored data
      const stored = localStorage.getItem('currentAnalysis');
      if (!stored) {
        setError('No analysis data found');
        setLoading(false);
        return;
      }

      const data = JSON.parse(stored);
      console.log('📄 Analyzing resume:', data.filename);

      // Analyze with Hugging Face API
      const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;
      if (!HF_TOKEN) {
        console.warn('⚠️ No HF_TOKEN found, using mock analysis');
        const mockResults = generateMockAnalysis(data.text);
        setAnalysis(mockResults);
        setLoading(false);
        return;
      }

      // Real AI Analysis
      const skills = await analyzeSkills(data.text, HF_TOKEN);
      const summary = await generateSummary(data.text, HF_TOKEN);
      
      const results = {
        id: data.id,
        originalFilename: data.filename,
        overallScore: Math.round(skills.reduce((sum, s) => sum + s.score, 0) / skills.length),
        skillsAnalysis: skills,
        recommendations: generateRecommendations(data.text, skills),
        experienceAnalysis: extractExperience(data.text),
        detailedFeedback: summary,
        status: 'completed'
      };

      setAnalysis(results);
      setLoading(false);

    } catch (error) {
      console.error('❌ Analysis error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const analyzeSkills = async (text, token) => {
    const skillLabels = [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
      'SQL', 'MongoDB', 'AWS', 'Docker', 'Git'
    ];

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: text.slice(0, 1024),
            parameters: { candidate_labels: skillLabels }
          })
        }
      );

      if (!response.ok) throw new Error('Skills API failed');

      const data = await response.json();
      return data.labels.slice(0, 6).map((skill, idx) => ({
        name: skill,
        score: Math.round(data.scores[idx] * 100)
      }));
    } catch (error) {
      console.error('Skills analysis failed:', error);
      return generateMockSkills(text);
    }
  };

  const generateSummary = async (text, token) => {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: text.slice(0, 1024),
            parameters: { max_length: 130, min_length: 30 }
          })
        }
      );

      if (!response.ok) throw new Error('Summary API failed');

      const data = await response.json();
      return data[0]?.summary_text || 'Professional resume with relevant experience.';
    } catch (error) {
      return 'Professional resume with relevant experience and skills.';
    }
  };

  const generateMockSkills = (text) => {
    const skills = ['JavaScript', 'Python', 'React', 'SQL', 'Git', 'AWS'];
    return skills.map(skill => ({
      name: skill,
      score: Math.floor(Math.random() * 30) + 60
    }));
  };

  const generateMockAnalysis = (text) => {
    return {
      originalFilename: 'Resume.pdf',
      overallScore: 75,
      skillsAnalysis: generateMockSkills(text),
      recommendations: [
        'Add quantifiable achievements',
        'Include relevant certifications',
        'Use strong action verbs'
      ],
      experienceAnalysis: extractExperience(text),
      detailedFeedback: 'Your resume shows strong technical skills and relevant experience.',
      status: 'completed'
    };
  };

  const generateRecommendations = (text, skills) => {
    const recs = [];
    if (!/\d+%/gi.test(text)) recs.push('Add quantifiable achievements');
    if (skills.length < 5) recs.push('Include more technical skills');
    if (!text.toLowerCase().includes('certif')) recs.push('Add relevant certifications');
    return recs.slice(0, 5);
  };

  const extractExperience = (text) => {
    const patterns = [
      /(?:software|web|frontend|backend)\s*(?:engineer|developer)/gi,
      /(?:data|business)\s*analyst/gi,
      /(?:project|product)\s*manager/gi
    ];

    const experiences = [];
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.slice(0, 2).forEach(match => {
          experiences.push({
            role: match.trim(),
            company: 'Previous Employer',
            analysis: 'Relevant experience identified'
          });
        });
      }
    });

    return experiences.length > 0 ? experiences : [{
      role: 'Professional Experience',
      company: 'Various',
      analysis: 'Work experience detected'
    }];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Resume</h2>
            <p className="text-gray-600">This may take a few seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>No analysis data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Resume Analysis Results
          </h1>
          <p className="text-gray-600">
            {analysis.originalFilename}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Overall Score">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-6xl font-bold text-blue-600">
                {analysis.overallScore || 0}
              </div>
              <div className="text-gray-500 text-lg">/100</div>
            </div>
          </Card>

          <Card title="Skills Detected">
            {analysis.skillsAnalysis && analysis.skillsAnalysis.length > 0 ? (
              <div className="space-y-3">
                {analysis.skillsAnalysis.map((skill, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="font-medium text-gray-900">{skill.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills detected</p>
            )}
          </Card>

          <Card title="Recommendations">
            {analysis.recommendations && analysis.recommendations.length > 0 ? (
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex gap-2">
                    <span className="text-blue-600">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No recommendations</p>
            )}
          </Card>

          {analysis.experienceAnalysis && analysis.experienceAnalysis.length > 0 && (
            <Card title="Experience" className="md:col-span-2">
              <div className="space-y-3">
                {analysis.experienceAnalysis.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{exp.role}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-sm">{exp.analysis}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card title="Summary">
            <p className="text-sm text-gray-700">
              {analysis.detailedFeedback}
            </p>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700"
          >
            Analyze Another Resume
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}