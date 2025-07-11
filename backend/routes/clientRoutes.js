const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Route to get final approved clients
router.get('/final-approved', clientController.getFinalApprovedClients);

module.exports = router;
