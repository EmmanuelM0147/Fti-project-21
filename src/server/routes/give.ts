import { Router } from 'express';
import { validate } from '../middleware/validate';
import { formSubmissionLimiter } from '../middleware/rateLimit';
import { giveSchema, type GiveFormData } from '../validation/schemas';
import { sendGivingEmail } from '../services/emailService';
import { logger } from '../middleware/logger';

const router = Router();

router.post('/',
  formSubmissionLimiter,
  validate(giveSchema),
  async (req, res) => {
    try {
      const formData: GiveFormData = req.body;

      logger.info('Processing giving form submission', {
        amount: formData.amount,
        frequency: formData.frequency,
        designation: formData.designation,
        anonymous: formData.anonymous
      });

      // Send email notifications
      await sendGivingEmail(formData);

      logger.info('Giving form processed successfully', {
        amount: formData.amount,
        designation: formData.designation
      });

      return res.status(200).json({
        success: true,
        message: 'Thank you for your generous support. Our team will contact you shortly.'
      });

    } catch (error) {
      logger.error('Error processing giving form', {
        error: error instanceof Error ? error.message : 'Unknown error',
        designation: req.body.designation
      });

      return res.status(500).json({
        success: false,
        message: 'Failed to process donation. Please try again later.'
      });
    }
  }
);

export { router as giveRouter };