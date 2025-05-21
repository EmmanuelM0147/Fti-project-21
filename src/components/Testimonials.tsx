import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "The hands-on learning approach at FolioTech Institute prepared me for real-world challenges in software development.",
    author: "Aisha Williams",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80"
  },
  {
    id: 2,
    quote: "The faculty's industry experience and mentorship were invaluable in shaping my career in data science.",
    author: "Adebayo Johnson",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Student Success Stories
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Hear from our alumni about their journey at FolioTech Institute
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg transition-transform hover:scale-105"
            >
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.author}
                />
                <div className="ml-4">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-base text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
