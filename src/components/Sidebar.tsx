
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Upload, Activity, MessageCircle, TreePine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navItems = [
    {
      to: '/dashboard',
      icon: TreePine,
      label: 'Dashboard',
      exact: true
    },
    {
      to: '/upload',
      icon: Upload,
      label: 'Upload Content'
    },
    {
      to: '/activities',
      icon: Activity,
      label: 'Previous Activities'
    }
  ];

  return (
    <div className={cn(
      "bg-gradient-to-b from-green-50 to-green-100 border-r border-green-200 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <TreePine className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-green-800">Vruksha</h1>
              <p className="text-xs text-green-600">Teacher Portal</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-green-500 text-white shadow-md"
                  : "text-green-700 hover:bg-green-200",
                isCollapsed && "justify-center"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-green-200">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
        >
          <div className={cn("transition-transform duration-300", isCollapsed ? "rotate-180" : "")}>
            ←
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
