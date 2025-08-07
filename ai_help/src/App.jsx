import React, { useState } from 'react';
import './app.css';
import FileUpload from './components/FileUpload';
import FeedbackSection from './components/FeedBackSection';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (textContent) => {
    setResumeText(textContent);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textContent }),
      });
      const data = await response.json();
      setAiFeedback(data.feedback);
    } catch (err) {
      setAiFeedback('Failed to get feedback. Try again later.');
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1>AI Career Assistant</h1>
      <FileUpload onUpload={handleFileUpload} />
      {loading && <p className="loading">Analyzing your resume...</p>}
      {aiFeedback && <FeedbackSection feedback={aiFeedback} />}
    </div>
  );
}

export default App;
