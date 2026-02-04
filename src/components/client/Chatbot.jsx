//src/components/client/Chatbot.jsx

import React, { useState, useEffect, useRef } from "react";
import { X, MessageSquare, Sparkles, ShoppingBag } from "lucide-react";
import { queryAI, checkAndInitializeChatbot } from "../../utils/Ai-Product"; //

// Component to render a single chat message
const ChatMessage = ({ m }) => (
  <div className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
    <div 
      className={`inline-block p-3.5 rounded-2xl max-w-[85%] text-sm font-medium leading-relaxed shadow-sm ${
        m.role === "user" 
          ? "bg-[#ff5701] text-white rounded-br-none" 
          : "bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-none"
      }`}
    >
      {m.text}
    </div>
  </div>
);

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    // Auto-initialize product embeddings in the chatbot collection
    const initBot = async () => { 
      const res = await checkAndInitializeChatbot();
      if (res.status === "processed") console.log("Shopy AI initialized with products."); 
    };
    initBot();

    const onClick = (e) => {
      if (!panelRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();

    setMessages((m) => [...m, { role: "user", text: userText }]);
    setInput(""); 
    setLoading(true);

    try {
      // Query AI using RAG logic against the products collection
      const data = await queryAI(userText, 3);
      setMessages((m) => [...m, { role: "bot", text: data.answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "bot", text: "Sorry, I'm having trouble accessing the shop catalog right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => { 
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(); 
    } 
  };

  return (
    <div className="fixed bottom-6 right-4.5 z-[100] flex flex-col items-end font-sans">
      {/* Chat Panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute bottom-20 right-0 w-[90vw] sm:w-[400px] h-[550px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-[#ff5701]" size={20} />
              </div>
              <div>
                <div className="font-black text-slate-900 text-sm tracking-tight">Shopy AI</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online Catalog</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 bg-white">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="text-[#ff5701] mx-auto mb-4" size={32} />
                <p className="text-slate-900 font-black text-lg">Looking for something?</p>
                <p className="text-slate-400 text-xs mt-2 font-bold leading-relaxed px-8 uppercase tracking-widest">
                  Ask me about our latest sneakers, pricing, or product availability!
                </p>
              </div>
            )}
            {messages.map((m, i) => <ChatMessage key={i} m={m} />)}
            {loading && (
              <div className="flex items-center gap-1.5 text-slate-300 ml-2">
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-300"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-50">
            <div className="flex gap-2 relative">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={onKeyDown} 
                placeholder="Ask about a product..." 
                className="w-full rounded-2xl border-2 border-slate-50 pl-4 pr-12 py-4 text-sm font-bold focus:outline-none focus:border-[#ff5701] focus:bg-white bg-slate-50 transition-all"
                autoFocus 
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-[#ff5701] text-white shadow-lg shadow-orange-100 disabled:opacity-30 disabled:shadow-none transition-all active:scale-90"
              >
                <MessageSquare size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        ref={buttonRef} 
        onClick={() => setOpen((o) => !o)} 
        className={`h-16 w-16 rounded-full shadow-2xl transition-all flex items-center justify-center hover:scale-110 active:scale-90 group ${
          open ? "bg-slate-900" : "bg-[#ff5701] shadow-orange-200"
        }`}
      >
        {open ? <X size={28} className="text-white" /> : <MessageSquare size={28} className="text-white group-hover:rotate-12 transition-transform" fill="currentColor" />}
      </button>
    </div>
  );
}