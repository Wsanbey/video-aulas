import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Lesson } from '@/types/db';
import { PlusCircle, XCircle } from 'lucide-react';

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  description: z.string().optional(), // Adicionado campo de descrição
  youtube_video_id: z.string().min(1, { message: 'O ID do vídeo do YouTube é obrigatório.' }),
  download_files: z.array(z.object({
    name: z.string().min(1, { message: 'Nome do arquivo é obrigatório.' }),
    url: z.string().url({ message: 'URL do arquivo inválida.' }),
  })).optional(),
});

type LessonFormValues = z.infer<typeof formSchema>;

const AdminLessonsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '', // Valor padrão para descrição
      youtube_video_id: '',
      download_files: [],
    },
  });

  // Fetch lessons for the current course
  const { data: lessons, isLoading, error } = useQuery<Lesson[]>({
    queryKey: ["adminLessons", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is missing.");
      const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  // Mutation for creating/updating lessons
  const upsertLessonMutation = useMutation({
    mutationFn: async (lessonData: LessonFormValues) => {
      const payload = {
        course_id: courseId,
        title: lessonData.title,
        description: lessonData.description || null, // Salva a descrição
        youtube_video_id: lessonData.youtube_video_id,
        download_files: lessonData.download_files || [],
      };

      if (lessonData.id) {
        // Update existing lesson
        const { id } = lessonData;
        const { data, error } = await supabase
          .from('lessons')
          .update(payload)
          .eq('id', id)
          .select();
        if (error) throw error;
        return data;
      } else {
        // Create new lesson
        const { data, error } = await supabase
          .from('lessons')
          .insert([payload])
          .select();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLessons", courseId] });
      showSuccess(editingLesson ? 'Aula atualizada com sucesso!' : 'Aula criada com sucesso!');
      form.reset();
      setEditingLesson(null);
    },
    onError: (err: any) => {
      showError(`Erro: ${err.message || 'Tente novamente.'}`);
    },
  });

  // Mutation for deleting lessons
  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLessons", courseId] });
      showSuccess('Aula excluída com sucesso!');
    },
    onError: (err: any) => {
      showError(`Erro ao excluir aula: ${err.message || 'Tente novamente.'}`);
    },
  });

  // Handle form submission
  const onSubmit = (values: LessonFormValues) => {
    upsertLessonMutation.mutate(values);
  };

  // Handle edit button click
  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    form.reset({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '', // Popula o campo de descrição
      youtube_video_id: lesson.youtube_video_id,
      download_files: lesson.download_files || [],
    });
  };

  // Handle "Nova Aula" button click
  const handleNewLesson = () => {
    setEditingLesson(null);
    form.reset({
      title: '',
      description: '',
      youtube_video_id: '',
      download_files: [],
    });
  };

  // Handle delete action
  const handleDelete = (lessonId: string) => {
    deleteLessonMutation.mutate(lessonId);
  };

  // Handle adding a new download file field
  const addDownloadFile = () => {
    const currentFiles = form.getValues('download_files') || [];
    form.setValue('download_files', [...currentFiles, { name: '', url: '' }]);
  };

  // Handle removing a download file field
  const removeDownloadFile = (index: number) => {
    const currentFiles = form.getValues('download_files') || [];
    form.setValue('download_files', currentFiles.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Carregando aulas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-destructive">Erro ao carregar aulas: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title={`Gerenciar Aulas do Curso ${courseId}`} showBackButton={true} backPath="/admin/courses" />
      <div className="flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-4xl mb-8">
          <CardHeader>
            <CardTitle>{editingLesson ? 'Editar Aula' : 'Criar Nova Aula'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Aula</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Fundamentos do JavaScript" {...field} />
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
                      <FormLabel>Descrição da Aula</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Uma breve descrição da aula..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtube_video_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Vídeo do YouTube</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: dQw4w9WgXcQ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel>Arquivos para Download</FormLabel>
                  {form.watch('download_files')?.map((file, index) => (
                    <div key={index} className="flex items-end gap-2 mb-2">
                      <FormField
                        control={form.control}
                        name={`download_files.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel className={index === 0 ? '' : 'sr-only'}>Nome do Arquivo</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do arquivo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`download_files.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel className={index === 0 ? '' : 'sr-only'}>URL do Arquivo</FormLabel>
                            <FormControl>
                              <Input placeholder="URL do arquivo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeDownloadFile(index)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addDownloadFile} className="mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Arquivo
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-grow" disabled={form.formState.isSubmitting || upsertLessonMutation.isPending}>
                    {upsertLessonMutation.isPending ? 'Salvando...' : (editingLesson ? 'Atualizar Aula' : 'Criar Aula')}
                  </Button>
                  {editingLesson && (
                    <Button type="button" variant="outline" onClick={handleNewLesson}>
                      Nova Aula
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Aulas Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {lessons && lessons.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>ID do YouTube</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
                        <TableCell>{lesson.description || 'N/A'}</TableCell>
                        <TableCell>{lesson.youtube_video_id}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(lesson)}>
                            Editar
                          </Button>
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
                                  Esta ação não pode ser desfeita. Isso excluirá permanentemente a aula "{lesson.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(lesson.id)} disabled={deleteLessonMutation.isPending}>
                                  {deleteLessonMutation.isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
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
              <p className="text-center text-muted-foreground">Nenhuma aula encontrada. Crie uma nova acima!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLessonsPage;