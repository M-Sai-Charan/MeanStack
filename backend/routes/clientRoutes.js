const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Final Approved Clients
router.get('/final-approved', clientController.getFinalApprovedClients);

// ✅ NEW: Get client name by OLPID
router.get('/:olpid', clientController.getClientNameByOLPID);

module.exports = router;
