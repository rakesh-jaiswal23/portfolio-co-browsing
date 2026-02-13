"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { getGeminiResponse } from "../../lib/gemini";
import { ActionHandler } from "../CoBrowsing/ActionHandler";
import DOMExtractor from "../CoBrowsing/DOMExtractor";
import { motion } from "framer-motion";

export default function ChatInterface({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI co-browsing assistant. I can help you explore this portfolio, navigate to different sections, highlight projects, and answer any questions you have. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const parseToolCalls = (text) => {
    // since gemini res in two way
    // 1. Action command (TOOL)
    // ex [TOOL:scroll{"direction":"down"}]
    const toolCalls = [];

    const pattern1 = /\[TOOL:(\w+)(\{.*?\})\]/g;
    let match;

    while ((match = pattern1.exec(text)) !== null) {
      try {
        // match[1] = tool ka naam
        // match[2] = JSON params string

        // Example:
        // match[1] => "scroll"
        // match[2] => {"direction":"down"}

        // JSON.parse() string ko JS object banata hai
        // {"direction":"down"}  =>  { direction: "down" }
        const params = JSON.parse(match[2]);

        // Ab toolCalls array me tool push kar rahe hain
        toolCalls.push({
          name: match[1], // tool name (scroll/click/navigate)
          parameters: params, // tool params object
        });
      } catch (e) {
        // Agar JSON galat hua (invalid) to error aayega
        console.error("Error parsing tool params:", e);
      }
    }

    // Normal text which user can see
    const pattern2 = /\[TOOL:(\w+)\]/g;

    // Jab tak response me aisa tool milta rahe, loop chalta rahega
    while ((match = pattern2.exec(text)) !== null) {
      // match[1] me tool ka naam aata hai
      // Example: match[1] => "scroll"

      toolCalls.push({
        name: match[1], // tool name (scroll, click, navigate)
        parameters: {}, // params nahi hai, so empty object
      });
    }

    // Finally saare tool calls return kar deta hai
    return toolCalls;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    console.log("userMessage", userMessage);
    try {
      const pageContext = DOMExtractor.extractVisibleContent();
      console.log("pageContext", pageContext);
      console.log("messages", messages);
      const response = await getGeminiResponse(
        userMessage,
        pageContext,
        messages,
      );

      console.log("AI Response:", response);

      const toolCalls = parseToolCalls(response);
      console.log("Parsed tool calls:", toolCalls);

      if (toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          console.log(`Executing tool: ${toolCall.name}`, toolCall.parameters);
          const result = await ActionHandler.handleToolCall(
            toolCall.name,
            toolCall.parameters,
          );
          console.log("Tool result:", result);
        }
      }

      let cleanResponse = response;
      cleanResponse = cleanResponse.replace(/\[TOOL:\w+\{.*?\}\]/g, "");
      cleanResponse = cleanResponse.replace(/\[TOOL:\w+\]/g, "");
      cleanResponse = cleanResponse.trim();

      if (!cleanResponse) {
        cleanResponse = "Done! I've completed the action you requested.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleanResponse,
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "😅 Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-5 right-5 w-96 h-[600px] bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-700"
    >
      {/* Header - Green Gradient */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              Online • Ready to help
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages  */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-900 flex flex-col gap-3">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-1.5 bg-slate-800 p-3 rounded-2xl self-start border border-slate-700">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
            <span
              className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
