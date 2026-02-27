import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState({ dishes: [] });

    const fetchWishlist = async () => {
        if (!user) return;
        try { const { data } = await api.get('/users/wishlist'); setWishlist(data); } catch { }
    };

    useEffect(() => { fetchWishlist(); }, [user]);

    const toggle = async (dishId) => {
        if (!user) return;
        try {
            console.log('Toggling wishlist for:', dishId);
            const { data } = await api.post('/users/wishlist', { dishId });
            console.log('Wishlist update received:', data);
            if (data) setWishlist(data);
        } catch (err) {
            console.error('Wishlist toggle error:', err);
        }
    };

    const isWished = (dishId) => {
        if (!wishlist || !wishlist.dishes || !dishId) return false;
        try {
            return wishlist.dishes.some((d) => {
                if (!d) return false;
                const id = d._id || d;
                return id && id.toString() === dishId.toString();
            });
        } catch (err) {
            console.error('isWished comparison crash:', err);
            return false;
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggle, isWished, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
