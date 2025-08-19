import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
  rightContent?: React.ReactNode; // Nova prop
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBackButton = false, backPath = '/', rightContent }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-card text-card-foreground border-b mb-4 rounded-lg shadow-sm">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to={backPath}>
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {rightContent && <div>{rightContent}</div>} {/* Renderiza o conteúdo à direita se existir */}
    </header>
  );
};

export default AppHeader;