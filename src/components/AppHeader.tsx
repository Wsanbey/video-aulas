import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, BookOpen, User } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backPath?: string;
  rightContent?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBackButton = false, backPath = "/", rightContent }) => {
  const location = useLocation();

  return (
    <header className="flex items-center justify-between p-4 bg-[#0B354E] text-white border-b border-white/20 mb-4 shadow-md">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" asChild className="mr-2 text-white hover:bg-white/10">
            <Link to={backPath}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        )}
        <h1 className="text-xl font-bold">{title || "LGC Consultoria"}</h1>
      </div>
      <div className="flex items-center space-x-4">
        {rightContent}
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              location.pathname === "/"
                ? "bg-white/20 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/courses"
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              location.pathname === "/courses"
                ? "bg-white/20 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Cursos</span>
          </Link>
          <Link
            to="/profile"
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              location.pathname === "/profile"
                ? "bg-white/20 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;