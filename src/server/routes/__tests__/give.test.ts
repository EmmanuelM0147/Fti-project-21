import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { giveRouter } from '../give';
import { sendGivingEmail } from '../../services/emailService';

// Mock email service
vi.mock('../../services/emailService', () => ({
  sendGivingEmail: vi.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/give', giveRouter);

describe('Give Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validGiveData = {
    amount: 50000,
    frequency: 'one-time',
    designation: 'scholarships',
    donor: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+2347088616350',
      address: {
        street: '123 Main St',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria'
      }
    }
  };

  it('should accept valid giving form submission', async () => {
    const response = await request(app)
      .post('/api/give')
      .send(validGiveData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sendGivingEmail).toHaveBeenCalledWith(validGiveData);
  });

  it('should reject amount below minimum', async () => {
    const response = await request(app)
      .post('/api/give')
      .send({
        ...validGiveData,
        amount: 500
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors[0].message).toContain('Minimum donation amount');
  });

  it('should validate donor information', async () => {
    const response = await request(app)
      .post('/api/give')
      .send({
        ...validGiveData,
        donor: {
          name: 'J', // Too short
          email: 'invalid-email',
          phone: '123', // Invalid format
          address: {
            street: '123',
            city: 'L',
            state: 'L',
            country: 'N'
          }
        }
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toHaveLength(6);
  });

  it('should handle anonymous donations', async () => {
    const response = await request(app)
      .post('/api/give')
      .send({
        ...validGiveData,
        anonymous: true
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should handle email service failure', async () => {
    (sendGivingEmail as any).mockRejectedValue(new Error('Email service error'));

    const response = await request(app)
      .post('/api/give')
      .send(validGiveData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });
});