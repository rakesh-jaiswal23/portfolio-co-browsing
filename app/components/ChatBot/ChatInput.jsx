'use client';

export default function ChatInput({ input, setInput, onSend, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSend();
  };

  return (
    <form className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything... (e.g., 'Show projects', 'Highlight AI project')"
        className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-full focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-white placeholder-slate-400 text-sm"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-emerald-500/25"
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </form>
  );
}