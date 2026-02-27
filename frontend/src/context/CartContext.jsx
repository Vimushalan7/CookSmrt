import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cooksmrt_cart');
        return saved ? JSON.parse(saved) : { items: [] };
    });

    useEffect(() => {
        localStorage.setItem('cooksmrt_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (dish) => {
        setCart(prev => {
            const items = [...prev.items];
            const existing = items.find(i => i._id === dish._id);
            if (existing) {
                existing.quantity += 1;
            } else {
                items.push({ ...dish, quantity: 1 });
            }
            return { items };
        });
    };

    const removeFromCart = (dishId) => {
        setCart(prev => ({
            items: prev.items.filter(i => i._id !== dishId)
        }));
    };

    const fetchCart = () => { };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
