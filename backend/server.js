require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dishes', require('./routes/dishRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Health check
app.get('/', (req, res) => res.send('CookSmrt API is running ✅'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'CookSmrt' }));

// Error handler
app.use((err, req, res, next) => {
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// Start server for local dev (Vercel handles this in production)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🍳 CookSmrt server running on port ${PORT}`));
}

module.exports = app;
