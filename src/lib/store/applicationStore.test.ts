import { renderHook, act } from '@testing-library/react';
import { useApplicationStore } from './applicationStore';

describe('applicationStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    act(() => {
      useApplicationStore.getState().resetForm();
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    expect(result.current.formData).toEqual({});
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toEqual({});
    expect(result.current.stepCompletion).toEqual({});
  });

  it('updates form data', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    const testData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    act(() => {
      result.current.setFormData(testData);
    });

    expect(result.current.formData).toEqual(testData);
  });

  it('handles step navigation', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    act(() => {
      result.current.setCurrentStep(1);
    });

    expect(result.current.currentStep).toBe(1);
  });

  it('tracks step completion', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    act(() => {
      result.current.setStepCompletion(0, true);
    });

    expect(result.current.stepCompletion[0]).toBe(true);
    expect(result.current.isCurrentStepValid()).toBe(true);
  });

  it('validates next step conditions', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    // Initially cannot proceed
    expect(result.current.canProceedToNextStep()).toBe(false);

    // Mark current step as complete
    act(() => {
      result.current.setStepCompletion(0, true);
    });

    // Now can proceed
    expect(result.current.canProceedToNextStep()).toBe(true);

    // Cannot proceed when submitting
    act(() => {
      result.current.setIsSubmitting(true);
    });

    expect(result.current.canProceedToNextStep()).toBe(false);
  });

  it('handles form submission state', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    act(() => {
      result.current.setIsSubmitting(true);
    });

    expect(result.current.isSubmitting).toBe(true);
  });

  it('manages error state', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    const testErrors = {
      'personalInfo.firstName': ['Required field'],
    };

    act(() => {
      result.current.setErrors(testErrors);
    });

    expect(result.current.errors).toEqual(testErrors);
  });

  it('resets form state', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    // Set some data
    act(() => {
      result.current.setFormData({ personalInfo: { firstName: 'John' } });
      result.current.setCurrentStep(2);
      result.current.setStepCompletion(0, true);
    });

    // Reset
    act(() => {
      result.current.resetForm();
    });

    // Verify reset state
    expect(result.current.formData).toEqual({});
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toEqual({});
    expect(result.current.stepCompletion).toEqual({});
  });

  it('persists state to localStorage', () => {
    const { result } = renderHook(() => useApplicationStore());
    
    const testData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    act(() => {
      result.current.setFormData(testData);
    });

    // Get data from localStorage
    const storedData = JSON.parse(localStorage.getItem('application-storage') || '{}');
    
    expect(storedData.state.formData).toEqual(testData);
  });
});