const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

// Final Approved Clients → GET /api/clients/final-approved
router.get('/final-approved', clientController.getFinalApprovedClients);

// Get client name by OLPID → GET /api/clients/:olpid
router.get('/:olpid', clientController.getClientNameByOLPID);

module.exports = router;
