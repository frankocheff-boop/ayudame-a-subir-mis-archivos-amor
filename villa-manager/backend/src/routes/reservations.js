const express = require('express');
const router = express.Router();
const reservations = require('../controllers/reservationsController');
const { authenticate, authorize } = require('../middleware/auth');

// public listing can be protected if needed
router.get('/', authenticate, reservations.listReservations);
router.post('/', authenticate, authorize(['admin','staff']), reservations.createReservation);
router.put('/:id', authenticate, authorize(['admin','staff']), reservations.updateReservation);
router.delete('/:id', authenticate, authorize(['admin']), reservations.deleteReservation);

module.exports = router;
