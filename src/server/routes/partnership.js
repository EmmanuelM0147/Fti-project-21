import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendPartnershipEmail } from '../services/emailService.js';
import { rateLimit } from 'express-rate-limit';

export const partnershipRouter = express.Router();

// Rate limiting for partnership inquiries
const partnershipLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 submissions per hour
  message: 'Too many partnership inquiries from this IP, please try again after an hour'
});

// Validation middleware
const validatePartnershipForm = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('organization').trim().isLength({ min: 2, max: 100 }).withMessage('Organization name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('phone').matches(/^\+[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  body('sponsorshipTier').isIn(['bronze', 'silver', 'gold', 'platinum', 'custom']).withMessage('Invalid sponsorship tier'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
  // Honeypot field
  body('website').isEmpty().withMessage('Bot detected')
];

partnershipRouter.post('/', partnershipLimiter, validatePartnershipForm, async (req, res) => {
  try {
    console.log('Partnership inquiry received:', {
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

    const { name, organization, email, phone, sponsorshipTier, message } = req.body;

    await sendPartnershipEmail({ name, organization, email, phone, sponsorshipTier, message });

    return res.status(200).json({
      success: true,
      message: 'Your partnership inquiry has been received. Our team will contact you soon.'
    });

  } catch (error) {
    console.error('Error processing partnership inquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'There was a problem submitting your inquiry. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default partnershipRouter;