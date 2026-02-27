const supabase = require('../config/supabase');

// GET /api/dishes?category=Breakfast
const getDishes = async (req, res) => {
    try {
        const { category } = req.query;
        let query = supabase.from('dishes').select('*').order('created_at', { ascending: false });
        if (category && category !== 'All') {
            query = query.contains('category', [category]);
        }
        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/dishes/search?q=
const searchDishes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);
        const { data, error } = await supabase
            .from('dishes')
            .select('*')
            .ilike('name', `%${q}%`)
            .limit(10);
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/dishes/:id
const getDishById = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('dishes')
            .select('*')
            .eq('id', req.params.id)
            .single();
        if (error || !data) return res.status(404).json({ message: 'Dish not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/dishes (admin)
const createDish = async (req, res) => {
    try {
        const { name, category, image, ingredients, instructions } = req.body;
        const { data, error } = await supabase
            .from('dishes')
            .insert({ name, category, image, ingredients, instructions })
            .select()
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/dishes/:id
const updateDish = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('dishes')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();
        if (error || !data) return res.status(404).json({ message: 'Dish not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/dishes/:id (admin)
const deleteDish = async (req, res) => {
    try {
        const { error } = await supabase.from('dishes').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Dish deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const seedDishes = async (req, res) => {
    try {
        const img = (name) => `/uploads/${name.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')}.jpg`;
        const dishes = [
            {
                name: 'Sambar', category: ['Lunch'], image: img('Sambar'),
                ingredients: [
                    { name: 'Toor dal', quantity: '1 cup' }, { name: 'Mixed vegetables', quantity: '1 cup' },
                    { name: 'Sambar powder', quantity: '2 tbsp' }, { name: 'Tamarind', quantity: 'small size' }
                ],
                instructions: ['Pressure cook dal.', 'Boil vegetables in tamarind water.', 'Add sambar powder and dal.', 'Temper and serve.']
            },
            {
                name: 'Rasam', category: ['Lunch'], image: img('Rasam'),
                ingredients: [{ name: 'Tomatoes', quantity: '2' }, { name: 'Tamarind', quantity: 'small piece' }, { name: 'Rasam powder', quantity: '2 tsp' }],
                instructions: ['Boil tamarind water with salt.', 'Add tomato mix + rasam powder.', 'Boil until frothy.', 'Temper mustard & curry leaves.']
            },
            {
                name: 'Ven Pongal', category: ['Breakfast', 'Dinner'], image: img('Ven Pongal'),
                ingredients: [{ name: 'Raw rice', quantity: '1 cup' }, { name: 'Moong dal', quantity: '½ cup' }, { name: 'Ghee', quantity: 'as needed' }],
                instructions: ['Pressure cook rice + dal.', 'Heat ghee, fry cashews, pepper, cumin.', 'Add to cooked rice-dal.']
            },
            {
                name: 'Idli', category: ['Breakfast', 'Dinner'], image: img('Idli'),
                ingredients: [{ name: 'Idli rice', quantity: '3 cups' }, { name: 'Urad dal', quantity: '1 cup' }],
                instructions: ['Soak and grind rice & dal.', 'Ferment overnight.', 'Steam for 10-12 mins.']
            },
            {
                name: 'Dosa', category: ['Breakfast', 'Dinner'], image: img('Dosa'),
                ingredients: [{ name: 'Idli batter', quantity: 'as needed' }],
                instructions: ['Spread batter on hot tawa.', 'Drizzle oil.', 'Cook until crispy.']
            },
            {
                name: 'Chettinad Chicken', category: ['Lunch'], image: img('Chettinad Chicken'),
                ingredients: [{ name: 'Chicken', quantity: '½ kg' }, { name: 'Chettinad masala', quantity: '2 tbsp' }],
                instructions: ['Sauté onions and spices.', 'Add chicken and cook until done.']
            },
            {
                name: 'Chicken Biryani', category: ['Lunch'], image: img('Chicken Biryani'),
                ingredients: [{ name: 'Chicken', quantity: '½ kg' }, { name: 'Basmati rice', quantity: '2 cups' }],
                instructions: ['Sauté onions and spices.', 'Add chicken and cook 70%.', 'Add rice + water and cook (dum).']
            },
            {
                name: 'Mutton Kulambu', category: ['Lunch'], image: img('Mutton Kulambu'),
                ingredients: [{ name: 'Mutton', quantity: '½ kg' }, { name: 'Coconut paste', quantity: 'as needed' }],
                instructions: ['Pressure cook mutton.', 'Sauté onions and spices.', 'Add mutton and coconut paste, simmer.']
            },
            {
                name: 'Lemon Rice', category: ['Lunch'], image: img('Lemon Rice'),
                ingredients: [{ name: 'Cooked rice', quantity: '2 cups' }, { name: 'Lemon juice', quantity: 'as needed' }],
                instructions: ['Temper mustard, chili, peanuts.', 'Add rice + salt.', 'Mix lemon juice.']
            },
            {
                name: 'Parotta', category: ['Breakfast', 'Dinner'], image: img('Parotta'),
                ingredients: [{ name: 'Maida', quantity: '2 cups' }],
                instructions: ['Make soft dough.', 'Roll thin, fold layers.', 'Cook with oil.']
            }
        ];

        // Clean current dishes first to prevent duplicates (optional)
        await supabase.from('dishes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        const { data, error } = await supabase.from('dishes').insert(dishes).select();
        if (error) throw error;
        res.json({ message: 'Seeded successfully', count: data.length });
    } catch (err) {
        console.error('Seed Error:', err.message);
        res.status(500).json({ message: err.message });
    }
}

module.exports = { getDishes, searchDishes, getDishById, createDish, updateDish, deleteDish, seedDishes };
