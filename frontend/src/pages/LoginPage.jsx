import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';
import { Sun, Moon } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const { dark, toggle } = useTheme();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) return toast.error('Enter email and password');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
            login(data);
            toast.success(`Welcome back, ${data.name}! 🍳`);
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            toast.error(msg);
            if (msg === 'Invalid credentials') {
                toast("No account? Click Sign Up below to create one!", { icon: '👇', duration: 5000 });
            }
        } finally { setLoading(false); }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
            {/* Theme toggle */}
            <button onClick={toggle} className="fixed top-4 right-4 p-2 rounded-full card">
                {dark ? <Sun size={20} className="text-orange-400" /> : <Moon size={20} />}
            </button>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="CookSmrt Logo" className="w-48 h-48 mb-2 object-contain" />
                    <p className="text-gray-500 mt-1 text-sm font-medium">Your personal cooking companion 🍴</p>
                </div>

                <h2 className="text-xl font-bold text-center mb-6">Login to CookSmrt</h2>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <input
                        className="input"
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handle}
                        required
                    />
                    <input
                        className="input"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handle}
                        required
                    />
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Don't have an account? <Link to="/signup" className="text-orange-500 font-semibold hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
}
