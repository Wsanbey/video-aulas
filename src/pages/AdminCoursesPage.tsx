import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showSuccess, showError } from '@/utils/toast';

const formSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  description: z.string().optional(),
  image_url: z.string().url({ message: 'URL da imagem inválida.' }).optional().or(z.literal('')),
});

const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            title: values.title,
            description: values.description || null,
            image_url: values.image_url || null,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      showSuccess('Curso criado com sucesso!');
      form.reset(); // Limpa o formulário
      navigate('/admin'); // Volta para o painel administrativo
    } catch (error: any) {
      console.error('Erro ao criar curso:', error);
      showError(`Erro ao criar curso: ${error.message || 'Tente novamente.'}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title="Gerenciar Cursos" showBackButton={true} backPath="/admin" />
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Criar Novo Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Curso</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Introdução ao React" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Uma breve descrição do curso..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: https://exemplo.com/imagem.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Criando...' : 'Criar Curso'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCoursesPage;