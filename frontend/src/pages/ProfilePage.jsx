import { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(user?.avatar || '');
    const [saving, setSaving] = useState(false);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleAvatar = (e) => { const f = e.target.files[0]; if (f) { setAvatar(f); setPreview(URL.createObjectURL(f)); } };

    const handleSave = async () => {
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (avatar) fd.append('avatar', avatar);
            const { data } = await api.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            updateUser(data);
            toast.success('Profile updated!');
        } catch { toast.error('Update failed'); }
        finally { setSaving(false); }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-20 max-w-md mx-auto px-4 pb-24">
                <h2 className="text-2xl font-bold my-6">👤 My Profile</h2>
                <div className="card p-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-orange-100 mb-3">
                            {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                                <Camera size={24} color="white" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                            </label>
                        </div>
                        <p className="text-sm text-gray-400">Click to change photo</p>
                    </div>
                    <div className="space-y-4">
                        <input className="input" name="name" placeholder="Full name" value={form.name} onChange={handle} />
                        <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={handle} />
                        <input className="input" name="phone" placeholder="Phone" value={form.phone} onChange={handle} />
                        <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
            <Chatbot />
        </div>
    );
}
