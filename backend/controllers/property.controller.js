const { validationResult } = require('express-validator');
const PropertyService = require('../services/property.service');

const getAllProperties = async (req, res) => {
  try {
    const properties = await PropertyService.getAllProperties(req.query);
    res.json({ count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching properties.' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await PropertyService.getPropertyById(req.params.id);
    res.json({ property });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Error fetching property.' });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await PropertyService.getMyProperties(req.user._id);
    res.json({ count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your properties.' });
  }
};

const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const property = await PropertyService.createProperty({
      body: req.body, files: req.files, user: req.user, req,
    });
    res.status(201).json({ message: 'Property listed successfully.', property });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Error creating property.' });
  }
};

const updateProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const property = await PropertyService.updateProperty({
      id: req.params.id, body: req.body, files: req.files, user: req.user, req,
    });
    res.json({ message: 'Property updated.', property });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Error updating property.' });
  }
};

const deleteProperty = async (req, res) => {
  try {
    await PropertyService.deleteProperty({ id: req.params.id, userId: req.user._id });
    res.json({ message: 'Property removed from marketplace.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Error deleting property.' });
  }
};

module.exports = { getAllProperties, getPropertyById, getMyProperties, createProperty, updateProperty, deleteProperty };
