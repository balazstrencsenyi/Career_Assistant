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
  const { text, lang } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

 let prompt;

if (lang === 'hu') {
  prompt = `
Karriertanácsadó és önéletrajz szakértő vagy. Vizsgáld meg az alábbi önéletrajz szövegét, és adj részletes visszajelzést magyar nyelven. A visszajelzés legyen pontokba szedve, és térjen ki a következő szempontokra:

- Szerkezet és áttekinthetőség
- Hiányzó szakaszok (pl. összefoglaló, készségek, eredmények)
- Nyelvhelyesség és stílus
- Professzionális hangnem
- Formázási és szerkesztési javaslatok

Önéletrajz szövege:
${text}
  `;
} else {
  prompt = `
You are a professional career coach and resume reviewer. Analyze the following resume text and provide detailed feedback in English. Your response should be in bullet points and include the following:

- Structure and readability
- Missing sections (e.g., summary, skills, achievements)
- Language, grammar, and tone
- Professionalism
- Formatting and layout suggestions

Resume text:
${text}
  `;
}


  try {
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

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
