import api from './api';

export const bookingApi = {
  getSlots: (params) => api.get('/bookings/slots', { params }),
  create: (payload) => api.post('/bookings', payload),
  list: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, payload) => api.put(`/bookings/${id}`, payload),
  confirm: (id) => api.post(`/bookings/${id}/confirm`),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
  complete: (id) => api.post(`/bookings/${id}/complete`),
};

export const studentApi = {
  getMyProfile: () => api.get('/students/me/profile'),
  updateMyProfile: (payload) => api.put('/students/me/profile', payload),
};
