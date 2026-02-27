import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';
import { Sun, Moon } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

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

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const { data } = await api.post('/auth/firebase-login', { idToken });
            login(data);
            toast.success(`Welcome back, ${data.name}! 🍳`);
            navigate('/');
        } catch (err) {
            console.error('Google auth error:', err);
            toast.error(err.response?.data?.message || 'Google Login failed');
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
                    <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg shadow-orange-200">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="px-3 text-gray-400 text-xs uppercase tracking-wider">or</span>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium text-gray-700 dark:text-gray-200 shadow-sm"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>

                <p className="text-center text-gray-500 text-sm mt-8">
                    Don't have an account? <Link to="/signup" className="text-orange-500 font-semibold hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
}
