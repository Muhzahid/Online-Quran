import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const signToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
