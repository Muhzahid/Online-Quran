import api from './api';

export const teacherApi = {
  list: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  getMyProfile: () => api.get('/teachers/me/profile'),
  updateMyProfile: (payload) => api.put('/teachers/me/profile', payload),
  updateAvailability: (payload) =>
    api.put('/teachers/me/availability', payload),
  uploadDocument: (formData) =>
    api.post('/teachers/me/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  submitApplication: () => api.post('/teachers/me/submit-application'),
  adminList: (params) => api.get('/teachers/admin/list', { params }),
  adminApplications: (params) =>
    api.get('/teachers/admin/applications', { params }),
  approve: (id) => api.put(`/teachers/${id}/approve`),
  reject: (id, reason) => api.put(`/teachers/${id}/reject`, { reason }),
  suspend: (id, reason) => api.put(`/teachers/${id}/suspend`, { reason }),
};
