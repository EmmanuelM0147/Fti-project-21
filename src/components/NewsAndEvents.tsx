import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { NewsItem, Event } from '../types';

const news: NewsItem[] = [
  {
    id: '1',
    title: 'FolioTech Partners with Leading Tech Companies',
    date: '2024-03-15',
    category: 'Partnerships',
    description: 'New collaboration program offers students direct access to industry projects and internships.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '2',
    title: 'AI Research Center Launch',
    date: '2024-03-10',
    category: 'Research',
    description: 'State-of-the-art AI research facility opens its doors to students and faculty.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  }
];

const events: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    date: 'March 25, 2024',
    time: '9:00 AM - 5:00 PM',
    location: 'Main Auditorium',
    description: 'Annual technology conference featuring industry leaders and innovative projects.'
  },
  {
    id: '2',
    title: 'Hackathon Spring 2024',
    date: 'April 5-7, 2024',
    time: '48 Hours',
    location: 'Innovation Hub',
    description: 'Join us for an exciting 48-hour coding challenge with amazing prizes.'
  }
];

export function NewsAndEvents() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* News Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-8 transition-colors duration-200">
            Latest News
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {news.map((item) => (
              <div 
                key={item.id} 
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-200 will-change-transform"
                style={{ contain: 'content' }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors duration-200">
                      {item.category}
                    </span>
                    <span className="mx-2 text-gray-300 dark:text-gray-600 transition-colors duration-200">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-8 transition-colors duration-200">
            Upcoming Events
          </h2>
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                      {event.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-200">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-200">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-blue-600 dark:border-blue-400 
                        text-base font-medium rounded-md text-blue-600 dark:text-blue-400 
                        hover:bg-blue-50 dark:hover:bg-blue-900/20 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900
                        transition-colors duration-200"
                      aria-label={`Register for ${event.title}`}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}