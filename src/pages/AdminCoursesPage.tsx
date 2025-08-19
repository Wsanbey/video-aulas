import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { showSuccess, showError } from '@/utils/toast';
import { Course } from '@/types/db';
import { Link } from 'react-router-dom'; // Importar Link

const formSchema = z.object({
  id: z.string().optional(), // Optional for create, required for update
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  description: z.string().optional(),
  image_url: z.string().url({ message: 'URL da imagem inválida.' }).optional().or(z.literal('')),
});

type CourseFormValues = z.infer<typeof formSchema>;

const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
    },
  });

  // Fetch courses
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Mutation for creating/updating courses
  const upsertCourseMutation = useMutation({
    mutationFn: async (courseData: CourseFormValues) => {
      if (courseData.id) {
        // Update existing course
        const { id, ...updateData } = courseData;
        const { data, error } = await supabase
          .from('courses')
          .update(updateData)
          .eq('id', id)
          .select();
        if (error) throw error;
        return data;
      } else {
        // Create new course
        const { data, error } = await supabase
          .from('courses')
          .insert([
            {
              title: courseData.title,
              description: courseData.description || null,
              image_url: courseData.image_url || null,
            },
          ])
          .select();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      showSuccess(editingCourse ? 'Curso atualizado com sucesso!' : 'Curso criado com sucesso!');
      form.reset();
      setEditingCourse(null);
    },
    onError: (err: any) => {
      showError(`Erro: ${err.message || 'Tente novamente.'}`);
    },
  });

  // Mutation for deleting courses
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      showSuccess('Curso excluído com sucesso!');
    },
    onError: (err: any) => {
      showError(`Erro ao excluir curso: ${err.message || 'Tente novamente.'}`);
    },
  });

  // Handle form submission
  const onSubmit = (values: CourseFormValues) => {
    upsertCourseMutation.mutate(values);
  };

  // Handle edit button click
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.reset({
      id: course.id,
      title: course.title,
      description: course.description || '',
      image_url: course.image_url || '',
    });
  };

  // Handle "Novo Curso" button click
  const handleNewCourse = () => {
    setEditingCourse(null);
    form.reset({
      title: '',
      description: '',
      image_url: '',
    });
  };

  // Handle delete action
  const handleDelete = (courseId: string) => {
    deleteCourseMutation.mutate(courseId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Carregando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-destructive">Erro ao carregar cursos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title="Gerenciar Cursos" showBackButton={true} backPath="/admin" />
      <div className="flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-4xl mb-8">
          <CardHeader>
            <CardTitle>{editingCourse ? 'Editar Curso' : 'Criar Novo Curso'}</CardTitle>
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
                <div className="flex gap-2">
                  <Button type="submit" className="flex-grow" disabled={form.formState.isSubmitting || upsertCourseMutation.isPending}>
                    {upsertCourseMutation.isPending ? 'Salvando...' : (editingCourse ? 'Atualizar Curso' : 'Criar Curso')}
                  </Button>
                  {editingCourse && (
                    <Button type="button" variant="outline" onClick={handleNewCourse}>
                      Novo Curso
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Cursos Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {courses && courses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.description || 'N/A'}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                            Editar
                          </Button>
                          <Link to={`/admin/courses/${course.id}/lessons`}>
                            <Button variant="secondary" size="sm">
                              Gerenciar Aulas
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá permanentemente o curso "{course.title}" e todas as suas aulas associadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(course.id)} disabled={deleteCourseMutation.isPending}>
                                  {deleteCourseMutation.isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Nenhum curso encontrado. Crie um novo acima!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCoursesPage;