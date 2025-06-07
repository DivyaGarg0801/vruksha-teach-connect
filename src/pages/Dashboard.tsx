
import React from 'react';
import { Upload, Activity, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { teacher, lessons } = useAuth();
  const navigate = useNavigate();

  const stats = {
    total: lessons.length,
    verified: lessons.filter(l => l.status === 'verified').length,
    pending: lessons.filter(l => l.status === 'pending').length,
    rejected: lessons.filter(l => l.status === 'rejected').length
  };

  const recentLessons = lessons.slice(-3).reverse();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {teacher?.name}!</h1>
        <p className="text-green-100 mb-6">Ready to share knowledge and inspire learning?</p>
        
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/upload')}
            className="bg-white text-green-600 hover:bg-green-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Content
          </Button>
          <Button
            onClick={() => navigate('/activities')}
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Activity className="w-4 h-4 mr-2" />
            View Activities
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Uploads</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.verified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-800">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLessons.length > 0 ? (
            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border border-green-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(lesson.status)}
                    <div>
                      <h4 className="font-medium text-green-800">{lesson.subject}</h4>
                      <p className="text-sm text-green-600">
                        {lesson.contentTypes.join(', ')} • {new Date(lesson.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                    {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-green-600">No activities yet. Start by uploading your first content!</p>
              <Button
                onClick={() => navigate('/upload')}
                className="mt-4 bg-green-500 hover:bg-green-600"
              >
                Upload Content
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
