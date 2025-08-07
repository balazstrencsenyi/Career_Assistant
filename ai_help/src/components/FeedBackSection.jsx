import React from 'react';

function FeedbackSection({ feedback }) {
  return (
    <div className="feedback">
      <h2>AI Suggestions</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{feedback}</pre>
    </div>
  );
}

export default FeedbackSection;
