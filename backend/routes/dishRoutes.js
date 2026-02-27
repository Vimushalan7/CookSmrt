const express = require('express');
const router = express.Router();
const { getDishes, searchDishes, getDishById, createDish, updateDish, deleteDish, seedDishes } = require('../controllers/dishController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getDishes);
router.get('/search', searchDishes);
router.post('/seed', seedDishes);
router.get('/:id', getDishById);
router.post('/', createDish);
router.put('/:id', updateDish);
router.delete('/:id', adminOnly, deleteDish);

module.exports = router;
