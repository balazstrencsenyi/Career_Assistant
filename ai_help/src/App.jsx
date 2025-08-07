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
          jobAd: jobAdText,
        }),
      });

      const data = await response.json();
      setAiFeedback(data.feedback);
      if (data.tailoring) setTailoredFeedback(data.tailoring);
    } catch {
      setAiFeedback('❌ Failed to get feedback. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="app-container dark">
      <div className="control-panel">
        {/* Header controls */}
        <div className="header-controls">
          <div className="language-control">
            <span className="icon"></span>
            <select
              aria-label={t.languageLabel}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="hu">HU</option>
            </select>
          </div>
        </div>

        {/* Title stays English */}
        <h1 className="title">AI Career Assistant</h1>

        {/* Upload + Job ad */}
        <FileUpload onUpload={setResumeText} label={t.uploadPrompt} />

        <JobAdInput
          onChange={setJobAdText}
          label={t.jobLabel}
          placeholder={t.jobPlaceholder}
        />

        <button
          className="analyze-button"
          disabled={!resumeText.trim()}
          onClick={getFeedback}
        >
          🚀 {t.analyzeButton}
        </button>
      </div>

      <div className="feedback-panel">
        {loading && <p className="loading">⏳ {t.analyzing}</p>}

        {aiFeedback && (
          <FeedbackSection title={t.suggestionsTitle} feedback={aiFeedback} />
        )}

        {tailoredFeedback && (
          <FeedbackSection title={t.tailoredTitle} feedback={tailoredFeedback} />
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
