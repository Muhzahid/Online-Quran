import api from './api';

export const adminApi = {
  students: (params) => api.get('/admin/students', { params }),
  updateStudent: (id, payload) => api.patch(`/admin/students/${id}`, payload),
  report: () => api.get('/admin/reports'),
};