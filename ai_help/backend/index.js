// 📁 backend/index.js

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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  let text = '';

  try {
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (file.mimetype.includes('wordprocessingml')) {
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

app.post('/api/analyze', async (req, res) => {
  const { text, lang, jobAd } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  const isHU = lang === 'hu';

  const basePrompt = isHU
    ? `Karriertanácsadó és önéletrajz szakértő vagy. Vizsgáld meg az alábbi önéletrajzot és adj visszajelzést magyar nyelven:
- Szerkezet
- Hiányzó szakaszok
- Nyelvhelyesség
- Professzionális hangnem
- Formázási javaslatok

Szöveg:
${text}`
    : `You are a career coach. Analyze this resume:
- Structure
- Missing sections
- Language and tone
- Professionalism
- Formatting suggestions

Resume:
${text}`;

  const tailoringPrompt = jobAd
    ? (isHU
        ? `Az alábbi álláshirdetés alapján szabj személyre javaslatokat az önéletrajz módosítására:

Állásleírás:
${jobAd}`
        : `Based on the job ad below, tailor your feedback for resume adjustments:

Job Ad:
${jobAd}`)
    : null;

  try {
    const messages = [
      { role: 'user', content: basePrompt },
    ];
    if (tailoringPrompt) messages.push({ role: 'user', content: tailoringPrompt });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    const fullText = completion.choices[0].message.content;
    const splitText = tailoringPrompt ? fullText.split(/(?=Tailored Suggestions:|Személyre szabott javaslatok:)/i) : [fullText];

    res.json({
      feedback: splitText[0].trim(),
      tailoring: splitText[1] ? splitText[1].trim() : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
