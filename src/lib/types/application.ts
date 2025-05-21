import { z } from 'zod';

// Calculate minimum date of birth for 18+ by February 27, 2025
const minBirthDate = new Date('2025-02-27');
minBirthDate.setFullYear(minBirthDate.getFullYear() - 18);

// Validation schemas
export const personalInfoSchema = z.object({
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  contactAddress: z.string().min(10, 'Please provide a complete address'),
  nationality: z.string().min(2, 'Please specify your nationality'),
  stateOfOrigin: z.string().min(2, 'Please specify your state of origin'),
  religion: z.string().optional(),
  phoneNumber: z.string().regex(/^\+234\d{10}$/, 'Please enter a valid Nigerian phone number (e.g., +2341234567890)'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    return dob <= minBirthDate;
  }, 'You must be at least 18 years old by February 27, 2025'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select your gender' })
  }),
  maritalStatus: z.enum(['single', 'married', 'divorced'], {
    errorMap: () => ({ message: 'Please select your marital status' })
  }),
  disability: z.object({
    hasDisability: z.boolean(),
    details: z.string().optional(),
  }),
});

export const academicBackgroundSchema = z.object({
  educationLevel: z.enum(['none', 'primary', 'js', 'jsse', 'ssce', 'tertiary'], {
    errorMap: () => ({ message: 'Please select your education level' })
  }),
  tertiaryEducation: z.enum(['none', 'certificate', 'national_diploma', 'degree', 'other']).optional(),
  certificates: z.array(z.object({
    type: z.string(),
    grade: z.string(),
    year: z.string(),
  })),
});

export const programSelectionSchema = z.object({
  program: z.string().min(1, 'Please select a program'),
  course: z.string().min(1, 'Please select a course'),
  startDate: z.string().min(1, 'Please select a start date'),
  studyMode: z.enum(['full-time', 'part-time', 'weekend'], {
    errorMap: () => ({ message: 'Please select a study mode' })
  }),
  previousExperience: z.string().optional(),
  careerGoals: z.string().min(10, 'Please describe your career goals').max(500, 'Career goals must not exceed 500 characters'),
});

export const accommodationSchema = z.object({
  needsAccommodation: z.boolean(),
  sponsorshipType: z.enum(['self', 'organization', 'guardian'], {
    errorMap: () => ({ message: 'Please select a sponsorship type' })
  }),
  sponsorDetails: z.object({
    name: z.string().min(2, 'Sponsor name is required'),
    relationship: z.string().min(2, 'Please specify the relationship'),
    contact: z.string().min(5, 'Please provide contact information'),
  }),
});

export const refereeSchema = z.object({
  name: z.string().min(2, 'Referee name is required'),
  address: z.string().min(10, 'Please provide a complete address'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  email: z.string().email('Invalid email address'),
  relationship: z.string().min(2, 'Please specify the relationship'),
});

export const applicationSchema = z.object({
  personalInfo: personalInfoSchema,
  academicBackground: academicBackgroundSchema,
  programSelection: programSelectionSchema,
  accommodation: accommodationSchema,
  referee: refereeSchema,
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type AcademicBackground = z.infer<typeof academicBackgroundSchema>;
export type ProgramSelection = z.infer<typeof programSelectionSchema>;
export type Accommodation = z.infer<typeof accommodationSchema>;
export type Referee = z.infer<typeof refereeSchema>;