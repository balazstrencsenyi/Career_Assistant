import React from 'react';

function FileUpload({ onUpload, label = "Upload your resume (PDF or DOCX)" }) {
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
    <div>
      <label>{label}</label>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
