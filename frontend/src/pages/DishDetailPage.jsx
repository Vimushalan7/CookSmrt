import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Plus, Save, Users, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import api from '../api/api';
import LoadingScreen from '../components/LoadingScreen';
import { AnimatePresence } from 'framer-motion';

export default function DishDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dish, setDish] = useState(null);
    const [tab, setTab] = useState('ingredients');
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [servings, setServings] = useState(1);
    const [isOrdering, setIsOrdering] = useState(false);

    useEffect(() => {
        api.get(`/dishes/${id}`).then(({ data }) => {
            setDish(data);
            setIngredients(data.ingredients || []);
            setInstructions(data.instructions || []);
        }).finally(() => setLoading(false));
    }, [id]);

    const scaleQuantity = (qty, scale) => {
        if (!qty || scale === 1) return qty;

        // Match numbers, fractions (1/2), and special fraction chars (½)
        const numRegex = /(\d+\/\d+|\d+\.\d+|\d+|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g;

        const fracMap = {
            '½': 0.5, '⅓': 0.33, '⅔': 0.66, '¼': 0.25, '¾': 0.75,
            '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8, '⅙': 0.16, '⅚': 0.83,
            '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875
        };

        const reverseFracMap = {
            '0.5': '½', '0.25': '¼', '0.75': '¾'
        };

        return qty.replace(numRegex, (match) => {
            let val;
            if (match.includes('/')) {
                const [n, d] = match.split('/').map(Number);
                val = n / d;
            } else if (fracMap[match]) {
                val = fracMap[match];
            } else {
                val = parseFloat(match);
            }

            const scaled = val * scale;

            // Try to keep it as a clean fraction for display if it's .5 or .25
            const decimalPart = scaled % 1;
            const wholePart = Math.floor(scaled);

            if (decimalPart === 0) return wholePart.toString();

            const fracStr = reverseFracMap[decimalPart.toString()] || reverseFracMap[decimalPart.toFixed(2)];
            if (fracStr) {
                return wholePart > 0 ? `${wholePart}${fracStr}` : fracStr;
            }

            return Number(scaled.toFixed(2)).toString();
        });
    };

    const saveIngredients = async () => {
        setSaving(true);
        try {
            await api.put(`/dishes/${id}`, { ingredients });
            toast.success('Ingredients saved!');
        } catch { toast.error('Save failed'); }
        finally { setSaving(false); }
    };

    const saveInstructions = async () => {
        setSaving(true);
        try {
            await api.put(`/dishes/${id}`, { instructions });
            toast.success('Instructions saved!');
        } catch { toast.error('Save failed'); }
        finally { setSaving(false); }
    };

    const handlePurchase = () => {
        setIsOrdering(true);
        const names = ingredients.map((i) => i.name).join(', ');
        const q = encodeURIComponent(names);

        // Show loading screen for 3s before redirecting
        setTimeout(() => {
            window.open(`https://www.swiggy.com/instamart/search?query=${q}`, '_blank');
            setIsOrdering(false);
        }, 3000);
    };

    const handleIndividualPurchase = (ingName) => {
        setIsOrdering(true);
        const q = encodeURIComponent(ingName);

        // Show loading screen for 2s before redirecting for individual items
        setTimeout(() => {
            window.open(`https://www.swiggy.com/instamart/search?query=${q}`, '_blank');
            setIsOrdering(false);
        }, 2000);
    };

    if (loading) return <div className="flex justify-center pt-32"><div className="spinner" /></div>;
    if (!dish) return <div className="text-center pt-32">Dish not found</div>;

    return (
        <div className="min-h-screen">
            <AnimatePresence>
                {isOrdering && <LoadingScreen />}
            </AnimatePresence>
            <Navbar />
            <div className="pt-20 max-w-3xl mx-auto px-4 pb-24">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-orange-500 font-semibold mt-4 mb-6 hover:gap-3 transition-all">
                    <ArrowLeft size={18} /> Back
                </button>

                {/* Hero image */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-2xl overflow-hidden h-64 mb-6 shadow-xl">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                        <h1 className="text-4xl font-extrabold text-white mb-1">{dish.name}</h1>
                        <div className="flex gap-2">
                            {Array.isArray(dish.category)
                                ? dish.category.map(c => <span key={c} className="bg-orange-500 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md">{c}</span>)
                                : <span className="bg-orange-500 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md">{dish.category}</span>
                            }
                        </div>
                    </div>
                </motion.div>

                {/* Servings Counter */}
                <div className="card p-4 mb-6 flex items-center justify-between shadow-sm border-orange-100 bg-orange-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">Number of People</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Scaling ingredients for {servings} person{servings > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700">
                        <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                            <Minus size={16} />
                        </button>
                        <span className="text-lg font-bold w-4 text-center dark:text-white">{servings}</span>
                        <button onClick={() => setServings(servings + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-500 transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 bg-gray-50 dark:bg-gray-800/50 p-1">
                    {['ingredients', 'instructions'].map((t) => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 font-bold text-sm capitalize rounded-lg transition-all ${tab === t ? 'bg-white dark:bg-gray-700 shadow-sm text-orange-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                            {t === 'ingredients' ? '🥕 Ingredients' : '👨‍🍳 Instructions'}
                        </button>
                    ))}
                </div>

                {/* Ingredients tab */}
                {tab === 'ingredients' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="space-y-2.5 mb-6">
                            {ingredients.map((ing, i) => (
                                <div key={i} className="card p-3 flex items-center gap-3 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all group">
                                    <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-black flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">{i + 1}</span>
                                    <div className="flex-1 min-w-0 flex items-center gap-3">
                                        <div className="flex-[2] text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {ing.name}
                                        </div>
                                        <div className="flex-1 min-w-[100px] flex items-center gap-1.5 justify-end">
                                            <span className="text-[10px] font-bold text-orange-400 dark:text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded">QTY</span>
                                            <span className="font-bold text-orange-600 dark:text-orange-400 text-right text-sm">
                                                {servings > 1 ? scaleQuantity(ing.quantity, servings) : ing.quantity}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleIndividualPurchase(ing.name)}
                                            className="p-2 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                                            title={`Buy ${ing.name}`}
                                        >
                                            <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={handlePurchase} className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-md active:scale-95">
                                <ShoppingBag size={18} /> Order All Ingredients
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Instructions tab */}
                {tab === 'instructions' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="grid gap-4 mb-6">
                            {instructions.map((step, i) => (
                                <div key={i} className="card p-5 flex gap-4 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg,#F97316,#CA8A04)' }}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed min-h-[60px]">
                                            {step}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
            <Chatbot />
        </div>
    );
}
