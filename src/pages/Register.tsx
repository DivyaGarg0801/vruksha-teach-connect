
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, User, Mail, Phone, Lock, Building, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organizationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organizationCode: formData.organizationCode,
        password: formData.password
      });
      
      if (success) {
        toast({
          title: "Registration successful!",
          description: "Your account has been created. Please sign in.",
        });
        navigate('/login');
      } else {
        toast({
          title: "Registration failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TreePine className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Join Vruksha</h1>
            <p className="text-green-600">Create your teacher account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-green-700 font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-green-500" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-green-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="teacher@school.com"
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-green-700 font-medium">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-green-500" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationCode" className="text-green-700 font-medium">Organization Code</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-5 h-5 text-green-500" />
                <Input
                  id="organizationCode"
                  name="organizationCode"
                  type="text"
                  value={formData.organizationCode}
                  onChange={handleChange}
                  placeholder="SCH001"
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-700 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-green-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10 border-green-200 focus:border-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-green-500 hover:text-green-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-700 font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-green-500" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-green-600">
              Already have an account?{" "}
              <Link to="/login" className="text-green-700 font-medium hover:text-green-800 underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
