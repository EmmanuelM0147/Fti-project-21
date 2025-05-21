export interface Program {
  id: string;
  name: string;
  description: string;
  capacity: number;
  status: 'active' | 'inactive' | 'archived';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  program_id: string;
  name: string;
  description: string;
  credits: number;
  duration: string;
  prerequisites: string[];
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  auth_id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  program_id: string;
  status: 'pending' | 'active' | 'completed' | 'withdrawn';
  enrollment_date: string;
  completion_date?: string;
  progress: Record<string, any>;
  payment_status: 'pending' | 'partial' | 'completed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  program_id: string;
  course_id: string;
  name: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'other';
  url: string;
  metadata: Record<string, any>;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}