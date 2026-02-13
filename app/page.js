"use client";

import { useState, useEffect } from "react";
import ChatInterface from "./components/ChatBot/ChatInterface";
import PortfolioContent from "./components/Portfolio/PortfolioContent";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["home", "projects", "skills", "contact"];
      const scrollPos = window.scrollY + 100;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navigation - Slate & Green Theme */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-md shadow-lg py-3 border-b border-emerald-500/20"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold"
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                RJ<span className="text-slate-300">.</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {["Home", "Projects", "Skills", "Contact"].map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.toLowerCase()}`}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    activeSection === item.toLowerCase()
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5"
                  }`}
                >
                  {item}
                  {activeSection === item.toLowerCase() && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"
                    />
                  )}
                </motion.a>
              ))}

              {/* Resume Button */}
              <motion.a
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href="/my_resume.pdf"
                download="RakeshJaiswal_Resume.pdf"
                className="ml-4 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                <span>📄</span>
                <span>Resume</span>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-slate-300 hover:text-emerald-400 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 bg-slate-900">
        <PortfolioContent />
      </main>

      {/* Chat Interface */}
      <AnimatePresence>
        {isChatOpen && <ChatInterface onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>

      {/* Chat Toggle  */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 border border-emerald-400/20"
          onClick={() => setIsChatOpen(true)}
        >
          💬
        </motion.button>
      )}

      {/* Scroll to Top Button - Shows when scrolled */}
      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 left-5 w-12 h-12 rounded-full bg-slate-800 text-emerald-400 text-xl flex items-center justify-center shadow-lg hover:shadow-emerald-500/20 transition-all border border-slate-700 hover:border-emerald-500 z-50"
        >
          ↑
        </motion.button>
      )}
    </>
  );
}
