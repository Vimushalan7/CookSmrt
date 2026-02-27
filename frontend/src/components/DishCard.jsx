import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function DishCard({ dish }) {
    const { toggle, isWished } = useWishlist();
    const { addToCart } = useCart();
    const { user } = useAuth();

    if (!dish?._id) return null;

    const wished = isWished(dish._id);
    console.log(`DishCard [${dish.name}]: wished = ${wished}`);

    const handleWishlist = (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login first');
        toggle(dish._id);
        toast.success(wished ? 'Removed from wishlist' : '❤️ Added to wishlist');
    };

    const handleCart = (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login first');
        addToCart(dish._id);
        toast.success('🛒 Added to cart!');
    };

    const handleImgError = (e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
    };

    return (
        <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group cursor-pointer">
            <Link to={`/dish/${dish._id}`}>
                <div className="relative overflow-hidden h-44 bg-gradient-to-br from-orange-100 to-red-50">
                    <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={handleImgError}
                    />
                    {/* Fallback when image fails */}
                    <div style={{ display: 'none' }} className="w-full h-full items-center justify-center text-5xl">🍽️</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-sm">{Array.isArray(dish.category) ? dish.category[0] : dish.category}</span>
                    <button onClick={handleWishlist} className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full shadow-md hover:scale-110 transition-transform">
                        <Heart size={16} fill={wished ? '#ef4444' : 'none'} className={wished ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'} />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-1">{dish.name}</h3>
                    {/* Ingredient name chips */}
                    <div className="flex flex-wrap gap-1 mb-3 min-h-[22px]">
                        {dish.ingredients?.slice(0, 4).map((ing, i) => (
                            <span key={i} className="text-[10px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 rounded-full px-2 py-0.5 font-medium transition-colors">
                                {ing.name}
                            </span>
                        ))}
                        {dish.ingredients?.length > 4 && (
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium px-1 py-0.5">+{dish.ingredients.length - 4} more</span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
