import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { showSuccess, showError } from '@/utils/toast';
import { Lesson, Course } from '@/types/db';
import { Textarea } from '@/components/ui/textarea'; // Importação adicionada

const formSchema = z.object({
  id: z.string().optional(), // Optional for create, required for update
  title: z.string().min(1, { message: 'O título da aula é obrigatório.' }),
  youtube_video_id: z.string().min(1, { message: 'O ID do vídeo do YouTube é obrigatório.' }),
  // download_files agora é uma string no formulário, será parseado antes de enviar ao DB
  download_files: z.string().optional(),
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
      youtube_video_id: '',
      download_files: '', // Default para string vazia
    },
  });

  // Fetch course details to display title
  const { data: course, isLoading: isLoadingCourse, error: courseError } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      // Selecionando todas as colunas para corresponder à interface Course
      const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  // Fetch lessons for the current course
  const { data: lessons, isLoading: isLoadingLessons, error: lessonsError } = useQuery<Lesson[]>({
    queryKey: ["adminLessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  // Mutation for creating/updating lessons
  const upsertLessonMutation = useMutation({
    mutationFn: async (lessonData: LessonFormValues) => {
      if (!courseId) throw new Error("Course ID is missing.");

      let parsedDownloadFiles = null;
      if (lessonData.download_files) {
        try {
          parsedDownloadFiles = JSON.parse(lessonData.download_files);
          if (!Array.isArray(parsedDownloadFiles) || !parsedDownloadFiles.every(item => typeof item === 'object' && item !== null && 'name' in item && 'url' in item)) {
            throw new Error("Formato de arquivos para download inválido. Deve ser um array de objetos {name: string, url: string}.");
          }
        } catch (e: any) {
          throw new Error(`Erro ao parsear arquivos para download: ${e.message}`);
        }
      }

      const payload = {
        title: lessonData.title,
        youtube_video_id: lessonData.youtube_video_id,
        download_files: parsedDownloadFiles, // Usando o valor parseado
        course_id: courseId,
      };

      if (lessonData.id) {
        // Update existing lesson
        const { data, error } = await supabase
          .from('lessons')
          .update(payload)
          .eq('id', lessonData.id)
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
      youtube_video_id: lesson.youtube_video_id,
      // Stringify o array de objetos para exibir no Textarea
      download_files: lesson.download_files ? JSON.stringify(lesson.download_files, null, 2) : '',
    });
  };

  // Handle "Nova Aula" button click
  const handleNewLesson = () => {
    setEditingLesson(null);
    form.reset({
      title: '',
      youtube_video_id: '',
      download_files: '', // Reset para string vazia
    });
  };

  // Handle delete action
  const handleDelete = (lessonId: string) => {
    deleteLessonMutation.mutate(lessonId);
  };

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Carregando aulas...</p>
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-destructive">Erro ao carregar curso: {courseError.message}</p>
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-destructive">Erro ao carregar aulas: {lessonsError.message}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Curso não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title={`Aulas do Curso: ${course.title}`} showBackButton={true} backPath="/admin/courses" />
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
                        <Input placeholder="Ex: Introdução ao JavaScript" {...field} />
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
                <FormField
                  control={form.control}
                  name="download_files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arquivos para Download (JSON Array)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Ex: [{"name": "Slide 1", "url": "https://example.com/slide1.pdf"}]'
                          {...field}
                          value={typeof field.value === 'string' ? field.value : JSON.stringify(field.value, null, 2)}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <TableHead>ID do Vídeo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
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
              <p className="text-center text-muted-foreground">Nenhuma aula encontrada para este curso. Crie uma nova acima!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLessonsPage;