import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationForm } from './ApplicationForm';
import { useApplicationStore } from '../../lib/store/applicationStore';

// Mock the store
jest.mock('../../lib/store/applicationStore');

describe('ApplicationForm', () => {
  const mockSetCurrentStep = jest.fn();
  const mockSetFormData = jest.fn();
  const mockResetForm = jest.fn();

  beforeEach(() => {
    (useApplicationStore as jest.Mock).mockReturnValue({
      currentStep: 0,
      setCurrentStep: mockSetCurrentStep,
      formData: {},
      setFormData: mockSetFormData,
      resetForm: mockResetForm,
    });
  });

  it('renders the form with initial step', () => {
    render(<ApplicationForm />);
    expect(screen.getByLabelText('Student Application Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Personal Information')).toBeInTheDocument();
  });

  it('validates required fields before proceeding', async () => {
    render(<ApplicationForm />);
    
    // Try to proceed without filling required fields
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    // Check for validation messages
    expect(screen.getByText('Surname is required')).toBeInTheDocument();
    expect(screen.getByText('First name is required')).toBeInTheDocument();
  });

  it('proceeds to next step when current step is valid', async () => {
    render(<ApplicationForm />);
    
    // Fill required fields
    await userEvent.type(screen.getByLabelText('Surname'), 'Doe');
    await userEvent.type(screen.getByLabelText('First Name'), 'John');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    
    // Click next
    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);
    
    // Verify step change
    expect(mockSetCurrentStep).toHaveBeenCalledWith(1);
  });

  it('saves form data between steps', async () => {
    render(<ApplicationForm />);
    
    // Fill form fields
    const testData = {
      surname: 'Doe',
      firstName: 'John',
      email: 'john@example.com'
    };
    
    await userEvent.type(screen.getByLabelText('Surname'), testData.surname);
    await userEvent.type(screen.getByLabelText('First Name'), testData.firstName);
    await userEvent.type(screen.getByLabelText('Email'), testData.email);
    
    // Proceed to next step
    await userEvent.click(screen.getByText('Next'));
    
    // Verify data was saved
    expect(mockSetFormData).toHaveBeenCalledWith(expect.objectContaining({
      personalInfo: expect.objectContaining(testData)
    }));
  });

  it('handles form submission', async () => {
    const mockSubmit = jest.fn();
    render(<ApplicationForm onSubmit={mockSubmit} />);
    
    // Fill all required fields
    // ... (fill form fields for all steps)
    
    // Submit form
    const submitButton = screen.getByText('Submit Application');
    await userEvent.click(submitButton);
    
    // Verify submission
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('is accessible', async () => {
    const { container } = render(<ApplicationForm />);
    
    // Check for ARIA attributes
    expect(screen.getByLabelText('Form Progress')).toBeInTheDocument();
    expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'Student Application Form');
    
    // Verify focus management
    const nextButton = screen.getByText('Next');
    nextButton.focus();
    expect(nextButton).toHaveFocus();
    
    // Test keyboard navigation
    await userEvent.tab();
    expect(screen.getByLabelText('Surname')).toHaveFocus();
  });
});