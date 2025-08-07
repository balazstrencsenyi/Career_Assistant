// components/ExportButton.jsx
import React from 'react';
import { jsPDF } from 'jspdf';

const base64Font = `
AAEAAAASAQAABAAgR0RFRu1BtEYAAAT0AAAAVEdQT1OxqZOrAAAB8AAAAIxHU1VC9NqQEAAAAfgAAADZ
... YOUR BASE64 FONT DATA GOES HERE ...
`; // Only include actual base64 string, no headers like 'data:font/...'

function ExportButton({ resume, feedback, tailored, language }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Register and set the font
    doc.addFileToVFS('NotoSans-Regular.ttf', base64Font);
    doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
    doc.setFont('NotoSans');

    doc.setFontSize(16);
    doc.text('AI Resume Feedback Report', 20, 20);

    doc.setFontSize(10);
    doc.text(`Language: ${language.toUpperCase()}`, 20, 30);

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(
      language === 'hu' ? 'Általános visszajelzés:' : 'General Feedback:',
      20,
      40
    );
    doc.setFont(undefined, 'normal');

    const splitFeedback = doc.splitTextToSize(feedback, 170);
    doc.text(splitFeedback, 20, 50);

    if (tailored) {
      const nextY = 60 + splitFeedback.length * 5;
      doc.setFont(undefined, 'bold');
      doc.text(
        language === 'hu' ? 'Testreszabási javaslatok:' : 'Tailored Suggestions:',
        20,
        nextY
      );
      doc.setFont(undefined, 'normal');

      const splitTailored = doc.splitTextToSize(tailored, 170);
      doc.text(splitTailored, 20, nextY + 10);
    }

    doc.save('resume_feedback.pdf');
  };

  return (
    <button onClick={generatePDF} className="download-button">
      📄 Download PDF Report
    </button>
  );
}

export default ExportButton;
