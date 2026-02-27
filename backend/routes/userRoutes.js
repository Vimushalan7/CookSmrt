const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getProfile, updateProfile,
    getCart, addToCart, removeFromCart,
    getWishlist, toggleWishlist,
    getOrders, placeOrder,
} = require('../controllers/userController');

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/cart', getCart);
router.post('/cart', addToCart);
router.delete('/cart/:dishId', removeFromCart);

router.get('/wishlist', getWishlist);
router.post('/wishlist', toggleWishlist);

router.get('/orders', getOrders);
router.post('/orders', placeOrder);

module.exports = router;
