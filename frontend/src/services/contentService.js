import api from './api';

export const courseService = {
  list: (params) => api.get('/courses', { params }),
  adminList: (params) => api.get('/courses/admin/list', { params }),
  create: (payload) => api.post('/courses', payload),
  update: (id, payload) => api.put(`/courses/${id}`, payload),
  remove: (id) => api.delete(`/courses/${id}`),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
};

export const teacherService = {
  list: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
};

export const contactService = {
  submit: (payload) => api.post('/contact', payload),
  adminList: (params) => api.get('/admin/contact-messages', { params }),
  adminUpdate: (id, payload) => api.patch(`/contact/${id}`, payload),
};

export const blogService = {
  list: (params) => api.get('/blog', { params }),
  adminList: (params) => api.get('/blog/admin/list', { params }),
  create: (payload) => api.post('/blog', payload),
  remove: (id) => api.delete(`/blog/${id}`),
  getBySlug: (slug) => api.get(`/blog/${slug}`),
};
