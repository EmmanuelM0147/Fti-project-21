import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { getApplicationById } from '../../lib/api/applications';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

interface ApplicationDetails {
  id: string;
  personal_info: {
    surname: string;
    firstName: string;
    middleName?: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    contactAddress: string;
    nationality: string;
    stateOfOrigin: string;
    religion?: string;
    disability: {
      hasDisability: boolean;
      details?: string;
    };
  };
  academic_background: {
    educationLevel: string;
    tertiaryEducation?: string;
    certificates: Array<{
      type: string;
      grade: string;
      year: string;
    }>;
  };
  program_selection: {
    program: string;
    course: string;
    startDate: string;
    studyMode: string;
    previousExperience?: string;
    careerGoals: string;
  };
  accommodation: {
    needsAccommodation: boolean;
    sponsorshipType: string;
    sponsorDetails?: {
      name: string;
      relationship: string;
      contact: string;
    };
  };
  referee: {
    name: string;
    address: string;
    phone: string;
    email: string;
    relationship: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

const statusIcons = {
  draft: Clock,
  pending: AlertCircle,
  under_review: FileText,
  approved: CheckCircle,
  rejected: XCircle
};

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err instanceof Error ? err.message : 'Failed to load application details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading application details..." />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !application) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6">
              <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
                <AlertCircle className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-semibold">Error Loading Application</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || 'Application not found or you do not have permission to view it.'}
              </p>
              <button
                onClick={() => navigate('/applications')}
                className="flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Applications
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const StatusIcon = statusIcons[application.status as keyof typeof statusIcons] || AlertCircle;

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Application Details | FolioTech Institute</title>
        <meta name="description" content="View your application details at FolioTech Institute" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/applications')}
              className="flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Applications
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Application Details
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Submitted on {formatDate(application.created_at)}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-3 py-1 inline-flex items-center text-sm font-medium rounded-full ${statusColors[application.status as keyof typeof statusColors]}`}>
                  <StatusIcon className="h-4 w-4 mr-1.5" />
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {application.personal_info.surname} {application.personal_info.firstName} {application.personal_info.middleName || ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.personal_info.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.personal_info.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="text-base text-gray-900 dark:text-white">{formatDate(application.personal_info.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                    <p className="text-base text-gray-900 dark:text-white capitalize">{application.personal_info.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nationality</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.personal_info.nationality}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Address</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.personal_info.contactAddress}</p>
                  </div>
                </div>
              </div>

              {/* Academic Background */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Academic Background
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Education Level</p>
                    <p className="text-base text-gray-900 dark:text-white capitalize">
                      {application.academic_background.educationLevel.replace('_', ' ')}
                    </p>
                  </div>
                  {application.academic_background.tertiaryEducation && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tertiary Education</p>
                      <p className="text-base text-gray-900 dark:text-white capitalize">
                        {application.academic_background.tertiaryEducation.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                </div>

                {application.academic_background.certificates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Certificates</p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <ul className="space-y-2">
                        {application.academic_background.certificates.map((cert, index) => (
                          cert.type && (
                            <li key={index} className="text-sm text-gray-900 dark:text-white">
                              <span className="font-medium">{cert.type}</span> - {cert.grade} ({cert.year})
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Program Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Program Selection
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Program</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.program_selection.program}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.program_selection.course}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                    <p className="text-base text-gray-900 dark:text-white">{formatDate(application.program_selection.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Mode</p>
                    <p className="text-base text-gray-900 dark:text-white capitalize">
                      {application.program_selection.studyMode.replace('-', ' ')}
                    </p>
                  </div>
                </div>

                {application.program_selection.careerGoals && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Career Goals</p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">
                      {application.program_selection.careerGoals}
                    </p>
                  </div>
                )}
              </div>

              {/* Accommodation */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Accommodation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Needs Accommodation</p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {application.accommodation.needsAccommodation ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sponsorship Type</p>
                    <p className="text-base text-gray-900 dark:text-white capitalize">
                      {application.accommodation.sponsorshipType.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {application.accommodation.sponsorDetails && (
                  <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Sponsor Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Name</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {application.accommodation.sponsorDetails.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Relationship</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {application.accommodation.sponsorDetails.relationship}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Contact</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {application.accommodation.sponsorDetails.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Referee */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Referee
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.referee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Relationship</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.referee.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.referee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.referee.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-base text-gray-900 dark:text-white">{application.referee.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}