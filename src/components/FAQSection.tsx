import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { faqData, faqCategories } from '../data/faqData';
import type { FAQ } from '../types';

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Intersection observer for animations
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [categoriesRef, categoriesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Filter FAQs based on search query and selected category
  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Toggle FAQ expansion
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Clear search and filters
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setExpandedId(null); // Close any open FAQ when changing category
  };

  // Effect to handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('faq-search')?.focus();
      }
      
      // Escape to clear search when focused
      if (e.key === 'Escape' && isSearchFocused) {
        setSearchQuery('');
        document.getElementById('faq-search')?.blur();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  return (
    <section id="faq" className="py-16 bg-gray-50 dark:bg-gray-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions about FolioTech Institute
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="faq-search"
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Search for questions... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                aria-label="Search frequently asked questions"
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
        </motion.div>

        {/* Categories Section */}
        <motion.div
          ref={categoriesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filter by Category</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              key="all"
              onClick={() => handleCategorySelect('all')}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-pressed={selectedCategory === 'all'}
              aria-label="Show all categories"
            >
              All Questions
            </button>
            
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-pressed={selectedCategory === category.id}
                aria-label={`Filter by ${category.name}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Content */}
        <div className="max-w-3xl mx-auto">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-6">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    aria-expanded={expandedId === faq.id}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white transition-colors">
                      {faq.question}
                    </span>
                    {expandedId === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="px-6 pb-4 prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                We couldn't find any FAQs matching your search criteria.
              </p>
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            If you couldn't find the answer to your question, please don't hesitate to contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=%2B2347088616350&text=Hi%2C+I+have+a+question+about+FolioTech+Institute"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}