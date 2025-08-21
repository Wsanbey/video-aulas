import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
  rightContent?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBackButton = false, backPath = '/', rightContent }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-[#0B354E] text-white border-b border-white/20 mb-4 shadow-md">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" asChild className="mr-2 text-white hover:bg-white/10">
            <Link to={backPath}>
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
        )}
        <h1 className="text-2xl font-bold">LGC Cursos {title && ` - ${title}`}</h1>
      </div>
      {rightContent && <div>{rightContent}</div>}
    </header>
  );
};

export default AppHeader;