const express = require('express');
const router = express.Router();
const { getDishes, searchDishes, getDishById, createDish, updateDish, deleteDish, seedDishes } = require('../controllers/dishController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getDishes);
router.get('/search', searchDishes);
router.post('/seed', seedDishes); // Added for remote seeding
router.get('/:id', getDishById);
router.post('/', protect, adminOnly, createDish);
router.put('/:id', protect, updateDish);
router.delete('/:id', protect, adminOnly, deleteDish);

module.exports = router;
