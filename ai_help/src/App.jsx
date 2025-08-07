import React, { useState } from 'react';
import './app.css';
import FileUpload from './components/FileUpload';
import FeedbackSection from './components/FeedBackSection';
import translations from './i18n';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const t = translations[language]; // translation map

  const handleFileUpload = async (textContent) => {
    setResumeText(textContent);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textContent, lang: language }),
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
      <h1>{t.title}</h1>

      {/* Language selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="language">{t.languageLabel}:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="en">English</option>
          <option value="hu">Hungarian</option>
        </select>
      </div>

      <FileUpload onUpload={handleFileUpload} label={t.uploadPrompt} button={t.chooseFile} />
      {loading && <p className="loading">{t.analyzing}</p>}
      {aiFeedback && <FeedbackSection title={t.suggestionsTitle} feedback={aiFeedback} />}
    </div>
  );
}

export default App;
