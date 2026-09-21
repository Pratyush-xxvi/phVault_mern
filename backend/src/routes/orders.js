const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { placeOrder, getAllOrders, getMyOrders, approveOrder, rejectOrder } = require('../controllers/orderController');

router.post('/', protect, placeOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/my', protect, getMyOrders);

// Support both PUT and PATCH
router.route('/:id/approve')
  .put(protect, admin, approveOrder)
  .patch(protect, admin, approveOrder);

router.route('/:id/reject')
  .put(protect, admin, rejectOrder)
  .patch(protect, admin, rejectOrder);

module.exports = router;
