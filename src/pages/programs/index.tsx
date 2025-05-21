import { usePrograms } from '../../lib/api/hooks';
import { ProgramList } from '../../components/programs/ProgramList';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ErrorMessage } from '../../components/ErrorMessage';

export default function Programs() {
  const { data: programs, isLoading, error } = usePrograms();

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Programs | FolioTech Institute</title>
        <meta name="description" content="Explore our comprehensive technology programs" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProgramList programs={programs} isLoading={isLoading} />
      </motion.div>
    </>
  );
}