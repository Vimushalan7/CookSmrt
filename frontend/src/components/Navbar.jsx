import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, ChefHat, ShoppingCart, Heart, User, Settings, LogOut, History, Sun, Moon, X, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { dark, toggle } = useTheme();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const navLinks = [
        { label: 'Home', icon: <Home size={18} />, to: '/' },
        { label: 'Profile', icon: <User size={18} />, to: '/profile' },
        { label: 'Order History', icon: <History size={18} />, to: '/orders' },
        { label: 'Wishlist', icon: <Heart size={18} />, to: '/wishlist' },
        { label: 'Settings', icon: <Settings size={18} />, to: '/settings' },
        ...(user?.role === 'admin' ? [{ label: 'Admin Panel', icon: <ChefHat size={18} />, to: '/admin' }] : []),
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-b shadow-sm`}>
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-orange-50 transition-colors">
                    <Menu size={22} className="text-orange-500" />
                </button>

                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="CookSmrt" className="h-14 w-auto object-contain" />
                </Link>

                <div className="flex items-center gap-2">
                    <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-lg hover:bg-orange-50 transition-colors relative">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
                    </button>
                </div>
            </nav>

            {/* Notification dropdown */}
            <AnimatePresence>
                {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="fixed top-16 right-4 z-50 card p-4 w-72 shadow-xl">
                        <h3 className="font-semibold mb-3">Notifications</h3>
                        <div className="text-sm text-gray-500 text-center py-4">🎉 Welcome to CookSmrt! Explore 100+ dishes.</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black" onClick={() => setSidebarOpen(false)} />
                        <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 30 }}
                            className={`fixed top-0 left-0 h-full w-72 z-50 shadow-2xl flex flex-col ${dark ? 'bg-gray-900' : 'bg-white'}`}>
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                                        {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={20} className="text-orange-500" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email || user?.phone}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-1"><X size={20} /></button>
                            </div>
                            {/* Links */}
                            <nav className="flex-1 p-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link key={link.to} to={link.to} onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${dark ? 'hover:bg-gray-800' : 'hover:bg-orange-50 hover:text-orange-600'}`}>
                                        <span className="text-orange-500">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            {/* Footer */}
                            <div className="p-4 border-t border-gray-100 space-y-2">
                                <button onClick={toggle} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${dark ? 'hover:bg-gray-800' : 'hover:bg-orange-50'}`}>
                                    {dark ? <Sun size={18} className="text-orange-500" /> : <Moon size={18} className="text-orange-500" />}
                                    {dark ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                <button onClick={() => { logout(); navigate('/login'); setSidebarOpen(false); }}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
