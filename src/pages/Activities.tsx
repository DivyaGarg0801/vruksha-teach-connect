
import React from 'react';
import { CheckCircle, XCircle, Clock, Eye, Download, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Activities: React.FC = () => {
  const { lessons } = useAuth();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const sortedLessons = [...lessons].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Previous Activities</h1>
        <p className="text-green-600">Track your uploaded content and its status</p>
      </div>

      {sortedLessons.length > 0 ? (
        <div className="space-y-6">
          {sortedLessons.map((lesson) => (
            <Card key={lesson.id} className="border-green-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(lesson.status)}
                    <div>
                      <CardTitle className="text-green-800 text-xl">{lesson.subject}</CardTitle>
                      <p className="text-green-600 mt-1">
                        Uploaded on {new Date(lesson.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(lesson.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {lesson.description && (
                  <p className="text-green-700">{lesson.description}</p>
                )}

                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-2">Content Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lesson.contentTypes.map((type) => (
                      <Badge key={type} variant="outline" className="border-green-300 text-green-700">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-3">Uploaded Files ({lesson.files.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lesson.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {file.type.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">{file.name}</p>
                            <p className="text-xs text-green-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-800">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-800">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {lesson.status === 'rejected' && lesson.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                        <p className="text-sm text-red-700 mt-1">{lesson.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {lesson.status === 'verified' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-700">
                        Content has been verified and is now available to students.
                      </p>
                    </div>
                  </div>
                )}

                {lesson.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-700">
                        Content is being reviewed and will be available once approved.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">No Activities Yet</h3>
            <p className="text-green-600 mb-6">
              Start sharing your knowledge by uploading your first educational content.
            </p>
            <Button 
              onClick={() => window.location.href = '/upload'}
              className="bg-green-500 hover:bg-green-600"
            >
              Upload Your First Content
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Activities;
