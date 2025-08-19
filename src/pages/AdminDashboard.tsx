import React from 'react';
import { useSupabase } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
              <Link to="/admin/courses">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Gerenciar Cursos</CardTitle>
                    <CardDescription>Adicione, edite ou remova cursos.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Acessar</Button>
                  </CardContent>
                </Card>
              </Link>
              {/* Futuros cards de gerenciamento podem ser adicionados aqui */}
            </div>
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