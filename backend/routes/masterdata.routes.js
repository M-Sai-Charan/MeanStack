const express = require('express');
const router = express.Router();
const masterdataController = require('../controllers/masterdata.controller');

// GET /api/masterdata
router.get('/', masterdataController.getMasterData);

module.exports = router;
