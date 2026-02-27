const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Dish = require('../models/Dish');

const verifyCategories = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const dishes = await Dish.find({}, 'name category');
    console.log(JSON.stringify(dishes, null, 2));
    process.exit(0);
};

verifyCategories().catch(err => { console.error(err); process.exit(1); });
