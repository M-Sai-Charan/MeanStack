const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

// ✅ Route to get all enquiries with InventoryStatus = 'New'
router.get('/new', inventoryController.getNewInventoryAssignments);

module.exports = router;
