const { validationResult } = require('express-validator');
const PropertyRepo = require('../repositories/property.repository');

const buildImageUrls = (files, existingImages = []) => {
  const uploaded = (files || []).map(f => `http://localhost:5000/uploads/${f.filename}`);
  return [...existingImages, ...uploaded];
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await PropertyRepo.findAll(req.query);
    res.json({ count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching properties.' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await PropertyRepo.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    res.json({ property });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching property.' });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await PropertyRepo.findByOwner(req.user._id);
    res.json({ count: properties.length, properties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your properties.' });
  }
};

const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const images = buildImageUrls(req.files);
    const property = await PropertyRepo.create({ ...req.body, images, owner: req.user._id });
    res.status(201).json({ message: 'Property listed successfully.', property });
  } catch (err) {
    res.status(500).json({ message: 'Error creating property.' });
  }
};

const updateProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const property = await PropertyRepo.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    if (property.owner._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden: You do not own this listing.' });
    let existingImages = [];
    if (req.body.existingImages) {
      try { existingImages = JSON.parse(req.body.existingImages); } catch { existingImages = []; }
    }
    const images = buildImageUrls(req.files, existingImages);
    const updated = await PropertyRepo.update(req.params.id, { ...req.body, images });
    res.json({ message: 'Property updated.', property: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating property.' });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await PropertyRepo.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    if (property.owner._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden: You do not own this listing.' });
    await PropertyRepo.delete(req.params.id);
    res.json({ message: 'Property removed from marketplace.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting property.' });
  }
};

module.exports = { getAllProperties, getPropertyById, getMyProperties, createProperty, updateProperty, deleteProperty };