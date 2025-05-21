import { z } from 'zod';

// UUID validation schema
export const uuidSchema = z.string().uuid({
  message: "Invalid UUID format"
});

// Validation middleware for UUID parameters
export function validateUUID(id: string): boolean {
  try {
    uuidSchema.parse(id);
    return true;
  } catch (error) {
    return false;
  }
}

// Convert numeric ID to UUID if needed
export function ensureUUID(id: string | number): string {
  if (typeof id === 'number') {
    throw new Error('Numeric IDs are not supported. Please use UUID format.');
  }
  
  if (!validateUUID(id)) {
    throw new Error(`Invalid UUID format: ${id}`);
  }
  
  return id;
}

// Generate a new UUID
export function generateUUID(): string {
  return crypto.randomUUID();
}