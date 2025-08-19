"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const AdminDashboard: React.FC = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Erro ao sair: ' + error.message);
    } else {
      showSuccess('Você foi desconectado.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title="Painel Administrativo" showBackButton={false} />

      <div className="flex-grow container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Bem-vindo ao Painel de Gerenciamento</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <CardHeader>
              <CardTitle>Gerenciar Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Adicione, edite ou remova cursos.</p>
              <Link to="/admin/courses">
                <Button>Ir para Cursos</Button>
              </Link>
            </CardContent>
          </Card>
          {/* Você pode adicionar mais cards para outras funcionalidades administrativas aqui */}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" onClick={handleLogout} className="flex items-center mx-auto">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;