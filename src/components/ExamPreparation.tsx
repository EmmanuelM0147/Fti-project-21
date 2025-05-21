import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Book, Award, PenTool as Tool, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

// Define types for our data
interface ExamCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  imagePath: string;
}

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  exam: string;
  image: string;
}

const examCards: ExamCard[] = [
  {
    id: 'jamb',
    name: 'JAMB',
    description: 'Joint Admissions and Matriculation Board Examination for University Entrance',
    icon: GraduationCap,
    imagePath: '/images/utme-logo.webp'
  },
  {
    id: 'neco',
    name: 'NECO',
    description: 'National Examinations Council for Secondary School Certification',
    icon: Book,
    imagePath: '/images/neco-logo.webp'
  },
  {
    id: 'waec',
    name: 'WAEC',
    description: 'West African Examinations Council for Secondary School Certification',
    icon: Award,
    imagePath: '/images/wassce.webp'
  },
  {
    id: 'nabteb',
    name: 'NABTEB',
    description: 'National Business and Technical Examinations Board for Technical Education',
    icon: Tool,
    imagePath: '/images/nabteb.webp'
  }
];

const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: 'With FolioTech intensive preparation program, I scored 320 on JAMB and secured admission to my dream university.',
    name: 'Adebayo Johnson',
    exam: 'JAMB',
    image: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't2',
    quote: 'The WAEC preparation at FolioTech helped me achieve 7 A1s. Their teaching methodology is exceptional.',
    name: 'Chioma Okafor',
    exam: 'WAEC',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't3',
    quote: 'I passed all my NABTEB exams with distinctions thanks to the practical approach at FolioTech Institute.',
    name: 'Emmanuel Nwachukwu',
    exam: 'NABTEB',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }
];

export function ExamPreparation() {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section 
      ref={ref} 
      className="py-16 bg-[#1A202C] text-white"
      aria-labelledby="exam-preparation-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 
            id="exam-preparation-title" 
            className="text-3xl font-bold text-white sm:text-4xl mb-4"
          >
            Examination Preparation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The Centre prepares students intensively for Nigerian examinations
          </p>
        </motion.div>

        {/* Exam Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {examCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(30, 144, 255, 0.1), 0 10px 10px -5px rgba(30, 144, 255, 0.04)" }}
                className="bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 border border-transparent hover:border-[#1E90FF]"
              >
                <div className="w-16 h-16 bg-[#1E90FF]/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-[#1E90FF]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold mb-2">{card.name}</h3>
                <p className="text-gray-400 mb-4">{card.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-800/50 rounded-xl p-8 relative overflow-hidden"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Success Stories</h3>
          
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8 p-4"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#1E90FF]">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <blockquote className="text-lg md:text-xl italic mb-4">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1E90FF]">{testimonials[currentTestimonial].name}</span>
                    <span className="text-gray-400">{testimonials[currentTestimonial].exam} Examination</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8 gap-4">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-gray-700 hover:bg-[#1E90FF] transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-[#1E90FF]' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-current={index === currentTestimonial ? 'true' : 'false'}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-gray-700 hover:bg-[#1E90FF] transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ExamPreparation;
