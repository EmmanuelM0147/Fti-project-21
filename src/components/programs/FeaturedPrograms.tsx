import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, BookOpen, Users, ChevronRight } from 'lucide-react';
import { Program } from '../../lib/api/types';
import { LoadingSpinner } from '../LoadingSpinner';

interface FeaturedProgramsProps {
  programs?: Program[];
  isLoading?: boolean;
}

export function FeaturedPrograms({ programs = [], isLoading = false }: FeaturedProgramsProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          program.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = !selectedLevel || program.metadata.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [programs, searchQuery, selectedLevel]);

  const handleProgramClick = (programId: string) => {
    navigate(`/programs/${programId}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Featured Programs
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Discover our comprehensive range of technology programs
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Program Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={program.metadata.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                    alt={program.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">
                      {program.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{program.metadata.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span>{program.metadata.level}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="h-5 w-5 mr-2" />
                      <span>{program.capacity} students</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleProgramClick(program.id)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View Program
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No programs match your search criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
}