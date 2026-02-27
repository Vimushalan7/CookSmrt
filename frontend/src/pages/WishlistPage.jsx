import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
    const { wishlist, toggle } = useWishlist();
    const dishes = wishlist?.dishes || [];

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-20 max-w-5xl mx-auto px-4 pb-24">
                <h2 className="text-2xl font-bold my-6">❤️ My Wishlist</h2>
                {!dishes.length ? (
                    <div className="text-center py-20 text-gray-400"><span className="text-5xl">💔</span><p className="mt-3">No saved dishes yet</p></div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {dishes.map((dish) => {
                            if (!dish || typeof dish === 'string') return null;
                            return (
                                <div key={dish._id} className="card overflow-hidden">
                                    <Link to={`/dish/${dish._id}`}>
                                        <img src={dish.image || '/logo.png'} alt={dish.name || 'Dish'} className="w-full h-40 object-cover" />
                                        <div className="p-3">
                                            <p className="font-semibold text-sm truncate">{dish.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-400">{dish.category || 'Food'}</p>
                                        </div>
                                    </Link>
                                    <button onClick={() => toggle(dish._id)} className="w-full py-2 flex items-center justify-center gap-1 text-red-500 text-xs font-semibold border-t border-gray-100 hover:bg-red-50 transition-colors">
                                        <Heart size={14} fill="#ef4444" /> Remove
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Chatbot />
        </div>
    );
}
