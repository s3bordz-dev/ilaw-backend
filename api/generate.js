module.exports = async function handler(req, res) {
  // 1. Set CORS headers so frontend can talk to backend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing in Vercel Environment Variables.' });
    }

    // 2. Parse string body if necessary, then format for Gemini API
    const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    let formattedBody = bodyData;

    if (bodyData && bodyData.prompt) {
      formattedBody = {
        contents: [
          {
            parts: [
              { text: bodyData.prompt }
            ]
          }
        ]
      };
    }

    // 3. Forward request to Google Gemini API
    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const googleResponse = await fetch(googleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedBody)
    });

    const data = await googleResponse.json();
    return res.status(googleResponse.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
