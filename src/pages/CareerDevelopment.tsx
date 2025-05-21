import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Briefcase, BookOpen, Users, Calendar, MapPin, 
  Search, Filter, ChevronDown, ChevronUp, ExternalLink,
  Star, Clock, Award, DollarSign, Bookmark, Heart, ArrowRight,
  CheckCircle, XCircle, AlertTriangle, Compass
} from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../components/auth/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Types
interface CareerTrack {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  salary_range: string;
  demand_level: 'high' | 'medium' | 'low';
  tools: string[];
  certifications: string[];
  icon: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'book' | 'interactive';
  level: 'beginner' | 'intermediate' | 'advanced';
  is_free: boolean;
  track_id: string;
  rating: number;
  review_count: number;
}

interface Community {
  id: string;
  name: string;
  description: string;
  location: string;
  type: 'physical' | 'online' | 'hybrid';
  website: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  logo_url: string;
}

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'mentorship';
  level: 'entry' | 'mid' | 'senior';
  description: string;
  requirements: string[];
  salary_range?: string;
  application_url: string;
  deadline: string;
  posted_date: string;
  logo_url: string;
}

// Main Component
export default function CareerDevelopment() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tracks' | 'resources' | 'community' | 'opportunities'>('tracks');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [careerTracks, setCareerTracks] = useState<CareerTrack[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  
  // Filter states
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('all');
  const [resourceFreeFilter, setResourceFreeFilter] = useState<boolean | null>(null);
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState<string>('all');
  const [opportunityLevelFilter, setOpportunityLevelFilter] = useState<string>('all');
  const [opportunityRemoteFilter, setOpportunityRemoteFilter] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI states
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>(null);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);
  
  // Intersection observer for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [tracksRef, tracksInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [resourcesRef, resourcesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [communitiesRef, communitiesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [opportunitiesRef, opportunitiesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch career tracks
        const { data: tracksData, error: tracksError } = await supabase
          .from('career_tracks')
          .select('*');
        
        if (tracksError) throw new Error(`Failed to fetch career tracks: ${tracksError.message}`);
        
        // Fetch resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('learning_resources')
          .select('*');
        
        if (resourcesError) throw new Error(`Failed to fetch resources: ${resourcesError.message}`);
        
        // Fetch communities
        const { data: communitiesData, error: communitiesError } = await supabase
          .from('tech_communities')
          .select('*');
        
        if (communitiesError) throw new Error(`Failed to fetch communities: ${communitiesError.message}`);
        
        // Fetch opportunities
        const { data: opportunitiesData, error: opportunitiesError } = await supabase
          .from('job_opportunities')
          .select('*');
        
        if (opportunitiesError) throw new Error(`Failed to fetch opportunities: ${opportunitiesError.message}`);
        
        // Set data
        setCareerTracks(tracksData || []);
        setResources(resourcesData || []);
        setCommunities(communitiesData || []);
        setOpportunities(opportunitiesData || []);
        
        // Load user bookmarks and saved opportunities if logged in
        if (user) {
          const { data: userPrefs, error: userPrefsError } = await supabase
            .from('user_preferences')
            .select('bookmarked_resources, saved_opportunities')
            .eq('user_id', user.id)
            .single();
          
          if (!userPrefsError && userPrefs) {
            setBookmarkedResources(userPrefs.bookmarked_resources || []);
            setSavedOpportunities(userPrefs.saved_opportunities || []);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Toggle bookmark for a resource
  const toggleBookmark = async (resourceId: string) => {
    if (!user) {
      toast.error('Please sign in to bookmark resources');
      return;
    }
    
    try {
      const newBookmarks = bookmarkedResources.includes(resourceId)
        ? bookmarkedResources.filter(id => id !== resourceId)
        : [...bookmarkedResources, resourceId];
      
      setBookmarkedResources(newBookmarks);
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          bookmarked_resources: newBookmarks,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(
        bookmarkedResources.includes(resourceId)
          ? 'Resource removed from bookmarks'
          : 'Resource bookmarked successfully'
      );
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Failed to update bookmarks');
      
      // Revert state on error
      setBookmarkedResources(bookmarkedResources);
    }
  };

  // Toggle save for an opportunity
  const toggleSaveOpportunity = async (opportunityId: string) => {
    if (!user) {
      toast.error('Please sign in to save opportunities');
      return;
    }
    
    try {
      const newSaved = savedOpportunities.includes(opportunityId)
        ? savedOpportunities.filter(id => id !== opportunityId)
        : [...savedOpportunities, opportunityId];
      
      setSavedOpportunities(newSaved);
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          saved_opportunities: newSaved,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(
        savedOpportunities.includes(opportunityId)
          ? 'Opportunity removed from saved list'
          : 'Opportunity saved successfully'
      );
    } catch (err) {
      console.error('Error toggling saved opportunity:', err);
      toast.error('Failed to update saved opportunities');
      
      // Revert state on error
      setSavedOpportunities(savedOpportunities);
    }
  };

  // Filter career tracks
  const filteredTracks = careerTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || track.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = trackFilter === 'all' || resource.track_id === trackFilter;
    const matchesLevel = levelFilter === 'all' || resource.level === levelFilter;
    const matchesType = resourceTypeFilter === 'all' || resource.type === resourceTypeFilter;
    const matchesFree = resourceFreeFilter === null || resource.is_free === resourceFreeFilter;
    
    return matchesSearch && matchesTrack && matchesLevel && matchesType && matchesFree;
  });

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = opportunityTypeFilter === 'all' || opportunity.type === opportunityTypeFilter;
    const matchesLevel = opportunityLevelFilter === 'all' || opportunity.level === opportunityLevelFilter;
    const matchesRemote = opportunityRemoteFilter === null || opportunity.is_remote === opportunityRemoteFilter;
    
    return matchesSearch && matchesType && matchesLevel && matchesRemote;
  });

  // Filter communities
  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Get icon component based on string name
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'briefcase': <Briefcase className="h-6 w-6" />,
      'book': <BookOpen className="h-6 w-6" />,
      'users': <Users className="h-6 w-6" />,
      'award': <Award className="h-6 w-6" />,
      'compass': <Compass className="h-6 w-6" />
    };
    
    return iconMap[iconName] || <Briefcase className="h-6 w-6" />;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get status badge for opportunity based on deadline
  const getOpportunityStatusBadge = (deadlineString: string) => {
    const daysRemaining = getDaysRemaining(deadlineString);
    
    if (daysRemaining < 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <XCircle className="h-3 w-3 mr-1" />
          Closed
        </span>
      );
    } else if (daysRemaining <= 7) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Closing Soon
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Open
        </span>
      );
    }
  };

  // Mock data for demonstration (will be replaced by actual data from Supabase)
  const mockCareerTracks: CareerTrack[] = [
  // Construction-related courses from the first screenshot
  {
    id: '1',
    title: 'Carpentry',
    description: 'Learn woodworking techniques and furniture construction.',
    level: 'beginner',
    duration: '6 months',
    salary_range: '₦100,000 - ₦300,000',
    demand_level: 'medium',
    tools: ['Hammer', 'Saw', 'Chisel', 'Drill', 'Measuring Tape'],
    certifications: ['National Vocational Certificate in Carpentry', 'City & Guilds Carpentry Level 1'],
    icon: 'briefcase'
  },
  {
    id: '2',
    title: 'Block-Laying and Concrete Works',
    description: 'Master the fundamentals of construction and concrete work.',
    level: 'beginner',
    duration: '6 months',
    salary_range: '₦120,000 - ₦350,000',
    demand_level: 'high',
    tools: ['Trowel', 'Level', 'Mixer', 'Wheelbarrow', 'Masonry Saw'],
    certifications: ['National Vocational Certificate in Masonry', 'NCCER Concrete Finishing'],
    icon: 'book'
  },
  {
    id: '3',
    title: 'Steel Fabrication',
    description: 'Learn metal fabrication and welding techniques.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦150,000 - ₦400,000',
    demand_level: 'high',
    tools: ['Welding Machine', 'Grinder', 'Cutting Torch', 'Measuring Tape', 'Clamps'],
    certifications: ['AWS Certified Welder', 'NCCER Structural Welding'],
    icon: 'compass'
  },
  {
    id: '4',
    title: 'Tiling',
    description: 'Master the art of tile installation and design.',
    level: 'beginner',
    duration: '3 months',
    salary_range: '₦80,000 - ₦250,000',
    demand_level: 'medium',
    tools: ['Tile Cutter', 'Trowel', 'Level', 'Spacers', 'Grout Float'],
    certifications: ['National Vocational Certificate in Tiling', 'City & Guilds Tiling Basics'],
    icon: 'briefcase'
  },
  {
    id: '5',
    title: 'Aluminium Works',
    description: 'Learn aluminium fabrication and installation.',
    level: 'beginner',
    duration: '3 months',
    salary_range: '₦90,000 - ₦280,000',
    demand_level: 'medium',
    tools: ['Cutting Machine', 'Drill', 'Riveting Gun', 'Measuring Tape', 'Screwdriver'],
    certifications: ['National Vocational Certificate in Aluminium Works', 'NCCER Aluminium Fabrication'],
    icon: 'book'
  },
  {
    id: '6',
    title: 'POP (Plaster of Paris) Design',
    description: 'Create decorative ceiling and wall designs.',
    level: 'beginner',
    duration: '3 months',
    salary_range: '₦80,000 - ₦250,000',
    demand_level: 'medium',
    tools: ['Trowel', 'Spatula', 'Mixing Bowl', 'Measuring Tape', 'Sandpaper'],
    certifications: ['National Vocational Certificate in POP Design', 'City & Guilds Interior Design Basics'],
    icon: 'compass'
  },
  {
    id: '7',
    title: 'Painting and Decorating',
    description: 'Learn professional painting and finishing techniques.',
    level: 'beginner',
    duration: '3 months',
    salary_range: '₦80,000 - ₦250,000',
    demand_level: 'medium',
    tools: ['Paint Roller', 'Brush', 'Spray Gun', 'Sandpaper', 'Ladder'],
    certifications: ['National Vocational Certificate in Painting', 'City & Guilds Painting & Decorating'],
    icon: 'briefcase'
  },
  // Tech-related courses from the second screenshot
  {
    id: '8',
    title: 'Radio/Router Configuration',
    description: 'Configure and manage network infrastructure equipment.',
    level: 'beginner',
    duration: '3 months',
    salary_range: '₦120,000 - ₦350,000',
    demand_level: 'high',
    tools: ['Router', 'Switch', 'Crimping Tool', 'Network Tester', 'Laptop'],
    certifications: ['Cisco CCNA Basics', 'CompTIA Network+'],
    icon: 'book'
  },
  {
    id: '9',
    title: 'Drone Technology',
    description: 'Learn drone operations, maintenance, and programming.',
    level: 'intermediate',
    duration: '3 months',
    salary_range: '₦150,000 - ₦400,000',
    demand_level: 'high',
    tools: ['Drone', 'Controller', 'FPV Goggles', 'Screwdriver', 'Programming Software'],
    certifications: ['FAA Part 107 Drone Pilot', 'Drone Technology Certification'],
    icon: 'compass'
  },
  {
    id: '10',
    title: 'Remote Control Systems',
    description: 'Design and implement remote control and automation systems.',
    level: 'intermediate',
    duration: '3 months',
    salary_range: '₦150,000 - ₦400,000',
    demand_level: 'high',
    tools: ['Microcontroller', 'Sensors', 'Transmitter', 'Receiver', 'Programming Software'],
    certifications: ['IoT Fundamentals Certification', 'Arduino Certification'],
    icon: 'briefcase'
  },
  {
    id: '11',
    title: 'Artificial Intelligence',
    description: 'Explore AI concepts, machine learning, and practical applications.',
    level: 'advanced',
    duration: '6 months',
    salary_range: '₦250,000 - ₦700,000',
    demand_level: 'high',
    tools: ['Python', 'TensorFlow', 'PyTorch', 'Jupyter Notebook', 'GPU'],
    certifications: ['Google AI Professional Certificate', 'Coursera AI Specialization'],
    icon: 'book'
  },
  // Construction-related courses from the third screenshot
  {
    id: '12',
    title: 'Plumbing-Pipe Fitting',
    description: 'Learn professional plumbing techniques and pipe system installation.',
    level: 'beginner',
    duration: '6 months',
    salary_range: '₦100,000 - ₦300,000',
    demand_level: 'medium',
    tools: ['Pipe Wrench', 'Plumber’s Tape', 'Pipe Cutter', 'Fittings', 'Torch'],
    certifications: ['National Vocational Certificate in Plumbing', 'NCCER Plumbing Level 1'],
    icon: 'compass'
  },
  {
    id: '13',
    title: 'Welding & Fabrications',
    description: 'Master various welding techniques and metal fabrication.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦150,000 - ₦400,000',
    demand_level: 'high',
    tools: ['Welding Machine', 'Electrodes', 'Grinder', 'Protective Gear', 'Measuring Tape'],
    certifications: ['AWS Certified Welder', 'NCCER Welding Level 2'],
    icon: 'briefcase'
  },
  {
    id: '14',
    title: 'Metal Folding Technology',
    description: 'Learn precision metal folding and forming techniques.',
    level: 'intermediate',
    duration: '3 months',
    salary_range: '₦120,000 - ₦350,000',
    demand_level: 'medium',
    tools: ['Folding Machine', 'Press Brake', 'Measuring Tools', 'Cutting Tools', 'Safety Gear'],
    certifications: ['National Vocational Certificate in Metal Folding', 'NCCER Metal Fabrication'],
    icon: 'book'
  },
  {
    id: '15',
    title: 'Electrical Installations & Maintenance',
    description: 'Install and maintain electrical systems safely and efficiently.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦150,000 - ₦400,000',
    demand_level: 'high',
    tools: ['Multimeter', 'Wire Strippers', 'Screwdrivers', 'Conduit Bender', 'Safety Gear'],
    certifications: ['National Vocational Certificate in Electrical', 'NCCER Electrical Level 1'],
    icon: 'compass'
  },
  {
    id: '16',
    title: 'Integrated Circuits',
    description: 'Design and build electronic circuits and systems.',
    level: 'advanced',
    duration: '6 months',
    salary_range: '₦200,000 - ₦600,000',
    demand_level: 'high',
    tools: ['Breadboard', 'Oscilloscope', 'Soldering Iron', 'Microchip', 'Design Software'],
    certifications: ['Electronics Technician Certification', 'IEEE Circuits Certification'],
    icon: 'briefcase'
  },
  {
    id: '17',
    title: 'Exotic Furniture',
    description: 'Create unique, high-quality furniture pieces.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦120,000 - ₦350,000',
    demand_level: 'medium',
    tools: ['Woodworking Tools', 'Sander', 'Varnish', 'Measuring Tape', 'Design Software'],
    certifications: ['National Vocational Certificate in Furniture Making', 'City & Guilds Furniture Design'],
    icon: 'book'
  },
  {
    id: '18',
    title: 'Electronics & Related Equipment Maintenance',
    description: 'Maintain and repair various electronic equipment.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦150,000 - ₦400,000',
    demand_level: 'high',
    tools: ['Soldering Iron', 'Multimeter', 'Oscilloscope', 'Screwdrivers', 'Diagnostic Software'],
    certifications: ['CompTIA A+ Certification', 'Electronics Repair Certification'],
    icon: 'compass'
  },
  {
    id: '19',
    title: 'Automobile Maintenance (Mechanical)',
    description: 'Service and repair various types of vehicles.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦120,000 - ₦350,000',
    demand_level: 'high',
    tools: ['Wrench Set', 'Diagnostic Scanner', 'Jack', 'Oil Filter Wrench', 'Torque Wrench'],
    certifications: ['ASE Certification', 'NCCER Automotive Maintenance'],
    icon: 'briefcase'
  },
  {
    id: '20',
    title: 'Visual Arts',
    description: 'Develop artistic skills and creative techniques.',
    level: 'beginner',
    duration: '3 months',
    salary_range: '₦80,000 - ₦250,000',
    demand_level: 'medium',
    tools: ['Canvas', 'Paints', 'Brushes', 'Sketchbook', 'Digital Drawing Tablet'],
    certifications: ['National Vocational Certificate in Visual Arts', 'Adobe Certified Associate'],
    icon: 'book'
  },
  // Tech-related courses from the fourth screenshot
  {
    id: '21',
    title: 'Computer Appreciation',
    description: 'Master the fundamentals of computing and essential software applications.',
    level: 'beginner',
    duration: '3 months',
    salary_range: '₦80,000 - ₦250,000',
    demand_level: 'medium',
    tools: ['Computer', 'Microsoft Office', 'Internet Browser', 'Keyboard', 'Mouse'],
    certifications: ['ICDL Certification', 'Microsoft Office Specialist'],
    icon: 'compass'
  },
  {
    id: '22',
    title: 'Computer Graphics',
    description: 'Learn digital design principles and industry-standard graphic design tools.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦150,000 - ₦400,000',
    demand_level: 'high',
    tools: ['Adobe Photoshop', 'Illustrator', 'CorelDRAW', 'Tablet', 'Design Software'],
    certifications: ['Adobe Certified Professional', 'Graphic Design Certification'],
    icon: 'briefcase'
  },
  {
    id: '23',
    title: 'Networking',
    description: 'Understand computer networks, protocols, and security fundamentals.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦150,000 - ₦400,000',
    demand_level: 'high',
    tools: ['Router', 'Switch', 'Cables', 'Network Analyzer', 'Firewall Software'],
    certifications: ['Cisco CCNA', 'CompTIA Network+'],
    icon: 'book'
  },
  {
    id: '24',
    title: 'Web Development',
    description: 'Build modern, responsive websites using the latest web technologies.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦200,000 - ₦600,000',
    demand_level: 'high',
    tools: ['HTML', 'CSS', 'JavaScript', 'React', 'VS Code'],
    certifications: ['FreeCodeCamp Web Development', 'Meta Frontend Developer'],
    icon: 'compass'
  },
  {
    id: '25',
    title: 'Mobile App Development',
    description: 'Create native and cross-platform mobile applications.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦250,000 - ₦700,000',
    demand_level: 'high',
    tools: ['React Native', 'Flutter', 'Android Studio', 'Xcode', 'Firebase'],
    certifications: ['Google Associate Android Developer', 'React Native Certification'],
    icon: 'briefcase'
  },
  {
    id: '26',
    title: 'Desktop Application Development',
    description: 'Develop powerful desktop applications using modern frameworks.',
    level: 'intermediate',
    duration: '6 months',
    salary_range: '₦200,000 - ₦600,000',
    demand_level: 'high',
    tools: ['C#', 'Java', 'Electron', 'Visual Studio', 'Qt Framework'],
    certifications: ['Microsoft Certified: Desktop Apps', 'Java SE Programmer'],
    icon: 'book'
  }
];

  const mockResources: Resource[] = [
  // Resources for Carpentry
  {
    id: '1',
    title: 'Introduction to Woodworking',
    description: 'A beginner course covering basic woodworking techniques and tools.',
    url: 'https://example.com/intro-woodworking',
    type: 'course',
    level: 'beginner',
    is_free: true,
    track_id: '1',
    rating: 4.6,
    review_count: 850
  },
  {
    id: '2',
    title: 'Furniture Design Tutorial',
    description: 'Video series on designing and constructing furniture pieces.',
    url: 'https://example.com/furniture-design-video',
    type: 'video',
    level: 'intermediate',
    is_free: false,
    track_id: '1',
    rating: 4.7,
    review_count: 600
  },

  // Resources for Block-Laying and Concrete Works
  {
    id: '3',
    title: 'Concrete Basics Guide',
    description: 'An article explaining the fundamentals of concrete mixing and laying.',
    url: 'https://example.com/concrete-basics',
    type: 'article',
    level: 'beginner',
    is_free: true,
    track_id: '2',
    rating: 4.5,
    review_count: 450
  },
  {
    id: '4',
    title: 'Advanced Masonry Techniques',
    description: 'Comprehensive course on advanced block-laying and concrete work.',
    url: 'https://example.com/advanced-masonry',
    type: 'course',
    level: 'intermediate',
    is_free: false,
    track_id: '2',
    rating: 4.8,
    review_count: 720
  },

  // Resources for Steel Fabrication
  {
    id: '5',
    title: 'Welding 101 Video Series',
    description: 'Learn the basics of welding and metal fabrication through video tutorials.',
    url: 'https://example.com/welding-101',
    type: 'video',
    level: 'beginner',
    is_free: true,
    track_id: '3',
    rating: 4.7,
    review_count: 900
  },
  {
    id: '6',
    title: 'Steel Fabrication Masterclass',
    description: 'In-depth course on advanced steel fabrication techniques.',
    url: 'https://example.com/steel-fabrication-course',
    type: 'course',
    level: 'intermediate',
    is_free: false,
    track_id: '3',
    rating: 4.9,
    review_count: 650
  },

  // Resources for Tiling
  {
    id: '7',
    title: 'Tile Installation Guide',
    description: 'Step-by-step article on tile installation and design principles.',
    url: 'https://example.com/tile-installation-guide',
    type: 'article',
    level: 'beginner',
    is_free: true,
    track_id: '4',
    rating: 4.6,
    review_count: 500
  },

  // Resources for Aluminium Works
  {
    id: '8',
    title: 'Aluminium Fabrication Basics',
    description: 'Video tutorial introducing aluminium fabrication and installation.',
    url: 'https://example.com/aluminium-basics',
    type: 'video',
    level: 'beginner',
    is_free: true,
    track_id: '5',
    rating: 4.5,
    review_count: 400
  },

  // Resources for POP (Plaster of Paris) Design
  {
    id: '9',
    title: 'POP Design Techniques',
    description: 'Interactive guide on creating decorative ceiling and wall designs.',
    url: 'https://example.com/pop-design-interactive',
    type: 'interactive',
    level: 'beginner',
    is_free: false,
    track_id: '6',
    rating: 4.7,
    review_count: 300
  },

  // Resources for Painting and Decorating
  {
    id: '10',
    title: 'Painting Techniques Video',
    description: 'Video lessons on professional painting and finishing techniques.',
    url: 'https://example.com/painting-techniques',
    type: 'video',
    level: 'beginner',
    is_free: true,
    track_id: '7',
    rating: 4.6,
    review_count: 550
  },

  // Resources for Radio/Router Configuration
  {
    id: '11',
    title: 'Network Configuration Course',
    description: 'Learn to configure routers and network infrastructure.',
    url: 'https://example.com/network-config-course',
    type: 'course',
    level: 'beginner',
    is_free: false,
    track_id: '8',
    rating: 4.8,
    review_count: 700
  },

  // Resources for Drone Technology
  {
    id: '12',
    title: 'Drone Operations Guide',
    description: 'Article on drone operations and maintenance basics.',
    url: 'https://example.com/drone-operations',
    type: 'article',
    level: 'beginner',
    is_free: true,
    track_id: '9',
    rating: 4.6,
    review_count: 600
  },

  // Resources for Remote Control Systems
  {
    id: '13',
    title: 'Automation Systems Tutorial',
    description: 'Video tutorial on designing remote control and automation systems.',
    url: 'https://example.com/automation-tutorial',
    type: 'video',
    level: 'intermediate',
    is_free: false,
    track_id: '10',
    rating: 4.7,
    review_count: 450
  },

  // Resources for Artificial Intelligence
  {
    id: '14',
    title: 'AI Fundamentals Course',
    description: 'Explore AI concepts and machine learning with practical examples.',
    url: 'https://example.com/ai-fundamentals',
    type: 'course',
    level: 'advanced',
    is_free: false,
    track_id: '11',
    rating: 4.9,
    review_count: 950
  },

  // Resources for Plumbing-Pipe Fitting
  {
    id: '15',
    title: 'Plumbing Basics Video',
    description: 'Video series on plumbing techniques and pipe installation.',
    url: 'https://example.com/plumbing-basics',
    type: 'video',
    level: 'beginner',
    is_free: true,
    track_id: '12',
    rating: 4.6,
    review_count: 500
  },

  // Resources for Welding & Fabrications
  {
    id: '16',
    title: 'Advanced Welding Course',
    description: 'In-depth course on various welding and fabrication techniques.',
    url: 'https://example.com/advanced-welding',
    type: 'course',
    level: 'intermediate',
    is_free: false,
    track_id: '13',
    rating: 4.8,
    review_count: 700
  },

  // Resources for Metal Folding Technology
  {
    id: '17',
    title: 'Metal Folding Guide',
    description: 'Article on precision metal folding and forming techniques.',
    url: 'https://example.com/metal-folding-guide',
    type: 'article',
    level: 'intermediate',
    is_free: true,
    track_id: '14',
    rating: 4.5,
    review_count: 400
  },

  // Resources for Electrical Installations & Maintenance
  {
    id: '18',
    title: 'Electrical Safety Course',
    description: 'Learn to install and maintain electrical systems safely.',
    url: 'https://example.com/electrical-safety',
    type: 'course',
    level: 'intermediate',
    is_free: false,
    track_id: '15',
    rating: 4.7,
    review_count: 600
  },

  // Resources for Integrated Circuits
  {
    id: '19',
    title: 'Circuit Design Video',
    description: 'Video tutorial on designing and building electronic circuits.',
    url: 'https://example.com/circuit-design',
    type: 'video',
    level: 'advanced',
    is_free: true,
    track_id: '16',
    rating: 4.6,
    review_count: 550
  },

  // Resources for Exotic Furniture
  {
    id: '20',
    title: 'Furniture Crafting Course',
    description: 'Learn to create unique, high-quality furniture pieces.',
    url: 'https://example.com/furniture-crafting',
    type: 'course',
    level: 'intermediate',
    is_free: false,
    track_id: '17',
    rating: 4.7,
    review_count: 450
  },

  // Resources for Electronics & Related Equipment Maintenance
  {
    id: '21',
    title: 'Electronics Repair Guide',
    description: 'Article on maintaining and repairing electronic equipment.',
    url: 'https://example.com/electronics-repair',
    type: 'article',
    level: 'intermediate',
    is_free: true,
    track_id: '18',
    rating: 4.6,
    review_count: 500
  },

  // Resources for Automobile Maintenance (Mechanical)
  {
    id: '22',
    title: 'Auto Repair Basics',
    description: 'Video series on servicing and repairing vehicles.',
    url: 'https://example.com/auto-repair-basics',
    type: 'video',
    level: 'intermediate',
    is_free: true,
    track_id: '19',
    rating: 4.5,
    review_count: 400
  },

  // Resources for Visual Arts
  {
    id: '23',
    title: 'Creative Arts Course',
    description: 'Develop artistic skills and creative techniques.',
    url: 'https://example.com/creative-arts',
    type: 'course',
    level: 'beginner',
    is_free: false,
    track_id: '20',
    rating: 4.6,
    review_count: 350
  },

  // Resources for Computer Appreciation
  {
    id: '24',
    title: 'Computer Basics Course',
    description: 'Master computing fundamentals and software applications.',
    url: 'https://example.com/computer-basics',
    type: 'course',
    level: 'beginner',
    is_free: true,
    track_id: '21',
    rating: 4.7,
    review_count: 600
  },

  // Resources for Computer Graphics
  {
    id: '25',
    title: 'Graphic Design Tutorial',
    description: 'Video series on digital design and graphic tools.',
    url: 'https://example.com/graphic-design',
    type: 'video',
    level: 'intermediate',
    is_free: false,
    track_id: '22',
    rating: 4.8,
    review_count: 700
  },

  // Resources for Networking
  {
    id: '26',
    title: 'Networking Fundamentals',
    description: 'Article on computer networks, protocols, and security.',
    url: 'https://example.com/networking-fundamentals',
    type: 'article',
    level: 'intermediate',
    is_free: true,
    track_id: '23',
    rating: 4.6,
    review_count: 550
  },

  // Resources for Web Development
  {
    id: '27',
    title: 'Web Development Bootcamp',
    description: 'Comprehensive course on building responsive websites.',
    url: 'https://example.com/web-dev-bootcamp',
    type: 'course',
    level: 'intermediate',
    is_free: false,
    track_id: '24',
    rating: 4.9,
    review_count: 900
  },

  // Resources for Mobile App Development
  {
    id: '28',
    title: 'Mobile App Development Guide',
    description: 'Article on creating native and cross-platform apps.',
    url: 'https://example.com/mobile-app-guide',
    type: 'article',
    level: 'intermediate',
    is_free: true,
    track_id: '25',
    rating: 4.7,
    review_count: 650
  },

  // Resources for Desktop Application Development
  {
    id: '29',
    title: 'Desktop App Development Course',
    description: 'Learn to develop desktop applications with modern frameworks.',
    url: 'https://example.com/desktop-app-course',
    type: 'course',
    level: 'intermediate',
    is_free: false,
    track_id: '26',
    rating: 4.8,
    review_count: 700
  }
];

  const mockCommunities: Community[] = [
    {
      id: '1',
      name: 'Lagos Developers',
      description: 'A community of developers in Lagos sharing knowledge and opportunities.',
      location: 'Lagos, Nigeria',
      type: 'hybrid',
      website: 'https://example.com/lagos-developers',
      coordinates: {
        latitude: 6.5244,
        longitude: 3.3792
      },
      logo_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '2',
      name: 'Nigerian Women in Tech',
      description: 'Supporting and empowering women in the Nigerian tech ecosystem.',
      location: 'Nationwide',
      type: 'online',
      website: 'https://example.com/nigerian-women-in-tech',
      coordinates: {
        latitude: 9.0820,
        longitude: 8.6753
      },
      logo_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
    }
  ];

  const mockOpportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechNigeria',
      location: 'Lagos, Nigeria',
      is_remote: true,
      type: 'full-time',
      level: 'mid',
      description: 'We are looking for a skilled Frontend Developer to join our team and help build responsive web applications.',
      requirements: [
        'Proficiency in HTML, CSS, and JavaScript',
        'Experience with React.js',
        'Understanding of responsive design principles',
        'Knowledge of version control systems (Git)'
      ],
      salary_range: '₦250,000 - ₦400,000',
      application_url: 'https://example.com/apply/frontend-dev',
      deadline: '2025-06-30',
      posted_date: '2025-05-15',
      logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '2',
      title: 'Backend Developer Intern',
      company: 'FinTech Solutions',
      location: 'Abuja, Nigeria',
      is_remote: false,
      type: 'internship',
      level: 'entry',
      description: 'Join our internship program and gain hands-on experience in backend development with Node.js and MongoDB.',
      requirements: [
        'Basic knowledge of JavaScript',
        'Understanding of RESTful APIs',
        'Eagerness to learn and grow',
        'Currently enrolled in a computer science or related program'
      ],
      salary_range: '₦80,000 - ₦120,000',
      application_url: 'https://example.com/apply/backend-intern',
      deadline: '2025-06-15',
      posted_date: '2025-05-10',
      logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80'
    }
  ];

