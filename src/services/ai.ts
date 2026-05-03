import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Groq fallback (OpenAI-compatible)
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || "";

async function callGroq(messages: { role: string; content: string }[]) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── AI-Powered Skill Checklist Generator ───
export const generateSkillChecklist = async (role: string) => {
  const prompt = `You are an expert career counselor. Generate a structured skill checklist for the role "${role}".
Return ONLY valid JSON (no markdown, no code fences). Format:
{
  "must_have": [{"name": "skill", "weight": 15}],
  "good_to_have": [{"name": "skill", "weight": 10}],
  "bonus": [{"name": "skill", "weight": 5}]
}
Max 5 skills per category. Weights should total ~100.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Gemini skill checklist error, falling back to Groq:", err);
    try {
      const text = await callGroq([{ role: "user", content: prompt }]);
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch {
      return {
        must_have: [
          { name: "Python", weight: 15 },
          { name: "SQL", weight: 15 },
          { name: "Data Structures", weight: 12 },
        ],
        good_to_have: [
          { name: "React", weight: 10 },
          { name: "Git/GitHub", weight: 8 },
        ],
        bonus: [
          { name: "Docker", weight: 5 },
          { name: "Cloud Basics", weight: 5 },
        ],
      };
    }
  }
};

// ─── AI-Powered Gap Score + Roadmap Generator ───
export const generateGapScore = async (skills: string[], targetRole: string) => {
  const prompt = `Student has these skills: ${JSON.stringify(skills)}
Target role: "${targetRole}"

Analyze the gap and return ONLY valid JSON (no markdown):
{
  "gapScore": number (0-100, how ready they are),
  "missingSkills": [{"skill": "name", "priority": "Must-Have"|"Good-to-Have", "weight": number}],
  "roadmap": [{"week": 1, "focus": "topic", "skills": ["skill1"], "hours": 8, "resource": "specific course/tutorial name", "resourceUrl": "https://youtube.com/results?search_query=..."}],
  "nextStep": {"title": "action", "description": "why", "link": "youtube search url"},
  "mentorCourse": {"title": "NPTEL/Coursera course", "description": "why", "badge": "Free"},
  "aiCourse": {"title": "Advanced course", "description": "why", "badge": "Paid"}
}
Make roadmap 4 weeks. Use real YouTube search URLs for resources.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Gemini gap score error, falling back to Groq:", err);
    try {
      const text = await callGroq([{ role: "user", content: prompt }]);
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch {
      return {
        gapScore: 50,
        missingSkills: [{ skill: "React", priority: "Must-Have", weight: 30 }],
        roadmap: [{ week: 1, focus: "Fundamentals", skills: ["Basics"], hours: 8, resource: "FreeCodeCamp", resourceUrl: "https://youtube.com/results?search_query=learn+programming" }],
        nextStep: { title: "Start Learning", description: "Begin with fundamentals", link: "https://youtube.com/results?search_query=programming+tutorials" },
        mentorCourse: { title: "NPTEL Foundation", description: "Curriculum aligned", badge: "Free" },
        aiCourse: { title: "Coursera Specialization", description: "Industry standard", badge: "Paid" },
      };
    }
  }
};

// ─── AI Mentor Chat ───
export const generateMentorResponse = async (
  studentMessage: string,
  chatHistory: { sender: string; text: string }[],
  mentorName: string = "Dr. Pavan Kumar Shukla",
  mentorDept: string = "Computer Science & Engineering"
) => {
  const historyText = chatHistory
    .slice(-8) // last 8 messages for context window
    .map((msg) => `${msg.sender === "mentor" ? mentorName : "Student"}: ${msg.text}`)
    .join("\n");

  const systemPrompt = `You are ${mentorName}, a faculty member in the ${mentorDept} department at Noida Institute of Engineering and Technology (NIET). You are mentoring a student. Keep your responses concise (2-4 sentences), professional but encouraging. Give practical academic or project advice. DO NOT include your name at the start.`;

  const userPrompt = `Conversation so far:\n${historyText}\n\nStudent: "${studentMessage}"\n\nRespond directly to the student.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent(userPrompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("Gemini chat error, falling back to Groq:", err);
    try {
      const text = await callGroq([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);
      return text.trim();
    } catch {
      return "I'd be happy to help! Could you share more details about your specific question so I can guide you better?";
    }
  }
};

// ─── AI Doubt Box Answer ───
export const generateDoubtAnswer = async (question: string, domain: string) => {
  const prompt = `You are a knowledgeable NIET professor specializing in ${domain}. A student asked: "${question}"
Give a clear, concise answer (3-5 sentences). Be practical and helpful. Include actionable advice.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    try {
      return (await callGroq([{ role: "user", content: prompt }])).trim();
    } catch {
      return "Great question! I'll prepare a detailed response for you. In the meantime, I recommend checking YouTube for introductory videos on this topic.";
    }
  }
};

// ─── AI Resume Summary Generator ───
export const generateResumeSummary = async (name: string, role: string, skills: string, education: string) => {
  const prompt = `Write a 2-3 sentence professional resume summary for ${name}, targeting "${role}" role. Skills: ${skills}. Education: ${education}. Make it ATS-friendly, action-oriented, and impactful. Return only the summary text.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    try {
      return (await callGroq([{ role: "user", content: prompt }])).trim();
    } catch {
      return `Detail-oriented ${education} student with strong skills in ${skills}. Seeking a ${role} opportunity to apply analytical skills and contribute to data-driven solutions.`;
    }
  }
};

// ─── AI News Fetcher ───
export const fetchAINews = async () => {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=artificial+intelligence+OR+machine+learning&lang=en&max=6&apikey=${apiKey}`
    );
    const data = await res.json();
    if (data.articles && data.articles.length > 0) {
      return data.articles.map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: a.source?.name || "Tech News",
        type: (a.title + (a.description || "")).toLowerCase().includes("india") ? "local" : "world",
        image: a.image,
      }));
    }
    return null;
  } catch {
    return null;
  }
};
