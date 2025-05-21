# FolioTech Institute Website Tour

This project implements a guided tour feature for the FolioTech Institute website using Shepherd.js.

## Features

- Responsive website tour that works on both desktop and mobile devices
- Cross-browser compatible (Chrome, Firefox, Safari)
- Skip and finish functionality
- Tour activation from welcome modal
- Customized tour steps highlighting key website sections

## Technical Implementation

### Dependencies

- Shepherd.js: A JavaScript library for guiding users through your app
- React: For building the user interface
- TypeScript: For type safety
- Tailwind CSS: For styling

### Tour Steps

1. Programs Section - Explore educational programs
2. About Navigation - Learn about the institute
3. Admissions Section - Discover admission requirements
4. Support Dropdown - Find ways to contribute
5. DevCareer Link - Access career resources
6. Contact Section - Connect with the team
7. Apply Link - Begin application process
8. Explore Programs Link - View comprehensive program listings

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Browser Compatibility

The tour feature has been tested and confirmed working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsiveness

The tour is fully responsive and adapts to different screen sizes:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## Usage

The tour can be triggered in two ways:
1. By clicking "Yes, Show Me Around" on the welcome modal that appears on first visit
2. By clicking the tour button in the navigation bar (info icon)

Users can navigate through the tour using:
- Next/Back buttons
- Skip button to exit the tour at any point
- Finish button on the last step

## Code Structure

- `useTour.ts`: Custom hook that initializes and manages the Shepherd.js tour
- `TourContext.tsx`: React context for sharing tour functionality across components
- `WelcomeModal.tsx`: Modal that appears on first visit with option to start tour
- `Navigation.tsx`: Navigation bar with tour button
- Custom CSS in `index.css` for styling the tour elements