// ... (existing state declarations remain unchanged)

  const navigate = useNavigate();

  // Event handler for Apply Now
  const handleApplyNow = () => {
    navigate('/apply');
  };

  // Event handler for Explore Programs
  const handleExplorePrograms = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
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
  };


  // Use mock data if no data is fetched yet
  useEffect(() => {
    if (careerTracks.length === 0 && !isLoading) {
      setCareerTracks(mockCareerTracks);
    }
    if (resources.length === 0 && !isLoading) {
      setResources(mockResources);
    }
    if (communities.length === 0 && !isLoading) {
      setCommunities(mockCommunities);
    }
    if (opportunities.length === 0 && !isLoading) {
      setOpportunities(mockOpportunities);
    }
  }, [isLoading, careerTracks.length, resources.length, communities.length, opportunities.length]);

  return (
    <>
      <Helmet>
        <title>Career Development | FolioTech Institute</title>
        <meta name="description" content="Explore career paths, resources, communities, and job opportunities in the Nigerian tech ecosystem." />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-24 bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-blue-900 dark:to-indigo-900"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMxMC4yMzcgMCAxOC44LTguNDIgMTguOC0xOC44QzU0LjggMjUuMjIgNDYuMjM3IDE4IDM2IDE4eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjQgNDJjMC05Ljk0MSA4LjA1OS0xOCAxOC0xOHMxOCA4LjA1OSAxOCAxOC04LjA1OSAxOC0xOCAxOC0xOC04LjA1OS0xOC0xOHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Folio Tech Builds Your Tech Career in Nigeria
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Discover learning paths, resources, communities, and opportunities to accelerate your growth in the Nigerian tech ecosystem.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white/10 backdrop-blur-sm text-white placeholder-blue-100"
                placeholder="Search for career tracks, resources, or opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'tracks'
                  ? 'bg-white text-blue-700'
                  : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
              }`}
            >
              Career Tracks
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'bg-white text-blue-700'
                  : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
              }`}
            >
              Resource Hub
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'community'
                  ? 'bg-white text-blue-700'
                  : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
              }`}
            >
              Tech Communities
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'opportunities'
                  ? 'bg-white text-blue-700'
                  : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
              }`}
            >
              Opportunities
            </button>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" message="Loading career development data..." />
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Error loading data</h3>
                  <div className="mt-2 text-sm">{error}</div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Career Tracks Section */}
              {activeTab === 'tracks' && (
                <motion.div
                  ref={tracksRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={tracksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Career Track Explorer
                    </h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                      Discover structured learning paths to guide your tech career journey
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Experience Level
                        </label>
                        <select
                          id="level-filter"
                          value={levelFilter}
                          onChange={(e) => setLevelFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="demand-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Market Demand
                        </label>
                        <select
                          id="demand-filter"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Demand Levels</option>
                          <option value="high">High Demand</option>
                          <option value="medium">Medium Demand</option>
                          <option value="low">Low Demand</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="duration-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Learning Duration
                        </label>
                        <select
                          id="duration-filter"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">Any Duration</option>
                          <option value="short">0-6 months</option>
                          <option value="medium">6-12 months</option>
                          <option value="long">12+ months</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Career Tracks Grid */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTracks.length > 0 ? (
                      filteredTracks.map((track) => (
                        <div
                          key={track.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                  {getIconComponent(track.icon)}
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {track.title}
                                  </h3>
                                  <div className="mt-1 flex items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      track.level === 'beginner'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                        : track.level === 'intermediate'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                      {track.level.charAt(0).toUpperCase() + track.level.slice(1)}
                                    </span>
                                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      track.demand_level === 'high'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                        : track.demand_level === 'medium'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                      {track.demand_level.charAt(0).toUpperCase() + track.demand_level.slice(1)} Demand
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => setExpandedTrackId(expandedTrackId === track.id ? null : track.id)}
                                className="ml-4 flex-shrink-0 bg-white dark:bg-gray-700 rounded-full p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                              >
                                {expandedTrackId === track.id ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                              {track.description}
                            </p>
                            
                            <div className="mt-4 flex items-center justify-between text-sm">
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{track.duration}</span>
                              </div>
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span>{track.salary_range}</span>
                              </div>
                            </div>
                            
                            {expandedTrackId === track.id && (
                              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Required Tools & Technologies
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {track.tools.map((tool) => (
                                      <span
                                        key={tool}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Recommended Certifications
                                  </h4>
                                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    {track.certifications.map((cert) => (
                                      <li key={cert} className="flex items-center">
                                        <Award className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                        {cert}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="mt-4 flex justify-end">
                                  <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                                  >
                                    Start This Track
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-4">
                          <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No career tracks found</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Resources Section */}
              {activeTab === 'resources' && (
                <motion.div
                  ref={resourcesRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={resourcesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Resource Hub
                    </h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                      Curated learning materials to help you master tech skills
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <label htmlFor="track-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Career Track
                        </label>
                        <select
                          id="track-filter"
                          value={trackFilter}
                          onChange={(e) => setTrackFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Tracks</option>
                          {careerTracks.map((track) => (
                            <option key={track.id} value={track.id}>
                              {track.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="resource-level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Difficulty Level
                        </label>
                        <select
                          id="resource-level-filter"
                          value={levelFilter}
                          onChange={(e) => setLevelFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="resource-type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Content Type
                        </label>
                        <select
                          id="resource-type-filter"
                          value={resourceTypeFilter}
                          onChange={(e) => setResourceTypeFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Types</option>
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="course">Course</option>
                          <option value="book">Book</option>
                          <option value="interactive">Interactive</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="resource-free-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Price
                        </label>
                        <select
                          id="resource-free-filter"
                          value={resourceFreeFilter === null ? 'all' : resourceFreeFilter ? 'free' : 'paid'}
                          onChange={(e) => {
                            const value = e.target.value;
                            setResourceFreeFilter(value === 'all' ? null : value === 'free');
                          }}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Resources</option>
                          <option value="free">Free Only</option>
                          <option value="paid">Paid Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Resources Grid */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResources.length > 0 ? (
                      filteredResources.map((resource) => {
                        const isBookmarked = bookmarkedResources.includes(resource.id);
                        const track = careerTracks.find(t => t.id === resource.track_id);
                        
                        return (
                          <div
                            key={resource.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                          >
                            <div className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      resource.type === 'video'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                        : resource.type === 'article'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                        : resource.type === 'course'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                        : resource.type === 'book'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                    }`}>
                                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                    </span>
                                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      resource.level === 'beginner'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                        : resource.level === 'intermediate'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                      {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
                                    </span>
                                  </div>
                                  <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    {resource.title}
                                  </h3>
                                </div>
                                <button
                                  onClick={() => toggleBookmark(resource.id)}
                                  className={`flex-shrink-0 p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${
                                    isBookmarked
                                      ? 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300'
                                      : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                                  }`}
                                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                                >
                                  <Bookmark className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                              
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {resource.description}
                              </p>
                              
                              {track && (
                                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-medium text-gray-900 dark:text-white mr-1">Track:</span>
                                  {track.title}
                                </div>
                              )}
                              
                              <div className="mt-4 flex items-center">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(resource.rating)
                                          ? 'text-yellow-400'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                      fill={i < Math.floor(resource.rating) ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                  ({resource.review_count})
                                </span>
                                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                <span className={`text-sm ${
                                  resource.is_free
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {resource.is_free ? 'Free' : 'Paid'}
                                </span>
                              </div>
                              
                              <div className="mt-6">
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                                >
                                  Access Resource
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-4">
                          <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Communities Section */}
              {activeTab === 'community' && (
                <motion.div
                  ref={communitiesRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={communitiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Nigerian Tech Community Directory
                    </h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                      Connect with tech communities across Nigeria for networking, learning, and growth
                    </p>
                  </div>

                  {/* Map Placeholder */}
                  <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                    <div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Interactive map of tech communities coming soon
                      </p>
                    </div>
                  </div>

                  {/* Communities Grid */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCommunities.length > 0 ? (
                      filteredCommunities.map((community) => (
                        <div
                          key={community.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                        >
                          <div className="p-6">
                            <div className="flex items-center">
                              <img
                                src={community.logo_url}
                                alt={community.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                              <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {community.name}
                                </h3>
                                <div className="mt-1 flex items-center">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    community.type === 'physical'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                      : community.type === 'online'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                  }`}>
                                    {community.type.charAt(0).toUpperCase() + community.type.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                              {community.description}
                            </p>
                            
                            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="h-4 w-4 mr-1" />
                              {community.location}
                            </div>
                            
                            <div className="mt-6">
                              <a
                                href={community.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                              >
                                Visit Community
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-4">
                          <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No communities found</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Try adjusting your search to find what you're looking for.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Opportunities Section */}
              {activeTab === 'opportunities' && (
                <motion.div
                  ref={opportunitiesRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={opportunitiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Opportunities Board
                    </h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                      Discover job openings, internships, and mentorship opportunities in the Nigerian tech ecosystem
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <label htmlFor="opportunity-type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Opportunity Type
                        </label>
                        <select
                          id="opportunity-type-filter"
                          value={opportunityTypeFilter}
                          onChange={(e) => setOpportunityTypeFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Types</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="mentorship">Mentorship</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="opportunity-level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Experience Level
                        </label>
                        <select
                          id="opportunity-level-filter"
                          value={opportunityLevelFilter}
                          onChange={(e) => setOpportunityLevelFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Levels</option>
                          <option value="entry">Entry Level</option>
                          <option value="mid">Mid Level</option>
                          <option value="senior">Senior Level</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="opportunity-remote-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Remote Options
                        </label>
                        <select
                          id="opportunity-remote-filter"
                          value={opportunityRemoteFilter === null ? 'all' : opportunityRemoteFilter ? 'remote' : 'onsite'}
                          onChange={(e) => {
                            const value = e.target.value;
                            setOpportunityRemoteFilter(value === 'all' ? null : value === 'remote');
                          }}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Locations</option>
                          <option value="remote">Remote Only</option>
                          <option value="onsite">On-site Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Opportunities List */}
                  <div className="space-y-6">
                    {filteredOpportunities.length > 0 ? (
                      filteredOpportunities.map((opportunity) => {
                        const isSaved = savedOpportunities.includes(opportunity.id);
                        const daysRemaining = getDaysRemaining(opportunity.deadline);
                        
                        return (
                          <div
                            key={opportunity.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                          >
                            <div className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                  <img
                                    src={opportunity.logo_url}
                                    alt={opportunity.company}
                                    className="h-12 w-12 rounded-full object-cover"
                                  />
                                  <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {opportunity.title}
                                    </h3>
                                    <div className="mt-1">
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {opportunity.company}
                                      </span>
                                      <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {opportunity.location}
                                      </span>
                                      {opportunity.is_remote && (
                                        <>
                                          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                          <span className="text-green-600 dark:text-green-400">
                                            Remote
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {getOpportunityStatusBadge(opportunity.deadline)}
                                  <button
                                    onClick={() => toggleSaveOpportunity(opportunity.id)}
                                    className={`ml-2 p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${
                                      isSaved
                                        ? 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
                                        : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                                    }`}
                                    aria-label={isSaved ? 'Unsave opportunity' : 'Save opportunity'}
                                  >
                                    <Heart className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex flex-wrap gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  opportunity.type === 'full-time'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                    : opportunity.type === 'part-time'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : opportunity.type === 'contract'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                    : opportunity.type === 'internship'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
                                }`}>
                                  {opportunity.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </span>
                                
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  opportunity.level === 'entry'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : opportunity.level === 'mid'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                  {opportunity.level === 'entry' ? 'Entry Level' : opportunity.level === 'mid' ? 'Mid Level' : 'Senior Level'}
                                </span>
                                
                                {opportunity.salary_range && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    {opportunity.salary_range}
                                  </span>
                                )}
                              </div>
                              
                              <button
                                onClick={() => setExpandedOpportunityId(expandedOpportunityId === opportunity.id ? null : opportunity.id)}
                                className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                {expandedOpportunityId === opportunity.id ? 'Show Less' : 'Show More'}
                                {expandedOpportunityId === opportunity.id ? (
                                  <ChevronUp className="ml-1 h-4 w-4" />
                                ) : (
                                  <ChevronDown className="ml-1 h-4 w-4" />
                                )}
                              </button>
                              
                              {expandedOpportunityId === opportunity.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {opportunity.description}
                                  </p>
                                  
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                      Requirements
                                    </h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                      {opportunity.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="mt-4 flex items-center justify-between text-sm">
                                    <div className="text-gray-500 dark:text-gray-400">
                                      Posted: {formatDate(opportunity.posted_date)}
                                    </div>
                                    <div className={`${
                                      daysRemaining <= 3
                                        ? 'text-red-600 dark:text-red-400'
                                        : daysRemaining <= 7
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                      {daysRemaining > 0
                                        ? `Deadline: ${daysRemaining} days remaining`
                                        : 'Deadline passed'}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-6 flex justify-end">
                                    <a
                                      href={opportunity.application_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                                    >
                                      Apply Now
                                      <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-4">
                          <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No opportunities found</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>




      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Accelerate Your Tech Career?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join FolioTech Institute today and gain access to our comprehensive career development resources.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyNow}
              className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg text-white 
                bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                transition-colors md:py-4 md:text-lg md:px-10 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                dark:focus:ring-offset-gray-900 shadow-md"
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExplorePrograms}
              className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg 
                text-white-600 dark:text-blue-400 bg-transparent 
                border-2 border-blue-600 dark:border-blue-400 
                hover:bg-blue-50 dark:hover:bg-blue-900/20 
                transition-colors md:py-4 md:text-lg md:px-10
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                dark:focus:ring-offset-gray-900"
            >
              Explore Programs
            </motion.button>
          </div>
        </div>
      </section>
    </>
  );
}