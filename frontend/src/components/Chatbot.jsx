import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChefHat, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';
import { useTheme } from '../context/ThemeContext';

export default function Chatbot() {
    const { dark } = useTheme();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! 👨‍🍳 I'm CookSmrt AI! Ask me about recipes, ingredient substitutes, nutrition info, or cooking tips!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef();

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', content: input };
        setMessages((m) => [...m, userMsg]);
        setInput('');
        setLoading(true);
        try {
            const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
            const { data } = await api.post('/chat', { messages: history });
            setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Connection issue. Please restart your backend server to apply .env changes.';
            setMessages((m) => [...m, { role: 'assistant', content: `⚠️ ${errorMsg}` }]);
        } finally { setLoading(false); }
    };

    const suggestions = ['Suggest a healthy breakfast', 'Substitute for eggs in baking', 'Calories in paneer', 'Quick 15-min dinner ideas'];

    return (
        <>
            {/* Floating button */}
            <button onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl text-white"
                style={{ background: 'linear-gradient(135deg,#F97316,#ef4444)' }}>
                <MessageCircle size={24} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${dark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-100'}`}
                        style={{ height: '500px' }}>
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 text-white" style={{ background: 'linear-gradient(135deg,#F97316,#ef4444)' }}>
                            <ChefHat size={24} />
                            <div className="flex-1">
                                <p className="font-bold text-sm">CookSmrt AI</p>
                                <p className="text-xs opacity-75">Your culinary assistant</p>
                            </div>
                            <button onClick={() => setOpen(false)}><X size={20} /></button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'text-white rounded-br-sm'
                                        : dark ? 'bg-gray-800 text-gray-200 rounded-bl-sm' : 'bg-orange-50 text-gray-800 rounded-bl-sm'
                                        }`}
                                        style={msg.role === 'user' ? { background: 'linear-gradient(135deg,#F97316,#ef4444)' } : {}}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm ${dark ? 'bg-gray-800' : 'bg-orange-50'}`}>
                                        <Loader size={14} className="animate-spin text-orange-500" /> Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Quick suggestions */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-1">
                                {suggestions.map((s) => (
                                    <button key={s} onClick={() => { setInput(s); }} className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2 py-1 rounded-full hover:bg-orange-100 transition-colors">{s}</button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className={`flex items-center gap-2 p-3 border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                            <input className="input flex-1 py-2 text-sm" placeholder="Ask me anything culinary..." value={input}
                                onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
                            <button onClick={send} disabled={loading || !input.trim()} className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg,#F97316,#ef4444)' }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
