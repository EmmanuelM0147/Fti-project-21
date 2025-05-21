import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendContactEmail } from '../services/emailService.js';
import { rateLimit } from 'express-rate-limit';

export const contactRouter = express.Router();

// Rate limiting specifically for contact form submissions
// More restrictive than the global rate limiter
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 contact form submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many contact requests from this IP, please try again after an hour'
});

// Validation middleware
const validateContactForm = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('subject').trim().isLength({ min: 2, max: 200 }).withMessage('Subject must be between 2 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
  body('phone').optional({ checkFalsy: true }).matches(/^\+?[0-9\s\-()]{7,20}$/).withMessage('Please provide a valid phone number'),
  // Honeypot field to catch bots
  body('website').isEmpty().withMessage('Bot detected')
];

// Contact form submission endpoint
contactRouter.post('/', contactLimiter, validateContactForm, async (req, res) => {
  try {
    // Log the incoming request for debugging
    console.log('Contact form submission received:', {
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'origin': req.headers['origin'],
        'user-agent': req.headers['user-agent']
      }
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, subject, message, phone } = req.body;

    // Log the contact attempt (in production, consider storing in a database)
    console.log(`Contact form submission from ${name} (${email})`);

    // Send email
    await sendContactEmail({ name, email, subject, message, phone });

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    
    // Return error response with more details in development
    return res.status(500).json({ 
      success: false, 
      message: 'There was a problem sending your message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Export the router
export default contactRouter;