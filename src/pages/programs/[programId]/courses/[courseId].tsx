import { useParams } from 'react-router-dom';
import { useCourse } from '../../../../lib/api/hooks';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ErrorMessage } from '../../../../components/ErrorMessage';
import { CourseDetail } from '../../../../components/courses/CourseDetail';

export default function CourseDetailPage() {
  const { programId, courseId } = useParams<{ programId: string; courseId: string }>();
  
  const {
    data: course,
    isLoading,
    error
  } = useCourse(programId!, courseId!);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>{course?.name || 'Course'} | FolioTech Institute</title>
        <meta name="description" content={course?.description} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CourseDetail course={course} isLoading={isLoading} />
      </motion.div>
    </>
  );
}