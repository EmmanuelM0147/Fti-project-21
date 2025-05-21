import { useParams, useNavigate } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useProgram, useProgramCourses } from '../../lib/api/hooks';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// Lazy load components with retry logic
const CourseList = lazy(() => retryImport(() => 
  import('../../components/courses/CourseList')
));

const ProgramHeader = lazy(() => retryImport(() => 
  import('../../components/programs/ProgramHeader').then(mod => ({ 
    default: mod.ProgramHeader 
  }))
));

// Retry logic for dynamic imports
async function retryImport(importFn: () => Promise<any>, retries = 3): Promise<any> {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      return retryImport(importFn, retries - 1);
    }
    throw error;
  }
}

// Loading fallback component with ARIA support
function LoadingFallback() {
  return (
    <div role="status" aria-live="polite" className="min-h-[200px] flex items-center justify-center">
      <LoadingSpinner message="Loading content..." />
    </div>
  );
}

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    data: program,
    isLoading: programLoading,
    error: programError,
    refetch: refetchProgram
  } = useProgram(id!);
  
  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses
  } = useProgramCourses(id!);

  // Handle automatic retries for data fetching
  useEffect(() => {
    if ((programError || coursesError) && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        refetchProgram();
        refetchCourses();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [programError, coursesError, retryCount, refetchProgram, refetchCourses]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/programs/${id}/courses/${courseId}`);
  };

  const handleRetry = () => {
    setRetryCount(0);
    refetchProgram();
    refetchCourses();
  };

  if (programError || coursesError) {
    return (
      <ErrorMessage 
        error={programError || coursesError} 
        onRetry={handleRetry}
      />
    );
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{program?.name || 'Program'} | FolioTech Institute</title>
        <meta name="description" content={program?.description} />
      </Helmet>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ProgramHeader 
              program={program} 
              isLoading={programLoading} 
              aria-busy={programLoading}
            />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <CourseList 
              courses={courses}
              isLoading={coursesLoading}
              onCourseClick={handleCourseClick}
              aria-busy={coursesLoading}
            />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
}