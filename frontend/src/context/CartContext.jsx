import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [] });

    const fetchCart = async () => {
        if (!user) return;
        try { const { data } = await api.get('/users/cart'); setCart(data); } catch { }
    };

    useEffect(() => { fetchCart(); }, [user]);

    const addToCart = async (dishId) => {
        if (!user) return;
        const { data } = await api.post('/users/cart', { dishId });
        setCart(data);
    };

    const removeFromCart = async (dishId) => {
        const { data } = await api.delete(`/users/cart/${dishId}`);
        setCart(data);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
