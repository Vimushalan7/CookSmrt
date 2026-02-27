import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import { Sun, Moon, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
    const { dark, toggle } = useTheme();
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-20 max-w-md mx-auto px-4 pb-24">
                <h2 className="text-2xl font-bold my-6">⚙️ Settings</h2>
                <div className="space-y-4">
                    <Link to="/profile" className="card p-4 flex items-center gap-4 hover:border-orange-300 border border-transparent transition-colors">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <User size={20} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="font-semibold">Edit Profile</p>
                            <p className="text-sm text-gray-400">Update name, email, phone, avatar</p>
                        </div>
                    </Link>

                    <div className="card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                {dark ? <Moon size={20} className="text-orange-500" /> : <Sun size={20} className="text-orange-500" />}
                            </div>
                            <div>
                                <p className="font-semibold">{dark ? 'Dark Mode' : 'Light Mode'}</p>
                                <p className="text-sm text-gray-400">Current theme: {dark ? 'Dark' : 'Light'}</p>
                            </div>
                        </div>
                        <button onClick={toggle} className={`w-12 h-6 rounded-full transition-colors relative ${dark ? 'bg-orange-500' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="card p-4">
                        <p className="font-semibold mb-1">Account Info</p>
                        <p className="text-sm text-gray-500">Email: {user?.email || '—'}</p>
                        <p className="text-sm text-gray-500">Phone: {user?.phone || '—'}</p>
                        <p className="text-sm text-gray-500">Role: <span className="capitalize font-medium text-orange-500">{user?.role}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
