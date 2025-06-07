
import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, Video, Headphones, Image, FileType, Presentation, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FilePreview {
  file: File;
  type: string;
  url: string;
}

const Upload: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isNewSubject, setIsNewSubject] = useState(true);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { uploadContent } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const contentTypes = [
    { id: 'text', label: 'Text Documents', icon: FileText, accept: '.txt,.doc,.docx' },
    { id: 'video', label: 'Video Files', icon: Video, accept: '.mp4,.avi,.mov,.wmv' },
    { id: 'audio', label: 'Audio Files', icon: Headphones, accept: '.mp3,.wav,.aac' },
    { id: 'image', label: 'Images', icon: Image, accept: '.jpg,.jpeg,.png,.gif' },
    { id: 'pdf', label: 'PDF Documents', icon: FileType, accept: '.pdf' },
    { id: 'presentation', label: 'Presentations', icon: Presentation, accept: '.ppt,.pptx' }
  ];

  const handleTypeSelection = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const uploadedFiles = Array.from(e.target.files || []);
    
    uploadedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setFiles(prev => [...prev, { file, type, url }]);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    if (!subject.trim() || files.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a subject and upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const lessonData = {
        subject: subject.trim(),
        description: description.trim(),
        contentTypes: selectedTypes,
        files: files.map(f => ({
          type: f.type,
          name: f.file.name,
          url: f.url,
          size: f.file.size
        }))
      };

      const result = await uploadContent(lessonData);

      if (result.success) {
        toast({
          title: "Content uploaded successfully!",
          description: "Your content has been submitted and is being processed.",
        });
        navigate('/activities');
      } else {
        toast({
          title: "Upload rejected",
          description: result.error || "Content validation failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Subject Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-green-700 font-medium">Choose an option:</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-subject"
                      checked={isNewSubject}
                      onCheckedChange={() => setIsNewSubject(true)}
                    />
                    <Label htmlFor="new-subject">Create new subject</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="existing-subject"
                      checked={!isNewSubject}
                      onCheckedChange={() => setIsNewSubject(false)}
                    />
                    <Label htmlFor="existing-subject">Continue existing subject</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-green-700 font-medium">
                  {isNewSubject ? "Subject Name" : "Select Subject"}
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={isNewSubject ? "Enter subject name (e.g., Mathematics)" : "Choose from existing subjects"}
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-green-700 font-medium">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the content you're uploading..."
                  className="border-green-200 focus:border-green-500"
                  rows={3}
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!subject.trim()}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Continue to Content Types
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Select Content Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleTypeSelection(type.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTypes.includes(type.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-green-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <type.icon className={`w-6 h-6 ${
                        selectedTypes.includes(type.id) ? 'text-green-600' : 'text-green-500'
                      }`} />
                      <span className={`font-medium ${
                        selectedTypes.includes(type.id) ? 'text-green-800' : 'text-green-700'
                      }`}>
                        {type.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-green-300 text-green-700"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={selectedTypes.length === 0}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  Continue to Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Upload Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedTypes.map((typeId) => {
                const type = contentTypes.find(t => t.id === typeId)!;
                return (
                  <div key={typeId} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <type.icon className="w-5 h-5 text-green-600" />
                      <Label className="text-green-700 font-medium">{type.label}</Label>
                    </div>
                    <Input
                      type="file"
                      accept={type.accept}
                      multiple
                      onChange={(e) => handleFileUpload(e, typeId)}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                );
              })}

              {files.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-green-700 font-medium">File Previews</Label>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                            {React.createElement(contentTypes.find(t => t.id === file.type)!.icon, {
                              className: "w-4 h-4 text-white"
                            })}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">{file.file.name}</p>
                            <p className="text-xs text-green-600">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Content Validation</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      All uploaded content will be automatically scanned for appropriateness and quality before approval.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-green-300 text-green-700"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={files.length === 0 || isUploading}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  {isUploading ? "Uploading..." : "Upload Content"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Upload Content</h1>
        <p className="text-green-600">Share your educational materials with students</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= stepNumber
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-500'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        <div className="w-full bg-green-100 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {renderStepContent()}
    </div>
  );
};

export default Upload;
