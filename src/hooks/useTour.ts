import { useCallback, useEffect, useState } from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export function useTour() {
  const [tour, setTour] = useState<Shepherd.Tour | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Initialize the tour
  useEffect(() => {
    // Only initialize once
    if (tour) return;

    const newTour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shepherd-theme-custom',
        scrollTo: true,
        cancelIcon: {
          enabled: true
        },
        popperOptions: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 12]
              }
            }
          ]
        },
        when: {
          show: () => {
            setIsActive(true);
          },
          hide: () => {
            setIsActive(false);
          }
        }
      },
      exitOnEsc: true,
      keyboardNavigation: true
    });

    setTour(newTour);

    // Add custom styles for the tour
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .shepherd-theme-custom {
        --shepherd-bg: #fff;
        --shepherd-text: #1a202c;
        --shepherd-border: #e2e8f0;
        --shepherd-button-primary-bg: #1E3A8A;
        --shepherd-button-primary-text: #fff;
        --shepherd-button-primary-hover: #1e40af;
        --shepherd-button-secondary-bg: #f3f4f6;
        --shepherd-button-secondary-text: #374151;
        --shepherd-button-secondary-hover: #e5e7eb;
      }
      
      .dark .shepherd-theme-custom {
        --shepherd-bg: #1f2937;
        --shepherd-text: #f9fafb;
        --shepherd-border: #374151;
        --shepherd-button-primary-bg: #3b82f6;
        --shepherd-button-primary-text: #fff;
        --shepherd-button-primary-hover: #2563eb;
        --shepherd-button-secondary-bg: #374151;
        --shepherd-button-secondary-text: #f9fafb;
        --shepherd-button-secondary-hover: #4b5563;
      }
      
      .shepherd-theme-custom .shepherd-content {
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--shepherd-border);
        background: var(--shepherd-bg);
        color: var(--shepherd-text);
        max-width: 400px;
      }
      
      .shepherd-theme-custom .shepherd-text {
        padding: 1.25rem;
        line-height: 1.5;
      }
      
      .shepherd-theme-custom .shepherd-footer {
        padding: 0.75rem 1.25rem;
        border-top: 1px solid var(--shepherd-border);
        display: flex;
        justify-content: space-between;
      }
      
      .shepherd-theme-custom .shepherd-button {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 0.2s;
        cursor: pointer;
      }
      
      .shepherd-theme-custom .shepherd-button-primary {
        background: var(--shepherd-button-primary-bg);
        color: var(--shepherd-button-primary-text);
      }
      
      .shepherd-theme-custom .shepherd-button-primary:hover {
        background: var(--shepherd-button-primary-hover);
      }
      
      .shepherd-theme-custom .shepherd-button-secondary {
        background: var(--shepherd-button-secondary-bg);
        color: var(--shepherd-button-secondary-text);
        margin-right: 0.5rem;
      }
      
      .shepherd-theme-custom .shepherd-button-secondary:hover {
        background: var(--shepherd-button-secondary-hover);
      }
      
      .shepherd-theme-custom .shepherd-cancel-icon {
        color: var(--shepherd-text);
        opacity: 0.5;
        transition: opacity 0.2s;
      }
      
      .shepherd-theme-custom .shepherd-cancel-icon:hover {
        opacity: 1;
      }
      
      .shepherd-theme-custom .shepherd-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      
      .shepherd-theme-custom .shepherd-header {
        padding: 1.25rem 1.25rem 0;
      }
      
      .shepherd-theme-custom .shepherd-element[data-popper-placement^="top"] .shepherd-arrow {
        border-bottom-color: var(--shepherd-bg);
      }
      
      .shepherd-theme-custom .shepherd-element[data-popper-placement^="bottom"] .shepherd-arrow {
        border-top-color: var(--shepherd-bg);
      }
      
      .shepherd-theme-custom .shepherd-element[data-popper-placement^="left"] .shepherd-arrow {
        border-right-color: var(--shepherd-bg);
      }
      
      .shepherd-theme-custom .shepherd-element[data-popper-placement^="right"] .shepherd-arrow {
        border-left-color: var(--shepherd-bg);
      }
    `;
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      if (newTour) {
        newTour.complete();
      }
      document.head.removeChild(styleElement);
    };
  }, [tour]);

  // Configure tour steps
  useEffect(() => {
    if (!tour) return;

    // Clear any existing steps
    tour.steps.forEach(() => tour.removeStep());

    // Add steps to the tour
    tour.addStep({
      id: 'programs',
      title: 'Programs',
      text: 'Explore our comprehensive tech education programs.',
      attachTo: {
        element: '#featured-programs',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Skip Tour',
          action: tour.complete,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next,
          classes: 'shepherd-button-primary'
        }
      ],
      beforeShowPromise: () => {
        return new Promise<void>((resolve) => {
          // Ensure the element exists before showing the step
          const checkElement = () => {
            const element = document.querySelector('#featured-programs');
            if (element) {
              resolve();
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      }
    });

    tour.addStep({
      id: 'about',
      title: 'About Us',
      text: 'Learn about our mission, history, and commitment to tech education excellence.',
      attachTo: {
        element: 'a[href="/about"]',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Skip Tour',
          action: tour.complete,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next,
          classes: 'shepherd-button-primary'
        }
      ],
      beforeShowPromise: () => {
        return new Promise<void>((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('a[href="/about"]');
            if (element) {
              resolve();
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      }
    });

    tour.addStep({
      id: 'admissions',
      title: 'Admissions',
      text: 'Discover admission requirements, deadlines, and how to begin your tech journey.',
      attachTo: {
        element: '#admissions',
        on: 'top'
      },
      buttons: [
        {
          text: 'Skip Tour',
          action: tour.complete,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next,
          classes: 'shepherd-button-primary'
        }
      ],
      beforeShowPromise: () => {
        return new Promise<void>((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('#admissions');
            if (element instanceof HTMLElement) {
              try {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(resolve, 500);
              } catch (error) {
                console.error('Error scrolling to element:', error);
                resolve();
              }
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      }
    });

    tour.addStep({
      id: 'support',
      title: 'Support',
      text: 'Find ways to contribute through sponsorships and donations to support future tech leaders.',
      attachTo: {
        element: '#support-nav-item',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Skip Tour',
          action: tour.complete,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next,
          classes: 'shepherd-button-primary'
        }
      ],
      beforeShowPromise: () => {
        return new Promise<void>((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('#support-nav-item');
            if (element) {
              resolve();
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      }
    });

    tour.addStep({
      id: 'devcareer',
      title: 'DevCareer',
      text: 'Access career resources, job boards, and industry partnerships for professional growth.',
      attachTo: {
        element: 'a[href="/career-development"]',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Skip Tour',
          action: tour.complete,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next,
          classes: 'shepherd-button-primary'
        }
      ],
      beforeShowPromise: () => {
        return new Promise<void>((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('a[href="/career-development"]');
            if (element) {
              resolve();
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      }
    });

    tour.addStep({
      id: 'contact',
      title: 'Contact Us',
      text: 'Connect with our team for inquiries, support, or partnership opportunities.',
      attachTo: {
        element: '#contact',
        on: 'top'
      },
      buttons: [
        {
          text: 'Skip Tour',
          action: tour.complete,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next,
          classes: 'shepherd-button-primary'
        }
      ],
      beforeShowPromise: () => {
        return new Promise<void>((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('#contact');
            if (element instanceof HTMLElement) {
              try {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(resolve, 500);
              } catch (error) {
                console.error('Error scrolling to element:', error);
                resolve();
              }
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      }
    });

    tour.addStep({
      id: 'apply',
      title: 'Apply Now',
      text: 'Apply for a course and begin your learning journey.',
      attachTo: {
        element: '#apply-button',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Skip Tour',
          action: tour.complete,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Next',
          action: tour.next,
          classes: 'shepherd-button-primary'
        }
      ],
      beforeShowPromise: () => {
        return new Promise<void>((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('#apply-button');
            if (element) {
              resolve();
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      }
    });

    tour.addStep({
      id: 'explore-programs',
      title: 'Explore Programs',
      text: 'Explore our comprehensive tech education programs.',
      attachTo: {
        element: '#explore-programs-button',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Finish Tour',
          action: tour.complete,
          classes: 'shepherd-button-primary'
        }
      ],
      beforeShowPromise: () => {
        return new Promise<void>((resolve) => {
          const checkElement = () => {
            const element = document.querySelector('#explore-programs-button');
            if (element) {
              resolve();
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      }
    });

    // Handle tour completion
    tour.on('complete', () => {
      setIsActive(false);
      // Redirect to homepage
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Handle tour cancellation
    tour.on('cancel', () => {
      setIsActive(false);
    });

  }, [tour]);

  // Start the tour
  const startTour = useCallback(() => {
    if (tour) {
      // Reset to first step
      tour.show('programs');
    }
  }, [tour]);

  // Stop the tour
  const stopTour = useCallback(() => {
    if (tour) {
      tour.complete();
    }
  }, [tour]);

  return { startTour, stopTour, isActive };
}