const OpenAI = require('openai');

let client;
const getClient = () => {
    if (client) return client;
    if (!process.env.GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY is missing');
        return null;
    }
    client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1'
    });
    return client;
};

const SYSTEM_PROMPT = `You are CookSmrt AI, an expert culinary assistant. You help users with:
- Cooking suggestions and tips
- Ingredient substitutes
- Nutritional information
- Recipe improvements and modifications
- Custom recipe generation
- Meal planning

Be friendly, concise, and food-focused. Format recipes clearly with numbered steps.`;

// POST /api/chat
const chatWithAI = async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: 'Messages array required' });
    }

    try {
        const aiClient = getClient();
        if (!aiClient) return res.status(503).json({ message: 'AI service not configured' });

        const completion = await aiClient.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
            max_tokens: 1024,
            temperature: 0.7,
        });
        const reply = completion.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('Groq/AI error:', error.message);
        res.status(500).json({ message: 'AI service unavailable', error: error.message });
    }
};

module.exports = { chatWithAI };
