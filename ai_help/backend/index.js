const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  let text = '';

  try {
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse file' });
  }
});

// Analyze resume using GPT
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    const prompt = `
You are a career coach and resume expert. Review this resume text and provide suggestions to improve it in terms of clarity, professionalism, and effectiveness. Focus on tone, formatting, and missing elements. Provide bullet-pointed feedback.

Resume:
${text}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const feedback = response.choices[0].message.content;
    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
