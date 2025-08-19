import React, { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import { UploadCloud, XCircle, ArrowUp, ArrowDown } from 'lucide-react'; // Novas importações para ícones

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  description: z.string().optional(),
  image_url: z.string().optional(), // Agora opcional, pois será tratado pelo upload ou URL manual
  order: z.number().optional().nullable(), // Adicionado campo de ordem
});

type CourseFormValues = z.infer<typeof formSchema>;

const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
      order: null,
    },
  });

  // Efeito para definir a pré-visualização da imagem ao editar um curso existente
  useEffect(() => {
    if (editingCourse?.image_url) {
      setImageUrlPreview(editingCourse.image_url);
      form.setValue('image_url', editingCourse.image_url);
    } else {
      setImageUrlPreview(null);
      form.setValue('image_url', '');
    }
    setSelectedFile(null); // Limpa qualquer arquivo selecionado ao mudar de curso ou criar novo
  }, [editingCourse, form]);

  // Lida com a seleção de arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setImageUrlPreview(URL.createObjectURL(file)); // Cria uma URL local para pré-visualização
      form.setValue('image_url', ''); // Limpa o campo de URL se um arquivo for selecionado
    } else {
      setSelectedFile(null);
      if (!editingCourse?.image_url) {
        setImageUrlPreview(null);
      }
    }
  };

  // Lida com a remoção da imagem (tanto arquivo selecionado quanto URL existente)
  const handleClearImage = () => {
    setSelectedFile(null);
    setImageUrlPreview(null);
    form.setValue('image_url', '');
    if (editingCourse) {
      setEditingCourse(prev => prev ? { ...prev, image_url: null } : null);
    }
  };

  // Fetch courses, ordered by the new 'order' column
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Mutation for creating/updating courses
  const upsertCourseMutation = useMutation({
    mutationFn: async (courseData: CourseFormValues) => {
      let finalImageUrl: string | null = null;

      if (selectedFile) {
        // Upload new file to Supabase Storage
        const fileExtension = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const { data, error: uploadError } = await supabase.storage
          .from('course_images') // Usar o bucket 'course_images'
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
        }

        // Get public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('course_images')
          .getPublicUrl(fileName);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error('Não foi possível obter a URL pública da imagem.');
        }
        finalImageUrl = publicUrlData.publicUrl;
      } else {
        // If no new file, use the URL from the form field (could be existing or manually pasted)
        finalImageUrl = courseData.image_url || null;
      }

      const payload: Partial<Course> = {
        title: courseData.title,
        description: courseData.description || null,
        image_url: finalImageUrl, // Usar a URL final determinada
      };

      if (courseData.id) {
        // Update existing course
        const { id } = courseData;
        const { data, error } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', id)
          .select();
        if (error) throw error;
        return data;
      } else {
        // Create new course
        // Determine the next order value
        const maxOrder = courses ? Math.max(...courses.map(c => c.order || 0)) : 0;
        payload.order = maxOrder + 1;

        const { data, error } = await supabase
          .from('courses')
          .insert([payload])
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
      setSelectedFile(null);
      setImageUrlPreview(null);
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

  // Mutation for reordering courses
  const moveCourseMutation = useMutation({
    mutationFn: async ({ courseId, direction }: { courseId: string; direction: 'up' | 'down' }) => {
      const currentCourses = queryClient.getQueryData<Course[]>(["adminCourses"]);
      if (!currentCourses) throw new Error("Cursos não carregados para reordenar.");

      const courseIndex = currentCourses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) throw new Error("Curso não encontrado.");

      const courseToMove = currentCourses[courseIndex];
      let targetCourse: Course | undefined;

      if (direction === 'up' && courseIndex > 0) {
        targetCourse = currentCourses[courseIndex - 1];
      } else if (direction === 'down' && courseIndex < currentCourses.length - 1) {
        targetCourse = currentCourses[courseIndex + 1];
      }

      if (!targetCourse) return; // Cannot move further up or down

      // Swap the order values
      const { error: error1 } = await supabase
        .from('courses')
        .update({ order: targetCourse.order })
        .eq('id', courseToMove.id);
      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('courses')
        .update({ order: courseToMove.order })
        .eq('id', targetCourse.id);
      if (error2) throw error2;

      showSuccess('Ordem do curso atualizada!');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
    },
    onError: (err: any) => {
      showError(`Erro ao reordenar curso: ${err.message || 'Tente novamente.'}`);
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
      image_url: course.image_url || '', // Popula o campo do formulário com a URL existente
      order: course.order || null,
    });
    setImageUrlPreview(course.image_url || null); // Define a pré-visualização para a imagem existente
    setSelectedFile(null); // Limpa qualquer arquivo previamente selecionado
  };

  // Handle "Novo Curso" button click
  const handleNewCourse = () => {
    setEditingCourse(null);
    form.reset({
      title: '',
      description: '',
      image_url: '',
      order: null,
    });
    setSelectedFile(null);
    setImageUrlPreview(null);
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
                      <FormLabel>Imagem do Curso</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          {imageUrlPreview && (
                            <div className="relative w-48 h-32 rounded-md overflow-hidden border">
                              <img src={imageUrlPreview} alt="Preview" className="w-full h-full object-cover" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                                onClick={handleClearImage}
                              >
                                <XCircle className="h-5 w-5" />
                                <span className="sr-only">Remover Imagem</span>
                              </Button>
                            </div>
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-primary file:text-primary-foreground
                              hover:file:bg-primary/90"
                          />
                          <p className="text-sm text-muted-foreground text-center">OU</p>
                          <Input
                            placeholder="Cole uma URL de imagem aqui (se não for fazer upload)"
                            value={field.value || ''} // Garante que o campo é controlado
                            onChange={(e) => {
                              field.onChange(e);
                              setImageUrlPreview(e.target.value); // Atualiza a pré-visualização se uma URL for digitada
                              setSelectedFile(null); // Limpa o arquivo selecionado se estiver digitando uma URL
                            }}
                          />
                        </div>
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
                      <TableHead>Ordem</TableHead> {/* Nova coluna para ordem */}
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course, index) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.order || 'N/A'}</TableCell> {/* Exibe a ordem */}
                        <TableCell>{course.description || 'N/A'}</TableCell>
                        <TableCell className="flex gap-2 items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveCourseMutation.mutate({ courseId: course.id, direction: 'up' })}
                            disabled={index === 0 || moveCourseMutation.isPending}
                          >
                            <ArrowUp className="h-4 w-4" />
                            <span className="sr-only">Mover para Cima</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveCourseMutation.mutate({ courseId: course.id, direction: 'down' })}
                            disabled={index === (courses.length - 1) || moveCourseMutation.isPending}
                          >
                            <ArrowDown className="h-4 w-4" />
                            <span className="sr-only">Mover para Baixo</span>
                          </Button>
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