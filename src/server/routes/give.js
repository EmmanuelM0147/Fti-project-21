import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendGivingEmail } from '../services/emailService.js';
import { rateLimit } from 'express-rate-limit';

export const giveRouter = express.Router();

// Rate limiting for giving inquiries
const givingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 submissions per hour
  message: 'Too many giving inquiries from this IP, please try again after an hour'
});

// Validation middleware
const validateGivingForm = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('organization').trim().isLength({ min: 2, max: 100 }).withMessage('Organization name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('phone').matches(/^\+[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  body('preferredContact').isIn(['email', 'phone', 'either']).withMessage('Invalid contact preference'),
  body('interestArea').isIn(['scholarships', 'facilities', 'research', 'general']).withMessage('Invalid interest area'),
  body('givingRange').isIn(['under_1m', '1m_5m', '5m_10m', 'above_10m', 'custom']).withMessage('Invalid giving range'),
  body('bestTimeToContact').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('privacyPolicy').isBoolean().equals('true').withMessage('You must accept the privacy policy'),
  // Honeypot field
  body('website').isEmpty().withMessage('Bot detected')
];

giveRouter.post('/', givingLimiter, validateGivingForm, async (req, res) => {
  try {
    console.log('Giving inquiry received:', {
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'origin': req.headers['origin']
      }
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const formData = req.body;

    await sendGivingEmail(formData);

    return res.status(200).json({
      success: true,
      message: 'Your giving inquiry has been received. Our team will contact you soon.'
    });

  } catch (error) {
    console.error('Error processing giving inquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'There was a problem submitting your inquiry. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default giveRouter;