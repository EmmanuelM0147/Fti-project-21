import { test, expect } from '@playwright/test';

test.describe('Application Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apply');
  });

  test('completes full application journey', async ({ page }) => {
    // Personal Information
    await page.getByLabel('Surname').fill('Doe');
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByRole('button', { name: 'Next' }).click();

    // Education
    await page.getByLabel('Education Level').selectOption('tertiary');
    await page.getByRole('button', { name: 'Next' }).click();

    // Technical Interests
    await page.getByLabel('Web Development').check();
    await page.getByRole('button', { name: 'Next' }).click();

    // Accommodation
    await page.getByLabel('Do you need accommodation?').check();
    await page.getByRole('button', { name: 'Next' }).click();

    // Payment
    await page.getByLabel('Full Name').fill('John Doe');
    await page.getByRole('button', { name: 'Next' }).click();

    // Referee
    await page.getByLabel('Referee Name').fill('Jane Smith');
    await page.getByRole('button', { name: 'Submit Application' }).click();

    // Verify submission
    await expect(page.getByText('Application Submitted Successfully')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    // Try to proceed without filling required fields
    await page.getByRole('button', { name: 'Next' }).click();

    // Verify error messages
    await expect(page.getByText('Surname is required')).toBeVisible();
    await expect(page.getByText('First name is required')).toBeVisible();
  });

  test('saves progress between steps', async ({ page }) => {
    // Fill personal information
    await page.getByLabel('Surname').fill('Doe');
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByRole('button', { name: 'Next' }).click();

    // Go back to personal information
    await page.getByRole('button', { name: 'Previous' }).click();

    // Verify data is preserved
    await expect(page.getByLabel('Surname')).toHaveValue('Doe');
    await expect(page.getByLabel('First Name')).toHaveValue('John');
    await expect(page.getByLabel('Email')).toHaveValue('john.doe@example.com');
  });

  test('is responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('form')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('form')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole('form')).toBeVisible();
  });

  test('is keyboard accessible', async ({ page }) => {
    // Navigate through form using keyboard
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Surname')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel('First Name')).toBeFocused();

    // Fill form using keyboard
    await page.keyboard.type('Doe');
    await page.keyboard.press('Tab');
    await page.keyboard.type('John');

    // Navigate to next button
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Next' })).toBeFocused();
  });
});