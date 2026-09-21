const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const {
  getVehicles, searchVehicles, createVehicle,
  updateVehicle, deleteVehicle, restockVehicle
} = require('../controllers/vehicleController');

router.get('/', getVehicles);
router.get('/search', searchVehicles);
router.post('/', protect, admin, createVehicle);
router.put('/:id', protect, admin, updateVehicle);
router.delete('/:id', protect, admin, deleteVehicle);
router.post('/:id/restock', protect, admin, restockVehicle);

module.exports = router;
