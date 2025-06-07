
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  organizationCode: string;
  createdAt: string;
}

interface Lesson {
  id: string;
  teacherId: string;
  subject: string;
  contentTypes: string[];
  files: Array<{
    type: string;
    name: string;
    url: string;
    size: number;
  }>;
  description: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  rejectionReason?: string;
}

interface AuthContextType {
  teacher: Teacher | null;
  lessons: Lesson[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Omit<Teacher, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  uploadContent: (lessonData: Omit<Lesson, 'id' | 'teacherId' | 'createdAt' | 'status'>) => Promise<{ success: boolean; lesson?: Lesson; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock ML content validation
const validateContent = (files: any[]): { isValid: boolean; reason?: string } => {
  // Simulate random validation (80% success rate)
  const isValid = Math.random() > 0.2;
  
  if (!isValid) {
    const reasons = [
      'Inappropriate content detected in uploaded files',
      'Content quality does not meet educational standards',
      'Sensitive information found in the material'
    ];
    return { isValid: false, reason: reasons[Math.floor(Math.random() * reasons.length)] };
  }
  
  return { isValid: true };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data
    const storedTeacher = localStorage.getItem('vruksha_teacher');
    const storedLessons = localStorage.getItem('vruksha_lessons');
    
    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
      setIsAuthenticated(true);
    }
    
    if (storedLessons) {
      setLessons(JSON.parse(storedLessons));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check against registered teachers
    const teachers = JSON.parse(localStorage.getItem('vruksha_teachers') || '[]');
    const foundTeacher = teachers.find((t: any) => t.email === email && t.password === password);
    
    if (foundTeacher) {
      const { password: _, ...teacherWithoutPassword } = foundTeacher;
      setTeacher(teacherWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('vruksha_teacher', JSON.stringify(teacherWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (data: Omit<Teacher, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    // Mock registration
    const teachers = JSON.parse(localStorage.getItem('vruksha_teachers') || '[]');
    
    // Check if email already exists
    if (teachers.find((t: any) => t.email === data.email)) {
      return false;
    }
    
    const newTeacher = {
      ...data,
      id: `teacher_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    teachers.push(newTeacher);
    localStorage.setItem('vruksha_teachers', JSON.stringify(teachers));
    
    return true;
  };

  const logout = () => {
    setTeacher(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vruksha_teacher');
  };

  const uploadContent = async (lessonData: Omit<Lesson, 'id' | 'teacherId' | 'createdAt' | 'status'>): Promise<{ success: boolean; lesson?: Lesson; error?: string }> => {
    if (!teacher) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate content using mock ML
    const validation = validateContent(lessonData.files);
    
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson_${Date.now()}`,
      teacherId: teacher.id,
      createdAt: new Date().toISOString(),
      status: validation.isValid ? 'verified' : 'rejected',
      rejectionReason: validation.reason
    };

    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    localStorage.setItem('vruksha_lessons', JSON.stringify(updatedLessons));

    if (!validation.isValid) {
      return { success: false, error: validation.reason };
    }

    return { success: true, lesson: newLesson };
  };

  return (
    <AuthContext.Provider value={{
      teacher,
      lessons: lessons.filter(l => l.teacherId === teacher?.id),
      isAuthenticated,
      login,
      register,
      logout,
      uploadContent
    }}>
      {children}
    </AuthContext.Provider>
  );
};
