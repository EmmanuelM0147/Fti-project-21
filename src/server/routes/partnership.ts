import { Router } from 'express';
import { validate } from '../middleware/validate';
import { formSubmissionLimiter } from '../middleware/rateLimit';
import { partnershipSchema, type PartnershipFormData } from '../validation/schemas';
import { sendPartnershipEmail } from '../services/emailService';
import { logger } from '../middleware/logger';

const router = Router();

router.post('/', 
  formSubmissionLimiter,
  validate(partnershipSchema),
  async (req, res) => {
    try {
      const formData: PartnershipFormData = req.body;

      logger.info('Processing partnership form submission', {
        organization: formData.organization,
        sponsorshipTier: formData.sponsorshipTier
      });

      // Send email notifications
      await sendPartnershipEmail(formData);

      logger.info('Partnership form processed successfully', {
        organization: formData.organization
      });

      return res.status(200).json({
        success: true,
        message: 'Your partnership inquiry has been received. Our team will contact you soon.'
      });

    } catch (error) {
      logger.error('Error processing partnership form', {
        error: error instanceof Error ? error.message : 'Unknown error',
        organization: req.body.organization
      });

      return res.status(500).json({
        success: false,
        message: 'Failed to process partnership inquiry. Please try again later.'
      });
    }
  }
);

export { router as partnershipRouter };