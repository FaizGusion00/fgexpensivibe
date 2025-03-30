
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  StickyNote, 
  DollarSign, 
  Settings, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
}

interface SidebarLink {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const Sidebar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  const links: SidebarLink[] = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/tasks", icon: <CheckSquare size={18} />, label: "Tasks" },
    { to: "/notes", icon: <StickyNote size={18} />, label: "Notes" },
    { to: "/expenses", icon: <DollarSign size={18} />, label: "Expenses" },
    { to: "/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <div className="bg-sidebar h-full flex flex-col overflow-y-auto pb-4">
      <div className="px-3 py-6">
        <h1 className="text-sidebar-foreground font-bold text-xl tracking-tight">
          expensivibe
        </h1>
      </div>
      <div className="space-y-1 px-3 flex-1">
        {links.map((link) => (
          <Link 
            key={link.to} 
            to={link.to}
            className={cn(
              "sidebar-link",
              location.pathname === link.to && "active"
            )}
          >
            {link.icon} 
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const MobileNav = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation();
  
  const links: SidebarLink[] = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/tasks", icon: <CheckSquare size={18} />, label: "Tasks" },
    { to: "/notes", icon: <StickyNote size={18} />, label: "Notes" },
    { to: "/expenses", icon: <DollarSign size={18} />, label: "Expenses" },
    { to: "/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-sidebar animate-slide-in-left overflow-y-auto">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-sidebar-foreground font-bold text-xl tracking-tight">
            expensivibe
          </h1>
          <button 
            onClick={onClose}
            className="text-sidebar-foreground rounded-full p-1 hover:bg-sidebar-accent"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-1 px-3">
          {links.map((link) => (
            <Link 
              key={link.to} 
              to={link.to}
              onClick={onClose}
              className={cn(
                "sidebar-link",
                location.pathname === link.to && "active"
              )}
            >
              {link.icon} 
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden md:block md:w-60 border-r">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center md:justify-end justify-between px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu />
          </Button>
          <div className="text-sm font-medium text-muted-foreground">
            Welcome to your productivity hub
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {mobileMenuOpen && <MobileNav onClose={() => setMobileMenuOpen(false)} />}
    </div>
  );
};

export default Layout;
