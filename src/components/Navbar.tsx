
import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { teacher, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-green-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-green-800">
            Welcome back, {teacher?.name}!
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <User className="w-4 h-4" />
            <span>{teacher?.email}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
