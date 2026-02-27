const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const img = (name) => `/uploads/${name.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')}.jpg`;

const dishes = [
    {
        name: 'Sambar', category: ['Lunch'], image: img('Sambar'),
        ingredients: [
            { name: 'Toor dal', quantity: '1 cup' }, { name: 'Onion (small onions preferred)', quantity: '1' },
            { name: 'Tomato', quantity: '1' }, { name: 'Mixed vegetables (drumstick, carrot, brinjal)', quantity: '1 cup' },
            { name: 'Sambar powder', quantity: '2 tbsp' }, { name: 'Turmeric', quantity: '½ tsp' },
            { name: 'Tamarind', quantity: 'small lemon size' }, { name: 'Salt', quantity: 'to taste' },
            { name: 'Mustard seeds', quantity: '1 tsp' }, { name: 'Curry leaves', quantity: 'few' },
            { name: 'Dried red chilies', quantity: '2' }, { name: 'Oil', quantity: '1 tbsp' }
        ],
        instructions: ['Pressure cook toor dal with turmeric until soft. Mash well.', 'Soak tamarind in warm water and extract juice.', 'Boil vegetables in tamarind water with salt.', 'Add sambar powder and cook 5 mins.', 'Add mashed dal and simmer.', 'Temper mustard seeds, red chilies & curry leaves in oil and add to sambar.']
    },
    {
        name: 'Rasam', category: ['Lunch'], image: img('Rasam'),
        ingredients: [{ name: 'Tomatoes', quantity: '2' }, { name: 'Tamarind', quantity: 'small piece' }, { name: 'Rasam powder', quantity: '2 tsp' }, { name: 'Garlic cloves (optional)', quantity: '3' }, { name: 'Mustard seeds', quantity: 'as needed' }, { name: 'Curry leaves', quantity: 'few' }, { name: 'Coriander leaves', quantity: 'few' }, { name: 'Salt', quantity: 'as needed' }],
        instructions: ['Crush tomato & garlic.', 'Boil tamarind water with salt.', 'Add tomato mix + rasam powder.', 'Boil until frothy.', 'Temper mustard & curry leaves and pour over.', 'Garnish with coriander.']
    },
    {
        name: 'Ven Pongal', category: ['Breakfast', 'Dinner'], image: img('Ven Pongal'),
        ingredients: [{ name: 'Raw rice', quantity: '1 cup' }, { name: 'Moong dal', quantity: '½ cup' }, { name: 'Pepper', quantity: '1 tsp' }, { name: 'Cumin', quantity: '1 tsp' }, { name: 'Ginger', quantity: 'small piece' }, { name: 'Cashews', quantity: 'handful' }, { name: 'Ghee', quantity: 'as needed' }, { name: 'Salt', quantity: 'as needed' }],
        instructions: ['Dry roast moong dal lightly.', 'Pressure cook rice + dal (soft & mushy).', 'Heat ghee, fry cashews, pepper, cumin, ginger.', 'Add to cooked rice-dal.', 'Mix well and serve hot.']
    },
    {
        name: 'Idli', category: ['Breakfast', 'Dinner'], image: img('Idli'),
        ingredients: [{ name: 'Idli rice', quantity: '3 cups' }, { name: 'Urad dal', quantity: '1 cup' }, { name: 'Salt', quantity: 'to taste' }],
        instructions: ['Soak rice & dal separately (4–6 hrs).', 'Grind separately and mix.', 'Ferment overnight.', 'Add salt.', 'Steam in idli plates 10–12 mins.']
    },
    {
        name: 'Dosa', category: ['Breakfast', 'Dinner'], image: img('Dosa'),
        ingredients: [{ name: 'Idli batter', quantity: 'same as idli' }, { name: 'Oil', quantity: 'as needed' }],
        instructions: ['Pour batter on hot tawa.', 'Spread thin in circular motion.', 'Drizzle oil.', 'Cook until crispy.']
    },
    {
        name: 'Chettinad Chicken', category: ['Lunch'], image: img('Chettinad Chicken'),
        ingredients: [{ name: 'Chicken', quantity: '½ kg' }, { name: 'Onions', quantity: '2' }, { name: 'Tomatoes', quantity: '2' }, { name: 'Ginger-garlic paste', quantity: 'as needed' }, { name: 'Chettinad masala', quantity: '2 tbsp' }, { name: 'Curry leaves', quantity: 'few' }, { name: 'Oil', quantity: 'as needed' }, { name: 'Salt', quantity: 'as needed' }],
        instructions: ['Heat oil, sauté onions & curry leaves.', 'Add ginger-garlic paste.', 'Add tomatoes and cook till soft.', 'Add masala + chicken.', 'Cook covered until done.', 'Add little water if needed. Simmer 20 mins.']
    },
    {
        name: 'Chicken Biryani (Tamil Style)', category: ['Lunch'], image: img('Chicken Biryani (Tamil Style)'),
        ingredients: [{ name: 'Chicken', quantity: '½ kg' }, { name: 'Basmati rice', quantity: '2 cups' }, { name: 'Onions (sliced)', quantity: '2' }, { name: 'Tomatoes', quantity: '2' }, { name: 'Mint & coriander', quantity: 'handful' }, { name: 'Ginger-garlic paste', quantity: 'as needed' }, { name: 'Chili powder', quantity: 'as needed' }, { name: 'Garam masala', quantity: 'as needed' }, { name: 'Curd', quantity: 'as needed' }, { name: 'Oil/ghee', quantity: 'as needed' }, { name: 'Salt', quantity: 'as needed' }],
        instructions: ['Marinate chicken with curd, chili powder & salt (30 mins).', 'Fry onions, add tomatoes, mint, coriander.', 'Add marinated chicken and cook 70%.', 'Add soaked rice + water (1:2 ratio).', 'Cook covered on low flame (dum method).']
    },
    {
        name: 'Mutton Kulambu', category: ['Lunch'], image: img('Mutton Kulambu'),
        ingredients: [{ name: 'Mutton', quantity: '½ kg' }, { name: 'Onions', quantity: '2' }, { name: 'Tomatoes', quantity: '2' }, { name: 'Ginger-garlic paste', quantity: 'as needed' }, { name: 'Chili powder', quantity: 'as needed' }, { name: 'Coriander powder', quantity: 'as needed' }, { name: 'Coconut paste', quantity: 'as needed' }, { name: 'Oil', quantity: 'as needed' }, { name: 'Salt', quantity: 'as needed' }, { name: 'Turmeric', quantity: 'pinch' }],
        instructions: ['Pressure cook mutton with salt & turmeric.', 'Sauté onions, add paste & tomatoes.', 'Add spices.', 'Add cooked mutton + stock.', 'Add coconut paste.', 'Simmer 15 mins.']
    },
    {
        name: 'Kara Kuzhambu', category: ['Lunch'], image: img('Kara Kuzhambu'),
        ingredients: [{ name: 'Tamarind', quantity: 'as needed' }, { name: 'Small onions', quantity: 'handful' }, { name: 'Garlic', quantity: 'handful' }, { name: 'Sambar powder', quantity: 'as needed' }, { name: 'Curry leaves', quantity: 'few' }, { name: 'Mustard seeds', quantity: 'as needed' }, { name: 'Oil', quantity: 'as needed' }],
        instructions: ['Heat oil, temper mustard.', 'Add onions & garlic.', 'Add tamarind water + spice powder.', 'Boil until thick.']
    },
    {
        name: 'Kootu', category: ['Lunch'], image: img('Kootu'),
        ingredients: [{ name: 'Vegetable (chow chow / ash gourd)', quantity: '1 cup' }, { name: 'Moong dal', quantity: '½ cup' }, { name: 'Coconut + cumin paste', quantity: 'as needed' }, { name: 'Mustard', quantity: 'as needed' }, { name: 'Curry leaves', quantity: 'few' }],
        instructions: ['Cook dal & vegetable together.', 'Add coconut paste.', 'Temper mustard & curry leaves.']
    },
    {
        name: 'Poriyal', category: ['Lunch'], image: img('Poriyal'),
        ingredients: [{ name: 'Chopped vegetable', quantity: '1 cup' }, { name: 'Mustard seeds', quantity: 'as needed' }, { name: 'Curry leaves', quantity: 'few' }, { name: 'Grated coconut', quantity: 'handful' }, { name: 'Salt', quantity: 'to taste' }],
        instructions: ['Temper mustard & curry leaves.', 'Add vegetable + salt.', 'Cook until soft.', 'Add coconut at end.']
    },
    {
        name: 'Medu Vada', category: ['Breakfast'], image: img('Medu Vada'),
        ingredients: [{ name: 'Urad dal', quantity: '1 cup' }, { name: 'Pepper', quantity: 'as needed' }, { name: 'Curry leaves', quantity: 'few' }, { name: 'Salt', quantity: 'as needed' }, { name: 'Oil', quantity: 'for deep frying' }],
        instructions: ['Soak dal 4 hrs.', 'Grind thick batter.', 'Add salt, pepper, curry leaves.', 'Shape into donut and deep fry.']
    },
    {
        name: 'Appam', category: ['Breakfast', 'Dinner'], image: img('Appam'),
        ingredients: [{ name: 'Raw rice', quantity: '2 cups' }, { name: 'Grated coconut', quantity: '½ cup' }, { name: 'Yeast', quantity: '½ tsp' }, { name: 'Salt', quantity: 'as needed' }],
        instructions: ['Soak rice 4 hrs.', 'Grind with coconut.', 'Add yeast and ferment overnight.', 'Pour in appam pan and swirl.', 'Cover and cook.']
    },
    {
        name: 'Paniyaram', category: ['Breakfast', 'Dinner'], image: img('Paniyaram'),
        ingredients: [{ name: 'Idli batter', quantity: 'as needed' }, { name: 'Onion', quantity: '1 chopped' }, { name: 'Green chili', quantity: '1 chopped' }, { name: 'Mustard', quantity: 'as needed' }, { name: 'Oil', quantity: 'as needed' }],
        instructions: ['Mix chopped onion & chili in batter.', 'Heat paniyaram pan.', 'Pour batter in molds.', 'Flip and cook both sides.']
    },
    {
        name: 'Lemon Rice', category: ['Lunch'], image: img('Lemon Rice'),
        ingredients: [{ name: 'Cooked rice', quantity: '2 cups' }, { name: 'Lemon juice', quantity: 'as needed' }, { name: 'Mustard seeds', quantity: 'as needed' }, { name: 'Green chili', quantity: 'as needed' }, { name: 'Peanuts', quantity: 'handful' }, { name: 'Curry leaves', quantity: 'few' }, { name: 'Salt', quantity: 'as needed' }],
        instructions: ['Temper mustard, chili, peanuts.', 'Add rice + salt.', 'Switch off flame and mix lemon juice.']
    },
    {
        name: 'Puliyodarai', category: ['Lunch'], image: img('Puliyodarai'),
        ingredients: [{ name: 'Tamarind paste', quantity: 'as needed' }, { name: 'Cooked rice', quantity: '2 cups' }, { name: 'Red chili', quantity: 'as needed' }, { name: 'Mustard', quantity: 'as needed' }, { name: 'Peanuts', quantity: 'handful' }, { name: 'Sambar powder', quantity: 'as needed' }],
        instructions: ['Cook tamarind paste with spice powder until thick.', 'Mix with rice.', 'Add tempered peanuts & mustard.']
    },
    {
        name: 'Curd Rice', category: ['Lunch', 'Dinner'], image: img('Curd Rice'),
        ingredients: [{ name: 'Cooked rice', quantity: 'as needed' }, { name: 'Curd', quantity: 'as needed' }, { name: 'Salt', quantity: 'as needed' }, { name: 'Mustard', quantity: 'as needed' }, { name: 'Curry leaves', quantity: 'few' }, { name: 'Pomegranate (optional)', quantity: 'for garnish' }],
        instructions: ['Mash rice.', 'Mix curd & salt.', 'Temper mustard & curry leaves.', 'Garnish with pomegranate.']
    },
    {
        name: 'Rava Kesari', category: ['Breakfast'], image: img('Rava Kesari'),
        ingredients: [{ name: 'Rava', quantity: '1 cup' }, { name: 'Sugar', quantity: '1 cup' }, { name: 'Water', quantity: '2½ cups' }, { name: 'Ghee', quantity: 'as needed' }, { name: 'Cashews', quantity: 'handful' }, { name: 'Cardamom', quantity: 'as needed' }, { name: 'Food color (optional)', quantity: 'pinch' }],
        instructions: ['Roast rava in ghee.', 'Boil water separately.', 'Add hot water to rava carefully.', 'Add sugar & cardamom.', 'Cook till thick. Add ghee.']
    },
    {
        name: 'Payasam', category: ['Lunch'], image: img('Payasam'),
        ingredients: [{ name: 'Vermicelli / rice', quantity: 'as needed' }, { name: 'Milk', quantity: 'as needed' }, { name: 'Sugar', quantity: 'as needed' }, { name: 'Cardamom', quantity: 'as needed' }, { name: 'Cashews', quantity: 'handful' }, { name: 'Raisins', quantity: 'handful' }],
        instructions: ['Roast vermicelli in ghee.', 'Boil milk and add vermicelli.', 'Add sugar & cardamom.', 'Fry nuts in ghee and add.']
    },
    {
        name: 'Parotta', category: ['Breakfast', 'Dinner'], image: img('Parotta'),
        ingredients: [{ name: 'Maida', quantity: '2 cups' }, { name: 'Salt', quantity: 'as needed' }, { name: 'Oil', quantity: 'as needed' }, { name: 'Water', quantity: 'as needed' }],
        instructions: ['Mix flour, salt, water → soft dough.', 'Rest 2 hrs.', 'Roll thin, fold layers.', 'Cook on tawa with oil.', 'Clap to separate layers.']
    },
];

const seed = async () => {
    console.log('🌱 Seeding dishes into Supabase...');
    const { error: deleteError } = await supabase.from('dishes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) console.warn('Delete warning:', deleteError.message);

    const { data, error } = await supabase.from('dishes').insert(dishes).select();
    if (error) { console.error('❌ Seed failed:', error.message); process.exit(1); }
    console.log(`✅ ${data.length} dishes seeded into Supabase!`);
    process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
