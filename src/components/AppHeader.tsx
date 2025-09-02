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
  // O usuário pediu para remover o cabeçalho, então este componente não renderizará nada.
  return null;
};

export default AppHeader;