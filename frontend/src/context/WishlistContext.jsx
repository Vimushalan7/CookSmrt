import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('cooksmrt_wishlist');
        return saved ? JSON.parse(saved) : { dishes: [] };
    });

    useEffect(() => {
        localStorage.setItem('cooksmrt_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggle = (dish) => {
        setWishlist(prev => {
            const dishes = [...prev.dishes];
            const index = dishes.findIndex(d => d._id === dish._id);
            if (index > -1) {
                dishes.splice(index, 1);
            } else {
                dishes.push(dish);
            }
            return { dishes };
        });
    };

    const isWished = (dishId) => {
        return wishlist.dishes.some(d => d._id === dishId);
    };

    const fetchWishlist = () => { };

    return (
        <WishlistContext.Provider value={{ wishlist, toggle, isWished, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
