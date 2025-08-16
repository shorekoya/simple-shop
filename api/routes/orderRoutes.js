const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', checkAuth, orderController.getAllOrders);

// POST new order
router.post('/', checkAuth, orderController.newOrder);

// GET order by ID
router.get('/:id', checkAuth, orderController.getOneOrder);

// DELETE order
router.delete('/:id', checkAuth, orderController.deleteOrder);

module.exports = router;
