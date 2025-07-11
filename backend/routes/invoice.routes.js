const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

// Get all invoices with status = New and callStatus = Approved
router.get('/', invoiceController.getAllInvoices);

module.exports = router;
