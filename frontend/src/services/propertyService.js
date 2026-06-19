import api from './api';

const cleanParams = (params = {}) => {
  const result = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value;
    }
  });
  return result;
};

export const getProperties = (filters = {}, signal) =>
  api.get('/properties', { params: cleanParams(filters), signal });
export const getPropertyById = (id, signal) =>
  api.get(`/properties/${id}`, { signal });
export const getMyListings = (signal) =>
  api.get('/properties/my-listings', { signal });
export const createProperty = (formData) => api.post('/properties', formData);
export const updateProperty = (id, formData) => api.put(`/properties/${id}`, formData);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
