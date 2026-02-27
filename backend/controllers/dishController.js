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
        const dishes = [
            {
                name: 'Sambar', category: ['Lunch'], image: '/uploads/sambar.jpg',
                ingredients: [{ name: 'Toor dal', quantity: '1 cup' }],
                instructions: ['Pressure cook dal.']
            },
            // ... (I'll add more in a moment or just use a simplified version for now)
            { name: 'Rasam', category: ['Lunch'], image: '/uploads/rasam.jpg', ingredients: [], instructions: [] },
            { name: 'Ven Pongal', category: ['Breakfast'], image: '/uploads/ven_pongal.jpg', ingredients: [], instructions: [] },
            { name: 'Idli', category: ['Breakfast'], image: '/uploads/idli.jpg', ingredients: [], instructions: [] },
            { name: 'Dosa', category: ['Breakfast'], image: '/uploads/dosa.jpg', ingredients: [], instructions: [] }
        ];

        const { data, error } = await supabase.from('dishes').insert(dishes).select();
        if (error) throw error;
        res.json({ message: 'Seeded successfully', count: data.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { getDishes, searchDishes, getDishById, createDish, updateDish, deleteDish, seedDishes };
