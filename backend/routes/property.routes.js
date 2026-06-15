const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAllProperties, getPropertyById, getMyProperties, createProperty, updateProperty, deleteProperty } = require('../controllers/property.controller');
const { protect } = require('../middleware/auth.middleware');
const uploadImages = require('../middleware/upload.middleware');

const propertyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('price').isNumeric().withMessage('Price must be a number.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('country').trim().notEmpty().withMessage('Country is required.'),
  body('type').isIn(['Apartment','House','Studio']).withMessage('Invalid property type.'),
  body('listingType').isIn(['rent','sale']).withMessage('Listing type must be rent or sale.'),
];

router.get('/', getAllProperties);
router.get('/my-listings', protect, getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, uploadImages, propertyValidation, createProperty);
router.put('/:id', protect, uploadImages, propertyValidation, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;