const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getProfile, updateProfile,
    getCart, addToCart, removeFromCart,
    getWishlist, toggleWishlist,
    getOrders, placeOrder,
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.delete('/cart/:dishId', protect, removeFromCart);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, toggleWishlist);

router.get('/orders', protect, getOrders);
router.post('/orders', protect, placeOrder);

module.exports = router;
