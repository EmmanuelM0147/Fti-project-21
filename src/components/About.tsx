import React from 'react';
import {
  LucideIcon,
  Lightbulb,
  Target,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Play,
  Briefcase,
  GraduationCap,
  Clock,
  Building,
  Heart,
} from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-[--primary-bg] text-[--text-primary] transition-colors">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] bg-gray-950 dark:bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80" // Example Hero Image
            alt="Diverse group of Black students engaged in collaborative learning in a modern tech environment"
            className="w-full h-full object-cover opacity-80 dark:opacity-60 transition-opacity"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 dark:bg-black/50" /> {/* Hero Section with improved contrast */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center md:justify-start z-10">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 mb-4 leading-tight ">
              About FolioTech Institute
            </h1>
            <p className="text-xl md:text-2xl font-medium  text-[--text-secondary] ">
              Empowering Nigeria's Next Generation of Tech Professionals.
            </p>
          </div>
        </div>
      </div>{/* Hero Section */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[--primary-bg] transition-colors">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Column - Main Content  */}
          <div className="lg:col-span-3 space-y-12 text-[--text-primary] transition-colors"> {/* Introduction - High Contrast */}
            <section className="prose lg:prose-lg prose-headings:text-[--text-primary] prose-p:text-[--text-secondary]">
              <h2 className="text-3xl font-bold mb-6">
                Shaping the Future of Tech Education
              </h2>
              <p className="leading-relaxed">

                We are a leading-edge educational institution dedicated to empowering the next
                generation of technical professionals. As a higher-level vocational training center, we
                usher in a new era of functional education designed for individuals looking to transition
                or re-orient themselves into technology.
              </p>
            </section>
            {/* Mission Statement - High Contrast */}
            <section >
                <h2 className="text-2xl font-bold mb-6 transition-colors text-[--text-primary]">Our Mission</h2>
                <div className="rounded-lg p-6 space-y-4 border shadow-md transition-colors bg-[--secondary-bg] border-[--border-color]">
                  <ul className="space-y-3">
                    {[
                    'Assist young Nigerians in developing practical technical and vocational skills for ready employment in the industrial sector.',
                    'Provide opportunities for unemployed graduates to re-tool their technical skills or transition into new careers',
                    'Offer learning paths for employed individuals seeking a career change',
                    'Upgrade the competence of technicians to perform at higher levels, including supervisory roles in various industrial applications.'
                 ].map((item, index) => (
                   <li key={index} className="flex items-start text-[--text-primary]">
                    {/* Numbered List with Theme-Aware Colors */}
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[--accent] flex items-center justify-center mt-1">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="ml-4 text-base">{item}</p>
                   </li>
                  ))}
                </ul>
                </div>
            </section>

            {/* What Sets Us Apart - High Contrast */}
            <section>
              <h2 className="text-2xl font-bold mb-6 transition-colors">
                Who We Are
              
              </h2>
              <div className="grid md:grid-cols-2 gap-6 transition-colors">
                {[
                  {
                    icon: Users as LucideIcon,
                    title: 'Industry-Expert Instructors',
                    description: 'Learn from professionals with real-world experience',
                  },
                  {
                    icon: BookOpen,
                    title: 'Cutting-Edge Curriculum',
                    description: 'Stay ahead with programs that evolve alongside technology trends',
                  },
                  {
                    icon: Briefcase,
                    title: 'Hands-On Projects',
                    description: 'Gain practical experience through immersive projects and internships',
                  },
                  {
                    icon: Clock,
                    title: 'Flexible Learning Options',
                    description: 'Choose from online, in-person, or hybrid models to suit your schedule',
                  },
                  {
                    icon: Building,
                    title: 'Strong Industry Partnerships',
                    description: 'Benefit from job placement opportunities with leading technology companies',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border transition-colors bg-[--secondary-bg] border-[--border-color]"
                    >
                      <Icon className="h-8 w-8 mb-4 transition-colors text-[--accent]" strokeWidth={1.5}/>
                      <h3 className="text-lg font-semibold mb-2 transition-colors text-[--text-primary]">
                        {item.title}
                      </h3>
                      <p className="text-[--text-secondary]">{item.description}</p>
                     </div>
                  );
                })}
              </div>
            </section>

            {/* Core Values */}
            <section>
              <h2 className="text-2xl font-bold mb-6 transition-colors text-[--text-primary]">
                Our Values
                </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Lightbulb,
                    value: 'Innovation',
                    description: 'Embracing emerging technologies and teaching methodologies',
                  },
                  { icon: Heart, value: 'Inclusivity', description: 'Ensuring equal opportunities for all learners' },
                  { icon: Award, value: 'Excellence', description: 'Committing to the highest standards in education' },
                  { icon: Users, value: 'Collaboration', description: 'Building a supportive learning community' },
                  { icon: Target, value: 'Integrity', description: 'Upholding ethical practices in all interactions' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-6 rounded-lg border shadow-md hover:shadow-lg transition-colors bg-[--secondary-bg] border-[--border-color]"
                    >
                      <Icon className="h-8 w-8 mb-3 transition-colors text-[--accent]" strokeWidth={1.5}/>
                      <span className="font-semibold mb-2 transition-colors text-[--text-primary]">{item.value}</span>
                      <p className="text-sm transition-colors text-[--text-secondary]">{item.description}</p>
                      </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-2 space-y-8 text-[--text-primary] transition-colors">
            {/* Virtual Tour - High Contrast */}
            <div className="rounded-lg p-6 text-center border shadow-md transition-colors bg-[--secondary-bg] border-[--border-color] text-[--text-primary]">
              <h3 className="text-xl font-semibold mb-4 transition-colors">Take a Virtual Tour</h3>
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" // Example Virtual Tour Image
                  alt="Black students engaged in a tech workshop session"
                  className="w-full h-48 object-cover transition-opacity opacity-90 dark:opacity-80"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
              <button className="flex items-center justify-center w-full text-white rounded-lg px-4 py-3 transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-[--accent] hover:bg-blue-700">
                <Play className="h-5 w-5 mr-2 stroke-2" />
                Start Tour
              </button>
            </div>

            {/* CTA Card - High Contrast */}
            <div className="rounded-lg p-6 sticky top-24 border transition-colors bg-[--secondary-bg] border-[--border-color]">
               <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" // Example CTA Image
                  alt="Black tech professional in a modern office environment"
                  className="w-full h-48 object-cover rounded-lg transition-opacity opacity-90 dark:opacity-70"
                />
              </div>
              <h3 className={`text-xl font-semibold mb-4 transition-colors text-[--text-primary]`}> {/* Better Contrast for this heading */}
                Start Your Journey
              </h3>
              <form className="space-y-4">
                <div >
                  <label htmlFor="name" className="block text-sm font-medium mb-1 transition-colors ">
                    Full Name 
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-lg focus:border-blue-500 focus:ring-blue-500 p-2 transition-colors bg-[--input-bg] border-[--border-color] text-[--input-text]"
                  />
                </div>
                <div >
                  <label htmlFor="email" className="block text-sm font-medium mb-1 transition-colors">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg focus:border-blue-500 focus:ring-blue-500 transition-colors bg-[--input-bg] border-[--border-color] text-[--input-text]"
                  />
                </div>
               <button type="submit" className="w-full text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-[--accent] hover:bg-blue-700">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 stroke-2" />
                </button>
                <a href="#programs" className="block text-center font-medium mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-[--accent] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  <GraduationCap className="inline-block h-4 w-4 mr-1 stroke-2" />
                  Explore Our Programs
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
