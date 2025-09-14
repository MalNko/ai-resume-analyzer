import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = `/results?id=${data.id}`;
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload your resume and get instant AI-powered analysis and feedback
          </p>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block text-center"
              >
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-blue-600 font-medium">
                  {file ? file.name : 'Choose file'}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  PDF, DOC, or DOCX files only
                </p>
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || isUploading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}