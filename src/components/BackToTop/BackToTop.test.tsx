import { render, screen, fireEvent, act } from '@testing-library/react';
import { BackToTop } from './BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
    
    // Mock requestAnimationFrame
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(0);
      return 0;
    });

    // Mock scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not be visible initially', () => {
    render(<BackToTop />);
    expect(screen.queryByTestId('back-to-top-button')).not.toBeInTheDocument();
  });

  it('should appear when scrolled past threshold', () => {
    render(<BackToTop threshold={300} />);
    
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('back-to-top-button')).toBeInTheDocument();
  });

  it('should scroll to top on click', () => {
    render(<BackToTop />);
    
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400 });
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByTestId('back-to-top-button');
    fireEvent.click(button);
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });

  it('should handle keyboard interaction', () => {
    render(<BackToTop />);
    
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400 });
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByTestId('back-to-top-button');
    
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(window.scrollTo).toHaveBeenCalled();
    
    fireEvent.keyDown(button, { key: ' ' });
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', () => {
    render(<BackToTop />);
    
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400 });
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByTestId('back-to-top-button');
    
    expect(button).toHaveAttribute('aria-label', 'Scroll to top of page');
    expect(button).toHaveAttribute('role', 'button');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('should handle scroll errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Scroll error');
    
    window.scrollTo = jest.fn().mockImplementation(() => {
      throw mockError;
    });

    render(<BackToTop />);
    
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400 });
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByTestId('back-to-top-button');
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith('Error scrolling to top:', mockError);
    consoleSpy.mockRestore();
  });
});