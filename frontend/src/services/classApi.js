import api from './api';

export const classApi = {
  list: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  saveAttendance: (id, payload) => api.post(`/classes/${id}/attendance`, payload),
};