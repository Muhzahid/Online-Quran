import { body, param } from 'express-validator';
import { validate } from './authValidators.js';

export const createCourseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'all'])
    .withMessage('Invalid level'),
  validate,
];

export const updateCourseValidation = [
  param('id').isMongoId().withMessage('Invalid course id'),
  body('title').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'all']),
  validate,
];

export const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 5000 })
    .withMessage('Message is too long'),
  body('phone').optional().trim(),
  validate,
];

export const blogValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validate,
];
