import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import api from '../api/api';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
    }, []);

    const statusColor = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', delivered: 'bg-blue-100 text-blue-700' };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-20 max-w-2xl mx-auto px-4 pb-24">
                <h2 className="text-2xl font-bold my-6">📦 Order History</h2>
                {loading ? <div className="flex justify-center py-20"><div className="spinner" /></div>
                    : !orders.length ? (
                        <div className="text-center py-20 text-gray-400"><span className="text-5xl">📦</span><p className="mt-3">No orders yet</p></div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="card p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${statusColor[order.status]}`}>{order.status}</span>
                                    </div>
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm py-1 border-b border-gray-50 last:border-0">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-gray-400 ml-auto">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
            </div>
            <Chatbot />
        </div>
    );
}
