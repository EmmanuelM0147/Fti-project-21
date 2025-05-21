import { createClient } from '@supabase/supabase-js';
import { validateUUID, ensureUUID } from './validation';
import type { Program, Course, Student, Enrollment, Resource, ApiError } from './types';

// Default to demo mode if env vars are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-mode';

const supabase = createClient(supabaseUrl, supabaseKey);

export const api = {
  // Programs
  async getPrograms(): Promise<Program[]> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('status', 'active');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      return [];
    }
  },

  async getProgram(id: string): Promise<Program> {
    try {
      // Validate UUID before making the request
      if (!validateUUID(id)) {
        throw new Error(`Invalid UUID format: ${id}`);
      }

      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch program: ${error.message}`);
    }
  },

  // Program Courses
  async getProgramCourses(programId: string): Promise<Course[]> {
    try {
      if (!validateUUID(programId)) {
        throw new Error(`Invalid UUID format: ${programId}`);
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('program_id', programId)
        .eq('status', 'active');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch program courses:', error);
      return [];
    }
  },

  // Courses
  async getCourse(programId: string, courseId: string): Promise<Course> {
    try {
      // Validate both UUIDs
      [programId, courseId].forEach(id => {
        if (!validateUUID(id)) {
          throw new Error(`Invalid UUID format: ${id}`);
        }
      });

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('program_id', programId)
        .eq('id', courseId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch course: ${error.message}`);
    }
  },

  // Error handling middleware
  handleApiError(error: any): ApiError {
    console.error('API Error:', error);
    
    if (error.message?.includes('invalid input syntax for type uuid')) {
      return {
        code: 'INVALID_UUID',
        message: 'Invalid UUID format provided'
      };
    }
    
    if (error.code) {
      return {
        code: error.code,
        message: error.message,
        details: error.details
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred'
    };
  }
};

// Type guard for UUID validation
export function isValidUUID(id: unknown): id is string {
  return typeof id === 'string' && validateUUID(id);
}