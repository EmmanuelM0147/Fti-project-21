import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { getUserApplications } from '../../lib/api/applications';
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, Eye } from 'lucide-react';

interface Application {
  id: string;
  personal_info: {
    surname: string;
    firstName: string;
    middleName?: string;
    email: string;
  };
  program_selection: {
    program: string;
    course: string;
  };
  status: string;
  created_at: string;
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

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const data = await getUserApplications();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err instanceof Error ? err.message : 'Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleViewApplication = (id: string) => {
    navigate(`/applications/${id}`);
  };

  const handleNewApplication = () => {
    navigate('/apply');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>My Applications | FolioTech Institute</title>
        <meta name="description" content="View and manage your applications to FolioTech Institute" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Applications
            </h1>
            <button
              onClick={handleNewApplication}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              New Application
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" message="Loading your applications..." />
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No applications found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                You haven't submitted any applications yet.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleNewApplication}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Application
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Program
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {applications.map((application) => {
                      const StatusIcon = statusIcons[application.status as keyof typeof statusIcons] || AlertCircle;
                      return (
                        <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {application.personal_info.firstName} {application.personal_info.surname}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {application.personal_info.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{application.program_selection.program}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{application.program_selection.course}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(application.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[application.status as keyof typeof statusColors]}`}>
                              <StatusIcon className="h-4 w-4 mr-1" />
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewApplication(application.id)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-end"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}