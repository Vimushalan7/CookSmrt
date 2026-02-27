const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: [{
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
    }],
    image: { type: String, required: true },
    ingredients: [
        {
            name: { type: String, required: true },
            quantity: { type: String, required: true },
        },
    ],
    instructions: [{ type: String }],
}, { timestamps: true });

dishSchema.index({ name: 'text' });

module.exports = mongoose.model('Dish', dishSchema);
