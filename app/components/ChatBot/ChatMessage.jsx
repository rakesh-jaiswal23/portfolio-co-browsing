"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[85%] p-3 rounded-2xl break-words ${
        isUser
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white self-end rounded-br-none"
          : "bg-slate-800 text-slate-200 self-start rounded-bl-none border border-slate-700"
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{isUser ? "👤" : "🤖"}</span>
        <div className="flex-1 text-sm leading-relaxed prose prose-sm max-w-none prose-invert">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className={`${isUser ? "text-white" : "text-slate-200"}`}>
                  {children}
                </p>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-emerald-300 hover:text-emerald-200 underline"
                  target="_blank"
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code
                  className={`px-1 py-0.5 rounded ${isUser ? "bg-white/20" : "bg-slate-700"} text-sm`}
                >
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      <div
        className={`text-[0.6rem] opacity-60 mt-1 ${isUser ? "text-white/70 text-right" : "text-slate-400 text-left"}`}
      >
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </motion.div>
  );
}
