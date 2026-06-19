const fs = require('fs');
const path = require('path');
const PropertyRepo = require('../repositories/property.repository');

const buildImageUrls = (req, files, existingImages = []) => {
  const base = `${req.protocol}://${req.get('host')}`;
  const uploaded = (files || []).map((f) => `${base}/uploads/${f.filename}`);
  return [...existingImages, ...uploaded];
};

const cleanupImageFiles = (images) => {
  if (!Array.isArray(images)) return;
  images.forEach((img) => {
    try {
      let filename;
      try {
        const url = new URL(img);
        filename = path.basename(url.pathname);
      } catch {
        filename = path.basename(img);
      }
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {
      console.error('Failed to remove image file:', e);
    }
  });
};

const getAllProperties = (filters = {}) => PropertyRepo.findAll(filters);

const getPropertyById = async (id) => {
  const property = await PropertyRepo.findById(id);
  if (!property) {
    const err = new Error('Property not found.');
    err.status = 404;
    throw err;
  }
  return property;
};

const getMyProperties = (ownerId) => PropertyRepo.findByOwner(ownerId);

const createProperty = async ({ body, files, user, req }) => {
  const images = buildImageUrls(req, files);
  return PropertyRepo.create({ ...body, images, owner: user._id });
};

const updateProperty = async ({ id, body, files, user, req }) => {
  const property = await PropertyRepo.findById(id);
  if (!property) {
    const err = new Error('Property not found.');
    err.status = 404;
    throw err;
  }
  if (property.owner._id.toString() !== user._id.toString()) {
    const err = new Error('Forbidden: You do not own this listing.');
    err.status = 403;
    throw err;
  }
  let existingImages = [];
  if (body.existingImages) {
    try { existingImages = JSON.parse(body.existingImages); } catch { existingImages = []; }
  }
  const images = buildImageUrls(req, files, existingImages);
  return PropertyRepo.update(id, { ...body, images });
};

const deleteProperty = async ({ id, userId }) => {
  const property = await PropertyRepo.findById(id);
  if (!property) {
    const err = new Error('Property not found.');
    err.status = 404;
    throw err;
  }
  if (property.owner._id.toString() !== userId.toString()) {
    const err = new Error('Forbidden: You do not own this listing.');
    err.status = 403;
    throw err;
  }
  const deleted = await PropertyRepo.delete(id);
  cleanupImageFiles(deleted?.images);
};

module.exports = { getAllProperties, getPropertyById, getMyProperties, createProperty, updateProperty, deleteProperty };
