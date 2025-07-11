const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiry.controller');

router.post('/', enquiryController.createEnquiry);
router.get('/getallenquires', enquiryController.getAllEnquires);
router.delete('/deleteAll', enquiryController.deleteAllEnquiries);
router.put('/markasread/:id', enquiryController.markAsRead);
router.put('/update/:id', enquiryController.updateEnquiry);
router.get('/:id', enquiryController.getEnquiryById);
module.exports = router;
