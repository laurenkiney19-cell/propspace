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

export const getProperties = (filters = {}) => api.get('/properties', { params: cleanParams(filters) });
export const getPropertyById = (id) => api.get(`/properties/${id}`);
export const getMyListings = () => api.get('/properties/my-listings');
export const createProperty = (formData) => api.post('/properties', formData);
export const updateProperty = (id, formData) => api.put(`/properties/${id}`, formData);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
