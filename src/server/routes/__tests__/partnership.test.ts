import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { partnershipRouter } from '../partnership';
import { sendPartnershipEmail } from '../../services/emailService';

// Mock email service
vi.mock('../../services/emailService', () => ({
  sendPartnershipEmail: vi.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/partnership', partnershipRouter);

describe('Partnership Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPartnershipData = {
    name: 'John Doe',
    email: 'john@example.com',
    organization: 'Test Corp',
    message: 'Interested in gold partnership',
    phone: '+2347088616350',
    sponsorshipTier: 'gold'
  };

  it('should accept valid partnership form submission', async () => {
    const response = await request(app)
      .post('/api/partnership')
      .send(validPartnershipData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sendPartnershipEmail).toHaveBeenCalledWith(validPartnershipData);
  });

  it('should reject invalid email format', async () => {
    const response = await request(app)
      .post('/api/partnership')
      .send({
        ...validPartnershipData,
        email: 'invalid-email'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors[0].message).toContain('Invalid email');
  });

  it('should reject empty required fields', async () => {
    const response = await request(app)
      .post('/api/partnership')
      .send({
        email: 'john@example.com'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toHaveLength(3); // name, organization, message
  });

  it('should handle honeypot field', async () => {
    const response = await request(app)
      .post('/api/partnership')
      .send({
        ...validPartnershipData,
        website: 'spam'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should handle email service failure', async () => {
    (sendPartnershipEmail as any).mockRejectedValue(new Error('Email service error'));

    const response = await request(app)
      .post('/api/partnership')
      .send(validPartnershipData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });
});