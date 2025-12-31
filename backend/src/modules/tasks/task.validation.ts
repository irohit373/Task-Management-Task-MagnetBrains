import { body, query } from 'express-validator';

export const createTaskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
];

export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be between 1 and 2000 characters'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be pending, in_progress, or completed'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
];

export const taskQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional({ values: 'falsy' })
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Invalid status'),
  query('priority')
    .optional({ values: 'falsy' })
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  query('search').optional({ values: 'falsy' }).isString(),
  query('assignedTo').optional({ values: 'falsy' }).isMongoId().withMessage('Invalid user ID'),
];