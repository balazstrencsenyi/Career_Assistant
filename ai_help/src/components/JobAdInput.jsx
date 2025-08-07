import React from 'react';

function JobAdInput({ onChange, label, placeholder }) {
  const handleTextChange = (e) => onChange(e.target.value);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <label>{label}</label>
      <textarea
        placeholder={placeholder}
        onChange={handleTextChange}
      />
    </div>
  );
}

export default JobAdInput;
