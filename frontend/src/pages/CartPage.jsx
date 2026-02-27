import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import { useCart } from '../context/CartContext';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { cart, removeFromCart, fetchCart } = useCart();
    const [placing, setPlacing] = useState(false);
    const navigate = useNavigate();

    const placeOrder = async () => {
        setPlacing(true);
        try {
            await api.post('/users/orders');
            await fetchCart();
            toast.success('🎉 Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Order failed');
        } finally { setPlacing(false); }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-20 max-w-2xl mx-auto px-4 pb-24">
                <h2 className="text-2xl font-bold my-6">🛒 My Cart</h2>
                {!cart?.items?.length ? (
                    <div className="text-center py-20 text-gray-400"><span className="text-5xl">🛒</span><p className="mt-3">Your cart is empty</p></div>
                ) : (
                    <>
                        <div className="space-y-3 mb-6">
                            {cart.items.map((item) => (
                                <div key={item._id} className="card p-4 flex items-center gap-4">
                                    <img src={item.dish?.image} alt={item.dish?.name} className="w-16 h-16 rounded-xl object-cover" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.dish?.name}</p>
                                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <button onClick={() => { removeFromCart(item.dish?._id); toast.success('Removed from cart'); }} className="text-red-400 hover:text-red-600">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={placeOrder} disabled={placing} className="btn-primary w-full flex items-center justify-center gap-2">
                            <ShoppingBag size={18} /> {placing ? 'Placing Order...' : `Place Order (${cart.items.length} items)`}
                        </button>
                    </>
                )}
            </div>
            <Chatbot />
        </div>
    );
}
