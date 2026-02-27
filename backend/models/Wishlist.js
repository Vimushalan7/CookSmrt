const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
