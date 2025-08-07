import React from 'react';

function FileUpload({ onUpload, label, button }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    onUpload(data.text);
  };

  return (
    <div className="upload-area">
      <p>{label}</p>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        style={{ marginTop: '1rem' }}
      />
    </div>
  );
}

export default FileUpload;
