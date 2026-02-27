const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner'];

export default function CategoryTabs({ active, onChange }) {
    const icons = {
        All: '🍽️',
        Breakfast: '🌅',
        Lunch: '☀️',
        Dinner: '🌙'
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => onChange(cat)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${active === cat
                        ? 'text-white shadow-lg scale-105'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-500 border border-gray-200 dark:border-gray-700'
                        }`}
                    style={active === cat ? { background: 'linear-gradient(135deg,#F97316,#ef4444)' } : {}}
                >
                    <span>{icons[cat]}</span>
                    {cat}
                </button>
            ))}
        </div>
    );
}
