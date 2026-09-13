import api from './api';

export const messageApi = {
  conversations: () => api.get('/messages'),
  createConversation: (participantId) => api.post('/messages', { participantId }),
  messages: (id) => api.get(`/messages/${id}`),
  send: (id, body) => api.post(`/messages/${id}/messages`, { body }),
};
