import React from 'react';
import { useSupabase } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';

const AdminDashboard: React.FC = () => {
  const { supabase, session } = useSupabase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title="Painel Administrativo" showBackButton={false} />
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Painel Administrativo!</h1>
        {session ? (
          <>
            <p className="text-lg mb-6">Você está logado como: {session.user?.email}</p>
            <Button onClick={handleLogout} variant="destructive">Sair</Button>
          </>
        ) : (
          <p className="text-lg mb-6">Carregando informações do usuário...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;