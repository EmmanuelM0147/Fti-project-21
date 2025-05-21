import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, Calendar, ArrowRight, Bell } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    return () => clearTimeout(timer);
  }, []);

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Student';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Dashboard | FolioTech Institute</title>
        <meta name="description" content="Your personal learning dashboard at FolioTech Institute" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 mb-8 text-white shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {greeting}, {displayName}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Welcome back to your learning journey
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  to="/apply"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-700 rounded-lg font-medium shadow-md hover:bg-blue-50 transition-colors"
                >
                  Continue Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* In Progress Courses */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    In Progress
                  </h2>
                  <Link to="/courses" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View all
                  </Link>
                </div>

                <div className="space-y-4">
                  {/* Course Card */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                        <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Web Development Fundamentals
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Learn HTML, CSS, and JavaScript basics
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>4 of 12 modules completed</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link
                        to="/courses/web-development"
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Continue
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Another Course Card */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                        <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Computer Appreciation
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Master the fundamentals of computing
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>2 of 8 modules completed</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link
                        to="/courses/computer-appreciation"
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Continue
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Upcoming Events
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">MAY</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">15</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        Web Development Workshop
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        10:00 AM - 12:00 PM • Virtual
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">MAY</span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">22</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        Career Development Session
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        2:00 PM - 4:00 PM • Main Campus
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/events"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all events
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Notifications */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    3 New
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Assignment due tomorrow
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        2 hours ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        New course material available
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Yesterday
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Upcoming live session
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        2 days ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/notifications"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>

              {/* Calendar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Calendar
                </h2>

                <div className="flex items-center justify-between mb-4">
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    &lt;
                  </button>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    May 2025
                  </h3>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    &gt;
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days - first row (empty days + start of month) */}
                  {[null, null, null, 1, 2, 3, 4].map((day, i) => (
                    <div key={`row1-${i}`} className={`text-sm py-1 ${
                      day ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer' : ''
                    }`}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days - second row */}
                  {[5, 6, 7, 8, 9, 10, 11].map((day, i) => (
                    <div key={`row2-${i}`} className={`text-sm py-1 ${
                      day === 10 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer'
                    }`}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days - third row */}
                  {[12, 13, 14, 15, 16, 17, 18].map((day, i) => (
                    <div key={`row3-${i}`} className={`text-sm py-1 ${
                      day === 15 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-medium' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer'
                    }`}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days - fourth row */}
                  {[19, 20, 21, 22, 23, 24, 25].map((day, i) => (
                    <div key={`row4-${i}`} className={`text-sm py-1 ${
                      day === 22 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-medium' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer'
                    }`}>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days - fifth row */}
                  {[26, 27, 28, 29, 30, 31, null].map((day, i) => (
                    <div key={`row5-${i}`} className={`text-sm py-1 ${
                      day ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer' : ''
                    }`}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    to="/calendar"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View full calendar
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}