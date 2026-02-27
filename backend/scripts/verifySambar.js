const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Dish = require('../models/Dish');

const checkSambar = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const sambar = await Dish.findOne({ name: 'Sambar' });
    console.log(JSON.stringify(sambar, null, 2));
    process.exit(0);
};

checkSambar().catch(err => { console.error(err); process.exit(1); });
