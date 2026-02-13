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

AVAILABLE ACTIONS:

1. SCROLL:
   - [TOOL:scroll{"direction":"up"}]
   - [TOOL:scroll{"direction":"down"}]

2. NAVIGATE:
   - [TOOL:navigate{"section":"projects"}]
   - [TOOL:navigate{"section":"skills"}]
   - [TOOL:navigate{"section":"contact"}]

3. HIGHLIGHT (DYNAMIC - kuch bhi text highlight karo):
   - [TOOL:highlight{"text":"jo bhi text user ne kaha"}]
   Example: 
     * "highlight Tailwind" → [TOOL:highlight{"text":"Tailwind"}]
     * "React ko highlight karo" → [TOOL:highlight{"text":"React"}]
     * "E-Commerce project dikhao" → [TOOL:highlight{"text":"E-Commerce"}]

4. FILL FORM (DYNAMIC - kisi bhi field mein value daalo):
   - [TOOL:fillForm{"field":"name","value":"Rakesh Jaiswal"}]
   - [TOOL:fillForm{"field":"email","value":"rakesh@email.com"}]
   - [TOOL:fillForm{"field":"message","value":"Hello World"}]
   
   Field names can be: name, email, message, phone, subject, etc.
   Automatically find the right input field.

5. CLICK:
   - [TOOL:click{"text":"button text"}]

INSTRUCTIONS:
- Extract the text/content to highlight from user's message
- Extract field name and value for form filling
- DO NOT ask clarifying questions
- Always respond conversationally after tool call

EXAMPLES:

User: "mere skills mein Tailwind ko highlight kro"
Assistant: [TOOL:highlight{"text":"Tailwind"}] Done! Highlighting Tailwind in your skills section!

User: "name section mein Rakesh Jaiswal fill kr de"
Assistant: [TOOL:fillForm{"field":"name","value":"Rakesh Jaiswal"}] I've filled your name in the form!

User: "message mein Hello World likh do"
Assistant: [TOOL:fillForm{"field":"message","value":"Hello World"}] Message added to the form!

User: "React project highlight karo"
Assistant: [TOOL:highlight{"text":"React"}] Here are all React-related elements highlighted!

RESPONSE:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);

    //  FALLBACK: Intelligent fallback responses
    const msg = userMessage.toLowerCase();

    // Highlight fallback
    if (
      msg.includes("highlight") ||
      msg.includes("dikhao") ||
      msg.includes("show")
    ) {
      // Extract what to highlight
      let textToHighlight = msg
        .replace("highlight", "")
        .replace("ko", "")
        .replace("kro", "")
        .replace("dikhao", "")
        .replace("show", "")
        .replace("mere skills mein", "")
        .replace("skills mein", "")
        .trim();

      if (textToHighlight) {
        return `[TOOL:highlight{"text":"${textToHighlight}"}] Here, I've highlighted "${textToHighlight}" for you!`;
      }
    }

    // Form fill fallback
    if (msg.includes("fill") || msg.includes("daal") || msg.includes("likh")) {
      if (msg.includes("name") && msg.includes("rakesh")) {
        return '[TOOL:fillForm{"field":"name","value":"Rakesh Jaiswal"}] I\'ve filled your name!';
      }
      if (msg.includes("email")) {
        const emailMatch = msg.match(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          return `[TOOL:fillForm{"field":"email","value":"${emailMatch[0]}"}] Email added!`;
        }
      }
      if (msg.includes("message")) {
        const messageText =
          msg
            .split("message")[1]
            ?.replace("mein", "")
            .replace("likh", "")
            .trim() || "Hello";
        return `[TOOL:fillForm{"field":"message","value":"${messageText}"}] Message added!`;
      }
    }

    // Scroll/navigate fallbacks
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

    return "I can help you scroll, navigate, highlight anything, or fill forms. What would you like?";
  }
}
