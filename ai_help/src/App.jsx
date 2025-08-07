import React, { useState } from 'react';
import './app.css';
import FileUpload from './components/FileUpload';
import FeedbackSection from './components/FeedBackSection';
import JobAdInput from './components/JobAdInput';
import ExportButton from './components/ExportButton';
import translations from './i18n';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobAdText, setJobAdText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [tailoredFeedback, setTailoredFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);

  const t = translations[language];

  const getFeedback = async () => {
    setLoading(true);
    setAiFeedback('');
    setTailoredFeedback('');

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: resumeText,
          lang: language,
          jobAd: jobAdText
        })
      });

      const data = await response.json();
      setAiFeedback(data.feedback);
      if (data.tailoring) {
        setTailoredFeedback(data.tailoring);
      }
    } catch (err) {
      setAiFeedback('❌ Failed to get feedback. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <div className="control-panel">
        <div className="language-switch">
          <label htmlFor="language">🌍 {t.languageLabel}</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hu">Hungarian</option>
          </select>
        </div>

        <label className="dark-toggle">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          🌙 Dark Mode
        </label>

        <h1 className="title">{t.title}</h1>

        <FileUpload onUpload={setResumeText} label={t.uploadPrompt} />

        <JobAdInput onChange={setJobAdText} />

        <button
          className="analyze-button"
          disabled={!resumeText.trim()}
          onClick={getFeedback}
        >
          🚀 {t.analyzeButton || 'Start Analysis'}
        </button>
      </div>

      <div className="feedback-panel">
        {loading && <p className="loading">⏳ {t.analyzing}</p>}

        {aiFeedback && (
          <FeedbackSection
            title={t.suggestionsTitle}
            feedback={aiFeedback}
          />
        )}

        {tailoredFeedback && (
          <FeedbackSection
            title={t.tailoredTitle || 'Tailored Suggestions'}
            feedback={tailoredFeedback}
          />
        )}

        {(aiFeedback || tailoredFeedback) && (
          <ExportButton
            resume={resumeText}
            feedback={aiFeedback}
            tailored={tailoredFeedback}
            language={language}
          />
        )}
      </div>
    </div>
  );
}

export default App;