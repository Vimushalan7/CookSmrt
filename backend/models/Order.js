const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
            name: String,
            quantity: { type: Number, default: 1 },
        },
    ],
    status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
