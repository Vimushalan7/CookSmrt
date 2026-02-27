const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const supabase = require('../config/supabase');
const admin = require('firebase-admin');

// Initialize Firebase Admin defensibly
if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        console.error('❌ Firebase Admin error: Missing environment variables. Google/Phone login will fail.');
    } else {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
            console.log('✅ Firebase Admin initialized successfully');
        } catch (error) {
            console.error('❌ Firebase Admin init error:', error.message);
        }
    }
}

// @POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Name, email and password are required' });

        // Check if already exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: user, error } = await supabase
            .from('users')
            .insert({ name, email: email.toLowerCase(), password: hashedPassword, role: 'user' })
            .select('id, name, email, phone, avatar, role')
            .single();

        if (error) throw error;

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).json({ message: err.message || 'Signup failed' });
    }
};

// @POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, phone, avatar, role, password')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (error || !user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: err.message || 'Login failed' });
    }
};

// @POST /api/auth/firebase-login (Phone or Google login via Firebase)
const firebaseLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: 'Firebase token required' });

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { phone_number: phone, email, name, picture: avatar } = decodedToken;

        let user;

        // Try to find user by email or phone
        if (email) {
            const { data } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
            user = data;
        } else if (phone) {
            const { data } = await supabase.from('users').select('*').eq('phone', phone).maybeSingle();
            user = data;
        }

        if (!user) {
            // Create new user
            const { data: newUser, error } = await supabase
                .from('users')
                .insert({
                    name: name || 'CookSmrt User',
                    email: email?.toLowerCase(),
                    phone,
                    avatar: avatar || '',
                    role: 'user'
                })
                .select()
                .single();
            if (error) throw error;
            user = newUser;
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (err) {
        console.error('Firebase Login error:', err.message);
        res.status(401).json({ message: `Authentication failed: ${err.message}` });
    }
};

module.exports = { signup, login, firebaseLogin };
