const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// GET /api/users/profile
const getProfile = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, phone, avatar, role, created_at')
            .eq('id', req.user.id)
            .single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, password, avatar } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email.toLowerCase();
        if (phone) updates.phone = phone;
        if (avatar) updates.avatar = avatar;
        if (password) updates.password = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', req.user.id)
            .select('id, name, email, phone, avatar, role')
            .single();

        if (error) throw error;
        res.json({ ...data, _id: data.id, token: generateToken(data.id) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/users/cart
const getCart = async (req, res) => {
    try {
        const { data } = await supabase.from('carts').select('*').eq('user_id', req.user.id).maybeSingle();
        if (!data) return res.json({ items: [] });

        // Populate dish details
        const items = data.items || [];
        const dishIds = items.map(i => i.dish_id).filter(Boolean);
        let dishes = [];
        if (dishIds.length > 0) {
            const { data: dishData } = await supabase.from('dishes').select('*').in('id', dishIds);
            dishes = dishData || [];
        }
        const populated = items.map(i => ({
            dish: dishes.find(d => d.id === i.dish_id) || null,
            quantity: i.quantity,
        }));
        res.json({ items: populated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/users/cart
const addToCart = async (req, res) => {
    try {
        const { dishId, quantity } = req.body;
        const { data: existing } = await supabase.from('carts').select('*').eq('user_id', req.user.id).maybeSingle();

        let items = existing?.items || [];
        const idx = items.findIndex(i => i.dish_id === dishId);
        if (idx > -1) {
            items[idx].quantity += quantity || 1;
        } else {
            items.push({ dish_id: dishId, quantity: quantity || 1 });
        }

        const { data, error } = await supabase
            .from('carts')
            .upsert({ user_id: req.user.id, items, updated_at: new Date() }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/users/cart/:dishId
const removeFromCart = async (req, res) => {
    try {
        const { data: existing } = await supabase.from('carts').select('*').eq('user_id', req.user.id).maybeSingle();
        if (!existing) return res.status(404).json({ message: 'Cart not found' });

        const items = (existing.items || []).filter(i => i.dish_id !== req.params.dishId);
        const { data, error } = await supabase
            .from('carts')
            .update({ items, updated_at: new Date() })
            .eq('user_id', req.user.id)
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/users/wishlist
const getWishlist = async (req, res) => {
    try {
        const { data: wl } = await supabase.from('wishlists').select('*').eq('user_id', req.user.id).maybeSingle();
        if (!wl || !wl.dish_ids?.length) return res.json({ dishes: [] });

        const { data: dishes } = await supabase.from('dishes').select('*').in('id', wl.dish_ids);
        res.json({ dishes: dishes || [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/users/wishlist
const toggleWishlist = async (req, res) => {
    try {
        const { dishId } = req.body;
        const { data: wl } = await supabase.from('wishlists').select('*').eq('user_id', req.user.id).maybeSingle();
        let dish_ids = wl?.dish_ids || [];

        if (dish_ids.includes(dishId)) {
            dish_ids = dish_ids.filter(id => id !== dishId);
        } else {
            dish_ids.push(dishId);
        }

        await supabase
            .from('wishlists')
            .upsert({ user_id: req.user.id, dish_ids, updated_at: new Date() }, { onConflict: 'user_id' });

        const { data: dishes } = dish_ids.length
            ? await supabase.from('dishes').select('*').in('id', dish_ids)
            : { data: [] };

        res.json({ dishes: dishes || [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/users/orders
const getOrders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/users/orders
const placeOrder = async (req, res) => {
    try {
        const { data: cart } = await supabase.from('carts').select('*').eq('user_id', req.user.id).maybeSingle();
        if (!cart || !cart.items?.length) return res.status(400).json({ message: 'Cart is empty' });

        const dishIds = cart.items.map(i => i.dish_id);
        const { data: dishes } = await supabase.from('dishes').select('id, name').in('id', dishIds);

        const orderItems = cart.items.map(i => ({
            dish_id: i.dish_id,
            name: dishes?.find(d => d.id === i.dish_id)?.name || '',
            quantity: i.quantity,
        }));

        const { data: order, error } = await supabase
            .from('orders')
            .insert({ user_id: req.user.id, items: orderItems, status: 'confirmed' })
            .select()
            .single();

        if (error) throw error;

        // Clear cart
        await supabase.from('carts').update({ items: [], updated_at: new Date() }).eq('user_id', req.user.id);

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProfile, updateProfile, getCart, addToCart, removeFromCart, getWishlist, toggleWishlist, getOrders, placeOrder };
