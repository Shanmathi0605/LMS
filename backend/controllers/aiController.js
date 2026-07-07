import { GoogleGenAI } from '@google/genai';

export const chatWithAI = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500);
      throw new Error('Gemini API Key is not configured on the server. Please add it to your .env file.');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are a helpful and friendly AI assistant for an online Learning Management System (LMS) called 'SkillNova'.
Your goal is to help students navigate courses, provide learning tips, and answer questions. 
Keep your answers concise, encouraging, and formatted in Markdown. You can speak in English or Tanglish based on the user's preference.`;

    // Format history for Gemini
    const contents = history.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    
    // Add the new message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    next(error);
  }
};
