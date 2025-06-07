
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
      "bg-gradient-to-b from-warm-beige to-warm-beige/80 border-r border-border transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-earth-brown to-earth-brown/80 rounded-lg flex items-center justify-center">
            <TreePine className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-earth-brown">Vruksha</h1>
              <p className="text-xs text-muted-foreground">Teacher Portal</p>
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
                  ? "bg-earth-brown text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-accent",
                isCollapsed && "justify-center"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
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
