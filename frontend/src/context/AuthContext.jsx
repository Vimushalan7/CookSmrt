import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Default guest identity for public access
    const [user, setUser] = useState({ name: 'Guest User', role: 'user', avatar: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Just clear any old tokens to be clean
        localStorage.removeItem('cooksmrt_token');
        localStorage.removeItem('cooksmrt_user');
    }, []);

    const login = () => { };
    const logout = () => { };
    const updateUser = (data) => setUser(prev => ({ ...prev, ...data }));

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
