export interface Student {
  id?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    nationality: string;
    stateOfOrigin: string;
  };
  academicBackground: {
    highestQualification: string;
    institution: string;
    graduationYear: string;
    grade: string;
    otherCertifications: Array<{
      name: string;
      institution: string;
      year: string;
    }>;
  };
  programSelection: {
    program: string;
    course: string;
    startDate: string;
    studyMode: 'full-time' | 'part-time' | 'weekend';
  };
  accommodation: {
    required: boolean;
    type?: 'single' | 'shared';
    duration?: string;
  };
  referee: {
    name: string;
    relationship: string;
    organization: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export type StudentFormData = Omit<Student, 'id' | 'status' | 'createdAt' | 'updatedAt'>;