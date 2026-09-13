import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { AppError } from '../utils/ApiResponse.js';

const access = async (id, userId) => {
  const conversation = await Conversation.findOne({ _id: id, participants: userId });
  if (!conversation) throw new AppError('Conversation not found', 404);
  return conversation;
};

export const listConversations = (userId) => Conversation.find({ participants: userId }).populate('participants', 'name email').sort({ lastMessageAt: -1 });
export const listMessages = async (id, userId) => { await access(id, userId); return Message.find({ conversationId: id }).populate('senderId', 'name').sort({ createdAt: 1 }).limit(200); };
export const sendMessage = async (id, userId, body) => { const conversation = await access(id, userId); const message = await Message.create({ conversationId: id, senderId: userId, body }); await Conversation.findByIdAndUpdate(id, { lastMessage: body, lastMessageAt: new Date() }); return message.populate('senderId', 'name'); };
export const createConversation = async (userId, participantId) => Conversation.findOneAndUpdate({ participants: { $all: [userId, participantId], $size: 2 } }, { $setOnInsert: { participants: [userId, participantId] } }, { upsert: true, new: true }).populate('participants', 'name email');