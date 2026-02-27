import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import DishCard from '../components/DishCard';
import Chatbot from '../components/Chatbot';
import api from '../api/api';

export default function HomePage() {
    const [dishes, setDishes] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`/dishes${category !== 'All' ? `?category=${category}` : ''}`)
            .then(({ data }) => setDishes(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [category]);

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-20 px-4 pb-24 max-w-7xl mx-auto">
                {/* Hero section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-2 dark:text-white">
                        Cook <span className="gradient-text">Smarter</span> 🍳
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">Discover 100+ delicious recipes with step-by-step instructions</p>
                    <SearchBar />
                </motion.div>

                {/* Category tabs */}
                <div className="mb-6">
                    <CategoryTabs active={category} onChange={setCategory} />
                </div>

                {/* Dish grid */}
                {loading ? (
                    <div className="flex justify-center py-20"><div className="spinner" /></div>
                ) : (
                    <>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{dishes.length} dishes found</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {dishes.map((dish, i) => {
                                if (!dish?._id) return null;
                                return (
                                    <motion.div key={dish._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                                        <DishCard dish={dish} />
                                    </motion.div>
                                );
                            })}
                        </div>
                        {dishes.length === 0 && (
                            <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                                <p className="text-4xl mb-3">🍽️</p>
                                <p>No dishes found in this category</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Chatbot />
        </div>
    );
}
