const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Dish = require('../models/Dish');

const testFilter = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('--- Breakfast ---');
    const breakfast = await Dish.find({ category: 'Breakfast' }, 'name');
    console.log(breakfast.map(d => d.name));

    console.log('--- Lunch ---');
    const lunch = await Dish.find({ category: 'Lunch' }, 'name');
    console.log(lunch.map(d => d.name));

    console.log('--- Dinner ---');
    const dinner = await Dish.find({ category: 'Dinner' }, 'name');
    console.log(dinner.map(d => d.name));

    process.exit(0);
};

testFilter().catch(err => { console.error(err); process.exit(1); });
