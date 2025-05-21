import * as Yup from 'yup';

const phoneRegExp = /^\+[1-9]\d{1,14}$/;

export const personalInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(phoneRegExp, 'Please enter a valid phone number')
    .required('Phone number is required'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender')
    .required('Gender is required'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .required('Address is required'),
  nationality: Yup.string()
    .required('Nationality is required'),
  stateOfOrigin: Yup.string()
    .required('State of origin is required'),
});

export const academicBackgroundSchema = Yup.object().shape({
  highestQualification: Yup.string()
    .required('Highest qualification is required'),
  institution: Yup.string()
    .required('Institution is required'),
  graduationYear: Yup.string()
    .matches(/^\d{4}$/, 'Please enter a valid year')
    .required('Graduation year is required'),
  grade: Yup.string()
    .required('Grade is required'),
  otherCertifications: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Certification name is required'),
      institution: Yup.string().required('Institution is required'),
      year: Yup.string()
        .matches(/^\d{4}$/, 'Please enter a valid year')
        .required('Year is required'),
    })
  ),
});

export const programSelectionSchema = Yup.object().shape({
  program: Yup.string()
    .required('Program is required'),
  course: Yup.string()
    .required('Course is required'),
  startDate: Yup.date()
    .min(new Date(), 'Start date must be in the future')
    .required('Start date is required'),
  studyMode: Yup.string()
    .oneOf(['full-time', 'part-time', 'weekend'], 'Please select a valid study mode')
    .required('Study mode is required'),
});

export const accommodationSchema = Yup.object().shape({
  required: Yup.boolean(),
  type: Yup.string()
    .when('required', {
      is: true,
      then: Yup.string()
        .oneOf(['single', 'shared'], 'Please select a valid accommodation type')
        .required('Accommodation type is required'),
    }),
  duration: Yup.string()
    .when('required', {
      is: true,
      then: Yup.string()
        .required('Duration is required'),
    }),
});

export const refereeSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Referee name is required'),
  relationship: Yup.string()
    .required('Relationship is required'),
  organization: Yup.string()
    .required('Organization is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(phoneRegExp, 'Please enter a valid phone number')
    .required('Phone number is required'),
});

export const applicationFormSchema = Yup.object().shape({
  personalInfo: personalInfoSchema,
  academicBackground: academicBackgroundSchema,
  programSelection: programSelectionSchema,
  accommodation: accommodationSchema,
  referee: refereeSchema,
});