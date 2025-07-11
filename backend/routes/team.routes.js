const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');

// Get all enquiries where TeamStatus is "New"
router.get('/new', teamController.getAllNewTeamAssignments);

module.exports = router;
