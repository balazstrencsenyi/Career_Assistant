import React from 'react';

function FeedbackSection({ feedback, title }) {
  return (
    <div className="feedback">
      <h2>{title}</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{feedback}</pre>
    </div>
  );
}

export default FeedbackSection;
