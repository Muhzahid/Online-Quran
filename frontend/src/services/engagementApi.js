import api from './api';

export const notificationApi = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export const reviewApi = {
  list: (params) => api.get('/reviews', { params }),
  create: (payload) => api.post('/reviews', payload),
};