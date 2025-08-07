import React from 'react';

function JobAdInput({ onChange }) {
  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <label>Paste the job ad you'd like to tailor your resume for:</label>
      <textarea placeholder="Paste job description here..." onChange={handleTextChange} />
    </div>
  );
}

export default JobAdInput;
