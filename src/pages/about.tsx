import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, Target, Users, Globe, Award, BookOpen, 
  ArrowRight, Download, Play, Briefcase, GraduationCap, 
  Clock, Building, Heart, Shield, Trophy, Star, MessageSquare,
  ExternalLink 
} from 'lucide-react';
import { FAQSection } from '../components/FAQSection';
import { ExamPreparation } from '../components/ExamPreparation';
import Carousel from '../components/Carousel/Carousel.tsx';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function About() {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [bannerRef, bannerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [whoRef, whoInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [whyRef, whyInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [valuesRef, valuesInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const handleTalkToAdvisor = () => {
    // WhatsApp chat link with encoded message
    const whatsappUrl = "https://api.whatsapp.com/send/?phone=%2B2347088616350&text=Hi%2C+I%27d+like+to+learn+more+about+FolioTech+Institute&type=phone_number&app_absent=0";
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank', 'noopener noreferrer');
  };

  const handleExplorePrograms = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (window.location.pathname === '/') {
      const programsSection = document.getElementById('featured-programs');
      if (programsSection) {
        const headerOffset = 80;
        const elementPosition = programsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        programsSection.focus();
      }
    } else {
      navigate('/', { state: { scrollTo: 'featured-programs' } });
    }
  };

  return (
    <>
      <Helmet>
        <title>About Us | FolioTech Institute</title>
        <meta name="description" content="Learn about FolioTech Institute's mission to empower innovators and shape the future of technology education in Nigeria." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is FolioTech Institute?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "FolioTech Institute is a leading-edge educational institution dedicated to empowering the next generation of technical professionals. As a higher-level vocational training center, we offer practical, industry-focused education designed for individuals looking to transition or re-orient themselves into technology fields."
                }
              },
              {
                "@type": "Question",
                "name": "Where is FolioTech Institute located?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our main campus is located at 1, Sunmonu Animashaun St, Zina Estate, Addo Rd, Ajah, Lagos, Nigeria. We also offer select programs through online and hybrid learning formats."
                }
              },
              {
                "@type": "Question",
                "name": "What programs does FolioTech Institute offer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer three main program tracks: Computer Technology, Vocational Studies, and Construction Technologies. Each track contains multiple specialized courses ranging from 3 months to 2 years in duration."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E293B] via-[#2563EB] to-[#1E293B] overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMxMC4yMzcgMCAxOC44LTguNDIgMTguOC0xOC44QzU0LjggMjUuMjIgNDYuMjM3IDE4IDM2IDE4eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjQgNDJjMC05Ljk0MSA4LjA1OS0xOCAxOC0xOHMxOCA4LjA1OSAxOCAxOC04LjA1OSAxOC0xOCAxOC0xOC04LjA1OS0xOC0xOHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] animate-[spin_30s_linear_infinite]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-10">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-inter">
              About FolioTech Institute
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-sourcesans">
              Empowering the next generation through innovative education and practical skills
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleExplorePrograms}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              Discover Our Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={handleTalkToAdvisor}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              aria-label="Start WhatsApp chat with an advisor"
            >
              Talk to an Advisor
              <ExternalLink className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.section>

      {/* About Content Banner */}
      <motion.section
        ref={bannerRef}
        initial="hidden"
        animate={bannerInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-24 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-12 shadow-xl"
          >
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Educational Philosophy
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                At FolioTech Institute, we offer a balanced education within a friendly and caring environment. We encourage independent learning that challenges students to accept responsibility for their total development. We also welcome an inclusive learning environment where academic excellence is promoted with secure pastoral care as students have access to support counselling and guidance.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      
      {/* Who We Are Section */}
      <motion.section
        ref={whoRef}
        initial="hidden"
        animate={whoInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-24 bg-white"
      >
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.h2
              variants={fadeIn}
              className="text-4xl font-bold text-[#1E293B] mb-6 font-inter"
            >
              Who We Are
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-[#64748B] mb-8 font-sourcesans"
            >
              FolioTech Institute is Nigeria's premier technology education hub, dedicated to bridging the gap between traditional education and industry demands. We empower students with practical skills and real-world experience through our innovative learning approach.
            </motion.p>
            <motion.ul
              variants={staggerChildren}
              className="space-y-4"
            >
              {[
                "Industry-led curriculum designed for real-world application",
                "Hands-on learning with modern technology stack",
                "Expert instructors with proven industry experience",
                "Strong partnerships with leading tech companies",
                "Career support and placement assistance"
              ].map((item, index) => (
                <motion.li
                  key={index}
                  variants={fadeIn}
                  className="flex items-start space-x-3 text-[#64748B]"
                >
                  <Shield className="flex-shrink-0 w-6 h-6 text-[#2563EB] mt-1" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <div className="lg:col-span-5" >
            <Carousel
              images={[
                "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302665/Plumbling_zodckw.jpg",
                "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746299927/Computer_h9ofeq.jpg",
                "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302434/Elect_wg04ur.jpg",
                "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302239/Tailoring_qwee1e.jpg",
                "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302189/Welding_b1y9ue.jpg",
                "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302162/Knitting_udffuy.jpg",
                "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302102/Fur_bldbyp.jpg",
                "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1746302032/Catering_d0efnz.jpg"
              ]}
            />
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        ref={whyRef}
        initial="hidden"
        animate={whyInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-24 bg-[#F8FAFC]"
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeIn}
              className="text-4xl font-bold text-[#1E293B] mb-6 font-inter"
            >
              Why Choose FolioTech
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-[#64748B] max-w-2xl mx-auto font-sourcesans"
            >
              Experience excellence in technology education through our comprehensive approach
            </motion.p>
          </div>

          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: GraduationCap,
                title: "Expert Faculty",
                description: "Learn from industry professionals with real-world experience"
              },
              {
                icon: Briefcase,
                title: "Industry Connections",
                description: "Direct access to leading technology companies"
              },
              {
                icon: Trophy,
                title: "Proven Track Record",
                description: "High employment rate among our graduates"
              },
              {
                icon: Star,
                title: "Modern Facilities",
                description: "State-of-the-art labs and learning environments"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-[#2563EB] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E293B] mb-2 font-inter">
                    {item.title}
                  </h3>
                  <p className="text-[#64748B] font-sourcesans">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Core Values Section */}
      <motion.section
        ref={valuesRef}
        initial="hidden"
        animate={valuesInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-24 bg-white"
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeIn}
              className="text-4xl font-bold text-[#1E293B] mb-6 font-inter"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-[#64748B] max-w-2xl mx-auto font-sourcesans"
            >
              The principles that guide our commitment to excellence
            </motion.p>
          </div>

          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "Embracing cutting-edge technology and teaching methodologies"
              },
              {
                icon: Target,
                title: "Excellence",
                description: "Maintaining the highest standards in education and student support"
              },
              {
                icon: Heart,
                title: "Community",
                description: "Fostering a collaborative and inclusive learning environment"
              }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="text-center p-8 rounded-lg border border-gray-200 hover:border-[#2563EB] transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-[#2563EB] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-[#2563EB]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E293B] mb-4 font-inter">
                    {value.title}
                  </h3>
                  <p className="text-[#64748B] font-sourcesans">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Examination Preparation Section */}
      <ExamPreparation />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#2563EB] to-[#1E293B]">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-inter">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-sourcesans">
            Join FolioTech Institute and become part of Nigeria's tech revolution
          </p>
          <button
            onClick={handleExplorePrograms}
            className="px-8 py-4 bg-[#22C55E] hover:bg-[#1EA34D] text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Explore Our Programs
            <ArrowRight className="inline-block ml-2" />
          </button>
        </div>
      </section>
    </>
  );
}