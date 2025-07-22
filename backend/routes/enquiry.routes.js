const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiry.controller');

// Create new enquiry → POST /api/enquiry/
router.post('/', enquiryController.createEnquiry);

// Get all enquiries → GET /api/enquiry/getallenquires
router.get('/getallenquires', enquiryController.getAllEnquires);

// Delete all enquiries → DELETE /api/enquiry/deleteAll
router.delete('/deleteAll', enquiryController.deleteAllEnquiries);

// Mark enquiry as read → PUT /api/enquiry/markasread/:id
router.put('/markasread/:id', enquiryController.markAsRead);

// Update enquiry → PUT /api/enquiry/update/:id
router.put('/update/:id', enquiryController.updateEnquiry);

// Get enquiry by ID → GET /api/enquiry/:id
router.get('/:id', enquiryController.getEnquiryById);

router.post('/send-invoice/:id', enquiryController.sendInvoiceTemplate);

module.exports = router;
