import api from './api';

export const progressApi = {
  list: () => api.get('/progress'),
  update: (courseId, payload) => api.put(`/progress/${courseId}`, payload),
};

export const assignmentApi = {
  list: () => api.get('/assignments'),
  create: (payload) => api.post('/assignments', payload),
  submit: (id, answer) => api.post(`/assignments/${id}/submit`, { answer }),
  grade: (id, submissionId, payload) => api.put(`/assignments/${id}/submissions/${submissionId}`, payload),
};