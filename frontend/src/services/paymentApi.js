import api from './api';

export const paymentApi = {
  list: () => api.get('/payments'),
  create: (payload) => api.post('/payments', payload),
};