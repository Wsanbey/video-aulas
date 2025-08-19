import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBackButton = false, backPath }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1); // Go back one step in history
    }
  };

  return (
    <header className="flex items-center p-4 border-b bg-card text-card-foreground shadow-sm mb-4 rounded-lg">
      {showBackButton && (
        <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Voltar</span>
        </Button>
      )}
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
};

export default AppHeader;