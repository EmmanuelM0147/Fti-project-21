import React from 'react';
import { Facebook, Linkedin, Instagram, Briefcase } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Link } from 'react-router-dom';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer 
      className="bg-[#f8f9fa] dark:bg-[#1a1a1a] transition-colors duration-300"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 300 300"
                aria-hidden="true"
              >
                <path d="M60 250 Q20 200 40 120 Q50 80 90 70 Q120 60 160 70 Q100 80 110 140 Q120 180 160 190 Q100 190 100 250 Z" fill="#894876" stroke="none"/>
                <path d="M200 250 Q140 250 160 180 Q180 120 120 120 Q160 100 200 100 Q260 100 240 120 Q220 140 220 180 Q220 250 200 250 Z" fill={theme === 'dark' ? '#66b3ff' : '#0066cc'} stroke="none"/>
                <text x="220" y="190" fontSize="70" fill={theme === 'dark' ? '#cccccc' : '#555555'}>⚙️</text>
              </svg>
              <span className="ml-2 text-xl font-bold text-[#333333] dark:text-white transition-colors duration-300">
                FolioTech Institute
              </span>
            </div>
            <p className="mt-4 text-[#555555] dark:text-[#cccccc] transition-colors duration-300">
              Pursuing Excellence, with Passion and Integrity
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#333333] dark:text-white font-semibold mb-4 transition-colors duration-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Programs', 'Admissions', 'Student Life', 'Research', 'Careers', 'Career Development'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Career Development' ? '/career-development' : `#${item.toLowerCase()}`}
                    className="text-[#0066cc] hover:text-[#004d99] dark:text-[#66b3ff] dark:hover:text-[#99ccff] 
                      transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#66b3ff] 
                      rounded"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[#333333] dark:text-white font-semibold mb-4 transition-colors duration-300">
              Resources
            </h3>
            <ul className="space-y-2">
              {['Student Portal', 'Library', 'Academic Calendar', 'Support', 'FAQs'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-[#0066cc] hover:text-[#004d99] dark:text-[#66b3ff] dark:hover:text-[#99ccff] 
                      transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#66b3ff] 
                      rounded"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-[#333333] dark:text-white font-semibold mb-4 transition-colors duration-300">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: 'Facebook', url: 'https://web.facebook.com/FolioTechInstitute/' },
                { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/folahan-olumide-a2a93829/' },
                { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/folio_techinstitute/?hl=en' },
                { icon: Briefcase, label: 'Careers', url: '/career-development' }
              ].map(({ icon: Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target={url.startsWith('http') ? "_blank" : undefined}
                  rel={url.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="text-[#555555] hover:text-[#0066cc] dark:text-[#cccccc] dark:hover:text-[#66b3ff] 
                    transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#66b3ff] 
                    rounded-full p-1"
                  aria-label={`Visit our ${label} page`}
                >
                  <Icon 
                    className="h-6 w-6 transform hover:scale-110 transition-transform duration-300 will-change-transform" 
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e5e5] dark:border-[#333333] transition-colors duration-300">
          <div className="text-center text-[#555555] dark:text-[#cccccc] transition-colors duration-300">
            <p>© {new Date().getFullYear()} FolioTech Institute. All rights reserved.</p>
            <p className="mt-2">
              Built and Engineered by{' '}
              <a
                href="https://www.kingstechstudio.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066cc] hover:text-[#004d99] dark:text-[#66b3ff] dark:hover:text-[#99ccff] 
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#66b3ff] 
                  rounded"
              >
                Kings Tech Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}