import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export const GeminiChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', role: 'model', text: 'Hello! I am the Mensch AI assistant. Ask me anything about our fleet.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Format history for the API
            const historyForApi = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));
            
            const responseText = await sendMessageToGemini(userMsg.text, historyForApi);
            
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-primary hover:bg-primary-hover'}`}
            >
                <span className="material-symbols-outlined text-white text-2xl">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-surface-dark shadow-2xl ring-1 ring-white/10 sm:w-[380px] animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/5 bg-surface-light px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </div>
                            <h3 className="text-sm font-bold text-white">Mensch Assistant</h3>
                        </div>
                    </div>

                    <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-4 bg-background-dark/50 backdrop-blur-sm">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-primary text-white rounded-br-none' 
                                    : 'bg-white/10 text-slate-200 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="border-t border-white/5 bg-surface-light p-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about our robots..."
                                className="w-full rounded-full border border-white/10 bg-black/50 py-2.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button 
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};