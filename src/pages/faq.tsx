import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { faqData } from '../data/faqData';

// FAQ Category type
type FAQCategory = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

// FAQ Item type
type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

// Define categories with icons
const categories: FAQCategory[] = [
  {
    id: 'all',
    name: 'All Questions',
    description: 'Browse all frequently asked questions',
    icon: <span className="text-xl">📋</span>
  },
  {
    id: 'admissions',
    name: 'Admissions',
    description: 'Application process and requirements',
    icon: <span className="text-xl">📝</span>
  },
  {
    id: 'programs',
    name: 'Programs & Courses',
    description: 'Information about our educational offerings',
    icon: <span className="text-xl">🎓</span>
  },
  {
    id: 'fees',
    name: 'Tuition & Fees',
    description: 'Payment information and financial aid',
    icon: <span className="text-xl">💰</span>
  },
  {
    id: 'accommodation',
    name: 'Accommodation',
    description: 'Housing options and facilities',
    icon: <span className="text-xl">🏠</span>
  },
  {
    id: 'career',
    name: 'Career Support',
    description: 'Job placement and career services',
    icon: <span className="text-xl">💼</span>
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Technical requirements and support',
    icon: <span className="text-xl">💻</span>
  }
];

export default function FAQ() {
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

  // Generate FAQ schema for SEO
  const generateFAQSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
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
    <>
      <Helmet>
        <title>Frequently Asked Questions | FolioTech Institute</title>
        <meta 
          name="description" 
          content="Find answers to common questions about FolioTech Institute's programs, admissions, tuition, accommodation, and more."
        />
        <meta name="keywords" content="FolioTech Institute FAQ, tech education questions, vocational training FAQ, Nigeria tech school" />
        <link rel="canonical" href="https://foliotechinstitute.com/faq" />
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema())}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Hero Section */}
        <motion.section
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative py-20 bg-blue-600 dark:bg-blue-800 transition-colors"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMxMC4yMzcgMCAxOC44LTguNDIgMTguOC0xOC44QzU0LjggMjUuMjIgNDYuMjM3IDE4IDM2IDE4eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjQgNDJjMC05Ljk0MSA4LjA1OS0xOCAxOC0xOHMxOCA4LjA1OSAxOCAxOC04LjA1OSAxOC0xOCAxOC0xOC04LjA1OS0xOC0xOHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-blue-100">
              Find answers to common questions about FolioTech Institute
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="faq-search"
                  type="text"
                  className="block w-full pl-10 pr-10 py-3 border border-transparent rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white/10 backdrop-blur-sm text-white placeholder-blue-100"
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
                    <X className="h-5 w-5 text-blue-100 hover:text-white" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-blue-100">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
          </div>
        </motion.section>

        {/* Categories Section */}
        <motion.section
          ref={categoriesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-8 bg-white dark:bg-gray-800 shadow-md transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filter by Category</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
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
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </section>

        {/* Still Have Questions Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800/50 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              If you couldn't find the answer to your question, please don't hesitate to contact us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
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
        </section>
      </div>
    </>
  );
}