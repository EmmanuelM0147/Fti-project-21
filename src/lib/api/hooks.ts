import { useQuery } from '@tanstack/react-query';
import { api, isValidUUID } from './client';
import { validateUUID } from './validation';
import type { Program, Course } from './types';

// Add error handling and retry logic
const defaultQueryConfig = {
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  staleTime: 5 * 60 * 1000, // 5 minutes
  onError: (error: Error) => {
    console.error('Query error:', error);
  }
};

export function usePrograms() {
  return useQuery<Program[], Error>({
    queryKey: ['programs'],
    queryFn: async () => {
      try {
        const programs = await api.getPrograms();
        if (!programs || !Array.isArray(programs)) {
          throw new Error('Invalid programs data received');
        }
        return programs;
      } catch (error) {
        console.error('Error fetching programs:', error);
        throw error;
      }
    },
    ...defaultQueryConfig
  });
}

export function useProgram(id: string) {
  return useQuery<Program, Error>({
    queryKey: ['program', id],
    queryFn: async () => {
      try {
        if (!validateUUID(id)) {
          throw new Error('Invalid program ID format');
        }
        return await api.getProgram(id);
      } catch (error) {
        console.error('Error fetching program:', error);
        throw error;
      }
    },
    ...defaultQueryConfig,
    enabled: isValidUUID(id)
  });
}

export function useProgramCourses(programId: string) {
  return useQuery<Course[], Error>({
    queryKey: ['program-courses', programId],
    queryFn: async () => {
      try {
        if (!validateUUID(programId)) {
          throw new Error('Invalid program ID format');
        }
        const courses = await api.getProgramCourses(programId);
        
        // Validate courses data
        if (!Array.isArray(courses)) {
          throw new Error('Invalid courses data: expected array');
        }
        
        // Transform duration from interval to string if needed
        return courses.map(course => ({
          ...course,
          duration: typeof course.duration === 'object' 
            ? `${course.duration.hours || 0} hours`
            : course.duration
        }));
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
    },
    ...defaultQueryConfig,
    enabled: isValidUUID(programId)
  });
}

export function useCourse(programId: string, courseId: string) {
  return useQuery<Course, Error>({
    queryKey: ['course', programId, courseId],
    queryFn: async () => {
      try {
        if (!validateUUID(programId) || !validateUUID(courseId)) {
          throw new Error('Invalid ID format');
        }
        return await api.getCourse(programId, courseId);
      } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
      }
    },
    ...defaultQueryConfig,
    enabled: isValidUUID(programId) && isValidUUID(courseId)
  });
}