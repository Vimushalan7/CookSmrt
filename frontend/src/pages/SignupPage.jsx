import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { ChefHat } from 'lucide-react';

export default function SignupPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email && !form.phone) return toast.error('Provide either an email or phone number');
        setLoading(true);
        try {
            // Only send non-empty fields to avoid sparse unique index conflicts
            const payload = { name: form.name, password: form.password };
            if (form.email) payload.email = form.email;
            if (form.phone) payload.phone = form.phone;

            const { data } = await api.post('/auth/signup', payload);
            login(data);
            toast.success(`Welcome to CookSmrt, ${data.name}! 🍳`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-red-50">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg,#F97316,#ef4444)' }}>
                        <ChefHat size={28} color="white" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="input" name="name" placeholder="Full name" value={form.name} onChange={handle} required />
                    <input className="input" name="email" type="email" placeholder="Email address" value={form.email} onChange={handle} />
                    <input className="input" name="phone" type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={handle} />
                    <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={handle} required />
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account? <Link to="/login" className="text-orange-500 font-semibold hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
}
