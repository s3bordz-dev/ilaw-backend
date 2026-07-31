const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ILAW_MASTER_PROMPT = `
You are an expert curriculum developer for the Philippine Department of Education (DepEd). 
Generate a comprehensive Lesson Plan strictly aligned with DepEd Order No. 016, s. 2026 (ILAW Framework).

Structure the output into four mandatory sections:

1. I — INTENTIONS
   - Learning Competencies & Standards
   - Specific Learning Objectives
   - Learner Context (strengths, interests, barriers)

2. L — LEARNING EXPERIENCES
   - Pre-Lesson (Motivation/Review)
   - Flow (Presentation, Concept Building, Processing, Guided & Independent Practice)
   - Learning Resources & Integration Opportunities

3. A — ASSESSING LEARNING
   - Formative Assessment Checks & Feedback Methods
   - Inclusive Accommodations

4. W — WAYS FORWARD
   - Extended Learning Opportunities (Remediation / Enrichment)
   - Reflective Practice Notes

At the top, include:
Declaration of AI Use: "AI was used to generate the initial draft of this lesson plan following DepEd DO 16, s. 2026. Reviewed and adapted by the teacher."

Format the entire lesson plan in clear Markdown.
`;

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Please provide a subject/topic prompt." });

    const fullPrompt = `${ILAW_MASTER_PROMPT}\n\nTeacher Request:\n${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return res.status(200).json({ lessonPlan: response.text });
  } catch (err) {
    console.error("Gemini Error:", err);
    return res.status(500).json({ error: "Failed to generate ILAW Lesson Plan." });
  }
};
