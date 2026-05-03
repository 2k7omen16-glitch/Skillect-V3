const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function generateAIRoadmap(prompt: string) {
  const systemPrompt = `
    You are an expert career counselor and senior engineer. 
    Generate a high-fidelity career roadmap for the user's requested topic: "${prompt}".
    
    Return the response ONLY as a JSON object with this structure:
    {
      "title": "Professional Title",
      "description": "Short description",
      "phases": [
        {
          "id": 1,
          "title": "Phase Title",
          "subtitle": "Duration/Intensity",
          "description": "Goal",
          "topics": ["Topic 1", "Topic 2"],
          "tips": ["Tip 1"],
          "resources": []
        }
      ]
    }
    
    Ensure you include at least 5 phases. Keep it professional and GenZ friendly.
  `;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a JSON-only response bot.' },
          { role: 'user', content: systemPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating AI roadmap:', error);
    throw error;
  }
}
