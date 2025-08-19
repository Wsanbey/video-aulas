import React from 'react';
import { Link } from 'react-router-dom';
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
    <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground border-b border-primary-foreground/20 mb-4 rounded-lg shadow-md">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" asChild className="mr-2 text-primary-foreground hover:bg-primary-foreground/10">
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