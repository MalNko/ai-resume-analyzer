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

  useEffect(() => {
    if (id) {
      fetchAnalysis(id);
    }
  }, [id]);

  const fetchAnalysis = async (analysisId) => {
    try {
      const response = await fetch(`/api/analyze?id=${analysisId}`);
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Analysis not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Resume Analysis Results
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Overall Score">
            <div className="text-4xl font-bold text-blue-600 text-center">
              {analysis.overallScore}/100
            </div>
          </Card>

          <Card title="Skills Match">
            <div className="space-y-2">
              {analysis.skillsAnalysis?.map((skill, index) => (
                <div key={index} className="flex justify-between">
                  <span>{skill.name}</span>
                  <span className="font-medium">{skill.score}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recommendations">
            <ul className="space-y-2">
              {analysis.recommendations?.map((rec, index) => (
                <li key={index} className="text-sm">• {rec}</li>
              ))}
            </ul>
          </Card>

          <Card title="Experience Analysis" className="md:col-span-2">
            <div className="space-y-3">
              {analysis.experienceAnalysis?.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-medium">{exp.role}</h4>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-sm">{exp.analysis}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Detailed Feedback">
            <p className="text-sm text-gray-700">{analysis.detailedFeedback}</p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}