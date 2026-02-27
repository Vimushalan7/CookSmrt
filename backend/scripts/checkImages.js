const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Dish = require('../models/Dish');

const checkDishes = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const dishes = await Dish.find({ name: { $in: ['Sambar', 'Rasam'] } }, 'name image');
    console.log(JSON.stringify(dishes, null, 2));
    process.exit(0);
};

checkDishes().catch(err => { console.error(err); process.exit(1); });
