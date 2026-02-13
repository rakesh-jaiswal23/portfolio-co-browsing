import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(" Gemini API key not found in .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export async function getGeminiResponse(userMessage, pageContext, chatHistory) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an AI co-browsing assistant for a portfolio website. 
You can perform actions using [TOOL:name{...}] syntax.

CONTEXT:
${JSON.stringify(pageContext, null, 2)}

USER: ${userMessage}

INSTRUCTIONS:
1. If user says "scroll up" → [TOOL:scroll{"direction":"up"}]
2. If user says "scroll down" → [TOOL:scroll{"direction":"down"}]
3. If user says "go to projects" → [TOOL:navigate{"section":"projects"}]
4. If user says "go to skills" → [TOOL:navigate{"section":"skills"}]
5. If user says "go to contact" → [TOOL:navigate{"section":"contact"}]
6. If user says "highlight [text]" → [TOOL:highlight{"text":"text"}]
7. If user says "click [text]" → [TOOL:click{"text":"text"}]


DO NOT ask clarifying questions. Just execute the action immediately.
Always respond conversationally after the tool call.

Example:
User: "scroll down"
Assistant: [TOOL:scroll{"direction":"down"}] Scrolling down!

RESPONSE:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);

    //  FALLBACK: Direct action mapping
    const msg = userMessage.toLowerCase();

    if (msg.includes("scroll up")) {
      return '[TOOL:scroll{"direction":"up"}] Scrolling up!';
    }
    if (msg.includes("scroll down")) {
      return '[TOOL:scroll{"direction":"down"}] Scrolling down!';
    }
    if (msg.includes("go to projects") || msg.includes("show projects")) {
      return '[TOOL:navigate{"section":"projects"}] Taking you to projects section!';
    }
    if (msg.includes("go to skills")) {
      return '[TOOL:navigate{"section":"skills"}] Here are the skills!';
    }
    if (msg.includes("go to contact")) {
      return '[TOOL:navigate{"section":"contact"}] Contact form is right here!';
    }

    return "I can help you scroll, navigate to sections, or highlight projects. What would you like?";
  }
}
