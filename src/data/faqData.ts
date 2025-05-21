import { FAQ } from '../types';

export const faqCategories = [
  { id: 'general', name: 'General Information' },
  { id: 'courses', name: 'Courses & Programs' },
  { id: 'admissions', name: 'Admissions & Applications' },
  { id: 'fees', name: 'Tuition & Fees' },
  { id: 'career', name: 'Career Support' },
  { id: 'technical', name: 'Technical Requirements' }
];

export const faqData: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is FolioTech Institute?',
    answer: 'FolioTech Institute is a leading-edge educational institution dedicated to empowering the next generation of technical professionals. As a higher-level vocational training center, we offer practical, industry-focused education designed for individuals looking to transition or re-orient themselves into technology fields.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'Where is FolioTech Institute located?',
    answer: 'Our main campus is located at 1, Sunmonu Animashaun St, Zina Estate, Addo Rd, Ajah, Lagos, Nigeria. We also offer select programs through online and hybrid learning formats.',
    category: 'general'
  },
  {
    id: 'faq-3',
    question: 'What programs does FolioTech Institute offer?',
    answer: 'We offer three main program tracks: Computer Technology, Vocational Studies, and Construction Technologies. Each track contains multiple specialized courses ranging from 3 months to 2 years in duration. Visit our <a href="/programs" class="text-blue-600 hover:underline">Programs page</a> for detailed information.',
    category: 'courses'
  },
  {
    id: 'faq-4',
    question: 'How long are the courses?',
    answer: 'Our courses range from 3 months to 2 years, depending on the program and specialization. Short courses typically run for 3-6 months, while comprehensive diploma programs may take 1-2 years to complete.',
    category: 'courses'
  },
  {
    id: 'faq-5',
    question: 'Are courses offered online or in-person?',
    answer: 'We offer both in-person and hybrid learning options. Most technical and vocational courses include significant hands-on components that require on-campus attendance, while theoretical components may be completed online.',
    category: 'courses'
  },
  {
    id: 'faq-6',
    question: 'What are the admission requirements?',
    answer: 'Admission requirements vary by program. Generally, applicants should have completed at least secondary education. Some advanced programs may require prior knowledge or experience. All applicants must complete our application form and may be invited for an interview.',
    category: 'admissions'
  },
  {
    id: 'faq-7',
    question: 'How do I apply to FolioTech Institute?',
    answer: 'You can apply through our online application portal. Click the "Apply Now" button on our homepage or visit the Admissions section. The application process includes filling out personal information, educational background, and selecting your preferred program.',
    category: 'admissions'
  },
  {
    id: 'faq-8',
    question: 'Is there an application deadline?',
    answer: 'We operate on a rolling admissions basis for most programs, meaning you can apply at any time. However, some specialized programs have specific intake dates. We recommend applying at least 1-2 months before your intended start date.',
    category: 'admissions'
  },
  {
    id: 'faq-9',
    question: 'How much is the tuition fee?',
    answer: 'Tuition fees vary by program. Our standard fee structure is ₦40,000 per month for tuition. Additional costs may include accommodation (₦30,000 per month if needed) and a student allowance of ₦30,000 per month. Please contact our admissions office for specific program fees.',
    category: 'fees'
  },
  {
    id: 'faq-10',
    question: 'Are there any scholarships or financial aid options?',
    answer: 'Yes, we offer various scholarships and financial aid options based on merit and need. We also have payment plans and sponsorship opportunities. Visit our <a href="/sponsorships" class="text-blue-600 hover:underline">Sponsorships page</a> or contact our financial aid office for more information.',
    category: 'fees'
  },
  {
    id: 'faq-11',
    question: 'What payment methods are accepted?',
    answer: 'We accept payments through bank transfers, debit/credit cards via Paystack, and mobile money. Payment can be made in full or through our installment plans.',
    category: 'fees'
  },
  {
    id: 'faq-12',
    question: 'Do you offer job placement services?',
    answer: 'Yes, we have a dedicated career services department that assists students with job placement, internships, and career counseling. We maintain strong relationships with industry partners who regularly recruit our graduates.',
    category: 'career'
  },
  {
    id: 'faq-13',
    question: 'What is the employment rate for graduates?',
    answer: 'Our graduates enjoy a high employment rate, with approximately 92% securing relevant positions within six months of graduation. This success is due to our industry-focused curriculum and strong employer partnerships.',
    category: 'career'
  },
  {
    id: 'faq-14',
    question: 'Do you offer internship opportunities?',
    answer: 'Yes, internships are an integral part of many of our programs. We partner with leading companies in various industries to provide students with practical work experience before graduation.',
    category: 'career'
  },
  {
    id: 'faq-15',
    question: 'What technical equipment do I need for the courses?',
    answer: 'Requirements vary by program. For computer technology courses, you\'ll need a laptop meeting minimum specifications that will be provided upon enrollment. For vocational and construction programs, specialized tools and equipment are provided in our workshops.',
    category: 'technical'
  },
  {
    id: 'faq-16',
    question: 'Is prior technical knowledge required?',
    answer: 'Most of our introductory courses assume no prior technical knowledge. However, some advanced courses may have prerequisites. Our admissions team can help determine the best starting point based on your background.',
    category: 'technical'
  },
  {
    id: 'faq-17',
    question: 'Do you provide accommodation for students?',
    answer: 'Yes, we offer on-campus accommodation for students at a rate of ₦30,000 per month. Accommodation is subject to availability and must be requested during the application process.',
    category: 'general'
  },
  {
    id: 'faq-18',
    question: 'Are there any certification exams included in the programs?',
    answer: 'Many of our programs prepare students for industry-recognized certifications. Some certification exam fees are included in the tuition, while others may require additional payment. Specific details are provided in each program description.',
    category: 'courses'
  },
  {
    id: 'faq-19',
    question: 'How can I contact FolioTech Institute?',
    answer: 'You can reach us by phone at +234-708-861-6350, by email at info@foliotechinstitute.com, or by visiting our campus at 1, Sunmonu Animashaun St, Zina Estate, Addo Rd, Ajah, Lagos. You can also use the contact form on our website.',
    category: 'general'
  },
  {
    id: 'faq-20',
    question: 'Do you offer any short courses or workshops?',
    answer: 'Yes, we regularly offer short courses and workshops ranging from a few days to several weeks. These are designed for specific skills development or as introductions to our longer programs. Check our website or contact us for the current schedule.',
    category: 'courses'
  }
];