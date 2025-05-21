import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Clock, BookOpen, DollarSign } from 'lucide-react';
import { usePrograms } from '../../lib/api/hooks';
import type { Program } from '../../lib/api/types';

interface FilterState {
  search: string;
  category: string;
  level: string;
  priceRange: [number, number];
}

const initialFilters: FilterState = {
  search: '',
  category: '',
  level: '',
  priceRange: [0, 100000]
};

const categories = ['Technology', 'Vocational', 'Construction'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

export function ProgramList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const { data: programs, isLoading, error } = usePrograms();

  const handleProgramClick = (programId: string) => {
    console.log('Navigating to program:', programId);
    navigate(`/programs/${programId}`);
  };

  const filteredPrograms = programs?.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         program.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || program.metadata.category === filters.category;
    const matchesLevel = !filters.level || program.metadata.level === filters.level;
    const matchesPrice = program.metadata.price >= filters.priceRange[0] && 
                        program.metadata.price <= filters.priceRange[1];
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  if (isLoading) {
    return <ProgramListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load programs. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Available Programs
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            aria-label="Grid view"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="sr-only">Search programs</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                id="search"
                placeholder="Search programs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="sr-only">Category</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label htmlFor="level" className="sr-only">Level</label>
            <select
              id="level"
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label htmlFor="price-range" className="sr-only">Price Range</label>
            <input
              type="range"
              id="price-range"
              min="0"
              max="100000"
              step="5000"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                priceRange: [0, parseInt(e.target.value)] 
              }))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Up to ₦{filters.priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Program Grid/List */}
      {filteredPrograms?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No programs match your search criteria.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms?.map(program => (
            <div
              key={program.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={program.metadata.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                alt={program.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {program.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {program.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{program.metadata.duration}</span>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">
                    ₦{program.metadata.price?.toLocaleString() ?? 'Free'}
                  </div>
                </div>
                <button
                  onClick={() => handleProgramClick(program.id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
                >
                  View Program
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrograms?.map(program => (
            <div
              key={program.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {program.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {program.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{program.metadata.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span className="text-sm">{program.metadata.level}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="text-sm">₦{program.metadata.price?.toLocaleString() ?? 'Free'}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button
                    onClick={() => handleProgramClick(program.id)}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 transition-colors"
                  >
                    View Program
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProgramListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
              </div>
              <div className="mt-4 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}