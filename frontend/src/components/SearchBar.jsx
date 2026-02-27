import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (!query.trim()) { setSuggestions([]); setOpen(false); return; }
        const t = setTimeout(async () => {
            try {
                const { data } = await api.get(`/dishes/search?q=${query}`);
                setSuggestions(data);
                setOpen(true);
            } catch { }
        }, 300);
        return () => clearTimeout(t);
    }, [query]);

    return (
        <div ref={ref} className="relative max-w-2xl mx-auto">
            <div className="flex items-center gap-2 card px-4 py-3">
                <Search size={20} className="text-orange-400 flex-shrink-0" />
                <input
                    className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
                    placeholder="Search for dishes, ingredients..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => suggestions.length && setOpen(true)}
                />
                {query && <button onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); }}><X size={16} className="text-gray-400" /></button>}
            </div>

            <AnimatePresence>
                {open && suggestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 right-0 mt-2 card shadow-xl z-40 overflow-hidden">
                        {suggestions.map((dish) => (
                            <button key={dish._id} onClick={() => { navigate(`/dish/${dish._id}`); setQuery(''); setOpen(false); }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0">
                                <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-lg object-cover" />
                                <div>
                                    <p className="font-medium text-sm">{dish.name}</p>
                                    <p className="text-xs text-gray-400">{dish.category}</p>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
